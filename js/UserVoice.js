/************ ../dummy2/lib/plugins/UserVoice.js ********************/
/* MIT licensed */
// (c) 2013 Surinder Singh, DeveloperExtensions.com

function UserVoice(){
	//Does nothing
}
function UzerVoice(){
	//Does nothing
}
UserVoice.prototype.launch = function(cfg){
	cfg = cfg?cfg:{};
	if(Object.prototype.toString.call(cfg)!='[object Object]'){
		alert('Invalid UserVoice Config');
		cfg = {};
	}
	var config = {
		task:'viewForum',//[launchFeedback|contactUs|viewForum|postIdea]
		
		site:'cancian.uservoice.com',
		key:'62oo7AhcRoQuvozU6ya6A',
		secret:'g911MyHj3qs92pDDa6f1XOgT9fHSi7pNBZoXO4E',
		
		topicId:1,//[0|453|333 (any valid topicId)]
		showContactUs:0,//[0|1]
		showForum:0,//[0|1]
		showPostIdea:0,//[0|1]
		showKnowledgeBase:0//[0|1]
	};
	//Ext.Msg.alert('', Ext.encode(config))
	for(var key in config){
		if (typeof cfg[key] !== "undefined"){
			if(key=='task' && cfg[key]!='launchFeedback' && cfg[key]!='contactUs' && cfg[key]!='viewForum' && cfg[key]!='postIdea'){
				alert('UserVoice task "'+cfg[key]+'" not supported. Supported tasks are launchFeedback,contactUs,viewForum and postIdea,  so we are using "launchFeedback" ');
				cfg[key]='launchFeedback';
			}else if(key=='topicId'){
				cfg[key]=parseInt(cfg[key]);
			}else if(key.indexOf('show')>-1){
				cfg[key] = (cfg[key]==1)?1:0;
			}
			config[key] = cfg[key];
		}
	}
	
	//cordova.exec(Ext.emptyFn, Ext.emptyFn, "UserVoiceCommand", "launch", [config]);
	cordova.exec(UzerVoice, UzerVoice, "UserVoiceCommand", "launch", [config]);	
};
UserVoice.install = function(){
	if(!window.plugins){
		window.plugins = {};
	}
	if(!window.plugins.uservoice){
		window.plugins.uservoice = new UserVoice();
	}	
	return window.plugins.uservoice;
};
UserVoice.install();

function showUserVoice(cfg){
	window.plugins.uservoice.launch(cfg);
}