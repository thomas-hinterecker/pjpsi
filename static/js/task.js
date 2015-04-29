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

var practice_materials = [
	/*[
		9,
		'The human race will be able to generate sustainable energy by nuclear fusion within the next 20 years', 
		'energy will become drastically more expensive by then', 
		'The human race will ' + not() + ' be able to generate sustainable energy by nuclear fusion within the next 20 years', 
		'energy will ' + not() + ' become drastically more expensive by then',
		5
	],
	[
		10,
		'The United States will enact laws which prescribe the use of water', 
		'cities in dry and hot areas will overcome their problem of severe water shortages', 
		'The United States will ' + not() + ' enact laws which prescribe the use of water', 
		'cities in dry and hot areas will ' + not() + ' overcome their problem of severe water shortages',
		6
	]*/
	[
		9,
		' US companies focus their advertising on the Web next year', 
		'the New York Times becomes more profitable', 
		' US companies will ' + not() + ' focus their advertising on the Web next year', 
		'the New York Times will ' + not() + ' become more profitable'
	],
	[
		10,
		'In less than 15 years, millions of people will live past 100', 
		'advances in genetics will end the shortage of replacement organs in the next 15 years', 
		'In less than 15 years, millions of people will ' + not() + ' live past 100', 
		'advances in genetics will ' + not() + ' end the shortage of replacement organs in the next 15 years'
	]
];
var practice_num = practice_materials.length;
var curr_material = mycounterbalance % practice_num;
practice_materials[curr_material][5] = 5;
if (curr_material == 1) {
	curr_material = 0;
} else {
	curr_material = 1;
}
practice_materials[curr_material][5] = 6;

var materials = [
	[
		1,
		'The United States will sign the Kyoto Protocol and commit to reducing CO2 emissions', 
		'global temperatures reach a theoretical point of no return in the next 100 years', 
		'The United States will ' + not() + ' sign the Kyoto Protocol and commit to reducing CO2 emissions', 
		'global temperatures will ' + not() + ' reach a theoretical point of no return in the next 100 years'
	],
	/*[
		2,
		' US companies focus their advertising on the Web next year', 
		'the New York Times becomes more profitable', 
		' US companies will ' + not() + ' focus their advertising on the Web next year', 
		'the New York Times will ' + not() + ' become more profitable'
	],*/
	[
		2,
		'Intellectual property law in the US will be updated to a reflect advances in technology by the year 2040', 
		'Russia will become the world center for software development by 2040', 
		'Intellectual property law in the US will ' + not() + ' be updated to a reflect advances in technology by the year 2040', 
		'Russia will ' + not() + ' become the world center for software development by 2040'
	],
	/*[
		3,
		'A nuclear weapon will be used in a terrorist attack in the next decade', 
		'there will be a substantial decrease in terrorist activity in the next 10 years', 
		'A nuclear weapon will ' + not() + ' be used in a terrorist attack in the next decade', 
		'there will ' + not() + ' be a substantial decrease in terrorist activity in the next 10 years'
	],*/
	[
		3,
		'The United States adopts an open border policy of universal acceptance', 
		'English is legally declared the official language of the United States', 
		'The United States does ' + not() + ' adopt an open border policy of universal acceptance', 
		'English is ' + not() + ' legally declared the official language of the United States'
	],
	/*[
		5,
		' Greece will make a full economic recovery in the next 10 years', 
		'Greece will be forced to leave the EU in the next 10 years', 
		' Greece will ' + not() + ' make a full economic recovery in the next 10 years', 
		'Greece will ' + not() + ' be forced to leave the EU in the next 10 years'
	],*/
	[
		4,
		'Scientists will discover a cure for Parkinson\'s disease in 10 years', 
		'the number of patients who suffer from Parkinson\'s disease will triple by 2050', 
		'Scientists will ' + not() + ' discover a cure for Parkinson\'s disease in 10 years', 
		'the number of patients who suffer from Parkinson\'s disease will ' + not() + ' triple by 2050'
	],
	/*[
		8,
		' Honda will go bankrupt in 2016', 
		'Ford will go bankrupt before the end of 2017', 
		' Honda will ' + not() + ' go bankrupt in 2016', 
		'Ford will ' + not() + ' go bankrupt before the end of 2017'
	],*/
	[
		5,
		'A new illegal but synthetic drug becomes popular in the USA over the next two years', 
		'the movement to decriminalize drugs doubles its numbers by 2017', 
		'A new illegal but synthetic drug will ' + not() + ' become popular in the USA over the next two years', 
		'the movement to decriminalize drugs will ' + not() + ' double its numbers by 2017'
	],
	[
		6,
		'3-dimensional graphics will be required to contain explicit markers to indicate their unreal nature by 2020', 
		'competitive video game playing will achieve mainstream acceptance by 2020', 
		'3-dimensional graphics will ' + not() + ' be required to contain explicit markers to indicate their unreal nature by 2020', 
		'competitive video game playing will ' + not() + ' achieve mainstream acceptance by 2020'
	],
	[
		7,
		'The Supreme Court rules on the constitutionality of gay marriage in the next 5 years', 
		'a gay person will be elected as president in the next 50 years', 
		'The Supreme Court will ' + not() + ' rule on the constitutionality of gay marriage in the next 5 years', 
		'a gay person will ' + not() + ' be elected as president in the next 50 years'
	],
	/*[
		10,
		'In less than 15 years, millions of people will live past 100', 
		'advances in genetics will end the shortage of replacement organs in the next 15 years', 
		'In less than 15 years, millions of people will ' + not() + ' live past 100', 
		'advances in genetics will ' + not() + ' end the shortage of replacement organs in the next 15 years'
	],*/
	/*[
		11,
		'Space tourism will achieve widespread popularity in the next 50 years', 
		'advances in material science will lead to the development of anti-gravity materials in the next 50 years', 
		'Space tourism will ' + not() + ' achieve widespread popularity in the next 50 years', 
		'advances in material science will ' + not() + ' lead to the development of anti-gravity materials in the next 50 years'
	],*/
	[
		8,
		'Intelligent alien life is found outside the solar system in the next 10 years', 
		'world governments dedicate more resources to contacting extra-terrestrials', 
		'Intelligent alien life is ' + not() + ' found outside the solar system in the next 10 years', 
		'world governments will ' + not() + ' dedicate more resources to contacting extra-terrestrials'
	],
	/*[
		15,
		'The legal drinking age will be lowered in the United States in the next few years', 
		'The number of traffic accidents goes up in in the next few years', 
		'The legal drinking age will ' + not() + ' be lowered in the United States in the next few years', 
		'The number of traffic accidents will ' + not() + ' go up in in the next few years'
	],
	[
		16,
		'The Islamic State will carry out a terroristic attack in the next months', 
		'NATO will grant military support to Iraq and help defeating the Islamic State', 
		'The Islamic State will ' + not() + ' carry out a terroristic attack in the next months', 
		'NATO will ' + not() + ' grant military support to Iraq and help defeating the Islamic State'
	],*/
];
var task_num = materials.length;

// balancing
var curr_material = mycounterbalance % task_num;
versions = [4, 4];
var material_count = 0;
var version_count = 0;
var curr_version = -1;
while (material_count < materials.length) {
	while (curr_version == -1) {
		if (versions[version_count] > 0) {
			--versions[version_count];
			curr_version = version_count;
		}
		++version_count;
		if (version_count > 1) {
			version_count = 0;
		}
	}
	materials[curr_material][5] = curr_version + 1;
	curr_version = -1;
	++material_count;
	++curr_material;
	if (curr_material == materials.length) {
		curr_material = 0;
	}
}
var order_ok = false;
while (order_ok == false) {
	materials = _.shuffle(materials);
	var count = 0;
	for (var i = 0; i < 4; ++i) {
		count += materials[i][5]
	}
	if (count != 4 && count != 8) {
		order_ok = true;
	}
}


practice_materials = _.shuffle(practice_materials);
materials.push(practice_materials[1]);
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

	var step1 = function() {
		if (inferences.length===0) {
			finish();
		}
		else {
			inference = inferences.shift();
			show_inference(inference);
			timeon = new Date().getTime();
			//listening = true;
			$('#query').html(
				'<div id="step1">'
					+ '<p style="text-align:center;"><b>Does the premise imply that the conclusion is true?</b></p>'
					+ '<div class="col-xs-2"></div><div class="col-xs-8"><center>'
					+ '<button type="button" value="yes" class="btn btn-primary btn-lg btn-yes response">Yes</button>'
					+ '<button type="button" value="no" class="btn btn-primary btn-lg btn-no response">No</button>'
					+ '</center></div><div class="col-xs-2"></div>'
				+' </div>'
			);
			$(".response").click(
				function () {
					response = $(this).attr('value');
					if (response.length>0) {
						//listening = false;
						var hit = false;
						if ((inference[4] == 1 && response == 'yes')
							|| (inference[4] == 2 && response == 'no')
							|| (inference[4] == 3 && response == 'no')
							|| (inference[4] == 4 && response == 'no')) {
							hit = true;
						}
						var rt = new Date().getTime() - timeon;

						var phase = "TEST_INFERENCE";
						if (inference[0] > task_num) {
							phase = "PRACTICE_INFERENCE";
						}

						pjpsi.recordTrialData(
							{
								'phase':phase,
								'response':response,
								'hit':hit,
								'rt':rt,
								'material':inference[0],
								'premise':get_disjunction(inference[1], inference[2], inference[5]),
								'conclusion':get_conclusion(inference),
								'version':inference[5]
							}
			           	);
						step2(inference);
					}
				}
			);
		}
	};

	var step2 = function(inference) {
		remove_inference();
		timeon = new Date().getTime();
		//listening = true;
		$('#query').html(
			'<div id="step2">'
				+ '<p>'
				+ '<b>What are the chances out of 100 that each of the following assertions (1 to 4) is true?</b>'
				+ '<br /><br />Choose a number from 0 (no chance at all) to 100 (completely certain) for each assertion by using the sliders.'
				+ ' If you cannot see a complete page on your system, please scroll down to the rest of the page.'
				+ '</p>'
				+ '<div id="sliders"></div>'
				+ '<div class="col-xs-2"></div><div class="col-xs-8">'
				+ '<center><button type="button" value="continue" class="btn btn-primary btn-lg btn-estimates response">'
					+ 'Continue <span class="glyphicon glyphicon-arrow-right"></span>'
				+ '</button></center></div><div class="col-xs-2"></div>'
			+' </div>'
		);
		create_sliders(inference, 'jpd');
		$(".response").click(
			function () {
				response = $(this).attr('value');

				var slider_modified = true;
				if (mode != 'debug') {
					_.each(
						["a-and-b", "na-and-b", "a-and-nb", "na-and-nb"], 
						function (item) {
							if ($('#' + item + '-value-modified').val() == "0") {
								slider_modified = false;
								return;
							}
						}
					);
				}

				if (response.length>0 && slider_modified == true) {
					//listening = false;
					var hit = false;
					var rt = new Date().getTime() - timeon;

					var phase = "TEST_JPD";
					if (inference[0] > task_num) {
						phase = "PRACTICE_JPD";
					}

					pjpsi.recordTrialData(
						{
							'phase':phase,
							'response':response,
							'hit':hit,
							'rt':rt,
							'material':inference[0],
							'version':inference[5],
							"a-and-b":parseInt($('#a-and-b-value').html()), 
							"na-and-b":parseInt($('#na-and-b-value').html()), 
							"a-and-nb":parseInt($('#a-and-nb-value').html()), 
							"na-and-nb":parseInt($('#na-and-nb-value').html()), 
						}
		            );
					step3(inference);
				} else {
					alert(
						"Please set a value for each slider."
						+ "\n\nIf you want to set a slider to 50%, set the slider to any value first and then back to 50%."
					);
				}
			}
		);
	};

	var step3 = function(inference) {
		timeon = new Date().getTime();
		//listening = true;
		$('#query').html(
			'<div id="step2">'
				+ '<p>'
				+ '<b>What are the chances out of 100 that each of the following assertions (1 to 2) is true?</b>'
				+ '<br /><br />Choose a number from 0 (no chance at all) to 100 (completely certain) for each assertion by using the sliders.'
				+ ' If you cannot see a complete page on your system, please scroll down to the rest of the page.'
				+ '</p>'
				+ '<div id="sliders"></div>'
				+ '<div class="col-xs-2"></div><div class="col-xs-8">'
				+ '<center><button type="button" value="continue" class="btn btn-primary btn-lg btn-estimates response">'
					+ 'Continue <span class="glyphicon glyphicon-arrow-right"></span>'
				+ '</button></center></div><div class="col-xs-2"></div>'
			+' </div>'
		);
		create_sliders(inference, 'inference');
		$(".response").click(
			function () {
				response = $(this).attr('value');

				var pc = []
				if (inference[5] == 1 || inference[5] >= 5) {
					pc = ["a-or-b-i", "p-a-and-b"];
				} else if (inference[5] == 2) {
					pc = ["a-or-b-e", "p-a-and-b"];
				} else if (inference[5] == 3) {
					pc = ["a-or-b-e", "a-and-i"];
				} else if (inference[5] == 4) {
					pc = ["a-or-b-i", "a-or-b-e"];
				}

				var slider_modified = true;
				if (mode != 'debug') {
					_.each(
						[pc[0], pc[1]], 
						function (item) {
							if ($('#' + item + '-value-modified').val() == "0") {
								slider_modified = false;
								return;
							}
						}
					);
				}

				if (response.length>0 && slider_modified == true) {
					//listening = false;
					var hit = false;
					var rt = new Date().getTime() - timeon;

					var phase = "TEST_LIKELIHOODS";
					if (inference[0] > task_num) {
						phase = "PRACTICE_LIKELIHOODS";
					}

					pjpsi.recordTrialData(
						{
							'phase':phase,
							'response':response,
							'hit':hit,
							'rt':rt,
							'material':inference[0],
							'version':inference[5],
							'premise':parseInt($('#' + pc[0] + '-value').html()), 
							'conclusion':parseInt($('#' + pc[1] + '-value').html()),
						}
		            );
					step1();
				} else {
					alert(
						"Please set a value for each slider."
						+ "\n\nIf you want to set a slider to 50%, set the slider to any value first and then back to 50%."
					);
				}
			}
		);
	};
	
	var create_sliders = function (inference, which) {
		var range_all_sliders = {
			'min': [   0 ], '10%': [  10 ], '20%': [  20 ], '30%': [  30 ], '40%': [  40 ], '50%': [  50 ], '60%': [  60 ], '70%': [  70 ], '80%': [  80 ], '90%': [  90 ], 'max': [ 100 ]
		};
		var slider_count = 1;
		if (which == 'jpd') {
			var slider_keys = ["a-and-b", "na-and-b", "a-and-nb", "na-and-nb"];
		} else {
			if (inference[5] == 1 || inference[5] >= 5) {
				var slider_keys = ["p-a-and-b", "a-or-b-i"];
			} else if (inference[5] == 2) {
				var slider_keys = ["p-a-and-b", "a-or-b-e"];
			} else if (inference[5] == 3) {
				var slider_keys = ["a-or-b-i", "a-or-b-e"];
			} else if (inference[5] == 4) {
				var slider_keys = ["a-or-b-e", "a-or-b-i"];
			}
		}
		_.each(
			_.shuffle(slider_keys), 
			function (id) {
				$("#sliders").append(
					'<div class="text-and-slider">' 
					+ (slider_count++) + '. ' + get_assertion(inference, id)
					+ '<br /><span id="' + id + '-value" class="slider-value"></span> <span class="slider-value">chance</span> <span id="'  + id + '-value-modified-sign" class="slider-value"> - Slider not modified yet!</span>'
					+ '<div id="'  + id + '" class="slider"></div><input id="'  + id + '-value-modified" value="0" type="hidden" /><br /><br />'
					+ '</div>'
				);
				$('#' + id).noUiSlider({
					start: [ 50 ],
					range: range_all_sliders,
					format: wNumb({
						decimals: 0,
						postfix: '%',
					})
				});
				$('#' + id).noUiSlider_pips({
					mode: 'range',
					density: 2,
					filter: function (value, type){
						return 2;
					}
				});	

				$('#' + id).Link().to($('#' + id + '-value'));	
				$('#' + id).Link().to(
					slider_modified, 
					null, 
					{
						to: parseInt,
						from: Number
					}
				);	
			}
		);
	};

	var slider_modified = function  (value) {
		if (value != 50) {
			var id = $(this).attr('id');
			$('#' + id + '-value-modified').val(1);
			$('#' + id + '-value-modified-sign').html('');
		}
	};

	/*var response_handler = function(e) {
		if (!listening) return;
	};*/
	
	var show_inference = function(inference) {
		if (inference[0] <= task_num) {
			var premise = get_disjunction(inference[1], inference[2], inference[5]);
		} else {
			var premise = 'IF ' + lowercaseFirstLetter(inference[1]) + ' THEN ' + inference[2] + '.';
		}
		/*} else if (inference[0] == 18) {
			var premise = '' + inference[1] + ' UNLESS ' + inference[2] + '.';
		}*/
		d3.select("#inference")
			.append("div")
			.attr("id","premise")
			.text("Premise: " + premise);

		if (inference[0] <= task_num) {
			var conclusion = get_conclusion(inference);
		} else if (inference[0] == task_num + 1) {
			var conclusion = get_conclusion(inference);
		} else if (inference[0] == task_num + 2) {
			var conclusion = get_conclusion(inference);
		}
		/*} else if (inference[0] == 18) {
			var conclusion = 'It is possible that ' + lowercaseFirstLetter(get_conjunction(inference, 'na-and-nb'));
		}*/	
		d3.select("#inference")
			.append("div")
			.attr("id","conclusion")
			.text("Conclusion: " + conclusion);
	};

	var get_conclusion = function (inference) {
		var conclusion = "";
		if (inference[5] < 3 || inference[5] == 5) {
			conclusion =  "It is possible that " + lowercaseFirstLetter(get_conjunction(inference));
		} else if (inference[5] == 6) {
			conclusion =  get_conjunction(inference);
		} else {
			if (inference[5] == 3) {
				inference[5] = 4;
			} else {
				inference[5] = 3;
			}
			conclusion =  get_disjunction(inference[1], inference[2], inference[5]);
		}
		return conclusion;
	};

	var get_assertion = function (inference, which) {
		if (inference[0] >= task_num + 1 && which == "a-or-b-i") {
			return 'IF ' + lowercaseFirstLetter(inference[1]) + ' THEN ' + inference[2] + '.';
		} else if (which == "a-or-b-i" || which == "a-or-b-e") {
			var type = 1;
			if (which == "a-or-b-e") {
				type = 2;
			}
			return get_disjunction(inference[1], inference[2], type);
		} else if (which == "p-a-and-b" && inference[5] != 6) { // it is a conjunction
			return 'It is possible that ' + lowercaseFirstLetter(get_conjunction(inference, which));
		} else { // it is a conjunction
			return get_conjunction(inference, which);
		}
	};

	var get_disjunction = function(a, b, type) {
		return a + " OR " + b + ", " + get_disjunction_ending(type) + '.';
	};

	var get_disjunction_ending = function (type_of_disjunction) {
		if (type_of_disjunction == 1 || type_of_disjunction == 3) {
			return "OR both";
		} else {
			return "BUT not both";
		}
	};

	var get_conjunction = function(inference, which) {
		switch (which) {
			case "na-and-b":
				return inference[3] + " AND " + inference[2] + '.';
			case "a-and-nb":
				return inference[1] + " AND " + inference[4] + '.';
			case "na-and-nb":
				return inference[3] + " AND " + inference[4] + '.';
			default:
				return inference[1] + " AND " + inference[2] + '.';
		}
	};

	var remove_inference = function() {
		d3.select("#premise").remove();
		d3.select("#conclusion").remove();
	};

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
	step1();
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
	    pjpsi.saveData({
            success: function(){
                /*pjpsi.computeBonus('compute_bonus', function() { 
                	pjpsi.completeHIT(); // when finished saving compute bonus, the quit
                });*/
                pjpsi.complete(); // when finished saving compute bonus, the quit
            }, 
            error: prompt_resubmit});
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
