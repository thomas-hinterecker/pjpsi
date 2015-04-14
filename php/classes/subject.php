<?php

class Subject {

    function get ($f3, $params) {
        $uniqueId = $params['uniqueId'];
        if (empty($uniqueId) == false) {
        	$result = $f3->get('DB')->exec(
        	   'SELECT `uniqueid`, `cond`, `counterbalance` FROM data WHERE uniqueid=?',
        		$uniqueId
        	);

            Header('Content-Type: application/json; charset=UTF8');
            if ($result[0]) {
                echo json_encode($result[0]);
            } else {
                echo '{}';
            }
        }
    }

    function put ($f3, $params) {
        $data = str_replace(array('model=', '&_method=PUT'), '', urldecode(file_get_contents('php://input')));
        $this->_updateSubject($f3, $params['uniqueId'], $data);
    }

    function _updateSubject ($f3, $uniqueId, $data) {
        if (empty($uniqueId) == false) {
            $f3->get('DB')->exec(
                'UPDATE data SET datastring=:newdata WHERE uniqueid=:id',
                array(
                    ':id' => $uniqueId,
                    ':newdata' => $data
                )
            );

            Header('Content-Type: application/json; charset=UTF8');
            echo json_encode(array('status' => 'user data saved'));
        }
    }

    function credit ($f3, $params) {
        $uniqueId = $params['uniqueId'];
        if (empty($uniqueId) == false) {
            $f3->get('DB')->exec(
                'UPDATE data SET status=:status WHERE uniqueid=:id',
                array(
                    ':id' => $uniqueId,
                    ':status' => $f3->get('STATUS.CREDITED')
                )
            );
            Header('Content-Type: application/json; charset=UTF8');
            echo json_encode(array('status' => 'user marked as credited'));
        }
    }

}
?>