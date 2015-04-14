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
			            <div class="question">
			                <p class="questiontext">
			                Please enter your <b>Prolific ID</b> in the field below:<br />(It can be found at the top of this webpage or when going to your account info)
			                </p>
			                <input id="uniqueId" name="uniqueId" type="string" min="" style="height:30px; width:150px" />
			            </div>
			            <br />
					    <p>
					    	By clicking the following button, you will be taken to the experiment,
					        including complete instructions and an informed consent agreement.
					    </p>
					    <script>
							function begin() {
								var uniqueId = $('#uniqueId').val();
								if (uniqueId == '') {
									alert("Please fill in your Prolific ID!");
									return;
								} else {
						    		window.location.href = '<?php echo $BASE; ?>/consent/' + uniqueId;
						    		return;
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
