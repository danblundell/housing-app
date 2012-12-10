(function () {
	'use strict';
	var nbcApp = nbcApp || {models: {}};

	nbcApp.models.App = function () {
		var self = this;

		//move to the next page
		this.nextQ = function () {

		};

		this.init = function (data) {
			var questions = data.questions;
			for (var i = questions.length - 1; i >= 0; i--) {
				var question = new nbcApp.models.Question();
				question.content(questions[i].question);
				console.log(questions[i].question);
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
	};

	var json = {
		"questions" : [
			{
				"question" : "Does this work?",
				"answers" : [
					{"answer" : "Yes"},
					{"answer" : "No"}
				]
			}
		]
	};

	var app = new nbcApp.models.App();
	app.init(json);
	ko.applyBindings(app);
})();