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
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-ready.html",
	"stage.html",
	"postquestionnaire.html"
];

pjpsi.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-ready.html"
];

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
* STROOP TEST       *
********************/
var StroopExperiment = function() { //, practice, finish

	var wordon, // time word is presented
	    listening = false;

	// Stimuli for a basic Stroop experiment
	var stims = [
			["SHIP", "red", "unrelated"],
			["MONKEY", "green", "unrelated"],
			["ZAMBONI", "blue", "unrelated"],
			["RED", "red", "congruent"],
			["GREEN", "green", "congruent"],
			["BLUE", "blue", "congruent"],
			["GREEN", "red", "incongruent"],
			["BLUE", "green", "incongruent"],
			["RED", "blue", "incongruent"]
		];

	stims = _.shuffle(stims);

	var next = function () {
		if (stims.length===0) {
			finish();
		}
		else {
			stim = stims.shift();
			show_word( stim[0], stim[1] );
			wordon = new Date().getTime();
			listening = true;
			d3.select("#query").html('<p id="prompt">Type "R" for Red, "B" for blue, "G" for green.</p>');
		}
	};
	
	var response_handler = function(e) {
		if (!listening) return;

		var keyCode = e.keyCode,
			response;

		switch (keyCode) {
			case 82:
				// "R"
				response="red";
				break;
			case 71:
				// "G"
				response="green";
				break;
			case 66:
				// "B"
				response="blue";
				break;
			default:
				response = "";
				break;
		}
		if (response.length>0) {
			listening = false;
			var hit = response == stim[1];
			var rt = new Date().getTime() - wordon;

			pjpsi.recordTrialData(
				{
					'phase':"TEST",
					'word':stim[0],
					'color':stim[1],
					'relation':stim[2],
					'response':response,
					'hit':hit,
					'rt':rt
				}
			);
			//pjpsi.saveData();
			remove_word();
			next();
		}
	};

	var finish = function() {
	    $("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new Questionnaire();
	};
	
	var show_word = function(text, color) {
		d3.select("#stim")
			.append("div")
			.attr("id","word")
			.style("color",color)
			.style("text-align","center")
			.style("font-size","150px")
			.style("font-weight","400")
			.style("margin","20px")
			.text(text);
	};

	var remove_word = function() {
		d3.select("#word").remove();
	};

	// Load the stage.html snippet into the body of the page
	pjpsi.showPage('stage.html');

	// Register the response handler that is defined above to handle any
	// key down events.
	$("body").focus().keydown(response_handler); 

	// Start the test
	next();	
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
            	pjpsi.complete();
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
	    	function () { currentview = new StroopExperiment(); } // what you want to do when you are done with instructions
	    );
	}
);
