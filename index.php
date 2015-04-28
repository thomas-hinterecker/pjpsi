<?php

require 'php/vendor/autoload.php';

use bcosca\fatfree;

$f3 = Base::instance();

// F3 AUTOLOADER
$f3->set('AUTOLOAD', 'php/classes/');
// Config file
$f3->config('experiment.cfg');
// DEBUG MODE?
if ($f3->get('mode') != 'live') {
	$f3->set('DEBUG', 3);
}

// Set status codes
$f3->set('STATUS.NOT_ACCEPTED', 0);
$f3->set('STATUS.ALLOCATED', 1);
$f3->set('STATUS.STARTED', 2);
$f3->set('STATUS.COMPLETED', 3);
$f3->set('STATUS.SUBMITTED', 4);
$f3->set('STATUS.CREDITED', 5);
$f3->set('STATUS.QUITEARLY', 6);

// Database connection
$f3->set(
	'DB', 
	new DB\SQL(
	    'mysql:host=' . $f3->get('db_host') . ';port=' . $f3->get('db_port') . ';dbname=' . $f3->get('db_name'),
	    $f3->get('db_user'),
	    $f3->get('db_password')
	)
);

// ROUTES
// Experiment flow
$f3->route('GET /','Experiment->index');
$f3->route('GET /consent/@prolificid','Experiment->consent');
$f3->route('GET /exp/@prolificid','Experiment->exp');
$f3->route('GET /complete/@prolificid','Experiment->complete');
// Data
$f3->map('/sync/@prolificid', 'Subject');
$f3->route('GET /credit/@prolificid','Subject->credit');
$f3->route('POST /inexp','Experiment->inexp');
$f3->route('POST /quitter','Experiment->quitter');
// Errors
$f3->route('GET @errorpage: /error/@errornum', 'Experiment->error');
$f3->route('GET @errorpage: /error/@errornum/@prolificid', 'Experiment->error');

// Go
$f3->run();
?>