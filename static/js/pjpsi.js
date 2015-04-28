/*
 * Requires:
 *     jquery
 *     backbone
 *     underscore
 */


/****************
 * Internals    *
 ***************/

// Sets up global notifications pub/sub
// Notifications get submitted here (via trigger) and subscribed to (via on)
Backbone.Notifications = {};
_.extend(Backbone.Notifications, Backbone.Events);

/*******
 * API *
 ******/
var PJPsi = function(prolificid, serverLoc, mode) { // serverLoc
	mode = mode || "live";  // defaults to live mode in case user doesn't pass this
	var self = this;

	/****************
	 * TASK DATA    *
	 ***************/
	var TaskData = Backbone.Model.extend({
		urlRoot: serverLoc + "/sync", // Save will PUT to /sync, with mimetype 'application/JSON'
		id: prolificid,
		serverLoc: serverLoc,
		mode: mode,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		
		defaults: {
			condition: 0,
			counterbalance: 0,
			prolificid: 0,
			currenttrial: 0,
			//bonus: 0,
			data: [],
			questiondata: {},
			eventdata: [],
			useragent: ""
		},
		
		initialize: function() {
			this.useragent = navigator.userAgent;
			this.addEvent('initialized', null);
			this.addEvent('window_resize', [window.innerWidth, window.innerHeight]);

			this.listenTo(Backbone.Notifications, '_pjpsi_lostfocus', function() { this.addEvent('focus', 'off'); });
			this.listenTo(Backbone.Notifications, '_pjpsi_gainedfocus', function() { this.addEvent('focus', 'on'); });
			this.listenTo(Backbone.Notifications, '_pjpsi_windowresize', function(newsize) { this.addEvent('window_resize', newsize); });
		},

		addTrialData: function(trialdata) {
			trialdata = {"prolificid":this.id, "current_trial":this.get("currenttrial"), "dateTime":(new Date().getTime()), "trialdata":trialdata};
			var data = this.get('data');
			data.push(trialdata);
			this.set('data', data);
			this.set({"currenttrial": this.get("currenttrial")+1});
		},
		
		addUnstructuredData: function(field, response) {
			var qd = this.get("questiondata");
			qd[field] = response;
			this.set("questiondata", qd);
		},
		
		getTrialData: function() {
			return this.get('data');	
		},
		
		getEventData: function() {
			return this.get('eventdata');	
		},
		
		getQuestionData: function() {
			return this.get('questiondata');	
		},
		
		addEvent: function(eventtype, value) {
			var interval,
			    ed = this.get('eventdata'),
			    timestamp = new Date().getTime();

			if (eventtype == 'initialized') {
				interval = 0;
			} else {
				interval = timestamp - ed[ed.length-1]['timestamp'];
			}

			ed.push({'eventtype': eventtype, 'value': value, 'timestamp': timestamp, 'interval': interval});
			this.set('eventdata', ed);
		}
	});


	/*****************************************************
	* INSTRUCTIONS 
	*   - a simple, default instruction player
	******************************************************/
	var Instructions = function(parent, pages, callback) {

		var self = this;
		var pjpsi = parent;
		var currentscreen = 0, timestamp;
		var instruction_pages = pages; 
		var complete_fn = callback;

		var loadPage = function() {

			// show the page
			pjpsi.showPage(instruction_pages[currentscreen]);

			// connect event handler to previous button
			if(currentscreen != 0) {  // can't do this if first page
				$('.previous').bind('click.pjpsi.instructionsnav.prev', function() {
					prevPageButtonPress();
				});
			}

			// connect event handler to continue button
			$('.continue').bind('click.pjpsi.instructionsnav.next', function() {
				nextPageButtonPress();
			});
			
			// Record the time that an instructions page is first presented
			timestamp = new Date().getTime();

		};

		var prevPageButtonPress = function () {

			// Record the response time
			var rt = (new Date().getTime()) - timestamp;
			viewedscreen = currentscreen;
			currentscreen = currentscreen - 1;
			if (currentscreen < 0) {
				currentscreen = 0; // can't go back that far
			} else {
				pjpsi.recordTrialData({"phase":"INSTRUCTIONS", "template":pages[viewedscreen], "indexOf":viewedscreen, "action":"PrevPage", "viewTime":rt});
				loadPage(instruction_pages[currentscreen]);
			}

		}

		var nextPageButtonPress = function() {

			// Record the response time
			var rt = (new Date().getTime()) - timestamp;
			viewedscreen = currentscreen;
			currentscreen = currentscreen + 1;

			if (currentscreen == instruction_pages.length) {
				pjpsi.recordTrialData({"phase":"INSTRUCTIONS", "template":pages[viewedscreen], "indexOf":viewedscreen, "action":"FinishInstructions", "viewTime":rt});
				finish();
			} else {
				pjpsi.recordTrialData({"phase":"INSTRUCTIONS", "template":pages[viewedscreen], "indexOf":viewedscreen, "action":"NextPage", "viewTime":rt});
				loadPage(instruction_pages[viewedscreen]);
			}

		};

		var finish = function() {

			// unbind all instruction related events
			$('.continue').unbind('click.pjpsi.instructionsnav.next');
			$('.previous').unbind('click.pjpsi.instructionsnav.prev');

			// Record that the user has finished the instructions and 
			// moved on to the experiment. This changes their status code
			// in the database.
			pjpsi.finishInstructions();

			// Move on to the experiment 
			complete_fn();
		};



		/* public interface */
		self.getIndicator = function() {
			return {"currently_viewing":{"indexOf":currentscreen, "template":pages[currentscreen]}, "instruction_deck":{"total_pages":instruction_pages.length, "templates":instruction_pages}};
		}

		self.loadFirstPage = function () { loadPage(); }

		// log instruction are starting
		pjpsi.recordTrialData({"phase":"INSTRUCTIONS", "templates":pages, "action":"Begin"});

		return self;
	};
	
	/*  PUBLIC METHODS: */
	self.preloadImages = function(imagenames) {
		$(imagenames).each(function() {
			image = new Image();
			image.src = serverLoc + '/static/' + this;
		});
	};
	
	self.preloadPages = function(pagenames) {
		// Synchronously preload pages.
		$(pagenames).each(function() {
			$.ajax({
				url: serverLoc + '/templates/' + this,
				success: function(page_html) { self.pages[this.url] = page_html; },
				dataType: "html",
				async: false
			});
		});
	};

	// Get HTML file from collection and pass on to a callback
	self.getPage = function(pagename) {
		pagename = serverLoc + '/templates/' + pagename;
		if (!(pagename in self.pages)){
		    throw new Error(
			["Attemping to load page before preloading: ",
			pagename].join(""));
		};
		return self.pages[pagename];
	};
	
	// Add a line of data with any number of columns
	self.recordTrialData = function(trialdata) {
		taskdata.addTrialData(trialdata);
	};
	
	// Add data value for a named column. If a value already
	// exists for that column, it will be overwritten
	self.recordUnstructuredData = function(field, value) {
		taskdata.addUnstructuredData(field, value);
	};

	self.getTrialData = function() {
		return taskdata.getTrialData();	
	};
		
	self.getEventData = function() {
		return taskdata.getEventData();	
	};
		
	self.getQuestionData = function() {
		return taskdata.getQuestionData();	
	};

	// Add bonus to task data
	/*self.computeBonus = function(url, callback) {
		$.ajax(url, {
                    type: "GET",
                    data: {prolificid: self.taskdata.id},
                    success: callback
                });
	};*/
	
	// Save data to server
	self.saveData = function(callbacks) {
		taskdata.save(undefined, callbacks);
	};

	self.startTask = function () {
		self.saveData();
		
		$.ajax(serverLoc + "/inexp", {
				type: "POST",
				data: {prolificid: self.taskdata.id}
		});

		if (self.taskdata.mode != 'debug') {  // don't block people from reloading in debug mode
			// Provide opt-out 
			$(window).on("beforeunload", function(){
				self.saveData();
				
				$.ajax(serverLoc + "/quitter", {
						type: "POST",
						data: {prolificid: self.taskdata.id}
				});
				//var optoutmessage = "By leaving this page, you opt out of the experiment.";
				//alert(optoutmessage);
				return "By leaving or reloading this page, you opt out of the experiment. Are you sure you want to leave the experiment?";
			});
		}

	};
	
	// Notify app that participant has begun main experiment
	self.finishInstructions = function(optmessage) {
		Backbone.Notifications.trigger('_pjpsi_finishedinstructions', optmessage);
	};
	
	self.teardownTask = function(optmessage) {
		Backbone.Notifications.trigger('_pjpsi_finishedtask', optmessage);
	};

	self.complete = function() {
		self.teardownTask();
		// save data one last time here?
		window.location.href = self.taskdata.serverLoc + '/complete/' + self.taskdata.id;
	}

	self.doInstructions = function(pages, callback) {
		instructionController = new Instructions(self, pages, callback);
		instructionController.loadFirstPage();
	};

	self.getInstructionIndicator = function() {
		if (instructionController!=undefined) {
			return instructionController.getIndicator();
		}
	}

	// To be fleshed out with backbone views in the future.
	var replaceBody = function(x) { $('body').html(x); };

	self.showPage = _.compose(replaceBody, self.getPage);

	/* initialized local variables */

	var taskdata = new TaskData();
	taskdata.fetch({async: false});
	
	/*  DATA: */
	self.pages = {};
	self.taskdata = taskdata;


	/* Backbone stuff */
	Backbone.Notifications.on('_pjpsi_finishedinstructions', self.startTask);
	Backbone.Notifications.on('_pjpsi_finishedtask', function(msg) { $(window).off("beforeunload"); });


	$(window).blur( function() {
		Backbone.Notifications.trigger('_pjpsi_lostfocus');
	});

	$(window).focus( function() {
		Backbone.Notifications.trigger('_pjpsi_gainedfocus');	
	});

	// track changes in window size
	var triggerResize = function() {
		Backbone.Notifications.trigger('_pjpsi_windowresize', [window.innerWidth, window.innerHeight]);
	};

	// set up the window resize trigger
	var to = false;
	$(window).resize(function(){
	 if(to !== false)
	    clearTimeout(to);
	 to = setTimeout(triggerResize, 200);
	});

	return self;
};

// vi: noexpandtab nosmartindent shiftwidth=4 tabstop=4