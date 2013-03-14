(function () {
	'use strict';
	var nbcApp = nbcApp || {models: {}};

	nbcApp.models.App = function () {
		var self = this;
		this.iframe = false;
		this.questions = ko.observableArray();
		this.currentQ = ko.observable(0);
		this.apply = ko.observable(false);
		

		/**
		* sends a message to the parent window
		* containing the url to be loaded, 
		* fallback for IE7 to open a new window
		*/
		this.sendMessageToParent = function(url) {
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

		//sets up the model objects and properties
		this.init = function (data) {

			//take a reference to the data
			var questions = data;

			//loop through the questions array
			for (var i = 0; i < questions.length; i += 1) {
				var question = new nbcApp.models.Question(),
					answers = questions[i].answers;

				//se the question properties
				question.content(questions[i].question);
				question.index(i);

				/**
				* loop through all answers for the question
				* create an instance of the answer object
				* set the properties and push to the 
				* answers array
				*/
				for (var n = 0; n < answers.length; n += 1) {
					var answer = new nbcApp.models.Answer();
					answer.content(answers[n].answer);
					answer.link(answers[n].link);
					answer.nextQ(answers[n].next);
					answer.tooltip(answers[n].info);
					question.answers.push(answer);
				}

				//add the current question to the knockout array of questions
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
		this.tooltip = ko.observable();
		this.tooltipOn = ko.observable(false);
		this.toggleTooltip = function(e){
			(!self.tooltipOn()) ? self.tooltipOn(true) : self.tooltipOn(false);
			e.preventDefault();
		}
	};


	// Question Data Model
	// question : the question text / html
	// answers	: an array of possible answers
	// 			answer : the text to display for an answers button
	//			link   : the link to immediately redirect to if the answer is selected
	//			next   : the index of the next question to display 

	var json = [
		{//2A (0)
			"question" : "Have you (or someone on your behalf) already completed a housing application and submitted it to Northampton Borough Council?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 1
				},
				{
					"answer" : "No",
					"next" : 6
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
			"question" : "Did the letter:",
			"answers" : [
				{
					"answer" : "Request that you bring in documents as proof of identity, eligibility, residence and/or current circumstances?",
					"next" : 4
				},
				{
					"answer" : "Tell you about your place on the register and/or your banding?",
					"next" : 5
				},
				{
					"answer" : "Ask you to clarify any details about your application?",
					"next" : 6
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
		{//2A.1.1.1.2 (5)
			"question" : "Do you want to appeal against the decision?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk/appealsprocess"
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk/contactthecouncil"
				}
			]
		},
		{//2B (6)
			"question" : "Are you a current Northampton Borough Council tenant or a tenant of a <a href='http://www.northampton.gov.uk/info/100007/housing/1272/housing_associations' title='Housing Association List' target='_blank'>Northampton Housing Association</a>",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 7
				},
				{
					"answer" : "No",
					"next" : 9
				}
			]
		},
		{//2B.1 (7)
			"question" : "Please tell us the reason you want or need to move",
			"answers" : [
				{
					"answer" : "I want to move to a smaller property",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1773/current_tenancy_3"
				},
				{
					"answer" : "I am overcrowded in my home",
					"next" : 8,
					"info" : "overcrowded info"
				},
				{
					"answer" : "I need to move for a severe medical or welfare reason",
					"next" : 8,
					"info" : "severe medical or welfare reason"
				},
				{
					"answer" : "My home lacks basic facilities",
					"next" : 8,
					"info" : "basic facilities"
				},
				{
					"answer" : "I want to move for another reason",
					"next" : 8
				}
			]
		},
		{//2B.1.1 (8)
			"question" : "Are you in <a href='#'>rent arrears</a>?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1771/current_tenancy_1"
				},
				{
					"answer" : "No",
					"next" : "go to question 5" 
				}
			]
		},
		{//3 (9)
			"question" : "How old are you?",
			"answers" : [
				{
					"answer" : "Under 16",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1774/contact_us_for_advice"
				},
				{
					"answer" : "16 or over",
					"next" : 10
				}
				
			]
		},
		{//4 (10)
			"question" : "Are you a <a href='#'>British Citizen</a>? ",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 11
				},
				{
					"answer" : "No",
					"next" :  13
				}
			]
		},
		{//4.1 (11)
			"question" : "Do you live in the <a href='#'>United Kingdom</a>?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 21
				},
				{
					"answer" : "No",
					"next" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				}
			]
		},
		{//4.1.1 (12)
			"question" : "Are you serving in HM Forces?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 21
				},
				{
					"answer" : "No",
					"next" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				}
			]
		},
		{//4.2 (13)
			"question" : "Are you a <a href='#'>Commonwealth Citizen</a>?",
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
		{//4.2.1 (14)
			"question" : "Do you have a <a href='#'>right of abode</a> in the <a href='#'>United Kingdom</a>?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 11
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				}
			]
		},
		{//4.2.2 (15)
			"question" : "Are you an <a href='http://www.housing-rights.info/EEA-nationals.php'>EEA/EU National?</a>",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 16
				},
				{
					"answer" : "No",
					"next" : 18
				}
			]
		},
		{//4.2.2.1 (16)
			"question" : "Have you worked in the United Kingdom at any time – now or in the past?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 17
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1778/citizenship_3"
				}
			]
		},
		{//4.2.2.1.1 (17)
			"question" : "Are you <a href='#'>working now</a>, <a href='#'>temporarily out of work</a> or a <a href='#'>retired worker</a>?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 21
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1778/citizenship_3"
				}
			]
		},
		{//4.2.2.2 (18)
			"question" : "Are you a citizen of <a href='http://www.housing-rights.info/02_8_Bulgarians_Romanians.php'>Bulgaria or Romania (A2 countries)</a>?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 19
				},
				{
					"answer" : "No",
					"next" : 20
				}
			]
		},
		{//4.2.2.2.1 (19)
			"question" : "Are you currently working in the UK AND authorised to work?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 21
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1779/citizenship_4"
				}
			]
		},
		{//4.2.2.2.2 (20)
			"question" : "Do you have one of the following status",
			"answers" : [
				{
					"answer" : "Refugee",
					"next" : 21
				},
				{
					"answer" : "Humanitarian protection",
					"next" : 21
				},
				{
					"answer" : "Discretionary leave to remain",
					"next" : 21
				},
				{
					"answer" : "Exceptional leave to remain",
					"next" : 21
				},
				{
					"answer" : "Limited Leave to remain",
					"next" : 21
				},
				{
					"answer" : "An eligible family member of someone who has one of the above status <em>or</em> an eligible family member an EU/EEA Citizen",
					"next" : 21
				},
				{
					"answer" : "None of the above",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1780/citizenship_5"
				}
			]
		},
		{//5 (21)
			"question" : "Which of the following best describes your current housing situation?",
			"answers" : [
				{
					"answer" : "I/We are homeless",
					"info" : "homeless description",
					"next" : 22
				},
				{
					"answer" : "I/We have a home but I am unable to live in it due to fire, flood or other emergency",
					"next" : 22
				},
				{
					"answer" : "I/We have somewhere to live at the moment but I am threatened with homelessness",
					"info" : "threatened with homelessness description",
					"next" : 24
				},
				{
					"answer" : "I/We are living in temporary accommodation (e.g. Bed and Breakfast)",
					"next" : 22
				},
				{
					"answer" : "I/We have somewhere to live but have nowhere I can live together with my immediate family",
					"info" : "immediate family description",
					"next" : 23
				},
				{
					"answer" : "I/We have somewhere to live and am not threatened with homelessness",
					"next" : 28 
				}
			]
		},
		{//5.1 (22)
			"question" : "Do you have any home anywhere in the UK or abroad?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				},
				{
					"answer" : "No",
					"next" : 35
				}
			]
		},
		{//5.1b (23)
			"question" : "Do you have any home that you can live in with your immediate family in the UK or abroad?",
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
		},
		{//5.2 (24)
			"question" : "Do you have any of the following armed forces connections?",
			"answers" : [
				{
					"answer" : "I have been discharged from the Armed Forces within the last 5 years",
					"next" : 100
				},
				{
					"answer" : "I am being discharged from the Armed Forces",
					"next" : 100
				},
				{
					"answer" : "I am the spouse or civil partner of a recently deceased member of the Armed Forces",
					"next" : 100
				},
				{
					"answer" : "None of the above",
					"next" : 25
				}
			]
		},
		{//5.2.1 (25)
			"question" : "Do any of the following apply to you now or within the next 8 weeks?<ul><li>You have been given a 'Notice to Quit'</li><li>You have been asked to leave your home (but aren't leaving the Armed Forces</li><li>You are being evicted</li><li>Your property is being reposessed</li><li>Your accommodation is being sold</li><li>You can no longer afford your accommodation</li><li>You are leaving a hostel or temorary accommodation</li><li>You have nowhere to park your mobile home or houseboat</li><li>You have been asked to vacate your home due to a Compulsory Purchase Order (CPO)</li><li>You have been asked to leave your 'tied' accommodation</li><li>You have been asked to vacate your home as a result of enforcement by the Local Authority</li></ul>",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 39
				},
				{
					"answer" : "No",
					"next" : 26
				}
			]
		},
		{//5.2.1.1 (26)
			"question" : "Do any of the following apply to you?",
			"answers" : [
				{
					"answer" : "You are you about to leave care or your foster placement is ending? ",
					"next" : 50
				},
				{
					"answer" : "You are being discharged from hospital or supported housing and have nowhere to live or your accommodation is unsuitable for you to live in",
					"next" : 27
				},
				{
					"answer" : "You are being released from prison and have nowhere to live",
					"next" : 27
				},
				{
					"answer" : "None of the above",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				}
			]
		},
		{//5.2.1.1.1 (27)
			"question" : "Have you been residing outside the Borough of Northampton after being place there through no choice of your own?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 33 //6B
				},
				{
					"answer" : "No",
					"next" : 35
				}
			]
		},
		{//5.3 (28)
			"question" : "Which of the following apply to you?",
			"answers" : [
				{
					"answer" : "I'm overcrowded in my home",
					"next" : 39
				},
				{
					"answer" : "My home lacks basic facilities",
					"info" : "working toilet, washing facilities, hot water, kitchen, heating.",
					"next" : 39
				},
				{
					"answer" : "I'm are sharing facilities with another household",
					"next" : 47 //5.3.1X
				},
				{
					"answer" : "My accommodation is not suitable for medical reasons",
					"next" : 29
				},
				{
					"answer" : "I need to move because of a risk to my welfare",
					"next" : 29
				},
				{
					"answer" : "None of the above",
					"next" : 33
				}
			]
		},
		{//5.3.1 (29)
			"question" : "Do you need to move because you are suffering severe harassment or violence in your current accommodation?",
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
		{//5.3.1X (30)
			"question" : "Are you sharing with members of your immediate family (parents, children, brothers or sisters)?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 31
				},
				{
					"answer" : "No",
					"next" : 39
				}
			]
		},
		{//5.3.1X.1 (31)
			"question" : "Are you applying for housing with any of the following",
			"answers" : [
				{
					"answer" : "A child or children who are under 16",
					"next" : 39
				},
				{
					"answer" : "Someone who is dependent on you for care",
					"next" : 39
				},
				{
					"answer" : "I am expecting a baby",
					"next" : 39
				},
				{
					"answer" : "None of the above",
					"link" : "http://northampton.gov.uk/10"
				}
			]
		},
		{//5.3.1.1 (32)
			"question" : "Do any of the following apply to you?",
			"answers" : [
				{
					"answer" : "My accommodation is not suitable, or unreasonable to live in due to my medical needs",
					"info" : "medical needs info",
					"next" : 39
				},
				{
					"answer" : "There is a serious risk to my health or wellbeing if I stay in my current accommodation",
					"info" : "health and wellbeing info",
					"next" : 39
				},
				{
					"answer" : "I need to move to be able to provide care for someone",
					"info" : "care definition",
					"next" : 33
				},
				{
					"answer" : "I need to move to be able to receive care",
					"info" : "care definition",
					"next" : 33
				},
				{
					"answer" : "I need to move to take up an employment or training opportunity",
					"info" : "employment or training description",
					"next" : 39
				},
				{
					"answer" : "I have another specific medical or welfare reason for needing to move",
					"info" : "medical or welfare definition",
					"next" : 39
				},
				{
					"answer" : "None of the above",
					"next" : 39
				}
			]
		},
		{//9A (33)
			"question" : "Are you an NBC Tenant or a Tenant of an NBC-partner Housing Association?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 34
				},
				{
					"answer" : "No",
					"next" : 42 //9B
				}
			]
		},
		{//9A.1 (34)
			"question" : "Do any of the following apply to you?",
			"answers" : [
				{
					"answer" : "I am under-occupying my property?",
					"info" : "under-occupying description",
					"next" : 39
				},
				{
					"answer" : "My property has been designated as ‘sheltered housing’ and I do not need and/or qualify for this facility",
					"info" : "sheltered housing description",
					"next" : 39
				},
				{
					"answer" : "My property has been specially adapted and I no longer/do not need the adaptations",
					"next" : 39
				},
				{
					"answer" : "I have been asked to move because my home requires major work within the next 6 weeks",
					"next" : 39
				},
				{
					"answer" : "I am a service tenant due to retire or have your contract of employment terminated",
					"next" : 39
				},
				{
					"answer" : "None of the above",
					"next" : 42 //9B
				}
			]
		},
		{//6A (35)
			"question" : "Have you lived in the Northampton area for at least SIX out of the last TWELVE months or THREE out of the last FIVE years?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1781/homelessness_team"
				},
				{
					"answer" : "No",
					"next" : 36
				}
			]
		},
		{//6A.1 (36)
			"question" : "Do you work in the Borough of Northampton?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1781/homelessness_team"
				},
				{
					"answer" : "No",
					"next" : 37
				}
			]
		},
		{//6A1.1 (37)
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
		{//6B (38)
			"question" : "Did you or a joint applicant live in the Borough of Northampton for at least 6 out of the last 12 months or 3 out of the last 5 years prior to leaving Northampton",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1781/homelessness_team"
				},
				{
					"answer" : "No",
					"next" : 37
				}
			]
		},
		{//6B.1 (39)
			"question" : "Did you or a joint applicant work in the Borough of Northampton prior to leaving Northampton?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1781/homelessness_team"
				},
				{
					"answer" : "No",
					"next" : 38
				}
			]
		},
		{//6B.1.1 (40)
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
		{//6C (41)
			"question" : "Have you lived in the Northampton area for at least three out of the last five years?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 50 //10
				},
				{
					"answer" : "No",
					"next" : 37
				}
			]
		},
		{//6C.1 (42)
			"question" : "Do you work in Northampton?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 50 //10
				},
				{
					"answer" : "No",
					"next" : 41
				}
			]
		},
		{//6C1.1 (43)
			"question" : "Do you want to live near a close relative who has lived in Northampton for at least five years to be able to provide care or receive support?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 50 //10
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				}
			]
		},
		{//6D (44)
			"question" : "Did you live in the Borough of Northampton for at least 3 out of th elast 5 years prior to leaving Northampton?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 100
				},
				{
					"answer" : "No",
					"next" : 43
				}
			]
		},
		{//6D.1 (45)
			"question" : "Did you work in the Borough of Northampton prior to leaving Northampton?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 50 //10
				},
				{
					"answer" : "No",
					"next" : 44
				}
			]
		},
		{//6D1.1 (46)
			"question" : "Do you or a joint applicant want to live near a close relative who has lived in the Borough of Northampton for at least 5 years to be able to provide care or receive support?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 50 //10
				},
				{
					"answer" : "No",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				}
			]
		},
		{//9B (47)
			"question" : "Do you need to move to a larger home to accommodate a 'looked after' child?",
			"answers" : [
				{
					"answer" : "Yes",
					"next" : 46
				},
				{
					"answer" : "No",
					"next" : 47
				}
			]
		},
		{//9B.1 (48)
			"question" : "Which of the following apply to you?",
			"answers" : [
				{
					"answer" : "I have a fostering or adopting agreement in place",
					"info" : "fostering or adopting agreement",
					"next" : 36 //6c
				},
				{
					"answer" : "I am the special guardian, family carer or hold a residence order for a child whose parents are unable to provide care",
					"info" : "special guardian / family carer description",
					"next" : 36 //6c
				},
				{
					"answer" : "None of the above",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				}
			]
		},
		{//9B.2 (49)
			"question" : "Do any the following apply to you?",
			"answers" : [
				{
					"answer" : "I have had an emergency move agreed by NBC",
					"info" : "emergency agreement description",
					"next" : 100
				},
				{
					"answer" : "I have had a 'move-on' agreed by NBC",
					"info" : "move-on description",
					"next" : 100
				},
				{
					"answer" : "I am part of a separte agreement by NBC",
					"info" : "separate agreement description",
					"next" : 100
				},
				{
					"answer" : "I have special needs and need help finding accommodation",
					"info" : "special needs description",
					"next" : 100
				},
				{
					"answer" : "None of the above",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				}
			]
		},
		{//10 (50)
			"question" : "Do you have more than £30,000 household income (for a single person household) or more than £50,000 income (for a family household)?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				},
				{
					"answer" : "No",
					"next" : 49
				}
			]
		},
		{//10.1 (51)
			"question" : "Do you have more than £16,000 in assets (single applicant) or more than £32,000 in assets (joint applicants)?",
			"answers" : [
				{
					"answer" : "Yes",
					"link" : "http://www.northampton.gov.uk/info/200183/housing_allocations/1776/citizenship_2"
				},
				{
					"answer" : "No",
					"next" : 100
				}
			]
		}
	];

	var app = new nbcApp.models.App();
	app.init(json);
	ko.applyBindings(app);
})();