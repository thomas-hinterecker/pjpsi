<!doctype html>
<!-- 

-->
<html>
	<head>
		<title>Psychology Experiment</title>
		<script src="<?php echo $BASE; ?>/static/lib/jquery-min.js" type="text/javascript"> </script>
		<link rel="stylesheet" href="<?php echo $BASE; ?>/static/css/bootstrap.min.css" type="text/css">
		<style>
			/* these tyles need to be defined locally */
			body {
			    padding:0px;
			    margin: 0px;
			    background-color: white;
			    color: black;
			    font-weight: 300; 
			    font-size: 13pt;
			}

			/* ad.html  - the ad that people view first */
			#adlogo {
			    float: right;
			    width: 200px;
			    padding: 2px;
			    border: 1px solid #ccc;
			}

			#container-ad {
			    position: absolute;
			    top: 0px; /* Header Height */
			    bottom: 0px; /* Footer Height */
			    left: 0px;
			    right: 0px;
			    padding: 100px;
			    padding-top: 5%;
			    border: 18px solid #f3f3f3;
			    background: white;
			}
		</style>
		<script type="text/javascript">
			var deviceAgent = navigator.userAgent.toLowerCase();

			var isTouchDevice = (deviceAgent.match(/(iphone|ipod|ipad)/) ||
			deviceAgent.match(/(android)/)  || 
			deviceAgent.match(/(iemobile)/) || 
			deviceAgent.match(/iphone/i) || 
			deviceAgent.match(/ipad/i) || 
			deviceAgent.match(/ipod/i) || 
			deviceAgent.match(/blackberry/i) || 
			deviceAgent.match(/bada/i));
		</script>		
	</head>
	<body>
		<div id="container-ad">

			<div id="ad">
				<div class="row">
					<div class="col-xs-2">
						<!-- REPLACE THE LOGO HERE WITH YOUR  UNIVERSITY, LAB, or COMPANY -->
						<img id="adlogo" src="<?php echo $BASE; ?>/static/images/university.png" alt="Lab Logo" />
					</div>
					<div class="col-xs-10">

					    <h1>Thank you for your interest in this study!</h1>
						<br />
						<p>
							Please open this study in a new window before you start! 
						</p>
			            <div class="question">
			                <p class="questiontext">
			                Enter your <b>Prolific ID</b> in the field below:<br />(It can be found when going to your account info)
			                </p>
			                <input id="prolificid" name="prolificid" type="string" min="" style="height:30px; width:150px" />
			            </div>
			            <br />
					    <p>
					    	By clicking the following button, you will be taken to the experiment,
					        including complete instructions and an informed consent agreement.
					    </p>
					    <script type="text/javascript">
							function begin() {
								if (isTouchDevice != null) {
									alert("You can't do this study on a mobile device.");
								} else {
									var prolificid = $('#prolificid').val();
									if (prolificid == '') {
										alert("Please fill in your Prolific ID!");
										return;
									} else {
							    		window.location.href = '<?php echo $BASE; ?>/consent/' + prolificid;
							    		return;
							    	}
						    	}
					  		}
					    </script>
					    
				    	<button type="button" class="btn btn-primary btn-lg" onClick="begin();">
						  Begin Experiment
						</button>

					</div>
			</div>
		</div>
	</body>
</html>
