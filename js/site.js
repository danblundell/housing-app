(function () {
	'use strict';
	var nbcApp = nbcApp || {models: {}};

	nbcApp.models.App = function () {
		var self = this;

		this.questions = ko.observableArray();
		this.currentQ = ko.observable(0);
		this.apply = ko.observable(false);

		//move to the next question
		this.nextQ = function () {
			if(this.link()){
				window.location = this.link();
			} 
			else{
				if(this.nextQ() >= self.questions().length){
					self.apply(true);
				}else{
					self.apply(false);
				}
				self.currentQ(this.nextQ());
				window.location.hash = self.currentQ();
			}
		};

		//listen for hash change in supporting browsers
		this.hashChanges = function () {
			
			if('onhashchange' in window){
				window.onhashchange = function (e){

					var h = parseInt(window.location.hash.replace('#',''),10);

					if(isNaN(h)){
						h = 0;
					}

					if(self.currentQ() !== h){
						if(h >= self.questions().length){
							self.apply(true);
						}else{
							self.apply(false);
						}
						self.currentQ(h);
					}

				};
			}
		};

		this.init = function (data) {

			//populate view from model
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
					answer.nextQ(answers[n].next);
					question.answers.push(answer);
				};

				self.questions.push(question);

			};


			//remove any hash on page load
			if(window.location.hash){
				window.location.hash = '';	
			}

			//set up hash change listener
			self.hashChanges();
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
		this.nextQ = ko.observable();
	};


	// Question Data Model
	// questions: the question text
	// infoText	: text to display to support terminology in the question
	// infoLink	: a link to direct to for further information
	// answers	: an array of possible answers
	// 			answer : the text to display for an answer
	//			link   : the link to immediately redirect to if the answer is selected
	//			next   : the next question to display 

	var json = [
		{//2A (0)
			"question" : "Have you (or someone else who is applying jointly with you for housing) already completed a housing application and submitted it to Northampton Borough Council?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 1
				},
				{
					"answer" : "No",
					"next" : 2
				}
			]
		},
		{//2A.1 (1)
			"question" : "Would you like to:",
			"answers" : [
				{
					"answer" : "Tell us about medical or welfare needs in support of your application",
					"link" : "http://www.northampton.gov.uk/downloads/file/1781/housing_medical_and_special_needs_questionnaire"
				},
				{
					"answer" : "Tell us about a change to your circumstances",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1299/housing_allocations-change_in_circumstances"
				},
				{
					"answer" : "Enquire about the progress to your application",
					"link" : "http://www.northampton.gov.uk"
				},
				{
					"answer" : "Discuss something else",
					"link" : "http://www.northampton.gov.uk"
				}
			]
		},
		{//2B (2)
			"question" : "Are you (or a joint applicant) a current Northampton Borough Council or <a href='http://www.northampton.gov.uk/info/100007/housing/1272/housing_associations' title='Housing Association List' target='_blank'>Northampton Housing Association</a> Tenant",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 3
				},
				{
					"answer" : "No",
					"next" : 5
				}
			]
		},
		{//2B.1 (3)
			"question" : "Please tell us the reason you want or need to move",
			"answers" : [
				{
					"answer" : "I want to move to a smaller property",
					"next" : 31
				},
				{
					"answer" : "I am overcrowded in my home",
					"next" : 4
				},
				{
					"answer" : "I need to move to a severe medical or welfare reason",
					"next" : 4
				},
				{
					"answer" : "My home lacks basic facilities",
					"next" : 4
				},
				{
					"answer" : "My home is insanitary or hazardous",
					"next" : 4
				},
				{
					"answer" : "I want to move for a nother reason",
					"next" : 4
				}
			]
		},
		{//2B.1.1 (4)
			"question" : "Are you in rent arrears?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "need some content here"
				},
				{
					"answer" : "No",
					"link" : "need some content here"
				}
			]
		},
		{//3 (5)
			"question" : "Are you 18 years or over?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 6
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk"
				}
			]
		},
		{//4 (6)
			"question" : "Are you a British Citizen? ",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 5
				},
				{
					"answer" : "No",
					"next" :  8
				}
			]
		},
		{//4.1 (7)
			"question" : "Are you (or a joint applicant) normally resident in the United Kingdom (or a member of HM Forces if based abroad)?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 14
				},
				{
					"answer" : "No",
					"link" : "to page with lots of text"
				}
			]
		},
		{//4.2 (8)
			"question" : "Are you (or a joint applicant) a Commonwealth Citizen?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 9
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk"
				}
			]
		},
		{//4.2.1 (9)
			"question" : "Do you have a ‘right of abode’ in the United Kingdom?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 7
				},
				{
					"answer" : "No",
					"link" : "to page with lots of text"
				}
			]
		},
		{//4.2.2 (10)
			"question" : "Are you an EEA/EU National?",
			"infoText" : "Are you from one of the following countries <ul><li>List of countries</li></ul>",
			"infoLink" : "http://www.housing-rights.info/EEA-nationals.php",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 11
				},
				{
					"answer" : "No",
					"next" : 13
				}
			]
		},
		{//4.2.2.1 (11)
			"question" : "Have you worked in the United Kingdom at any time – now or in the past?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 10
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk"
				}
			]
		},
		{//4.2.2.1.1 (12)
			"question" : "Are you working now, temporarily out of work or a retired worker?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 14
				},
				{
					"answer" : "No",
					"link" : "to a page of text"
				}
			]
		},
		{//4.2.2.2 (13)
			"question" : "Are you a citizen of Bulgaria or Romania (A4 countries)?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 14
				},
				{
					"answer" : "No",
					"next" : 15
				}
			]
		},
		{//4.2.2.2.1 (14)
			"question" : "Are you currently working in the UK AND authorised to work (or exempt from authorisation)?",
			"infoLink" : "http://www.housing-rights.info/02_8_Bulgarians_Romanians.php",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 16
				},
				{
					"answer" : "No",
					"link" : "to page of text"
				}
			]
		},
		{//4.2.2.2.2 (15)
			"question" : "Do you have one of the following status",
			"answers" : [
				{
					"answer" : "Refugee",
					"next" : 16
				},
				{
					"answer" : "Humanitarian protection",
					"next" : 16
				},
				{
					"answer" : "Discretionary leave to remain",
					"next" : 16
				},
				{
					"answer" : "Exceptional leave to remain",
					"next" : 16
				},
				{
					"answer" : "Limited Leave to remain",
					"next" : 16
				},
				{
					"answer" : "Asylum seeker",
					"next" : 16
				},
				{
					"answer" : "The spouse/civil partner or child (under 18 and in full-time education) of someone who has one of the above status",
					"next" : 16
				},
				{
					"answer" : "None of the above",
					"link" : "to page of text"
				}
			]
		},
		{//5 (16)
			"question" : "Which of the following best describes your current housing situation?",
			"answers" : [
				{
					"answer" : "I am homeless",
					"next" : 15
				},
				{
					"answer" : "I have somewhere to live at the moment but are threatened with homelessness",
					"next" : 16
				},
				{
					"answer" : "I have somewhere to live but have nowhere you can live together with your immediate family ",
					"next" : 15
				},
				{
					"answer" : "I have somewhere to live and am not threatened with homelessness",
					"next" : 17
				}
			]
		},
		{//15
			"question" : "Do you have any home anywhere in the UK or abroad?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk"
				},
				{
					"answer" : "No",
					"next" : 17
				}
			]
		},
		{//16
			"question" : "Do any of the following apply to you now or will do within the next 8 weeks?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : ""
				},
				{
					"answer" : "No",
					"next" : 29
				}
			]
		},
		{//17
			"question" : "Which of the following apply to you?",
			"answers" : [
				{
					"answer" : "I'm overcrowded in my home",
					"next" : 25
				},
				{
					"answer" : "My home lacks basic facilities",
					"next" : 25
				},
				{
					"answer" : "I'm are sharing facilities with another household",
					"next" : 25
				},
				{
					"answer" : "My accommodation is hazardous or insanitary",
					"next" : 25
				},
				{
					"answer" : "My accommodation is not suitable for medical reasons",
					"next" : 18
				},
				{
					"answer" : "I need to move because of a risk to my welfare",
					"next" : 18
				},
				{
					"answer" : "None of the above",
					"next" : 20
				}
			]
		},
		{//18
			"question" : "Do you need to move because you are suffering severe harassment or violence in your current accommodation?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : ""
				},
				{
					"answer" : "No",
					"next" : 19
				}
			]
		},
		{//19
			"question" : "Do any of the following apply to you?",
			"answers" : [
				{
					"answer" : "My accommodation is not suitable, or unreasonable to live in due to my medical needs",
					"next" : 25
				},
				{
					"answer" : "There is a serious risk to my health or wellbeing if I stay in my current accommodation",
					"next" : 25
				},
				{
					"answer" : "I need to move to be able to provide care for someone",
					"next" : 25
				},
				{
					"answer" : "I need to move to be able to receive care",
					"next" : 25
				},
				{
					"answer" : "I need to move to take up an employment or training opportunity",
					"next" : 25
				},
				{
					"answer" : "I have another specific medical or welfare reason for needing to move",
					"next" : 25
				},
				{
					"answer" : "None of the above",
					"next" : 30
				}
			]
		},
		{//20
			"question" : "Are you an NBC Tenant or a Tenant of an NBC-partner Housing Association?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 21
				},
				{
					"answer" : "No",
					"next" : 30
				}
			]
		},
		{//21
			"question" : "Do any of the following apply to you?",
			"answers" : [
				{
					"answer" : "I am under-occupying my property?",
					"next" : 25
				},
				{
					"answer" : "My property has been designated as ‘sheltered housing’ and I do not need and/or qualify for this facility",
					"next" : 25
				},
				{
					"answer" : "My property has been specially adapted and I no longer/do not need the adaptations",
					"next" : 25
				},
				{
					"answer" : "I have been asked to move because my home requires major work within the next 6 weeks",
					"next" : 25
				},
				{
					"answer" : "I am a service tenant due to retire or have your contract of employment terminated",
					"next" : 25
				},
				{
					"answer" : "None of the above",
					"next" : 30
				}
			]
		},
		{//22
			"question" : "Have you lived in the Northampton area for at least SIX out of the last TWELVE months or THREE out of the last FIVE years?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk"
				},
				{
					"answer" : "No",
					"next" : 23
				}
			]
		},
		{//23
			"question" : "Do you work in Northampton?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "homelessness team"
				},
				{
					"answer" : "No",
					"next" : 24
				}
			]
		},
		{//24
			"question" : "Do you want to live near a close relative who has lived in Northampton for at least five years?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "homelessness team"
				},
				{
					"answer" : "No",
					"link" : "link"
				}
			]
		},
		{//25
			"question" : "Have you lived in the Northampton area for at least three out of the last five years?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 31
				},
				{
					"answer" : "No",
					"next" : 26
				}
			]
		},
		{//26
			"question" : "Do you work in Northampton?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 31
				},
				{
					"answer" : "No",
					"next" : 27
				}
			]
		},
		{//27
			"question" : "Do you want to live near a close relative who has lived in Northampton for at least five years?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 31
				},
				{
					"answer" : "No",
					"link" : "link"
				}
			]
		},
		{//28
			"question" : "Do any of the following apply?",
			"answers" : [
				{
					"answer" : "I have lived in the Northampton area for at least 3 years prior to enlisting in the Armed Forces",
					"next" : 31
				},
				{
					"answer" : "I currently work in Northampton",
					"next" : 31
				},
				{
					"answer" : "I will be working in Northampton",
					"next" : 31
				},
				{
					"answer" : "I want to live near to a close relative who has lived in Northampton for at least 5 years",
					"next" : 31
				},
				{
					"answer" : "None of the above",
					"link" : "link"
				}
			]
		},
		{//29
			"question" : "Do you have any of the following Armed Forces connections?",
			"answers" : [
				{
					"answer" : "I was discharged from the Armed Forces within the last 5 years",
					"next" : 28
				},
				{
					"answer" : "I am being discharged from the Armed Forces",
					"next" : 28
				},
				{
					"answer" : "I am the spouse or civil partner of a recently deceased member of the Armed Forces",
					"next" : 28
				},
				{
					"answer" : "None of the above",
					"link" : "http://www.northampton.gov.uk"
				}
			]
		},
		{//30
			"question" : "Do you need to move to a larger home to accommodate a ‘looked after' child?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 31
				},
				{
					"answer" : "No",
					"next" : 31
				}
			]
		}
	];

	var app = new nbcApp.models.App();
	app.init(json);
	ko.applyBindings(app);

})();