<?php

class Analyze {

    function analyzeData ($f3, $params) {
        if ($params['key'] == $f3->get('analyze_key')) {
            // Retrieve data from DB.
            $result = $f3->get('DB')->exec('SELECT * FROM data ORDER BY end ASC');
            $data = array();
            $statuses = array(
                $f3->get('STATUS.COMPLETED'), 
                $f3->get('STATUS.SUBMITTED'), 
                $f3->get('STATUS.CREDITED')
            ); // Completed tasks only.
            
            $exlude = array(); // Fill in the subjects who you want to exclude.
            foreach ($result as $row) {
                if (in_array($row['status'], $statuses) && false == in_array($row['prolificid'], $exlude)) {
                    array_push($data, json_decode($row['datastring'], true));
                }
            }

            // Go through data ...
            foreach ($data as $subject) {

            }
        }
    }
    
}

?>