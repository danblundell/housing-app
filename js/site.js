(function () {
	'use strict';
	var nbcApp = nbcApp || {models: {}};

	nbcApp.models.App = function () {
		var self = this;

		this.questions = ko.observableArray();
		this.currentQ = ko.observable(0);
		this.apply = ko.observable(false);

		//move to the next page
		this.nextQ = function () {
			if(this.link()){
				window.location = this.link();
			} 
			else{
				if(self.lastQuestion()){
					self.apply(true);
				}
				self.currentQ(self.currentQ() + 1);
			}
		};

		this.lastQuestion = ko.computed(function () {
			return ((self.questions().length) === (self.currentQ() + 1)) ? true : false;
		},this);

		this.init = function (data) {
			var questions = data;
			for (var i = 0; i < questions.length; i += 1) {
				var question = new nbcApp.models.Question(),
					answers = questions[i].answers;

				question.content(questions[i].question);
				question.index(i);

				for (var n = 0; n < answers.length; n += 1) {
					var answer = new nbcApp.models.Answer();
					answer.content(answers[n].answer);
					answer.link(answers[n].link);
					question.answers.push(answer);
				};

				self.questions.push(question);

			};
		};


	}

	nbcApp.models.Question = function () {
		var self = this;
		this.index = ko.observable();
		this.content = ko.observable();
		this.answers = ko.observableArray();
	};

	nbcApp.models.Answer = function () {
		var self = this;

		this.content = ko.observable();
		this.link = ko.observable();
	};

	var json = [
		{
			"question" : "How old are you?",
			"answers" : [
				{
					"answer" : "Under 16",
					"link" : "http://www.northampton.gov.uk/housing"
				},
				{
					"answer" : "Over 16"
				}
			]
		},
		{
			"question" : "Do you, or a joint applicant already have a social housing tenancy in the Northampton area?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk"
				},
				{
					"answer" : "No"
				},
				{
					"answer" : "Maybe",
					"link" : "http://www.northampton.gov.uk/housing"
				}
			]
		},
		{
			"question" : "Do you want to inform us of a change to your circumstance",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk/housing"
				},
				{
					"answer" : "No"
				}
			]
		}
	];

	var app = new nbcApp.models.App();
	app.init(json);
	ko.applyBindings(app);
})();