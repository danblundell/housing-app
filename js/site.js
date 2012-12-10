(function () {
	'use strict';
	var nbcApp = nbcApp || {models: {}};

	nbcApp.models.App = function () {
		var self = this;

		this.questions = ko.observableArray();

		//move to the next page
		this.nextQ = function () {

		};

		this.init = function (data) {
			var questions = data.questions;
			for (var i = 0; i < questions.length; i += 1) {
				var question = new nbcApp.models.Question(),
					answers = questions[i].answers;

				question.content(questions[i].question);

				for (var n = 0; n < answers.length; n += 1) {
					var answer = new nbcApp.models.Answer();
					answer.content(answers[n].answer);
					question.answers.push(answer);
				};

				self.questions.push(question);
			};
		};

	}

	nbcApp.models.Question = function () {
		var self = this;
		this.content = ko.observable();
		this.answers = ko.observableArray();
	};

	nbcApp.models.Answer = function () {
		var self = this;

		this.content = ko.observable();
		this.link = ko.observable();
	};

	var json = {
		"questions" : [
			{
				"question" : "Does this work?",
				"answers" : [
					{"answer" : "Yes"},
					{"answer" : "No"}
				]
			},
			{
				"question" : "Does this work too?",
				"answers" : [
					{"answer" : "Almost"},
					{"answer" : "Perfectly"}
				]
			}
		]
	};

	var app = new nbcApp.models.App();
	app.init(json);
	ko.applyBindings(app);
})();