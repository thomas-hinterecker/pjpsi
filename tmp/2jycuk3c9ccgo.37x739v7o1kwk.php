<!doctype html>
<!-- 
  The exp.html is the main form that
  controls the experiment.

  see comments throughout for advice
-->
<html>
    <head>
        <title>Psychology Experiment</title>
        <meta charset="utf-8">
        <link rel="Favicon" href="<?php echo $BASE; ?>/static/favicon.ico" />

        <!-- libraries used in your experiment 
			psiturk specifically depends on underscore.js, backbone.js and jquery
    	-->
		<script src="<?php echo $BASE; ?>/static/lib/jquery-min.js" type="text/javascript"> </script>
		<script src="<?php echo $BASE; ?>/static/lib/underscore-min.js" type="text/javascript"> </script>
		<script src="<?php echo $BASE; ?>/static/lib/backbone-min.js" type="text/javascript"> </script>
		<script src="<?php echo $BASE; ?>/static/lib/d3.v3.min.js" type="text/javascript"> </script>

		<script type="text/javascript">
			// These fields provided by the Server
			var uniqueId = "<?php echo $uniqueId; ?>";  // a unique string identifying the worker/task
			var adServerLoc = "<?php echo $BASE; ?>";  // base path of the experiment 
			var mode = "<?php echo $mode; ?>";  // base path of the experiment 
			var condition = "<?php echo $condition; ?>"; // the condition number
			var counterbalance = "<?php echo $counterbalance; ?>"; // a number indexing counterbalancing conditions
		</script>
				
		<!-- utils.js and psiturk.js provide the basic psiturk functionality -->
		<script src="<?php echo $BASE; ?>/static/js/utils.js" type="text/javascript"> </script>
		<script src="<?php echo $BASE; ?>/static/js/psiturk.js" type="text/javascript"> </script>
		<script src="<?php echo $BASE; ?>/static/js/jquery.nouislider.all.min.js" type="text/javascript"> </script>

		<!-- task.js is where you experiment code actually lives 
			for most purposes this is where you want to focus debugging, development, etc...
		-->
		<script src="<?php echo $BASE; ?>/static/js/task.js" type="text/javascript"> </script>

        <link rel=stylesheet href="<?php echo $BASE; ?>/static/css/bootstrap.min.css" type="text/css">
        <link rel=stylesheet href="<?php echo $BASE; ?>/static/css/style.css" type="text/css">
        <link rel=stylesheet href="<?php echo $BASE; ?>/static/css/jquery.nouislider.min.css" type="text/css">
        <link rel=stylesheet href="<?php echo $BASE; ?>/static/css/jquery.nouislider.pips.min.css" type="text/css">
    </head>
    <body>
	    <noscript>
			<h1>Warning: Javascript seems to be disabled</h1>
			<p>This website requires that Javascript be enabled on your browser.</p>
			<p>Instructions for enabling Javascript in your browser can be found 
			<a href="http://support.google.com/bin/answer.py?hl=en&answer=23852">here</a><p>
		</noscript>
    </body>
</html>

