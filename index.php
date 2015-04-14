<?php

// Load
$f3 = require('php/f3/lib/base.php');

$f3->set('AUTOLOAD', 'php/classes/');

// Config file
$f3->set('CONFIG', parse_ini_file('config.ini'));
$f3->set('MODE', $f3->get('CONFIG')['mode']);

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
	    'mysql:host=' . $f3->get('CONFIG')['db_host'] . ';port=' . $f3->get('CONFIG')['db_port'] . ';dbname=' . $f3->get('CONFIG')['db_name'],
	    $f3->get('CONFIG')['db_user'],
	    $f3->get('CONFIG')['db_password']
	)
);

// ROUTES
// Experiment flow
$f3->route('GET /','Experiment->index');
$f3->route('GET /consent/@uniqueId','Experiment->consent');
$f3->route('GET /exp/@uniqueId','Experiment->exp');
$f3->route('GET /complete/@uniqueId','Experiment->complete');

// Data
$f3->map('/sync/@uniqueId', 'Subject');
$f3->route('GET /credit/@uniqueId','Subject->credit');
$f3->route('POST /inexp','Experiment->inexp');
$f3->route('POST /quitter','Experiment->quitter');

// Errors
$f3->route('GET @errorpage: /error/@errornum', 'Experiment->error');
$f3->route('GET @errorpage: /error/@errornum/@uniqueId', 'Experiment->error');

// Analyze
$f3->route('GET /analyze/@key','Analyze->analyzeData');
$f3->route('GET /analyzeBalancing/@key','Analyze->analyzeBalancing');

// Go
$f3->run();
?>