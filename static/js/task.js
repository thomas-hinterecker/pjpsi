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
var makeBalancing = function (start, current, num, versions, first_question) {
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
		materials[current][material_starting_question] = first_question[version];
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

first_question1 = _.shuffle([1,2,1,2,1,2]);
first_question2 = [];
for (var i = 0; i <= 5; ++i) {
	if (first_question1[i] == 1) {
		first_question2[i] = 2;
	} else {
		first_question2[i] = 1;
	}
}

makeBalancing(0, current, materials.length/2, [1, 1, 1, 1, 1, 1], first_question1);
makeBalancing(materials.length/2, current+(materials.length/2), materials.length, [1, 1, 1, 1, 1, 1], first_question2);
// Starting question
//var current = mycondition % materials.length;
//makeBalancing(0, current, materials.length, [6, 6], material_starting_question);

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
var ReasoningExperiment = function(inferences) { //, practice, finish

	var timeon = false; // time needed to provide estimates of the probabilities
	    //listening = false;

	var problem_count = 0;

	var getPremiseType = function (inference) {
		switch (inference[material_version]) {
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

	var getConclusionType = function (inference) {
		switch (inference[material_version]) {
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

	var getAssertion = function (inference, which, is_conclusion) {
		switch (which) {
			case "a-or-b":
				assertion = getDisjunction(inference[material_a], inference[material_b], "I");
				break;
			case "a-ore-b":
				assertion = getDisjunction(inference[material_a], inference[material_b], "E");
				break;
			case "a-or-b-e":
				assertion = getDisjunction(inference[material_a], inference[material_b], "E2");
				break;				
			case "na-or-nb":
				assertion = getDisjunction(inference[material_na], inference[material_nb], null);
				break;
			case "a-ore-nb":
				assertion = getDisjunction(inference[material_a], inference[material_nb], "E");
				break;
			case "na-ore-b":
				assertion = getDisjunction(inference[material_na], inference[material_b], "E");
				break;
			case "a-and-b":
				assertion = getConjunction(inference[material_a], inference[material_b]);
				break;
			case "a-and-nb":
				assertion = getConjunction(inference[material_a], inference[material_nb]);
				break;				
			case "na-and-nb":
				assertion = getConjunction(inference[material_na], inference[material_nb]);
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

	var trialStep1 = function () {
		if (inferences.length===0) {
			finish();
		} else {
			++problem_count;
			inference = inferences.shift();
			removeContent();
			/*d3.select("#content")
				.append("div")
				.attr("id","problem_count");
			var html = '<p style="text-align:center;font-size:20pt;"><b>Problem ' + problem_count + '</b></p>';
			$("#problem_count").append(html);*/

			d3.select("#content")
				.append("div")
				.attr("id","assertions");
			var html = '';
			/*
				'<p>'
					+ '<b>Please decide for the following assertions whether or not they can both be true at the same time.</b><br />' 
				+ '</p>'
				+ '<hr />'
				+ 
			*/
			html += '<p>The two assertions of problem ' + problem_count + ':</p>'
				+ '<p style="margin-top: 10px;">'
					+ '<b>A</b>: ' + getAssertion(inference, getPremiseType(inference), false)
				+ '</p>'
				+ '<p style="margin-top: 20px;">'
					+ '<b>B</b>: ' + getAssertion(inference, getConclusionType(inference), true)
				+ '</p>'
				+ '<hr />'
				+'<p>'
					+ '<div class="col-xs-2"></div><div class="col-xs-8">'
					+ '<center><button type="button" value="continue" class="btn btn-primary btn-lg btn-estimates response">'
						+ 'I read the assertions!</span>'
					+ '</button></center></div><div class="col-xs-2"></div>'
				+ '</p>';
			$("#assertions").append(html);	
			$('.response').click(
				function () {
					response = $(this).attr('value');
					if (response.length > 0) {
						var rt = new Date().getTime() - timeon;
						pjpsi.recordTrialData(
							{
								'phase':getPhase(1, inference),
								//'response':response,
								//'hit':hit,
								'rt':rt,
								'material':inference[material_id],
								'version':inference[material_version]
							}
			           	);
						trialStep2(inference);
					}
				}
			);

			/*setTimeout(
				function(){
			  		trialStep2(inference);
				}, 
				1500
			);*/
		}
	};

	var trialStep2 = function (inference) {
		timeon = new Date().getTime();
		removeContent();
		//listening = true;
		$(document).scrollTop(0);
		if (inference[material_starting_question] == 1) {
			showQuestion1(
				inference,
				function () {
					trialStep3(inference, showQuestion2);
				}
			);
		} else {
			showQuestion2(
				inference,
				function () {
					trialStep3(inference, showQuestion1);
				}
			);
		}
	};

	var trialStep3 = function (inference, callback) {
		timeon = new Date().getTime();
		removeContent();
		$(document).scrollTop(0);
		callback(
			inference,
			function () {
				trialStep1();
			}
		);
	};

	var showQuestion1 = function(inference, callback) {
		d3.select("#content")
			.append("div")
			.attr("id","assertions");
		var html = '';
		/*
			'<p>'
				+ '<b>Please decide for the following assertions whether or not they can both be true at the same time.</b><br />' 
			+ '</p>'
			+ '<hr />'
			+ 
		*/
		html += '<p>The two assertions of problem ' + problem_count + ':</p>'
			+ '<p style="margin-top: 10px;">'
				+ '<b>A</b>: ' + getAssertion(inference, getPremiseType(inference), false)
			+ '</p>'
			+ '<p style="margin-top: 20px;">'
				+ '<b>B</b>: ' + getAssertion(inference, getConclusionType(inference), true)
			+ '</p>'
			+ '<hr />'
			+'<p>'
				+ '<div style="text-align:center;">Please decide:<br /><b>Could both of these assertions be true at the same time?</b></div>'
				+ '<div class="col-xs-2"></div><div class="col-xs-8"><center>'
					+ '<button type="button" value="yes" class="btn btn-primary btn-lg btn-yes response">Yes</button>'
					+ '<button type="button" value="no" class="btn btn-primary btn-lg btn-no response">No</button>'
				+ '</center></div><div class="col-xs-2"></div>'
			+ '</p>';
		$("#assertions").append(html);
		$('.response').click(
			function () {
				response = $(this).attr('value');
				if (response.length > 0) {
					var rt = new Date().getTime() - timeon;
					pjpsi.recordTrialData(
						{
							'phase':getPhase(2, inference),
							//'response':response,
							//'hit':hit,
							'rt':rt,
							'material':inference[material_id],
							'version':inference[material_version],
							'response':response 
						}
		           	);
					callback();
				}
			}
		);
	};

	var showQuestion2 = function(inference, callback) {
		timeon = new Date().getTime();
		removeContent();
		$(document).scrollTop(0);
		//listening = true;
		var prob = _.shuffle(_.shuffle([85, 90, 95]));
		var html = '';
		html += '<div>'
				/*+ '<p>'
					+ '<b>Given this probability for A, what is the lowest probability that you’d assign to B, and what is the highest probability that you’d assign to B?</b>'
					+ '<br />Choose a number from 0 (no chance at all) to 100 (completely certain) for the lowest and the highest value by using the sliders.'
					+ ' You can set both sliders to the same value.'
				+ '</p>'
				+ '<hr />'*/
				+ '<p>The two assertions of problem ' + problem_count + ':</p>'
				+ '<p style="margin-top: 10px;">'
					+ '<b>A</b>: ' + getAssertion(inference, getPremiseType(inference), false)
				+ '</p>'
				+ '<p style="margin-top: 20px;">'
					+ '<b>B</b>: ' + getAssertion(inference, getConclusionType(inference), true)
				+ '</p>'
				+ '<hr />'
				+ '<p>'
					+ 'Suppose that assertion <b>A</b> has a probability of <b>' + prob[0] + '%</b>:<br />'
					+ 'What is the lowest and highest probability that you would assign to assertion <b>B</b>?<br />'					
				+ '</p>'
				+ '<p>'
					+ 'Choose a number from 0 (no chance at all) to 100 (completely certain) for both sliders.'
					+ ' <br />You can set both sliders to the same value, if you think that this is appropriate in this case.'
				+ '</p>'
				+ '<div id="sliders"></div>'
				+ '<div class="col-xs-2"></div><div class="col-xs-8">'
				+ '<center><button type="button" value="continue" class="btn btn-primary btn-lg btn-estimates response">'
					+ 'Continue <span class="glyphicon glyphicon-arrow-right"></span>'
				+ '</button></center></div><div class="col-xs-2"></div>'
			+ ' </div>';		
		$('#content').html(html);
		createSliders(inference);
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
							'phase':getPhase(3, inference),
							//'response':response,
							//'hit':hit,
							'rt':rt,
							'material':inference[material_id],
							'version':inference[material_version],
							'a':prob[0],
							'lowest':parseInt($('#lowest-value').html()), 
							'highest':parseInt($('#highest-value').html()),
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
			_.each(
				types, 
				function (item) {
					if ($('#' + item + '-value-modified').val() == "0") {
						val = false;
					}
				}
			);	
		}
		return val;
	};

	var sliderAlert = function () {
		alert(
			"Please set a value for each slider."
			+ "\n\nIf you want to set a slider to 50%, set the slider to any value first and then back to 50%."
		);		
	};

	var createSliders = function (inference) {
		var sliderModified = function  (value) {
			if (value != 50) {
				var id = $(this).attr('id');
				$('#' + id + '-value-modified').val(1);
				$('#' + id + '-value-modified-sign').html('');
			}
		};
		var range_all_sliders = {
			'min': [   0 ], '10%': [  10 ], '20%': [  20 ], '30%': [  30 ], '40%': [  40 ], '50%': [  50 ], '60%': [  60 ], '70%': [  70 ], '80%': [  80 ], '90%': [  90 ], 'max': [ 100 ]
		};
		var slider_count = 1;
		_.each(
			_.shuffle(['lowest', 'highest']), 
			function (shortcut) {
				$("#sliders").append(
					'<div class="text-and-slider">' 
					+  uppercaseFirstLetter(shortcut) + ' probability of assertion <b>B</b>:'
					+ '<br /><span id="' + shortcut + '-value" class="slider-value"></span> <span class="slider-value">chance</span> <span id="'  + shortcut + '-value-modified-sign" class="slider-value"> - Slider not modified yet!</span>'
					+ '<div id="'  + shortcut + '" class="slider"></div><input id="'  + shortcut + '-value-modified" value="0" type="hidden" /><br /><br />'
					+ '</div>'
					+ '<hr />'
				);
				$('#' + shortcut).noUiSlider({
					start: [ 50 ],
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
				$('#' + shortcut).Link().to($('#' + shortcut + '-value'));	
				$('#' + shortcut).Link().to(
					sliderModified, 
					null, 
					{
						to: parseInt,
						from: Number
					}
				);	
			}
		);
	};	

	var getPhase = function (step, inference) {
		var phase = ""
		switch (step) {
			case 1:
				phase = "TEST_ASSERTIONS";
				if (inference[material_id] > task_num) {
					phase = "PRACTICE_ASSERTIONS";
				}
				break;				
			case 2:
				phase = "TEST_CONSISTENCY";
				if (inference[material_id] > task_num) {
					phase = "PRACTICE_CONSISTENCY";
				}
				break;			
			case 3:
				phase = "TEST_LIKELIHOODS";
				if (inference[material_id] > task_num) {
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
	trialStep1();
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
	    	function() { currentview = new ReasoningExperiment(materials); } // what you want to do when you are done with instructions
	    );
	}
);
