<?php

class Analyze {

    function analyzeData ($f3, $params) {
        if ($params['key'] == $f3->get('CONFIG')['analyze_key']) {
            //echo '<pre>';

            $result = $f3->get('DB')->exec('SELECT * FROM data ORDER BY end ASC');

            $data = array();

            $statuses = array($f3->get('STATUS.COMPLETED'), $f3->get('STATUS.SUBMITTED'), $f3->get('STATUS.CREDITED')); // completed tasks
            
            $exlude = array();
            foreach ($result as $row) {
                if (in_array($row['status'], $statuses) && false == in_array($row['uniqueid'], $exlude)) {
                    array_push($data, json_decode($row['datastring'], true));
                }
            }

            $subjects = array();
            $count = 0;
            foreach ($data as $subject) {
                $subjects[$count] = array(
                    'uniqueid' => '',
                    'materials' => array(),
                    'postquestionnaire' => array()
                );
                foreach ($subject['data'] as $trial) {
                    $subjects[$count]['uniqueid'] = $trial['uniqueid'];

                    $phase = strtolower($trial['trialdata']['phase']);

                    if (strstr($phase, 'test_inference')) {
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

                    if (strstr($phase, 'test_likelihoods')) {
                        $subjects[$count]['materials'][$trial['trialdata']['material']]['estimates'] = array(
                            'a-and-b' => $trial['trialdata']['a-and-b'],
                            'na-and-b' => $trial['trialdata']['na-and-b'],
                            'a-and-nb' => $trial['trialdata']['a-and-nb'],
                            'na-and-nb' => $trial['trialdata']['na-and-nb'],
                            'a-or-b-i' => $trial['trialdata']['a-or-b-i'],
                            'a-or-b-e' => $trial['trialdata']['a-or-b-e'],
                            'rt' => $trial['trialdata']['rt'],
                        );
                    }
                }
                $subjects[$count]['postquestionnaire'] = $subject['questiondata'];

                ++$count;
            }

            echo "ID;material;version;response;rt;a-and-b;na-and-b;a-and-nb;na-and-nb;a-or-b-i;a-or-b-e;rt_estimates<br />";
            foreach ($subjects as $subject) {
                foreach ($subject['materials'] as $key => $material) {
                    echo $subject['uniqueid'] . ";"
                        . $key . ";"
                        . $material['version'] . ";"
                        . $material['response'] . ";"
                        . $material['rt'] . ";"
                    ;
                    foreach ($material['estimates'] as $estimate) {
                        echo $estimate . ";";
                    }
                    echo "<br />";
                }

            }
            echo "<br />";
            echo "ID;age;language;howtoimprove;logic_course;engagement;difficulty;sex<br />";
            foreach ($subjects as $subject) {
                echo $subject['uniqueid'] . ";";
                foreach ($subject['postquestionnaire'] as $data) {
                    echo $data . ";";
                }
                echo "<br />";
            }
            //echo '</pre>';
        }
    }

    function analyzeBalancing ($f3, $params) {
        if ($params['key'] == $f3->get('CONFIG')['analyze_key']) {
            echo '<pre>';

            $result = $f3->get('DB')->exec('SELECT * FROM data');

            $data = array();

            $statuses = array($f3->get('STATUS.COMPLETED'), $f3->get('STATUS.SUBMITTED'), $f3->get('STATUS.CREDITED')); // completed tasks
            
            $exlude = array();
            foreach ($result as $row) {
                if (in_array($row['status'], $statuses) && false == in_array($row['uniqueid'], $exlude)) {
                    array_push($data, json_decode($row['datastring'], true));
                }
            }

            $materials_verions = array();
            $versions = array('1' => 0, '2' => 0, '3' => 0, '4' => 0);

            $subjects = array();
            $count = 0;
            foreach ($data as $subject) {
                $subjects[$count] = array(
                    'phases' => array(
                        'instructions' => 0,
                        'practice_inference' => 0,
                        'practice_likelihoods' => 0,
                        'test_inference' => 0,
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
                    if (($version == 1 && $num != 6)
                        || ($version == 2 && $num != 4)
                        || ($version == 3 && $num != 1)
                        || ($version == 4 && $num != 1)
                        ) {
                            echo $version . ' VERSION ERROR!!<br />';
                    }
                }

                ++$count;
            }

            echo count($subjects);
            echo "<br />";

            /*foreach ($materials_verions as $material => $versions) {
                foreach ($versions as $version => $num) {
                    if (($version == 1 && $num != 8)
                        || ($version == 2 && $num != 4)
                        || ($version == 3 && $num != 2)
                        || ($version == 4 && $num != 2)
                        ) {
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