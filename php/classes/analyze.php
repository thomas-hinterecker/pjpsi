<?php

class Analyze {

    function analyzeData ($f3, $params) {
        if ($params['key'] == $f3->get('analyze_key')) {
            echo '<pre>';

            $result = $f3->get('DB')->exec('SELECT * FROM data ORDER BY end ASC');

            $data = array();

            $statuses = array($f3->get('STATUS.COMPLETED'), $f3->get('STATUS.SUBMITTED'), $f3->get('STATUS.CREDITED')); // completed tasks
            
            $exlude = array();
            foreach ($result as $row) {
                if (in_array($row['status'], $statuses) && false == in_array($row['prolificid'], $exlude)) {
                    array_push($data, json_decode($row['datastring'], true));
                }
            }

            $subjects = array();
            $count = 0;
            foreach ($data as $subject) {
                $subjects[$count] = array(
                    'prolificid' => '',
                    'materials' => array(),
                    'postquestionnaire' => array()
                );
                $subjects[$count]['materials'] = array();
                foreach ($subject['data'] as $trial) {
                    $subjects[$count]['prolificid'] = $trial['prolificid'];

                    $phase = strtolower($trial['trialdata']['phase']);

                    if (strstr($phase, 'consistency') || strstr($phase, 'likelihoods')) {
                        if (false == isset($subjects[$count]['materials'][$trial['trialdata']['material']])) {
                            $subjects[$count]['materials'][$trial['trialdata']['material']] = array(
                                'first' => 0,
                                'version' => '',
                                'rt' => '',
                                'response' => '',
                                'estimates' => array(),
                            );
                        }
                    }

                    if (strstr($phase, 'consistency')) {
                        if ($trial['trialdata']['response'] == "yes") {
                            $response = 1;
                        } else {
                            $response = 0;
                        }
                        if ($subjects[$count]['materials'][$trial['trialdata']['material']]['first'] == 0) {
                            $subjects[$count]['materials'][$trial['trialdata']['material']]['first'] = 1;
                        }
                        $subjects[$count]['materials'][$trial['trialdata']['material']]['version'] = $trial['trialdata']['version'];
                        $subjects[$count]['materials'][$trial['trialdata']['material']]['rt'] = $trial['trialdata']['rt'];
                        $subjects[$count]['materials'][$trial['trialdata']['material']]['response'] = $response;
                    }
                    if (strstr($phase, 'likelihoods')) {
                        if ($subjects[$count]['materials'][$trial['trialdata']['material']]['first'] == 0) {
                            $subjects[$count]['materials'][$trial['trialdata']['material']]['first'] = 2;
                        }
                        $subjects[$count]['materials'][$trial['trialdata']['material']]['estimates'] = array(
                            'rt' => $trial['trialdata']['rt'],
                            'lowest' => $trial['trialdata']['lowest'],
                            'highest' => $trial['trialdata']['highest'],
                        );
                    }
                }
                $subjects[$count]['postquestionnaire'] = $subject['questiondata'];

                ++$count;
            }

            echo "ID;material;first;version;rt;response;rt_estimates;lowest-prob;highest-prob<br />";
            foreach ($subjects as $subject) {
                foreach ($subject['materials'] as $key => $material) {
                    echo $subject['prolificid'] . ";"
                        . $key . ";"
                    ;
                    foreach ($material as $materia_key => $value) {
                        if ($materia_key == 'estimates') {
                            continue;
                        }
                        echo $value . ";";
                    }                    
                    foreach ($material['estimates'] as $estimate) {
                        echo $estimate . ";";
                    }
                    echo "<br />";
                }
            }
            echo "<br />";
            echo "ID;howtoimprove;logic_course;engagement;difficulty<br />";
            foreach ($subjects as $subject) {
                echo $subject['prolificid'] . ";";
                foreach ($subject['postquestionnaire'] as $data) {
                    echo $data . ";";
                }
                echo "<br />";
            }
            echo '</pre>';
        }
    }

    function analyzeData2 ($f3, $params) {
        if ($params['key'] == $f3->get('analyze_key')) {
            echo '<pre>';

            $result = $f3->get('DB')->exec('SELECT * FROM data ORDER BY end ASC');

            $data = array();

            $statuses = array($f3->get('STATUS.COMPLETED'), $f3->get('STATUS.SUBMITTED'), $f3->get('STATUS.CREDITED')); // completed tasks
            
            $exlude = array();
            foreach ($result as $row) {
                if (in_array($row['status'], $statuses) && false == in_array($row['prolificid'], $exlude)) {
                    array_push($data, json_decode($row['datastring'], true));
                }
            }

            $subjects = array();
            $count = 0;
            foreach ($data as $subject) {
                $subjects[$count] = array(
                    'prolificid' => '',
                    'instructions' => array(),
                    'events' => array()
                );
                foreach ($subject['data'] as $trial) {
                    $subjects[$count]['prolificid'] = $trial['prolificid'];

                    $phase = strtolower($trial['trialdata']['phase']);

                    if (strstr($phase, 'instructions') 
                        && ($trial['trialdata']['action'] == 'NextPage' || $trial['trialdata']['action'] == 'FinishInstructions')
                        ) {
                        $subjects[$count]['instructions'][] = array(
                            'template' => $trial['trialdata']['template'],
                            'view_time' => $trial['trialdata']['viewTime']
                        );
                    }
                }
                foreach ($subject['eventdata'] as $trial) {
                    $values = $trial['value'];
                    if (is_array($values)) {
                        $values = implode(',', $values);
                    }
                    $subjects[$count]['events'][] = array(
                        'type' => $trial['eventtype'],
                        'values' => $values,
                        'timestamp' => $trial['timestamp'],
                    );                    
                }
                ++$count;
            }

            echo "ID;template;view_time;<br />";
            foreach ($subjects as $subject) {
                foreach ($subject['instructions'] as $key => $instruction) {
                    echo $subject['prolificid'] . ";" . $instruction['template'] . ";" . $instruction['view_time'] . "<br />";
                }

            }
            echo "<br />";
            echo "ID;type;timestamp;values<br />";
            foreach ($subjects as $subject) {
                foreach ($subject['events'] as $key => $event) {
                    echo $subject['prolificid'] . ";" . $event['type'] . ";" . $event['timestamp'] . ";" . $event['values']. "<br />";
                }

            }
        }
    }

    function analyzeBalancing ($f3, $params) {
        if ($params['key'] == $f3->get('analyze_key')) {
            echo '<pre>';

            $result = $f3->get('DB')->exec('SELECT * FROM data');

            $data = array();

            $statuses = array($f3->get('STATUS.COMPLETED'), $f3->get('STATUS.SUBMITTED'), $f3->get('STATUS.CREDITED')); // completed tasks
            
            $exlude = array();
            foreach ($result as $row) {
                if (in_array($row['status'], $statuses) && false == in_array($row['prolificid'], $exlude)) {
                    array_push($data, json_decode($row['datastring'], true));
                }
            }

            $materials_verions = array();
            $versions = array(
                'Total' => array('1' => 0, '2' => 0, '3' => 0, '4' => 0, '5' => 0, '6' => 0),
                'Decr' => array('1' => 0, '2' => 0, '3' => 0, '4' => 0, '5' => 0, '6' => 0),
                'Incr' => array('1' => 0, '2' => 0, '3' => 0, '4' => 0, '5' => 0, '6' => 0)
            );

            $subjects = array();
            $count = 0;
            foreach ($data as $subject) {
                $subjects[$count] = array(
                    'versions' => $versions,
                );
                foreach ($subject['data'] as $trial) {
                    $phase = strtolower($trial['trialdata']['phase']);

                    if (strstr($phase, 'test_consistency')) {
                        $subjects[$count]['versions']['Total'][$trial['trialdata']['version']]++;
                        if ($trial['trialdata']['material'] <= 6) {
                            $subjects[$count]['versions']['Decr'][$trial['trialdata']['version']]++;
                        } else {
                            $subjects[$count]['versions']['Incr'][$trial['trialdata']['version']]++;
                        }

                        if (false == isset($materials_verions[$trial['trialdata']['material']])) {
                            $materials_verions[$trial['trialdata']['material']] = $versions['Total'];
                        }
                        $materials_verions[$trial['trialdata']['material']][$trial['trialdata']['version']]++;
                    }
                }

                // check versions
                //var_dump($subjects[$count]['versions']['Decr']);
                foreach ($subjects[$count]['versions']['Decr'] as $version => $num) {
                    if (($version == 1 && $num != 1) 
                        || ($version == 2 && $num != 1) 
                        || ($version == 3 && $num != 1)
                        || ($version == 4 && $num != 1)
                        || ($version == 5 && $num != 1)
                        || ($version == 6 && $num != 1)
                        ) {
                            echo $version . ' DECR VERSION ERROR!!<br />';
                    }
                }
                //var_dump($subjects[$count]['versions']['Incr']);
                foreach ($subjects[$count]['versions']['Incr'] as $version => $num) {
                    if (($version == 1 && $num != 1) 
                        || ($version == 2 && $num != 1) 
                        || ($version == 3 && $num != 1)
                        || ($version == 4 && $num != 1)
                        || ($version == 5 && $num != 1)
                        || ($version == 6 && $num != 1)
                        ) {
                            echo $version . ' INCR VERSION ERROR!!<br />';
                    }
                }

                ++$count;
            }

            echo count($subjects);
            echo "<br />";

            /*foreach ($materials_verions as $material => $versions) {
                foreach ($versions as $version => $num) {
                    if (($version == 1 && $num != 8) || ($version == 2 && $num != 4)) {
                            echo 'MATERIAL VERSION ERROR!!<br />';
                    }
                }
            }*/

            var_dump($materials_verions);
            echo '</pre>';
        }
    }

    function analyzeBalancing2 ($f3, $params) {
        if ($params['key'] == $f3->get('analyze_key')) {
            echo '<pre>';

            $result = $f3->get('DB')->exec('SELECT * FROM data');

            $data = array();

            $statuses = array($f3->get('STATUS.COMPLETED'), $f3->get('STATUS.SUBMITTED'), $f3->get('STATUS.CREDITED')); // completed tasks
            
            $exlude = array();
            foreach ($result as $row) {
                if (in_array($row['status'], $statuses) && false == in_array($row['prolificid'], $exlude)) {
                    array_push($data, json_decode($row['datastring'], true));
                }
            }

            $versions = array('1' => 0, '2' => 0);

            $subjects = array();
            $count = 0;
            foreach ($data as $subject) {
                $subjects[$count] = array(
                    'versions' => $versions,
                );

                $material_firsts = array();
                foreach ($subject['data'] as $trial) {
                    $phase = strtolower($trial['trialdata']['phase']);
                    
                    if (strstr($phase, 'test_consistency') || strstr($phase, 'test_likelihoods')) {
                        if (strstr($phase, 'test_consistency')) {
                            $version = 1;
                        } else {
                            $version = 2;
                        }
                        $subjects[$count]['versions'][$version]++; 
                        $versions[$version]++;
                        break;               
                    }
                }

                ++$count;
            }

            echo count($subjects);
            echo "<br />";

            var_dump($versions);
        }
    }

}

?>