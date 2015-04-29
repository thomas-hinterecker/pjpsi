<?php

class Analyze {

    function analyzeData ($f3, $params) {
        if ($params['key'] == $f3->get('analyze_key')) {
            //echo '<pre>';

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
                        $response = 0;
                        if ($trial['trialdata']['response'] == "yes") {
                            $response = 1;
                        }
                        $subjects[$count]['materials'][$trial['trialdata']['material']] = array(
                            'version' => $trial['trialdata']['version'],
                            'response' => $response,
                            'rt' => $trial['trialdata']['rt'],
                            'estimates' => array()
                        );
                    }
                     if (strstr($phase, 'jpd')) {
                        $subjects[$count]['materials'][$trial['trialdata']['material']]['jpd_estimates'] = array(
                            'a-and-b' => $trial['trialdata']['a-and-b'],
                            'na-and-b' => $trial['trialdata']['na-and-b'],
                            'a-and-nb' => $trial['trialdata']['a-and-nb'],
                            'na-and-nb' => $trial['trialdata']['na-and-nb'],
                            'rt' => $trial['trialdata']['rt'],
                        );
                    }
                    if (strstr($phase, 'likelihoods')) {
                        $subjects[$count]['materials'][$trial['trialdata']['material']]['pc_estimates'] = array(
                            'premise' => $trial['trialdata']['premise'],
                            'conclusion' => $trial['trialdata']['conclusion'],
                            'rt' => $trial['trialdata']['rt'],
                        );
                    }
                }
                $subjects[$count]['postquestionnaire'] = $subject['questiondata'];

                ++$count;
            }

            echo "ID;material;version;response;rt;a-and-b;na-and-b;a-and-nb;na-and-nb;rt_jpd;premise;conclusion;rt_pc<br />";
            foreach ($subjects as $subject) {
                foreach ($subject['materials'] as $key => $material) {
                    echo $subject['prolificid'] . ";"
                        . $key . ";"
                        . $material['version'] . ";"
                        . $material['response'] . ";"
                        . $material['rt'] . ";"
                    ;
                    foreach ($material['jpd_estimates'] as $estimate) {
                        echo $estimate . ";";
                    }
                    foreach ($material['pc_estimates'] as $estimate) {
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
            //echo '</pre>';
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
            $versions = array('1' => 0, '2' => 0);

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
                        $subjects[$count]['versions'][$trial['trialdata']['version']]++;

                        if (false == isset($materials_verions[$trial['trialdata']['material']])) {
                            $materials_verions[$trial['trialdata']['material']] = $versions;
                        }
                        $materials_verions[$trial['trialdata']['material']][$trial['trialdata']['version']]++;
                    }
                }
                $subjects[$count]['postquestionnaire'] = $subject['questiondata'];

                // check versions
                foreach ($subjects[$count]['versions'] as $version => $num) {
                    if (($version == 1 && $num != 4) || ($version == 2 && $num != 4)) {
                            echo $version . ' VERSION ERROR!!<br />';
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