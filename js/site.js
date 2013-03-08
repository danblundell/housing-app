(function () {
	'use strict';
	var nbcApp = nbcApp || {models: {}};

	nbcApp.models.App = function () {
		var self = this;
		this.iframe = false;
		this.questions = ko.observableArray();
		this.currentQ = ko.observable(0);
		this.apply = ko.observable(false);
		

		//PostMessage Callback to parent window
		this.sendMessageToParent = function(url) {
			/**
			* sends a message to the parent window
			* containing the url to be loaded, 
			* fallback for IE7 to open a new window
			*/
			(window.postMessage !== undefined) ? window.parent.postMessage(url,"http://localhost") : window.open(url);
		};

		//move to the next question
		this.nextQ = function () {
			if(this.link()){
				(self.iframe) ? self.sendMessageToParent(this.link()) : window.location = this.link();
			} 
			else{
				(this.nextQ() >= self.questions().length) ?	self.apply(true) : self.apply(false);
				self.currentQ(this.nextQ());
				if(window.onhashchange !== undefined){
					window.location.hash = self.currentQ();
				}
			}
		};

		//listen for hash change in supporting browsers
		this.hashChanges = function () {
			
			if(window.onhashchange !== undefined){
				window.onhashchange = function (e){

					var h = parseInt(window.location.hash.replace('#',''),10);

					if(isNaN(h)){
						h = 0;
					}

					if(self.currentQ() !== h){
						(h >= self.questions().length) ? self.apply(true) : self.apply(false);
						self.currentQ(h);
					}

				};
			}
		};

		this.init = function (data) {

			//populate view from model
			var questions = data;

			//loop through the questions
			for (var i = 0; i < questions.length; i += 1) {
				var question = new nbcApp.models.Question(),
					answers = questions[i].answers;

				question.content(questions[i].question);
				question.index(i);

				//loop through all answers per question
				for (var n = 0; n < answers.length; n += 1) {
					var answer = new nbcApp.models.Answer();
					answer.content(answers[n].answer);
					answer.link(answers[n].link);
					answer.nextQ(answers[n].next);
					question.answers.push(answer);
				}

				self.questions.push(question);

			}


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
	// question : the question text / html
	// answers	: an array of possible answers
	// 			answer : the text to display for an answers button
	//			link   : the link to immediately redirect to if the answer is selected
	//			next   : the index of the next question to display 

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
					"next" : 5
				}
			]
		},
		{//2A.1 (1)
			"question" : "Would you like to:",
			"answers" : [
				{
					"answer" : "Tell us about a change to your circumstances",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1299/housing_allocations-change_in_circumstances"
				},
				{
					"answer" : "Enquire about the progress to your application",
					"next" : 2
				},
				{
					"answer" : "Discuss something else",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1770/housing_application_progress_4"
				}
			]
		},
		{//2A.1.1 (2)
			"question" : "Have you received a letter from us about your application?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 3
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1769/housing_application_progress_3"
				}
			]
		},
		{//2A.1.1.1 (3)
			"question" : "Did the letter request that you bring in documents as proof of identity, eligibility, residence and/or current circumstances?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 4
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1768/housing_application_progress_2"
				}
			]
		},
		{//2A.1.1.1.1 (4)
			"question" : "Have you already brought in your documents for copying?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1767/housing_application_progress_1"
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1768/housing_application_progress_2"
				}
			]
		},
		{//2B (5)
			"question" : "Are you (or a joint applicant) a current Northampton Borough Council or <a href='http://www.northampton.gov.uk/info/100007/housing/1272/housing_associations' title='Housing Association List' target='_blank'>Northampton Housing Association</a> Tenant",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 6
				},
				{
					"answer" : "No",
					"next" : 8
				}
			]
		},
		{//2B.1 (6)
			"question" : "Please tell us the reason you want or need to move",
			"answers" : [
				{
					"answer" : "I want to move to a smaller property",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1773/current_tenancy_3"
				},
				{
					"answer" : "I am overcrowded in my home",
					"next" : 7
				},
				{
					"answer" : "I need to move for a severe medical or welfare reason",
					"next" : 7
				},
				{
					"answer" : "My home lacks basic facilities",
					"next" : 7
				},
				{
					"answer" : "I want to move for another reason",
					"next" : 7
				}
			]
		},
		{//2B.1.1 (7)
			"question" : "Are you in rent arrears?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1771/current_tenancy_1"
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1772/current_tenancy_2"
				}
			]
		},
		{//3 (8)
			"question" : "Are you 18 years or over?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 9
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1774/contact_us_for_advice"
				}
			]
		},
		{//4 (9)
			"question" : "Are you a British Citizen? ",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 10
				},
				{
					"answer" : "No",
					"next" :  11
				}
			]
		},
		{//4.1 (10)
			"question" : "Are you (or a joint applicant) normally resident in the United Kingdom (or a member of HM Forces if based abroad)?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 19 
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				}
			]
		},
		{//4.2 (11)
			"question" : "Are you (or a joint applicant) a Commonwealth Citizen?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 12
				},
				{
					"answer" : "No",
					"next" : 13
				}
			]
		},
		{//4.2.1 (12)
			"question" : "Do you have a ‘right of abode’ in the United Kingdom?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 10
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				}
			]
		},
		{//4.2.2 (13)
			"question" : "Are you an EEA/EU National?",
			"infoLink" : "http://www.housing-rights.info/EEA-nationals.php",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 14
				},
				{
					"answer" : "No",
					"next" : 16
				}
			]
		},
		{//4.2.2.1 (14)
			"question" : "Have you worked in the United Kingdom at any time – now or in the past?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 15
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1778/citizenship_3"
				}
			]
		},
		{//4.2.2.1.1 (15)
			"question" : "Are you working now, temporarily out of work or a retired worker?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 19
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1778/citizenship_3"
				}
			]
		},
		{//4.2.2.2 (16)
			"question" : "Are you a citizen of Bulgaria or Romania (A2 countries)?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 17
				},
				{
					"answer" : "No",
					"next" : 18
				}
			]
		},
		{//4.2.2.2.1 (17)
			"question" : "Are you currently working in the UK AND authorised to work (or exempt from authorisation)?",
			"infoLink" : "http://www.housing-rights.info/02_8_Bulgarians_Romanians.php",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 19
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1779/citizenship_4"
				}
			]
		},
		{//4.2.2.2.2 (18)
			"question" : "Do you have one of the following status",
			"answers" : [
				{
					"answer" : "Refugee",
					"next" : 19
				},
				{
					"answer" : "Humanitarian protection",
					"next" : 19
				},
				{
					"answer" : "Discretionary leave to remain",
					"next" : 19
				},
				{
					"answer" : "Exceptional leave to remain",
					"next" : 19
				},
				{
					"answer" : "Limited Leave to remain",
					"next" : 19
				},
				{
					"answer" : "An eligible family member of someone who has one of the above status <em>or</em> an eligible family member an EU/EEA Citizen",
					"next" : 19
				},
				{
					"answer" : "None of the above",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1780/citizenship_5"
				}
			]
		},
		{//5 (19)
			"question" : "Which of the following best describes your current housing situation?",
			"answers" : [
				{
					"answer" : "I am homeless",
					"next" : 20
				},
				{
					"answer" : "I have a home but I am unable to live in it due to fire, flood or other emergency",
					"next" : 20
				},
				{
					"answer" : "I have somewhere to live at the moment but I am threatened with homelessness",
					"next" : 21
				},
				{
					"answer" : "I have somewhere to live but have nowhere I can live together with my immediate family ",
					"next" : 20
				},
				{
					"answer" : "I have somewhere to live and am not threatened with homelessness",
					"next" : 25
				}
			]
		},
		{//5.1 (20)
			"question" : "Do you have any home anywhere in the UK or abroad?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				},
				{
					"answer" : "No",
					"next" : 30
				}
			]
		},
		{//5.2 (21)
			"question" : "Do you have any of the following armed forces connections?",
			"answers" : [
				{
					"answer" : "I have been discharged from the Armed Forces within the last 5 years",
					"next" : 48
				},
				{
					"answer" : "I am being discharged from the Armed Forces",
					"next" : 48
				},
				{
					"answer" : "I am the spouse or civil partner of a recently deceased member of the Armed Forces",
					"next" : 48
				},
				{
					"answer" : "None of the above",
					"next" : 22
				}
			]
		},
		{//5.2.1 (22)
			"question" : "Do any of the following apply to you now or within the next 4 weeks?<ul><li>You have been given a 'Notice to Quit'</li><li>You have been asked to leave your home (but aren't leaving the Armed Forces</li><li>You are being evicted</li><li>Your property is being reposessed</li><li>Your accommodation is being sold</li><li>You can no longer afford your accommodation</li><li>You are leaving a hostel or temorary accommodation</li><li>You have nowhere to park your mobile home or houseboat</li><li>You have been asked to vacate your home due to a Compulsory Purchase Order (CPO)</li><li>You have been asked to leave your 'tied' accommodation</li><li>You have been asked to vacate your home as a result of enforcement by the Local Authority</li></ul>",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 30
				},
				{
					"answer" : "No",
					"next" : 23
				}
			]
		},
		{//5.2.1.1 (23)
			"question" : "Do any of the following apply to you?<ul><li>I am about to leave care or your foster placement is ending</li><li>I am being discharged from hospital and have nowhere to live</li><li>I am being released from prison and have nowhere to live</li></ul>",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 24
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				}
			]
		},
		{//5.2.1.1.1 (24)
			"question" : "Have you been residing outside the Borough of Northampton after being place there through no choice of your own?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 33
				},
				{
					"answer" : "No",
					"next" : 30
				}
			]
		},
		{//5.3 (25)
			"question" : "Which of the following apply to you?",
			"answers" : [
				{
					"answer" : "I'm overcrowded in my home",
					"next" : 36
				},
				{
					"answer" : "My home lacks basic facilities",
					"next" : 36
				},
				{
					"answer" : "I'm are sharing facilities with another household",
					"next" : 47
				},
				{
					"answer" : "My accommodation is not suitable for medical reasons",
					"next" : 26
				},
				{
					"answer" : "I need to move because of a risk to my welfare",
					"next" : 26
				},
				{
					"answer" : "None of the above",
					"next" : 28
				}
			]
		},
		{//5.3.1 (26)
			"question" : "Do you need to move because you are suffering severe harassment or violence in your current accommodation?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1781/homelessness_team"
				},
				{
					"answer" : "No",
					"next" : 27
				}
			]
		},
		{//5.3.1.1 (27)
			"question" : "Do any of the following apply to you?",
			"answers" : [
				{
					"answer" : "My accommodation is not suitable, or unreasonable to live in due to my medical needs",
					"next" : 28
				},
				{
					"answer" : "There is a serious risk to my health or wellbeing if I stay in my current accommodation",
					"next" : 28
				},
				{
					"answer" : "I need to move to be able to provide care for someone",
					"next" : 28
				},
				{
					"answer" : "I need to move to be able to receive care",
					"next" : 28
				},
				{
					"answer" : "I need to move to take up an employment or training opportunity",
					"next" : 28
				},
				{
					"answer" : "I have another specific medical or welfare reason for needing to move",
					"next" : 28
				},
				{
					"answer" : "None of the above",
					"next" : 36
				}
			]
		},
		{//9A (28)
			"question" : "Are you an NBC Tenant or a Tenant of an NBC-partner Housing Association?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 29
				},
				{
					"answer" : "No",
					"next" : 42
				}
			]
		},
		{//9A.1 (29)
			"question" : "Do any of the following apply to you?",
			"answers" : [
				{
					"answer" : "I am under-occupying my property?",
					"next" : 36
				},
				{
					"answer" : "My property has been designated as ‘sheltered housing’ and I do not need and/or qualify for this facility",
					"next" : 36
				},
				{
					"answer" : "My property has been specially adapted and I no longer/do not need the adaptations",
					"next" : 36
				},
				{
					"answer" : "I have been asked to move because my home requires major work within the next 6 weeks",
					"next" : 36
				},
				{
					"answer" : "I am a service tenant due to retire or have your contract of employment terminated",
					"next" : 36
				},
				{
					"answer" : "None of the above",
					"next" : 42
				}
			]
		},
		{//6A (30)
			"question" : "Have you lived in the Northampton area for at least SIX out of the last TWELVE months or THREE out of the last FIVE years?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1781/homelessness_team"
				},
				{
					"answer" : "No",
					"next" : 31
				}
			]
		},
		{//6A.1 (31)
			"question" : "Do you (or a joint applicant) work in the Borough of Northampton?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1781/homelessness_team"
				},
				{
					"answer" : "No",
					"next" : 32
				}
			]
		},
		{//6A1.1 (32)
			"question" : "Do you want to live near a close relative who has lived in Northampton for at least five years to be able to provide care or receive support?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1781/homelessness_team"
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				}
			]
		},
		{//6B (33)
			"question" : "Did you or a joint applicant live in the Borough of Northampton for at least 6 out of the last 12 months or 3 out of the last 5 years prior to leaving Northampton",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1781/homelessness_team"
				},
				{
					"answer" : "No",
					"next" : 34
				}
			]
		},
		{//6B.1 (34)
			"question" : "Did you or a joint applicant work in the Borough of Northampton prior to leaving Northampton?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1781/homelessness_team"
				},
				{
					"answer" : "No",
					"next" : 35
				}
			]
		},
		{//6B.1.1 (35)
			"question" : "Do you or a joint applicant want to live near a close relative who has lived in the Borough of Northampton for at least 5 years to be able to provide care or receive support?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1781/homelessness_team"
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				}
			]
		},
		{//6C (36)
			"question" : "Have you or a joint applicant lived in the Northampton area for at least three out of the last five years?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 45
				},
				{
					"answer" : "No",
					"next" : 37
				}
			]
		},
		{//6C.1 (37)
			"question" : "Do you or a joint applicant work in Northampton?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 45
				},
				{
					"answer" : "No",
					"next" : 38
				}
			]
		},
		{//6C1.1 (38)
			"question" : "Do you or a joint applicant want to live near a close relative who has lived in Northampton for at least five years to be able to provide care or receive support?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 45
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				}
			]
		},
		{//6D (39)
			"question" : "Did you or a joint applicant live in the Borough of Northampton for at least 3 out of th elast 5 years prior to leaving Northampton?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 45
				},
				{
					"answer" : "No",
					"next" : 40
				}
			]
		},
		{//6D.1 (40)
			"question" : "Did you or a joint applicant work in the Borough of Northampton prior to leaving Northampton?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 45
				},
				{
					"answer" : "No",
					"next" : 41
				}
			]
		},
		{//6D1.1 (41)
			"question" : "Do you or a joint applicant want to live near a close relative who has lived in the Borough of Northampton for at least 5 years to be able to provide care or receive support?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 45
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				}
			]
		},
		{//9B (42)
			"question" : "Do you need to move to a larger home to accommodate a 'looked after' child?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 43
				},
				{
					"answer" : "No",
					"next" : 44
				}
			]
		},
		{//9B.1 (43)
			"question" : "Which of the following apply to you?",
			"answers" : [
				{
					"answer" : "I have a fostering or adopting agreement in place",
					"next" : 36
				},
				{
					"answer" : "I am the special guardian, family carer or hold a residence order for a child whose parents are unable to provide care",
					"next" : 36
				},
				{
					"answer" : "None of the above",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				}
			]
		},
		{//9B.2 (44)
			"question" : "Do any the following apply to you?",
			"answers" : [
				{
					"answer" : "I have had an emergency move agreed by NBC",
					"next" : 45
				},
				{
					"answer" : "I have had a 'move-on' agreed by NBC",
					"next" : 45
				},
				{
					"answer" : "I am part of a separte agreement by NBC",
					"next" : 45
				},
				{
					"answer" : "I have special needs and need help finding accommodation",
					"next" : 45
				},
				{
					"answer" : "None of the above",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				}
			]
		},
		{//10 (45)
			"question" : "Do you have more than £30,000 household income (for a single person household) or more than £50,000 income (for a family household)?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				},
				{
					"answer" : "No",
					"next" : 46
				}
			]
		},
		{//10.1 (46)
			"question" : "Do you have more than £16,000 in assets (single applicant) or more than £32,000 in assets (joint applicants)?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				},
				{
					"answer" : "No",
					"next" : 48
				}
			]
		},
		{//5.3.1x (47)
			"question" : "Are you sharing with members of your immediate family? (Parents, Children, Siblings)",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				},
				{
					"answer" : "No",
					"next" : 39
				}
			]
		}
	];

	var app = new nbcApp.models.App();
	app.init(json);
	ko.applyBindings(app);
})();