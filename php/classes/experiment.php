<?php

class Experiment {

    function beforeRoute ($f3, $params) {
        if (strstr($params[0], 'error') == false && strstr($params[0], 'complete') == false) {
            // if uniqueId is set, check whether uniqueId already exists in the database. If so, then load error.html
            if (isset($params['uniqueId'])) {
                $uniqueId = $params['uniqueId'];
                $result = $f3->get('DB')->exec(
                    'SELECT count(1) AS `exists`, `status`, `cond`, `counterbalance` FROM data WHERE uniqueid=?', 
                    $uniqueId
                );
                if ((boolean) $result[0]['exists'] == true) {
                    $f3->set('subject.exists', true);
                    $f3->set('subject.cond', (int) $result[0]['cond']);
                    $f3->set('subject.counterbalance', (int) $result[0]['counterbalance']);
                    $status = (int) $result[0]['status'];
                    
                    if ($f3->get('MODE') == 'live' && $status > $f3->get('STATUS.ALLOCATED')) {
                        if ($status >= $f3->get('STATUS.STARTED') && $status <= $f3->get('STATUS.CREDITED')) {
                            $errornum = 1010;
                        } else if ($status == $f3->get('STATUS.QUITEARLY')) {
                            $errornum = 1008;
                        } else {
                            $errornum = 1000;
                        }
                        $f3->reroute('@errorpage(@errornum=' . $errornum . ',@uniqueId=' . $uniqueId . ')');
                    }

                } else {
                    $f3->set('subject.exists', false);
                }
            }
        }
    }

    function index ($f3) {
        $template = new Template;
        echo $template->render('templates/start.html');
    }

    function consent ($f3, $params) {
        $uniqueId = $params['uniqueId'];
        $this->_createSubject($f3, $uniqueId);
    	$f3->set('uniqueId', $uniqueId);
        $template = new Template;
        echo $template->render('templates/consent.html');
    }

    function exp ($f3, $params) {
        $uniqueId = $params['uniqueId'];
        if (empty($uniqueId) == false && $f3->get('subject.exists') == true) {
            if ($f3->get('subject.cond') == null && $f3->get('subject.counterbalance') == null) {
                // cond and counterbalance
                list($cond, $counterbalance) = $this->_findGroups($f3, $uniqueId);
                $f3->get('DB')->exec(
                    'UPDATE data SET `cond`=:cond, `counterbalance`=:counterbalance, `status`=:status WHERE uniqueid=:id',
                    array(
                        ':id' => $uniqueId,
                        ':cond' => $cond,
                        ':counterbalance' => $counterbalance,
                        ':status' => $f3->get('STATUS.ALLOCATED')
                    )
                );
            } else {
                $cond = $f3->get('subject.cond');
                $counterbalance = $f3->get('subject.counterbalance');
            }
    	    $f3->set('uniqueId', $uniqueId);
            $f3->set('mode', $f3->get('MODE'));
    	    $f3->set('condition', $cond);
    	    $f3->set('counterbalance', $counterbalance);
            $template = new Template;
            echo $template->render('templates/exp.html');
        } else {
            $f3->reroute('@errorpage(@errornum=1000,@uniqueId=' . $uniqueId . ')');
        }
    }

    function complete ($f3, $params) {
        $uniqueId = $params['uniqueId'];
        if (empty($uniqueId) == false) {
            $result = $f3->get('DB')->exec(
                'SELECT count(1) AS `exists`, `status` FROM data WHERE uniqueid=?', 
                $uniqueId
            );
            if ($f3->get('MODE') == 'debug' || $result[0]['exists'] == true) {
                if ($f3->get('MODE') == 'debug' 
                    || $result[0]['status'] == $f3->get('STATUS.STARTED')
                    || $result[0]['status'] == $f3->get('STATUS.QUITEARLY')) {
                    $f3->set('uniqueId', $uniqueId);

                    $this->_updateDate($f3, $uniqueId, date('Y-m-d h:i:s', time()), 'end');
                    $this->_updateStatus($f3, $uniqueId, $f3->get('STATUS.COMPLETED'));
                    
                    $template = new Template;
                    echo $template->render('templates/complete.html');
                    return;
                } else {
                    $f3->reroute('@errorpage(@errornum=1010,@uniqueId=' . $uniqueId . ')');
                    return;
                }
            }
        }
        $f3->reroute('@errorpage(@errornum=1000,@uniqueId=' . $uniqueId . ')');
    }

    function inexp ($f3, $params) {
        if ($f3->get('POST.uniqueId')) {
            $this->_updateDate($f3, $f3->get('POST.uniqueId'), date('Y-m-d h:i:s', time()));
            $this->_updateStatus($f3, $f3->get('POST.uniqueId'), $f3->get('STATUS.STARTED'));
            echo json_encode(array('status' => 'success'));
        }
    }

    function quitter ($f3, $params) {
        if ($f3->get('POST.uniqueId')) {
            $this->_updateStatus($f3, $f3->get('POST.uniqueId'), $f3->get('STATUS.QUITEARLY'));
            echo json_encode(array('status' => 'marked as quitter'));
        }
    }

    function error ($f3, $params) {
        $f3->set('errornum', $params['errornum']);
        $f3->set('contact_address', $f3->get('CONFIG')['contact_email_on_error']);
        if (isset($params['uniqueId'])) {
            $f3->set('uniqueId', $params['uniqueId']);
        }
        $template = new Template;
        echo $template->render('templates/error.html');
    }

    function _createSubject ($f3, $uniqueId) {
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
            $useragent = $_SERVER['HTTP_USER_AGENT'];

            // save
            $f3->get('DB')->exec(
                'INSERT INTO data 
                    (`uniqueid`, `ipaddress`, `useragent`, `begin`, `codeversion`, `status`) 
                    VALUES (:id, :ipaddress, :useragent, :begin, :codeversion, :status)',
                array(
                    ':id' => $uniqueId,
                    ':ipaddress' => $ipaddress,
                    ':useragent' => $useragent,
                    ':begin' => date('Y-m-d h:i:s', time()),
                    ':codeversion' => $f3->get('CONFIG')['experiment_code_version'],
                    ':status' => $f3->get('STATUS.NOT_ACCEPTED')
                )
            );
        }      
    }

    function _updateDate ($f3, $uniqueId, $date, $which = 'beginexp') {
        if (strlen($uniqueId) > 0) {
            $f3->get('DB')->exec(
                'UPDATE data SET ' . $which . '=:date WHERE uniqueid=:id',
                array(
                    ':id' => $uniqueId,
                    ':date' => $date
                )
            );
        }
    }

    function _updateStatus ($f3, $uniqueId, $status) {
        if (strlen($uniqueId) > 0) {
            $f3->get('DB')->exec(
                'UPDATE data SET status=:status WHERE uniqueid=:id',
                array(
                    ':id' => $uniqueId,
                    ':status' => $status
                )
            );
        }
    }

    function _findGroups ($f3, $uniqueId) {
        $conditions = array_fill(0, (int) $f3->get('CONFIG')['num_conds'], 0);
        $counterbalances = array_fill(0, (int) $f3->get('CONFIG')['num_counters'], 0);

        // get the already used conds and balances
        $result = $f3->get('DB')->exec(
            'SELECT `cond`, `counterbalance`, `end`, `begin` FROM data WHERE uniqueid!=:id && `status`!=:status', 
            array(
                ':id' => $uniqueId,
                ':status' => $f3->get('STATUS.QUITEARLY')
            )
        );
        foreach ($result as $row) {
            if ($row['end'] == null && strtotime($row['begin']) <= (time() - $f3->get('CONFIG')['dismiss_after'])) {
                continue;
            }
            $conditions[$row['cond']]++;
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