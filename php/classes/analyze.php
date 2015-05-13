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
                foreach ($subject['data'] as $trial) {
                    $subjects[$count]['prolificid'] = $trial['prolificid'];

                    $phase = strtolower($trial['trialdata']['phase']);

                    if (strstr($phase, 'inference')) {
                        $subjects[$count]['materials'][$trial['trialdata']['material']] = array(
                            'version' => $trial['trialdata']['version'],
                            'rt' => $trial['trialdata']['rt'],
                            'estimates' => array(),                          
                        );
                        $subjects[$count]['materials'][$trial['trialdata']['material']]['a'] = $this->getResponse($trial['trialdata'], 'a');
                        $subjects[$count]['materials'][$trial['trialdata']['material']]['b'] = $this->getResponse($trial['trialdata'], 'b');
                        $subjects[$count]['materials'][$trial['trialdata']['material']]['a-and-b'] = $this->getResponse($trial['trialdata'], 'a-and-b');
                        $subjects[$count]['materials'][$trial['trialdata']['material']]['na-and-nb'] = $this->getResponse($trial['trialdata'], 'na-and-nb');
                        $subjects[$count]['materials'][$trial['trialdata']['material']]['a-or-b-i'] = $this->getResponse($trial['trialdata'], 'a-or-b-i');
                        $subjects[$count]['materials'][$trial['trialdata']['material']]['na-or-nb'] = $this->getResponse($trial['trialdata'], 'na-or-nb');
          
                    }
                    if (strstr($phase, 'likelihoods')) {
                        $subjects[$count]['materials'][$trial['trialdata']['material']]['estimates'] = array(
                            'rt' => $trial['trialdata']['rt'],                        
                        );
                        $subjects[$count]['materials'][$trial['trialdata']['material']]['estimates']['a'] = $this->getEstimate($trial['trialdata'], 'a');
                        $subjects[$count]['materials'][$trial['trialdata']['material']]['estimates']['b'] = $this->getEstimate($trial['trialdata'], 'b');
                        $subjects[$count]['materials'][$trial['trialdata']['material']]['estimates']['a-and-b'] = $this->getEstimate($trial['trialdata'], 'a-and-b');
                        $subjects[$count]['materials'][$trial['trialdata']['material']]['estimates']['na-and-nb'] = $this->getEstimate($trial['trialdata'], 'na-and-nb');
                        $subjects[$count]['materials'][$trial['trialdata']['material']]['estimates']['a-or-b-i'] = $this->getEstimate($trial['trialdata'], 'a-or-b-i');
                        $subjects[$count]['materials'][$trial['trialdata']['material']]['estimates']['na-or-nb'] = $this->getEstimate($trial['trialdata'], 'na-or-nb');
                        $subjects[$count]['materials'][$trial['trialdata']['material']]['estimates']['nb-a-and-b'] = $this->getEstimate($trial['trialdata'], 'nb-a-and-b');
                        $subjects[$count]['materials'][$trial['trialdata']['material']]['estimates']['a-or-b-e'] = $this->getEstimate($trial['trialdata'], 'a-or-b-e');
                    }
                }
                $subjects[$count]['postquestionnaire'] = $subject['questiondata'];

                ++$count;
            }

            echo "ID;material;version;rt;a;b;a-and-b;na-and-nb;a-or-b-i;na-or-nb;rt_estimates;a-prob;b-prob;a-and-b-prob;na-and-nb-prob;a-or-b-i-prob;na-or-nb-prob;nb-a-and-b-prob;a-and-b-e-prob<br />";
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

    function getResponse ($data, $which) {
        if (true == isset($data[$which])) {
            if ($data[$which] == "yes") {
                return 1;
            } else {
                return 0;
            }
        }
        return "NA";
    }

    function getEstimate ($data, $which) {
        if (true == isset($data[$which])) {
            return $data[$which];
        }
        return "NA";
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
                'Total' => array('1' => 0, '2' => 0, '3' => 0, '4' => 0),
                'Decr' => array('1' => 0, '2' => 0, '3' => 0, '4' => 0),
                'Incr' => array('1' => 0, '2' => 0, '3' => 0, '4' => 0)
            );

            $subjects = array();
            $count = 0;
            foreach ($data as $subject) {
                $subjects[$count] = array(
                    'phases' => array(
                        'instructions' => 0,
                        'practice_inference' => 0,
                        'practice_jpd' => 0,
                        'practice_likelihoods' => 0,
                        'test_inference' => 0,
                        'test_jpd' => 0,
                        'test_likelihoods' => 0,
                        'postquestionnaire' => 0
                    ),
                    'versions' => $versions,
                );
                foreach ($subject['data'] as $trial) {
                    $phase = strtolower($trial['trialdata']['phase']);
                    
                    $subjects[$count]['phases'][$phase]++;

                    if (strstr($phase, 'test_inference')) {
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
                $subjects[$count]['postquestionnaire'] = $subject['questiondata'];

                // check versions
                //var_dump($subjects[$count]['versions']['Decr']);
                foreach ($subjects[$count]['versions']['Decr'] as $version => $num) {
                    if (($version == 1 && $num != 4) || ($version == 2 && $num != 1) || ($version == 3 && $num != 1)) {
                            echo $version . ' DECR VERSION ERROR!!<br />';
                    }
                }
                //var_dump($subjects[$count]['versions']['Incr']);
                foreach ($subjects[$count]['versions']['Incr'] as $version => $num) {
                    if (($version == 1 && $num != 4) || ($version == 2 && $num != 1) || ($version == 3 && $num != 1)) {
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

}

?>