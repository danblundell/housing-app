(function () {
	'use strict';
	var nbcApp = nbcApp || {models: {}};

	nbcApp.models.App = function () {
		var self = this;

		//array of page objects
		this.pages = ko.observableArray();

		//show selected page
		this.showPage = ko.computed({
			read: function () {
				return true;
			},
			write: function (i) {
				$.each(self.pages(), function (k, item) {
					item.pageShow(false);
				});
				self.pages()[i].pageShow(true);
			}
		}, this);


		//move to the next page
		this.nextPage = function () {
			var nextpage = this.index() + 1;
			self.showPage(nextpage);
		};

		//move the previous page
		this.prevPage = function () {
			var nextpage = this.index() - 1;
			self.showPage(nextpage);
		};

		//flag if form is complete
		this.formComplete = ko.computed(function () {
			if (self.pages()) {
				for (var n = 0; n < self.pages().length; n += 1) {
					if (!self.pages()[n].pageComplete()) {
						return false;
					}
				}
				return true;
			}
			return false;
		}, this);

		//set up pages from json data
		this.init = function (data) {
			$.each(data.pages, function (k,item) {
				var page = new nbcApp.models.Page();
				page.init(item);
				page.index(k);
            	self.pages.push(page);
        	});
        	self.showPage(0);
		};


	}

	nbcApp.models.Page = function () {
		var self = this;
		this.pageName = ko.observable();
		this.pageDesc = ko.observable();
		this.questions = ko.observableArray();
		this.pageShow = ko.observable(false);
		this.index = ko.observable();

		//flag if the page is complete
		this.pageComplete = ko.computed(function () {
			for(var x = 0; x < self.questions().length; x += 1) {
				if (!self.questions()[x].answered()) {
					return false;
				}
			}
			return true;
		}, this);

		//set up questions from json data
		this.init = function (data) {
			self.pageName(data.pageName);
			self.pageDesc(data.pageDesc);
			ko.utils.arrayForEach(data.questions, function (item) {
				var q = new nbcApp.models.Question(item.question,item.answers,item.answer,item.help,item.link,item.info,item.infolink);
            	self.questions.push(q);
            	if (item.subQuestions && item.subQuestions.length > 0) {
            		ko.utils.arrayForEach(item.subQuestions, function (subQ) {
            			var subQuestion = new nbcApp.models.Question(subQ.question,subQ.answers,subQ.answer,subQ.help,subQ.link, subQ.info, subQ.infolink);
            			q.subQuestions.push(subQuestion)
            		});
            	}
        	});
		}
	};

	nbcApp.models.Question = function (q,a,cA,help,ahref,info,infolink) {
		var self = this;
		this.q = ko.observable(q);
		this.a = ko.observableArray(a);
		this.correctA = ko.observable(cA);
		this.selectedA = ko.observable();
		this.help = ko.observable(help);
		this.ahref = ko.observable(ahref);
		this.correct = ko.computed(function () {
			return (self.selectedA() === self.correctA()) ? true : false;
		}, this);
		this.subQuestions = ko.observableArray();
		this.answered = ko.computed(function () {
			return (self.selectedA() === "Select...") ? false : true;
		}, this);
		this.info = ko.observable(info);
		this.infolink = ko.observable(infolink);
	};

	var json = {
		"pages":
		[
			{
				"pageName" : "Your Circumstances",
				"pageDesc" : "Here's a few simple questions to get you started, please complete them so that we can guide you in the best way according to your personal circumstances.",
				"questions": [
					{
						"question": "How old are you",
						"answers": ["Select...", "Under 16 years old", "Over 16 years old"],
						"answer": "Over 16 years old",
						"info": "As you are under 16, we advise that we are unable to offer you support but you can contact find help elsewhere",
						"infolink": "http://northampton.gov.uk"
					},
					{
						"question": "Do you, or a joint applicant already have a social housing tenancy in the Northampton area",
						"answers": ["Select...", "Yes", "No"],
						"answer": "No",
						"help": "What is the Northampton Area?",
						"link" : "http://google.com?q=what is the northampton area"
					},
					{
						"question": "Do you want to inform us of a change to your circumstance",
						"answers": ["Select...", "Yes", "No"],
						"answer": "No",
						"help": "What counts as a change in circumstance?",
						"link" : "http://google.com?q=what is a change of circumstance"
					},
					{
						"question": "Do you want to tell us about a medical or welfare need",
						"answers": ["Select...", "Yes", "No"],
						"answer": "No"
					},
					{
						"question": "Do you owe any debts to Northampton Borough Council",
						"answers": ["Select...", "Yes", "No"],
						"answer": "No",
						"subQuestions": [
							{
								"question": "How much",
								"answers": ["Select...", "Less than £600", "More than £600"],
								"answer": "Less than £600",
								"info": "As you owe more then £600, we advise that we are unable to offer you support but you can contact find help elsewhere",
								"infolink": "http://northampton.gov.uk"	
							}
						]
					},
					{
						"question": "Are you homeless",
						"answers": ["Select...", "Yes", "No"],
						"answer": "Yes",
						"help": "What is homelessness",
						"link" : "http://google.com?q=what is homelessness"
					}
				]
			},
			{
				"pageName" : "Local Connection",
				"pageDesc" : "Second page description",
				"questions": [
					{
						"question": "Do you live in Northampton",
						"answers": ["Select...", "Yes", "No"],
						"answer": "Yes",
						"help": "What counts Northampton?",
						"link": "http://google.com?q=what is the Northampton area"
					},
					{
						"question": "Do you have a relative in the Northampton area?",
						"answers": ["Select...", "Yes", "No"],
						"answer": "Yes"
					},
					{
						"question": "Do you Work in Northampton",
						"answers": ["Select...", "Yes", "No"],
						"answer": "Yes"
					}

				]
			}
		]
	};

	var app = new nbcApp.models.App();
	app.init(json);
	ko.applyBindings(app);
})();