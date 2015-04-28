<?php

use phpbrowscap\Browscap;

class Experiment {

    function beforeRoute ($f3, $params) {
        if (strstr($params[0], 'error') == false && strstr($params[0], 'complete') == false) {
            // if prolificid is set, check whether prolificid already exists in the database. If so, then load error.html
            if (isset($params['prolificid'])) {
                $prolificid = $params['prolificid'];
                $result = $f3->get('DB')->exec(
                    'SELECT count(1) AS `exists`, `id`, `status`, `condition`, `counterbalance` FROM data WHERE prolificid=?', 
                    $prolificid
                );
                if ((boolean) $result[0]['exists'] == true) {
                    $f3->set('subject.exists', true);
                    $f3->set('subject.id', (int) $result[0]['id']);
                    $f3->set('subject.condition', (int) $result[0]['condition']);
                    $f3->set('subject.counterbalance', (int) $result[0]['counterbalance']);
                    $status = (int) $result[0]['status'];
                    
                    if ($f3->get('mode') == 'live' && $status > $f3->get('STATUS.ALLOCATED')) {
                        if ($status >= $f3->get('STATUS.STARTED') && $status <= $f3->get('STATUS.CREDITED')) {
                            $errornum = 1010;
                        } else if ($status == $f3->get('STATUS.QUITEARLY')) {
                            $errornum = 1008;
                        } else {
                            $errornum = 1000;
                        }
                        $f3->reroute('@errorpage(@errornum=' . $errornum . ',@prolificid=' . $prolificid . ')');
                    }

                } else {
                    $f3->set('subject.exists', false);
                }
            }
        }
    }

    function index ($f3) {
        echo Template::instance()->render('templates/start.html');
    }

    function consent ($f3, $params) {
        $prolificid = $params['prolificid'];
        $this->_createSubject($f3, $prolificid);
    	$f3->set('prolificid', $prolificid);
        echo Template::instance()->render('templates/consent.html');
    }

    function exp ($f3, $params) {
        $prolificid = $params['prolificid'];
        if (empty($prolificid) == false && $f3->get('subject.exists') == true) {
            if ($f3->get('subject.condition') == null && $f3->get('subject.counterbalance') == null) {
                // condition and counterbalance
                $f3->get('DB')->exec("START TRANSACTION");
                list($condition, $counterbalance) = $this->_findGroups($f3, $prolificid);
                $f3->get('DB')->exec(
                    'UPDATE data SET `condition`=:condition, `counterbalance`=:counterbalance, `status`=:status WHERE id=:id',
                    array(
                        ':id' => $f3->get('subject.id'),
                        ':condition' => $condition,
                        ':counterbalance' => $counterbalance,
                        ':status' => $f3->get('STATUS.ALLOCATED')
                    )
                );
                $f3->get('DB')->exec("COMMIT");
                $f3->set('subject.condition', $condition);
                $f3->set('subject.counterbalance', $counterbalance);                
            }

    	    $f3->set('subject.prolificid', $prolificid);

            // Emulate HTTP or JSON?
            if ($f3->get('emulateHTTP') == true) {
                $f3->set('emulateHTTP', 'Backbone.emulateHTTP = true;');
            } else {
                $f3->set('emulateHTTP', '');
            }
            if ($f3->get('emulateJSON') == true) {
                $f3->set('emulateJSON', 'Backbone.emulateJSON = true;');            
            } else {
                $f3->set('emulateJSON', '');
            }

            echo Template::instance()->render('templates/exp.html');
        } else {
            $f3->reroute('@errorpage(@errornum=1000,@prolificid=' . $prolificid . ')');
        }
    }

    function complete ($f3, $params) {
        $prolificid = $params['prolificid'];
        if (empty($prolificid) == false) {
            $result = $f3->get('DB')->exec(
                'SELECT count(1) AS `exists`, `status` FROM data WHERE prolificid=?', 
                $prolificid
            );
            if ($f3->get('mode') == 'debug' || $result[0]['exists'] == true) {
                if ($f3->get('mode') == 'debug' 
                    || $result[0]['status'] == $f3->get('STATUS.STARTED')
                    || $result[0]['status'] == $f3->get('STATUS.QUITEARLY')) {
                    $f3->set('prolificid', $prolificid);

                    $this->_updateDate($f3, $prolificid, date('Y-m-d h:i:s', time()), 'end');
                    $this->_updateStatus($f3, $prolificid, $f3->get('STATUS.COMPLETED'));
                    
                    $f3->set('completionurl', $f3->get('prolific_completion_url'));
                    echo Template::instance()->render('templates/complete.html');
                    return;
                } else {
                    $f3->reroute('@errorpage(@errornum=1010,@prolificid=' . $prolificid . ')');
                    return;
                }
            }
        }
        $f3->reroute('@errorpage(@errornum=1000,@prolificid=' . $prolificid . ')');
    }

    function inexp ($f3, $params) {
        if ($f3->get('POST.prolificid')) {
            $this->_updateDate($f3, $f3->get('POST.prolificid'), date('Y-m-d h:i:s', time()));
            $this->_updateStatus($f3, $f3->get('POST.prolificid'), $f3->get('STATUS.STARTED'));
            echo json_encode(array('status' => 'success'));
        }
    }

    function quitter ($f3, $params) {
        if ($f3->get('POST.prolificid')) {
            $this->_updateStatus($f3, $f3->get('POST.prolificid'), $f3->get('STATUS.QUITEARLY'));
            echo json_encode(array('status' => 'marked as quitter'));
        }
    }

    function error ($f3, $params) {
        $f3->set('errornum', $params['errornum']);
        $f3->set('contact_address', $f3->get('contact_email_on_error'));
        if (isset($params['prolificid'])) {
            $f3->set('prolificid', $params['prolificid']);
        }
        echo Template::instance()->render('templates/error.html');
    }

    function _createSubject ($f3, $prolificid) {
        // add subject to DB but only if not yet in DB
        if ($f3->get('subject.exists') == false) {

            // client info
            if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
                $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
            } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
            } else {
                $ipaddress = $_SERVER['REMOTE_ADDR'];
            }
            // browser and platform info
            if (is_file('php/cache/cache.lock')) {
                unlink('php/cache/cache.lock');
            }
            $browscap = new Browscap('php/cache/');
            if ($f3->get('update_browscap') == false) {
                $browscap->doAutoUpdate = false;
            }
            $browser = $browscap->getBrowser()->Browser . ' ' . $browscap->getBrowser()->Version;
            $platform = $browscap->getBrowser()->Platform;

            // save
            $f3->get('DB')->exec(
                'INSERT INTO data 
                    (`prolificid`, `ipaddress`, `browser`, `platform`, `begin`, `codeversion`, `status`) 
                    VALUES (:prolificid, :ipaddress, :browser, :platform, :begin, :codeversion, :status)',
                array(
                    ':prolificid' => $prolificid,
                    ':ipaddress' => $ipaddress,
                    ':browser' => $browser,
                    ':platform' => $platform,
                    ':begin' => date('Y-m-d h:i:s', time()),
                    ':codeversion' => $f3->get('experiment_code_version'),
                    ':status' => $f3->get('STATUS.NOT_ACCEPTED')
                )
            );
        }      
    }

    function _updateDate ($f3, $prolificid, $date, $which = 'beginexp') {
        if (strlen($prolificid) > 0) {
            $f3->get('DB')->exec(
                'UPDATE data SET ' . $which . '=:date WHERE prolificid=:prolificid',
                array(
                    ':prolificid' => $prolificid,
                    ':date' => $date
                )
            );
        }
    }

    function _updateStatus ($f3, $prolificid, $status) {
        if (strlen($prolificid) > 0) {
            $f3->get('DB')->exec(
                'UPDATE data SET status=:status WHERE prolificid=:prolificid',
                array(
                    ':prolificid' => $prolificid,
                    ':status' => $status
                )
            );
        }
    }

    function _findGroups ($f3, $prolificid) {
        $conditions = array_fill(0, (int) $f3->get('num_conds'), 0);
        $counterbalances = array_fill(0, (int) $f3->get('num_counters'), 0);

        // get the already used conds and balances
        $result = $f3->get('DB')->exec(
            'SELECT `condition`, `counterbalance` FROM data WHERE prolificid!=:id && `status`!=:status1 && `status`!=:status2', 
            array(
                ':id' => $prolificid,
                ':status1' => $f3->get('STATUS.NOT_ACCEPTED'),
                ':status2' => $f3->get('STATUS.QUITEARLY')
            )
        );
        foreach ($result as $row) {
            $conditions[$row['condition']]++;
            $counterbalances[$row['counterbalance']]++;
        }

        // assign to a group
        $lowest_val = min($conditions);
        $possibles = array();
        foreach ($conditions as $condition => $value) {
            if ($value == $lowest_val) {
                array_push($possibles, $condition);
            }
        }
        $cond = $possibles[rand(0, count($possibles) - 1)];

        // counterbalancing
        $lowest_val = min($counterbalances);
        $possibles = array();
        foreach ($counterbalances as $counterbalance => $value) {
            if ($value == $lowest_val) {
                array_push($possibles, $counterbalance);
            }
        }
        $counterbalance = $possibles[rand(0, count($possibles) - 1)];
        
        // return
        return array(
            $cond,
            $counterbalance
        );
    }

}
?>