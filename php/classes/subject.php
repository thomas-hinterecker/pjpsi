<?php

class Subject {

    function get ($f3, $params) {
        $prolificid = $params['prolificid'];
        if (empty($prolificid) == false) {
        	$result = $f3->get('DB')->exec(
        	   'SELECT `prolificid`, `condition`, `counterbalance` FROM data WHERE prolificid=?',
        		$prolificid
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
        $this->_updateSubject($f3, $params['prolificid'], $data);
    }

    function _updateSubject ($f3, $prolificid, $data) {
        if (empty($prolificid) == false) {
            $f3->get('DB')->exec(
                'UPDATE data SET datastring=:newdata, status=:status WHERE prolificid=:id',
                array(
                    ':id' => $prolificid,
                    ':newdata' => $data,
                    ':status' => $f3->get('STATUS.STARTED')
                )
            );

            Header('Content-Type: application/json; charset=UTF8');
            echo json_encode(array('status' => 'user data saved'));
        }
    }

    function credit ($f3, $params) {
        $prolificid = $params['prolificid'];
        if (empty($prolificid) == false) {
            $f3->get('DB')->exec(
                'UPDATE data SET status=:status WHERE prolificid=:id',
                array(
                    ':id' => $prolificid,
                    ':status' => $f3->get('STATUS.CREDITED')
                )
            );
            Header('Content-Type: application/json; charset=UTF8');
            echo json_encode(array('status' => 'user marked as credited'));
        }
    }

}
?>