/*
 * Requires:
 *     pjpsi.js
 *     utils.js
 */

// Initalize pjpsi object
var pjpsi = new PJPsi(prolificid, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the pjpsi server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to

// All pages to be loaded
var pages = [
	"instructions/instruct-1.html",
	"instructions/instruct-ready.html",
	"stage.html",
	"postquestionnaire.html"
];

pjpsi.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct-1.html",
	"instructions/instruct-ready.html"
];

function not () {
	return "NOT";
}

material_id = 0;
material_a = 1;
material_b = 2;
material_na = 3;
material_nb = 4;
material_version = 5;
material_starting_question = 6;

var practice_materials = [
	[
		13,
		' US companies focus their advertising on the Web next year', 
		'the New York Times becomes more profitable', 
		' US companies will ' + not() + ' focus their advertising on the Web next year', 
		'the New York Times will ' + not() + ' become more profitable',
		7,
		Math.floor((Math.random() * 2) + 1)
	]
];
var practice_num = practice_materials.length;

var materials = [
	[
		1,
		'The United States will sign the Kyoto Protocol and commit to reducing CO2 emissions', 
		'global temperatures reach a theoretical point of no return in the next 100 years', 
		'The United States will ' + not() + ' sign the Kyoto Protocol and commit to reducing CO2 emissions', 
		'global temperatures will ' + not() + ' reach a theoretical point of no return in the next 100 years'
	],
	[
		2,
		'Intellectual property law in the US will be updated to a reflect advances in technology by the year 2040', 
		' Russia will become the world center for software development by 2040', 
		'Intellectual property law in the US will ' + not() + ' be updated to a reflect advances in technology by the year 2040', 
		' Russia will ' + not() + ' become the world center for software development by 2040'
	],
	[
		3,
		'A nuclear weapon will be used in a terrorist attack in the next decade', 
		'there will be a substantial decrease in terrorist activity in the next 10 years', 
		'A nuclear weapon will ' + not() + ' be used in a terrorist attack in the next decade', 
		'there will ' + not() + ' be a substantial decrease in terrorist activity in the next 10 years'
	],
	[
		4,
		'The United States adopts an open border policy of universal acceptance', 
		' English is legally declared the official language of the United States', 
		'The United States does ' + not() + ' adopt an open border policy of universal acceptance', 
		' English is ' + not() + ' legally declared the official language of the United States'
	],
	[
		5,
		' Greece will make a full economic recovery in the next 10 years', 
		' Greece will be forced to leave the EU in the next 10 years', 
		' Greece will ' + not() + ' make a full economic recovery in the next 10 years', 
		' Greece will ' + not() + ' be forced to leave the EU in the next 10 years'
	],
	[
		6,
		'Scientists will discover a cure for Parkinson\'s disease in 10 years', 
		'the number of patients who suffer from Parkinson\'s disease will triple by 2050', 
		'Scientists will ' + not() + ' discover a cure for Parkinson\'s disease in 10 years', 
		'the number of patients who suffer from Parkinson\'s disease will ' + not() + ' triple by 2050'
	],
	[
		7,
		'A new illegal but synthetic drug becomes popular in the USA over the next two years', 
		'the movement to decriminalize drugs doubles its numbers by 2017', 
		'A new illegal but synthetic drug will ' + not() + ' become popular in the USA over the next two years', 
		'the movement to decriminalize drugs will ' + not() + ' double its numbers by 2017'
	],
	[
		8,
		'3-dimensional graphics will be required to contain explicit markers to indicate their unreal nature by 2020', 
		'competitive video game playing will achieve mainstream acceptance by 2020', 
		'3-dimensional graphics will ' + not() + ' be required to contain explicit markers to indicate their unreal nature by 2020', 
		'competitive video game playing will ' + not() + ' achieve mainstream acceptance by 2020'
	],
	[
		9,
		'The Supreme Court rules on the constitutionality of gay marriage in the next 5 years', 
		'a gay person will be elected as president in the next 50 years', 
		'The Supreme Court will ' + not() + ' rule on the constitutionality of gay marriage in the next 5 years', 
		'a gay person will ' + not() + ' be elected as president in the next 50 years'
	],
	[
		10,
		'In less than 15 years, millions of people will live past 100', 
		'advances in genetics will end the shortage of replacement organs in the next 15 years', 
		'In less than 15 years, millions of people will ' + not() + ' live past 100', 
		'advances in genetics will ' + not() + ' end the shortage of replacement organs in the next 15 years'
	],
	[
		11,
		'Space tourism will achieve widespread popularity in the next 50 years', 
		'advances in material science will lead to the development of anti-gravity materials in the next 50 years', 
		'Space tourism will ' + not() + ' achieve widespread popularity in the next 50 years', 
		'advances in material science will ' + not() + ' lead to the development of anti-gravity materials in the next 50 years'
	],
	[
		12,
		'Intelligent alien life is found outside the solar system in the next 10 years', 
		'world governments dedicate more resources to contacting extra-terrestrials', 
		'Intelligent alien life is ' + not() + ' found outside the solar system in the next 10 years', 
		'world governments will ' + not() + ' dedicate more resources to contacting extra-terrestrials'
	],
];
var task_num = materials.length;

// balancing
var makeBalancing = function (start, current, num, versions) { //, first_question
	//console.log(current)
	var version_count = 0;
	var version = -1;
	var counter = start;
	while (counter < num) {
		while (version == -1) {
			if (versions[version_count] > 0) {
				--versions[version_count];
				version = version_count;
			}
			++version_count;
			if (version_count > (versions.length - 1)) {
				version_count = 0;
			}
		}
		materials[current][material_version] = version + 1;
		//materials[current][material_starting_question] = first_question[version];
		//console.log(current+" - "+materials[current][material_version]+" - "+materials[current][material_starting_question])
		++counter;
		++current;
		if (current == num) {
			current = start;
		}	
		version = -1;
	}
}
// Problem versions
var current = mycounterbalance % (materials.length/2);

/*first_question1 = _.shuffle([1,2,1,2,1,2]);
first_question2 = [];
for (var i = 0; i <= 5; ++i) {
	if (first_question1[i] == 1) {
		first_question2[i] = 2;
	} else {
		first_question2[i] = 1;
	}
}*/

makeBalancing(0, current, materials.length/2, [1, 1, 1, 1, 1, 1]); // , first_question1
makeBalancing(materials.length/2, current+(materials.length/2), materials.length, [1, 1, 1, 1, 1, 1]); // , first_question2

materials = _.shuffle(_.shuffle(materials));
materials.push(practice_materials[0]);
materials.reverse();
/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the pjpsi object is created above. We
* need code to get those pages from the pjpsi object and 
* insert them into the document.
*
********************/

/********************
* REASONING TASK    *
********************/
var ReasoningExperiment = function(problems) { //, practice, finish

	var timeon = false; // time needed to provide estimates of the probabilities
	    //listening = false;

	var process = 0;

	var block_count = 0;

	var problem_count = 0;

	var getPremiseType = function (problem) {
		switch (problem[material_version]) {
			case 1:
				return "a-ore-b";
			case 2:
				return "a-ore-b";
			case 3:
				return "a-ore-b";
			case 4:
				return "a-ore-nb";
			case 5:
				return "a-or-b";
			case 6:
				return "a-or-b";
			case 7:
				return "a-or-b-e";
		}
	};

	var getConclusionType = function (problem) {
		switch (problem[material_version]) {
			case 1:
				return "a-and-nb";
			case 2:
				return "na-ore-b";
			case 3:
				return "na-and-nb";
			case 4:
				return "na-ore-b";
			case 5:
				return "a-and-b";
			case 6:
				return "na-and-nb";
			case 7:
				return "a-or-b";
		}
	};

	var getAssertion = function (problem, which, is_conclusion) {
		switch (which) {
			case "a-or-b":
				assertion = getDisjunction(problem[material_a], problem[material_b], "I");
				break;
			case "a-ore-b":
				assertion = getDisjunction(problem[material_a], problem[material_b], "E");
				break;
			case "a-or-b-e":
				assertion = getDisjunction(problem[material_a], problem[material_b], "E2");
				break;				
			case "na-or-nb":
				assertion = getDisjunction(problem[material_na], problem[material_nb], null);
				break;
			case "a-ore-nb":
				assertion = getDisjunction(problem[material_a], problem[material_nb], "E");
				break;
			case "na-ore-b":
				assertion = getDisjunction(problem[material_na], problem[material_b], "E");
				break;
			case "a-and-b":
				assertion = getConjunction(problem[material_a], problem[material_b]);
				break;
			case "a-and-nb":
				assertion = getConjunction(problem[material_a], problem[material_nb]);
				break;				
			case "na-and-nb":
				assertion = getConjunction(problem[material_na], problem[material_nb]);
				break;
		}	
		return assertion;
	};

	var getDisjunction = function(a, b, type) {
		if (type == "I") {
			return a + " OR " + lowercaseFirstLetter(b) + ", OR both.";
		} else if (type == "E") {
			return a + " OR ELSE " + lowercaseFirstLetter(b) + ".";
		} else if (type == "E2") {
			return a + " OR " + lowercaseFirstLetter(b) + ", BUT not both.";
		}
	};

	var getConjunction = function(a, b, add) {
		if (typeof(add) == "undefined") {
			add = "";
		}
		return a + " AND " + add + lowercaseFirstLetter(b) + '.';
	};

	var block1 = function (problem) {
		process += 1;
		++block_count;
		problem_count = 0;
		beginBlock(
			block_count,
			'In this block your task will be to determine whether both assertions of a particular problem could be true at the same time.',
			function () {
				trialStep(showQuestion1);
			}
		);
	};

	var block2 = function () {
		process += 2;
		++block_count;
		problem_count = 0;
		beginBlock(
			block_count,
			'In this block you\'ll be provided with a given probability for the first assertion of a problem and you\'ll have to estimate probabilities of the second assertion.',
			function () {
				trialStep(showQuestion2);
			}
		);
	};

	var beginBlock = function (number, instruction, callback) {
		removeContent();
		d3.select("#content")
			.append("div")
			.attr("id","block");
		var html = '<p style="text-align:center;font-size:20pt;"><b>Block ' + number + '</b></p>'
			+ '<hr />'
			+ '<p>' + instruction + '</p>'
			+ '<hr />'
			+'<p>'
				+ '<div class="col-xs-2"></div><div class="col-xs-8">'
				+ '<center><button type="button" value="continue" class="btn btn-primary btn-lg btn-estimates response">'
					+ 'Start block!</span>'
				+ '</button></center></div><div class="col-xs-2"></div>'
			+ '</p>';
		$("#block").append(html);
		timeon = new Date().getTime();
		$('.response').click(
			function () {
				response = $(this).attr('value');
				if (response.length > 0) {
					var rt = new Date().getTime() - timeon;
					pjpsi.recordTrialData(
						{
							'phase':'START_BLOCK',
							'rt':rt
						}
		           	);
					callback();
				}
			}
		);			
	};

	var trialStep = function (question) {
		if (problems.length == problem_count) {
			if (process == 2) {
				block1();
			} else if (process == 1) {
				block2();
			} else if (process == 3) {
				finish();
			}
		} else {
			problem = problems[problem_count];
			++problem_count;
			removeContent();
			$(document).scrollTop(0);
			//listening = true;

			d3.select("#content")
				.append("div")
				.attr("id","assertions");
			var html = '<p>The two assertions of problem ' + problem_count + ':</p>'
				+ '<p style="margin-top: 10px;">'
					+ '<b>A</b>: ' + getAssertion(problem, getPremiseType(problem), false)
				+ '</p>'
				+ '<p style="margin-top: 20px;">'
					+ '<b>B</b>: ' + getAssertion(problem, getConclusionType(problem), true)
				+ '</p>'
				+ '<hr />'
				+ '<div id="read">'
					+ '<div class="col-xs-2"></div><div class="col-xs-8">'
					+ '<center><button id="btn_read" type="button" value="continue" class="btn btn-primary btn-lg btn-estimates">'
						+ 'I read the assertions!</span>'
					+ '</button></center></div><div class="col-xs-2"></div>'
				+ '</div>'				;
			$("#assertions").append(html);

			timeon = new Date().getTime();
			$('#btn_read').click(
				function () {
					$('#read').remove();
					var rt = new Date().getTime() - timeon;
					pjpsi.recordTrialData(
						{
							'phase':getPhase(1, problem),
							'rt':rt,
							'material':problem[material_id],
							'version':problem[material_version]
						}
		           	);
					question(problem, function () { trialStep(question); } );
				}
			);
			
		}
	}

	var showQuestion1 = function(problem, callback) {
		var html = '<p>'
				+ '<div style="text-align:center;">Please decide:<br /><b>Could both of these assertions be true at the same time?</b></div>'
				+ '<div class="col-xs-2"></div><div class="col-xs-8"><center>'
					+ '<button type="button" value="yes" class="btn btn-primary btn-lg btn-yes response">Yes</button>'
					+ '<button type="button" value="no" class="btn btn-primary btn-lg btn-no response">No</button>'
				+ '</center></div><div class="col-xs-2"></div>'
			+ '</p>';
		$("#assertions").append(html);
		timeon = new Date().getTime();
		$('.response').click(
			function () {
				response = $(this).attr('value');
				if (response.length > 0) {
					var rt = new Date().getTime() - timeon;
					pjpsi.recordTrialData(
						{
							'phase':getPhase(2, problem),
							//'response':response,
							//'hit':hit,
							'rt':rt,
							'material':problem[material_id],
							'version':problem[material_version],
							'response':response 
						}
		           	);
					callback();
				}
			}
		);
	};

	var showQuestion2 = function(problem, callback) {
		var prob = 90;
		var html = '<p>'
					+ 'Suppose that assertion <b>A</b> has a probability of <b>' + prob + '%</b>:<br />'
					+ 'What is the lowest and highest probability that you would assign to assertion <b>B</b>?<br />'					
				+ '</p>'
				+ '<p>'
					+ 'Choose a number from 0 (no chance at all) to 100 (completely certain) for both slider handles.'
					+ ' <br />You can set both handles to the same value, if you think that this is appropriate in this case.'
				+ '</p>'
				+ '<div id="sliders"></div>'
				+ '<div>'
					+ '<div class="col-xs-2"></div><div class="col-xs-8">'
					+ '<center><button type="button" value="continue" class="btn btn-primary btn-lg btn-estimates response">'
						+ 'Continue <span class="glyphicon glyphicon-arrow-right"></span>'
					+ '</button></center></div><div class="col-xs-2"></div>'
				+ ' </div>';		
		$('#assertions').append(html);
		createSliders(problem);
		timeon = new Date().getTime();
		$(".response").click(
			function () {
				response = $(this).attr('value');
				// Check if all slider have been modified			
				if (response.length>0 && checkSliderModified(['lowest', 'highest']) == true) {
					//listening = false;
					var hit = false;
					var rt = new Date().getTime() - timeon;
					pjpsi.recordTrialData(
						{
							'phase':getPhase(3, problem),
							//'hit':hit,
							'rt':rt,
							'material':problem[material_id],
							'version':problem[material_version],
							'lowest':parseInt($('#b-lower-value').html()), 
							'highest':parseInt($('#b-upper-value').html()),
						}
		            );
					callback();
				} else {
					sliderAlert();
				}
			}
		);
	};
	
	var checkSliderModified = function (types) {
		var val = true;
		if (mode != 'debug') {
			/*_.each(
				types, 
				function (item) {
					if ($('.slider-handle-modified').val() == "0") {
						val = false;
					}
				}
			);*/
			console.log($('#b-lower-value-modified').val());
			console.log($('#b-upper-value-modified').val());
			if ($('#b-lower-value-modified').val() == "0") {
				val = false;
			}
			if ($('#b-upper-value-modified').val() == "0") {
				val = false;
			}			
		}
		return val;
	};

	var sliderAlert = function () {
		alert(
			"Please modify each handle."
			+ "\n\nIf you want to set both handles to their initial value, move them to any value and then back to the initial value."
		);		
	};

	var createSliders = function (problem) {
		var lowerHandleModified = function  (value) {
			if (value != 48) {
				var id = $(this).attr('id');
				var handle = 'lower';	
				$('#' + id + '-' + handle + '-value-modified').val(1);
				$('#' + id + '-' + handle + '-value-modified-sign').html('');
			}
		};
		var upperHandleModified = function  (value) {
			if (value != 52) {
				var id = $(this).attr('id');
				var handle = 'upper';	
				$('#' + id + '-' + handle + '-value-modified').val(1);
				$('#' + id + '-' + handle + '-value-modified-sign').html('');
			}
		};		
		var range_all_sliders = {
			'min': [   0 ], '10%': [  10 ], '20%': [  20 ], '30%': [  30 ], '40%': [  40 ], '50%': [  50 ], '60%': [  60 ], '70%': [  70 ], '80%': [  80 ], '90%': [  90 ], 'max': [ 100 ]
		};
		var slider_count = 1;
		var shortcut = 'b';
		/*_.each(
			_.shuffle(['lowest', 'highest']), 
			function (shortcut) {*/
				$("#sliders").append(
					'<div class="text-and-slider">' 
					+ 'Probabilities of assertion <b>B</b>:'
					+ '<br />Lowest probability (light grey handle): <span id="' + shortcut + '-lower-value" class="slider-value"></span> <span class="slider-value">chance</span> <span id="'  + shortcut + '-lower-value-modified-sign" class="slider-value"> - Handle not modified yet!</span>'
					+ '<input id="'  + shortcut + '-lower-value-modified" value="0" type="hidden" />'					
					+ '<br />Highest probability (dark grey handle): <span id="' + shortcut + '-upper-value" class="slider-value"></span> <span class="slider-value">chance</span> <span id="'  + shortcut + '-upper-value-modified-sign" class="slider-value"> - Handle not modified yet!</span>'
					+ '<input id="'  + shortcut + '-upper-value-modified" value="0" type="hidden" />'					
					+ '<div id="'  + shortcut + '" class="slider"></div><br /><br />'
					+ '</div>'
					+ '<hr />'
				);
				$('#' + shortcut).noUiSlider({
					start: [ 48, 52 ],
					range: range_all_sliders,
					format: wNumb({
						decimals: 0,
						postfix: '%',
					})
				});
				$('#' + shortcut).noUiSlider_pips({
					mode: 'range',
					density: 2,
					filter: function (value, type){
						return 2;
					}
				});	
				// Links
				$('#' + shortcut).Link('lower').to($('#' + shortcut + '-lower-value'));	
				$('#' + shortcut).Link('upper').to($('#' + shortcut + '-upper-value'));
				$('#' + shortcut).Link('lower').to(lowerHandleModified, null, { to: parseInt, from: Number });
				$('#' + shortcut).Link('upper').to(upperHandleModified, null, { to: parseInt, from: Number });
			/*}
		);*/
	};	

	var getPhase = function (step, problem) {
		var phase = ""
		switch (step) {
			case 1:
				phase = "TEST_ASSERTIONS";
				if (problem[material_id] > task_num) {
					phase = "PRACTICE_ASSERTIONS";
				}
				break;				
			case 2:
				phase = "TEST_CONSISTENCY";
				if (problem[material_id] > task_num) {
					phase = "PRACTICE_CONSISTENCY";
				}
				break;			
			case 3:
				phase = "TEST_LIKELIHOODS";
				if (problem[material_id] > task_num) {
					phase = "PRACTICE_LIKELIHOODS";
				}
				break;				
		}
		return phase;
	};

	var removeContent = function() {
		$("#content").html("");
	};

	/*var response_handler = function(e) {
		if (!listening) return;
	};*/

	var finish = function() {
	    //$("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new Questionnaire();
	};

	// Load the stage.html snippet into the body of the page
	pjpsi.showPage('stage.html');

	// Register the response handler that is defined above to handle any
	// key down events.
	//$("body").focus().keydown(response_handler); 

	// Start the test
	if (mycondition == 0) {
		block1();
	} else {
		block2();
	}
};


/****************
* Questionnaire *
****************/

var Questionnaire = function() {

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	var record_responses = function() {

		pjpsi.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});

		$('input').each( function(i, val) {
			pjpsi.recordUnstructuredData(this.id, this.value);
		});
		$('textarea').each( function(i, val) {
			pjpsi.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			pjpsi.recordUnstructuredData(this.id, this.value);		
		});

	};

	var prompt_resubmit = function() {
		replaceBody(error_message);
		$("#resubmit").click(resubmit);
	};

	var resubmit = function() {
		replaceBody("<h1>Trying to resubmit...</h1>");
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		pjpsi.saveData({
			success: function() {
			    clearInterval(reprompt); 
                pjpsi.computeBonus('compute_bonus', function(){finish()}); 
			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	pjpsi.showPage('postquestionnaire.html');
	pjpsi.recordTrialData({'phase':'postquestionnaire', 'status':'begin'});
	
	$("#next").click(function () {
	    record_responses();
	    pjpsi.saveData(
	    	{
	            success: function(){
	                pjpsi.complete();
	            }, 
            	error: prompt_resubmit
        	}
        );
	});
    
	
};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load(
	function () {
	    pjpsi.doInstructions(
	    	instructionPages, // a list of pages you want to display in sequence
	    	function () { currentview = new ReasoningExperiment(materials); } // what you want to do when you are done with instructions
	    );
	}
);
