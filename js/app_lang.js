var appVersion = "1.1.7 (11700)"; 
//#///////////////////////#//
//# CORE LANGUAGE MANAGER #//
//#///////////////////////#//
var appLang = "en";
if(window.navigator.language) {
	appLang = (window.navigator.language.slice(0,2).toLowerCase() == "pt") ? 'pt' : 'en';
}
if(window.localStorage.getItem("devSetLang") == "pt") {
	appLang = "pt";
}
function LANG(string) {
////////////////////////
// GET PREF. LANGUAGE //
////////////////////////
//#//////////////#//
//# STRING ARRAY #//
//#//////////////#//
var LANGUAGE = {
	en: "en",
	pt: "pt"
};
var LANGUAGE_FULL = {
	en: "en-US",
	pt: "pt-BR"
};
////////////////////
var NO_ENTRIES = {
	en: "no entries",
	pt: "nenhum registro"
};
var EXERCISE = {
	en: "exercise",
	pt: "exercício"
};
var FOOD = {
	en: "food",
	pt: "alimento"
};
var DESCRIPTION = {
	en: "Description...",
	pt: "Descrição..."
};
var ADD_ENTRY = {
	en: "quick add",
	pt: "adicionar"
};
var QUICK_ADD = {
	en: "quick add",
	pt: "adição rápida"
};
var ACTIVITY_LOG = {
	en: "activity log",
	pt: "atividades"
};
var NOW = {
	en: "now",
	pt: "agora"
};
var HOUR_AGO = {
	en: "hour ago",
	pt: "hora atrás"
};
var HOURS_AGO = {
	en: "hours ago",
	pt: "horas atrás"
};
var DAY_AGO = {
	en: "day ago",
	pt: "dia atrás"
};
var DAYS_AGO = {
	en: "days ago",
	pt: "dias atrás"
};
var RESET_COUNTER = {
	en: "reset counter",
	pt: "resetar contador"
};
var MINUTES = {
	en: "minutes",
	pt: "minutos"
};
var HOURS = {
	en: "hours",
	pt: "horas"
};
var DAYS = {
	en: "days",
	pt: "dias"
};
var MINUTE = {
	en: "minute",
	pt: "minuto"
};
var HOUR = {
	en: "hour",
	pt: "hora"
};
var DAY = {
	en: "day",
	pt: "dia"
};
var AND = {
	en: "and",
	pt: "e"
};
var AGO = {
	en: "ago",
	pt: "atrás"
};
var PREPARING_DB = {
	en: "preparing database",
	pt: "inicializando"
};
var BEEN_DIETING = {
	en: "Been dieting for",
	pt: "Iniciado há"
};
var DELETE = {
	en: "Delete",
	pt: "Apagar"
};
var SWIPE_TOOLTIP = {
	en: "swipe to get started",
	pt: "deslize para iniciar"
};
var ARE_YOU_SURE = {
	en: "are you sure?",
	pt: "confirmar?"
};
var WIPE_DIALOG = {
	en: "all data will be erased",
	pt: "todos os dados serão apagados"
};
var OK = {
	en: "ok",
	pt: "ok"
};
var CANCEL = {
	en: "cancel",
	pt: "cancelar"
};
var RESET_DIALOG = {
	en: "reset counter",
	pt: "resetar contador"
};
var RESET_ENTRY_DIALOG = {
	en: "Reset entry value",
	pt: "Resetar entrada"
};
var FOOD_SEARCH = {
	en: "Food search... (100g)",
	pt: "Buscar alimento... (100g)"
};
var NO_MATCHES = {
	en: "no matches",
	pt: "nenhum resultado"
};
var EXERCISE_SEARCH = {
	en: "Exercise search... (30 min)",
	pt: "Buscar exercício... (30 min)"
};
var ENTRY_HISTORY = {
	en: "Recent activities",
	pt: "Atividades recentes"
};
var PRO = {
	en: "pro",
	pt: "pro"
};
var CAR = {
	en: "car",
	pt: "car"
};
var FAT = {
	en: "fat",
	pt: "gor"
};
var PRE_FILL = {
	en: "pre-fill",
	pt: "preencher"
};
var ADD = {
	en: "add",
	pt: "adicionar"
};
var GRAMS = {
	en: "grams",
	pt: "gramas"
};
var SURPLUS = {
	en: "surplus",
	pt: "excesso"
};
var DEFICIT = {
	en: "deficit",
	pt: "deficit"
};
var BALANCED = {
	en: "balanced",
	pt: "balanceado"
};
var ERROR = {
	en: "ERROR!",
	pt: "ERRO!"
};
var STOP = {
	en: "STOP!",
	pt: "PARE!"
};
var EQ_TIME = {
	en: "eq. time",
	pt: "tempo eq."
};
var RANGE = {
	en: "range",
	pt: "(amplitude)"
};
var START_DATE = {
	en: "start date",
	pt: "data inicial"
};
var STATUS = {
	en: "status",
	pt: "status"
};
var DIARY = {
	en: "diary",
	pt: "diário"
};
var PROFILE = {
	en: "profile",
	pt: "perfil"
};
var SETTINGS = {
	en: "settings",
	pt: "configurar"
};
var MEASURE_SYSTEM = {
	en: "System of measurement",
	pt: "Sistema de medição"
};
var MEASURE_SYSTEM_INFO = {
	en: "(height, weight etc.)",
	pt: "(peso, altura, etc.)"
};
var IMPERIAL = {
	en: "imperial",
	pt: "imperial"
};
var METRIC = {
	en: "metric",
	pt: "métrico"
};
var SETTINGS_CONTACT = {
	en: "Contact us",
	pt: "Contato"
};
var SETTINGS_ABOUT = {
	en: "About",
	pt: "Sobre"
};
var SETTINGS_FEEDBACK = {
	en: "Support Forum",
	pt: "Fórum de Suporte"
};
var SETTINGS_REVIEW = {
	en: "Rate this App",
	pt: "Avalie este App"
};
var SETTINGS_REVIEW_INFO = {
	en: "Your opinion is important to us",
	pt: "Sua opinião é importante para nós"
};
/*
var SETTINGS_FACEBOOK = {
	en: "Sign in with Facebook",
	pt: "Conectar com Facebook"
};*/
var SETTINGS_FACEBOOK = {
	en: "Keep your data safe and synced",
	pt: "Mantenha seus dados seguros e sincronizados"
};
var SETTINGS_FACEBOOK_LOGGED = {
	en: "Logged in as ",
	pt: "Conectado como "
};
var SETTINGS_HELP = {
	en: "Help",
	pt: "Ajuda"
};
var SETTINGS_HELP_INFO = {
	en: "Topics to help you get started",
	pt: "Respostas para as dúvidas frequentes"
};
var SETTINGS_RESET = {
	en: "Reset settings",
	pt: "Apagar configurações"
};
var SETTINGS_SYNC = {
	en: "Automatic Backup",
	pt: "Backup Automático"
};
var SETTINGS_SYNC_INFO = {
	en: "Keep your data safe and synced",
	pt: "Mantenha seus dados seguros e sincronizados"
};

var LAST_SYNC = {
	en: "last sync",
	pt: "última sincronização"
};
var ABOUT_TITLE = {
	en: "MyLiveDiet v" + appVersion,
	pt: "MyLiveDiet v" + appVersion
};
var ABOUT_DIALOG = {
	en: "Developed by André Cancian",
	pt: "Desenvolvido por André Cancian"
};
var WEIGHT_LOSS = {
	en: "weight loss",
	pt: "perda de peso"
};
var TIME_ELAPSED = {
	en: "time elapsed",
	pt: "tempo total"
};
var CALORIC_BALANCE = {
	en: "caloric status",
	pt: "status calórico"
};
var RESET = {
	en: "reset",
	pt: "resetar"
};
var START = {
	en: "start",
	pt: "iniciar"
};
var MALE = {
	en: "male",
	pt: "masculino"
};
var FEMALE = {
	en: "female",
	pt: "feminino"
};
var YOUR_GENDER = {
	en: "Your gender",
	pt: "Gênero"
};
var YOUR_HEIGHT = {
	en: "Your height",
	pt: "Altura"
};
var YOUR_WEIGHT = {
	en: "Your weight",
	pt: "Peso"
};
var YOUR_AGE = {
	en: "Your age",
	pt: "Idade"
};
var YOUR_ACTIVITY = {
	en: "Your Activity",
	pt: "Nível de atividade"
};
var YOUR_ACTIVITY_OPTION1 = {
	en: "Sedentary: Mostly sitting down (desk job, designer)",
	pt: "Sedentário: Quase sempre sentado (designer, escritor)"
};
var YOUR_ACTIVITY_OPTION2 = {
	en: "Lightly Active: Occasionally sitting (teacher, salesman)",
	pt: "Pouco Ativo: Ocasionalmente sentado (professor, vendedor)"
};
var YOUR_ACTIVITY_OPTION3 = {
	en: "Active: Walking most of the time (waitress, mailman)",
	pt: "Ativo: Caminhando quase sempre (carteiro, garçonete)"
};
var YOUR_ACTIVITY_OPTION4 = {
	en: "Very Active: Physically hard work (construction worker)",
	pt: "Muito Ativo: Trabalho fisicamente extenuante (pedreiro, carregador)"
};
var FEET_INCHES = {
	en: "feet/inches",
	pt: "pés/polegadas"
};
var CENTIMETERS = {
	en: "centimeters",
	pt: "centímetros"
};
var POUNDS = {
	en: "pounds",
	pt: "libras"
};
var KILOGRAMS = {
	en: "kilograms",
	pt: "kilogramas"
};
var KEEP_WEIGHT = {
	en: "Keep current weight:",
	pt: "Manter peso atual:"
};
var LOSE_WEIGHT = {
	en: "Lose weight by:",
	pt: "Perder peso:"
};
var GAIN_WEIGHT = {
	en: "Gain weight by:",
	pt: "Ganhar peso:"
};
var PER_WEEK = {
	en: "per week",
	pt: "por semana"
};
var CALORIES_AVALIABLE = {
	en: "calories avaliable",
	pt: "calorias disponíveis"
};
var DAILY_CALORIES = {
	en: "daily calories",
	pt: "calorias por dia"
};
var STATUS_EQ_TIME_1 = {
	en: "Wait at least ",
	pt: "Aguarde pelo menos "
};
var STATUS_EQ_TIME_2 = {
	en: " before your next meal. \n\n(",
	pt: " antes de sua próxima refeição. \n\n("
};
var STATUS_EQ_TIME_3 = {
	en: " calories above your ",
	pt: " calorias acima de sua meta de "
};
var STATUS_EQ_TIME_4 = {
	en: " kcal/day target)",
	pt: " kcal/dia)"
};
var STATUS_EQ_TIME_5 = {
	en: "Your next meal should have around ",
	pt: "Sua próxima refeição deve possuir aprox. "
};
var STATUS_EQ_TIME_6 = {
	en: " calories. \n\n(equivalent to ",
	pt: " calorias. \n\n(equivalente a "
};
var STATUS_EQ_TIME_7 = {
	en: " on a ",
	pt: " em uma meta de "
};
var STATUS_EQ_TIME_8 = {
	en: " kcal/day schedule)",
	pt: " kcal diárias)"
};
var STATUS_LOSS_1 = {
	en: "You have lost a total of ",
	pt: "Você perdeu um total de "
};
var STATUS_LOSS_2 = {
	en: "(based on a caloric restriction of ",
	pt: "(baseado em uma restrição calórica de "
};
var CALORIC_INTAKE = {
	en: "CALORIC INTAKE",
	pt: "INGESTÃO CALÓRICA"
};
var STATUS_INTAKE_1 = {
	en: "Your daily caloric intake should be equal to (",
	pt: "Sua ingestão calórica deve ser igual a ("
};
var STATUS_INTAKE_2 = {
	en: ") + (calories burned from exercise) \n\nThe more you exercise, the more you can eat!",
	pt: ") + (calorias queimadas em exercício) \n\nQuanto mais você se exercitar, mais poderá comer!"
};
var DELETE_ITEM = {
	en: "Delete item",
	pt: "Excluir item"
};
var MY_FAVOURITES = {
	en: "favourites",
	pt: "favoritos"
};
var MY_FOODS = {
	en: "my foods",
	pt: "alimentos"
};
var MY_EXERCISES = {
	en: "my exercises",
	pt: "exercícios"
};
var ADD_NEW_FOOD = {
	en: "add new food",
	pt: "adicionar novo alimento"
};
var ADD_NEW_EXERCISE = {
	en: "add new exercise",
	pt: "adicionar novo exercício"
};
var ADD_NEW = {
	en: "save",
	pt: "gravar"
};
var ADD_NAME = {
	en: "Name",
	pt: "Nome"
};
var ADD_AMMOUNT = {
	en: "Ammount",
	pt: "Quantidade"
};
var ADD_DURATION = {
	en: "Duration",
	pt: "Duração"
};
var PROTEINS = {
	en: "Proteins",
	pt: "Proteínas"
};
var CARBS = {
	en: "Carbs",
	pt: "Carboidratos"
};
var FATS = {
	en: "Fats",
	pt: "Gorduras"
};
var STATUS_BARS = {
	en: "Nutrients",
	pt: "Nutrição"
};
var NOTEPAD_DONE = {
	en: "done",
	pt: "ok"
};
var NOT_RUNNING_TITLE = {
	en: "The counter is currently stopped",
	pt: "O contador não está ativado"
};
var NOT_RUNNING_DIALOG = {
	en: "Would you like to start it now?",
	pt: "Gostaria de iniciá-lo agora?"
};
var CLEAR_ALL = {
	en: "clear all",
	pt: "limpar tudo"
};
var CLEAR_ALL_TITLE = {
	en: "clear all entries",
	pt: "limpar todos itens"
};
var CLEAR_ALL_TITLE = {
	en: "clear all entries",
	pt: "limpar todos itens"
};
var LOGOUT_TITLE = {
	en: "Turn off automatic backup",
	pt: "Desativar backup automático"
};
var FOR = {
	en: "for",
	pt: "para"
};
var CALORIE_COUNTER = {
	en: "Calorie Counter",
	pt: "Contador de Calorias"
};
var SHARE_MESSAGE = {
	en: "I'm using MyLiveDiet to track calories in real-time! Check it out!",
	pt: "Estou usando MyLiveDiet - contador de calorias em tempo real! Confira!"
};
var SETTINGS_HELP = {
	en: "Help",
	pt: "Ajuda"
};
var BLANK_FIELD_TITLE = {
	en: "Required fields have been left blank.",
	pt: "Campos obrigatórios foram deixados em branco."
};
var BLANK_FIELD_DIALOG = {
	en: "The missing information is highlighted in red.",
	pt: "A informação em falta está destacada em vermelho."
};
var START_APP = {
	en: "MyLiveDiet is designed to help you lose weight as easily as possibile.",
	pt: "MyLiveDiet foi desenvolvido para ajudá-lo a perder peso de maneira fácil e intuitiva."
};
var STEP_1 = {
	en: "Fill your Profile data",
	pt: "Preencha o Perfil"
};
var STEP_2 = {
	en: "Hit start",
	pt: "Aperte iniciar"
};
var STEP_3 = {
	en: "There is no third step!",
	pt: "Não há terceiro passo!"
};
var CLOSE_INTRO = {
	en: "ok, let's get started",
	pt: "ok, vamos começar"
};
var HELP_TOPICS_ARRAY = {
////////////
	en: { //
////////////
"Getting started":"\
	<p>Your body does not restart its calories every 24 hours, so why should your calorie counter? MyLiveDiet simulates the way the body actually uses energy, giving you a more realistic, real-time feedback.</p>\
	<p>First, fill your profile data. Based on this information, the app will calculate how many calories you need in order to keep your current weight.</p>\
	<p>Then you should define a weight loss rate, given in lb/kg per week.</p>\
	<p>The resulting value will include the necessary caloric restriction for you to achieve that goal.</p>\
	<p>Now hit start, and the app will show how many calories you have burned over time, so that you'll always know exactly how many calories you should consume at any given moment - with the caloric restriction calculation already included.</p>\
	<p>For instance:</p>\
	<p>2400 per day / 24 hours = 100 calories per hour</p>\
	<p>So, after 30 minutes, the counter will indicate you have “50 calories available”. Its that simple!</p>\
	<p>All you have to do is keep the counter around zero, and you will be automatically walking towards your goal!</p>\
",
////////////
"The Main Counter":"\
	<p>The main counter has 3 states: balanced (between -300 and 300, shown in blue), surplus (-300 and below, shown in red), and deficit (300 and up, shown in green).</p>\
	<p>When the counter hits +/-600, the “caloric status” block on the status screen will turn yellow to indicate you are getting too distant from the balanced state. The value 600 was chosen because it is usually the highest amount of calories recommend per meal.</p>\
	<p>Note that the counter units are given in “calories available” for the sake of simplicity, so as to quickly indicate whether you ate too much (negative values) or too little (positive values), as if you were “gaining points” over time. The actual caloric (energetic) balance of your body would be the opposite (negative for eating too little, positive for eating too much), but since this seems to reward over-eating by giving it a positive value, the “calories available” approach seemed generally preferable.</p>\
",
////////////
"Changing the Start Date":"\
	<p>The default behaviour of the app is to start counting from the moment you hit Start. If for some reason you would like to adjust that value (e.g. you started dieting this morning, but only had time to setup app in the afternoon), just tap the down arrow on the Start button to reveal the date picker.</p>\
",
////////////
"Calculating Calories":"\
	<p>The weight loss rate (kg/lb per week) is calculated using a simple formula based on the number of calories in a pound (3500) or kilogram (7700) of fat. </p>\
	<p>Let us say you need 2000 daily calories in order to keep your current weight, and you want to lose 0.5 kg per week.</p>\
	<p>Divide 7700 by 2 to get the total calories in 0.5 kg of fat:</p>\
	<p>7700 / 2 = 3850</p>\
	<p>Then divide that value by 7 to get how many daily calories you need to cut back:</p>\
	<p>3850 / 7 = 550</p>\
	<p>Now subtract that value from your daily intake:</p>\
	<p>2000 – 550 = 1450</p>\
	<p>That’s how many you have to consume daily in order to lose 0.5 kg a week.</p>\
"
	},
////////////
	pt: { //
//////////// 
"Como começar?":"\
	<p>Seu corpo não esquece as calorias a cada 24 horas, então por que seu contador de calorias deveria? MyLiveDiet simula a maneira como seu corpo realmente usa energia, fornecendo um feedback mais realístico e atualizado.</p>\
	<p>Primeiro, preencha seu perfil. Com base nessa informação, o aplicativo calculará quantas calorias você precisa para manter seu peso atual.</p>\
	<p>Depois você deve definir a perda de peso (em kg por semana).</p>\
	<p>O valor resultante incluirá a restrição calórica necessária para que você atinja esse objetivo.</p>\
	<p>Agora pressione Iniciar, e o aplicativo passará a mostrar quantas calorias você queimou ao longo do tempo, e assim você saberá sempre quantas calorias deve consumir - já estando incluso nesse valor o cálculo da restrição calórica.</p>\
	<p>Por exemplo:</p>\
	<p>2400 calorias por dia / 24 horas = 100 calorias por hora</p>\
	<p>Então, após 30 minutos, o contador indicará que você possui “50 calorias disponíveis”. É simples assim!</p>\
	<p>Você só precisa manter o contador em torno de zero, e estará automaticamente caminhando em direção ao seu objetivo!</p>\
",
////////////
"O Contador Principal":"\
	<p>O contador principal possui 3 estados: balanceado (entre -300 e 300, mostrado em azul), excesso (-300 e abaixo, mostrado em vermelho), e deficit (300 e acima, mostrado em verde). </p>\
	<p>Quando o contador chega em +/-600, o bloco “status calórico” na tela de status fica amarelo para indicar que você está distanciando-se demais do balanço calórico ideal (zero). O valor 600 foi escolhido porque esse é geralmente o número máximo de calorias recomendado por refeição.</p>\
	<p>Note que o contador utiliza “calorias disponíveis” como medida por questão de praticidade, para indicar rapidamente se você comeu demais (valores negativos) ou de menos (valores positivos), como se estivesse “ganhando pontos” com o passar do tempo. O balanço calórico (energético) real de seu corpo seria o oposto (negativo para comer pouco, positivo para comer demais), mas isso parece recompensar o consumo excessivo de calorias, de modo que o esquema de “calorias disponíveis” pareceu preferível.</p>\
",
////////////
"Mudar Data Inicial":"\
	<p>O comportamento padrão do aplicativo é começar a contagem a partir do momento em que o botão Iniciar é pressionado. Porém, se por algum motivo você precisar ajustar esse valor (e.g. você começou a dieta esta manhã, mas só teve tempo de configurar o aplicativo à tarde), basta pressionar a seta para baixo (no botão Iniciar) para revelar o seletor de data.</p>\
",
////////////
"Calculando Calorias":"\
	<p>A perda de peso (em kg por semana) é calculada utilizando-se uma fórmula simples, baseada no número de calorias em um quilograma de gordura (7700).</p>\
	<p>Suponhamos que você precise de 2000 calorias por dia para manter seu peso atual, e deseja perder 0.5 kg por semana.</p>\
	<p>Divida 7700 por 2 para encontrar o total de calorias em 0.5 kg de gordura:</p>\
	<p>7700 / 2 = 3850</p>\
	<p>Depois divida esse valor por 7 para saber quantas calorias diárias você precisa reduzir:</p>\
	<p>3850 / 7 = 550</p>\
	<p>Agora subtraia esse valor de sua ingestão diária:</p>\
	<p>2000 – 550 = 1450</p>\
	<p>Esse é o número de calorias que você deve consumir diariamente para perder 0.5 kg por semana.</p>\
"
	}
};









/* ////////////////////
"TITLE":"\
	<p></p>\
	<p></p>\
",
/////////////////////*/


var XXX = {
	en: "XXX",
	pt: "XXX"
};

////////////
// OUTPUT //
////////////
return eval(string)[appLang];
}
/*
//detect offline
	setTimeout(function(){
		if(typeof updateTimer != 'function' && document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1) {
			var appTitle  = (window.navigator.language.slice(0,2).toLowerCase() == "pt") ? 'SEM CONEXAO COM A INTERNET' : 'NO INTERNET CONNECTION';
			var appDialog = (window.navigator.language.slice(0,2).toLowerCase() == "pt") ? 'Continuando em modo offline' : 'Reverting to offline mode';
			window.localStorage.removeItem("config_debug");
			if(window.cordova) {
				navigator.notification.alert(appDialog,window.location='',appTitle,"ok");
			} else {
				alert(appTitle + " \n" + appDialog);
				window.location='';
			}
			return false;
		}
	},5000);
*/
//#////////////////////#//
//# GET VERSION NUMBER #//
//#////////////////////#//
/*
if(window.cordova) {
	var wizUtils = {
		getBundleVersion: function(s) { return cordova.exec(s, null, "WizUtils", "getBundleVersion", []); },
		getBundleDisplayName: function(s) { return cordova.exec(s, null, "WizUtils", "getBundleDisplayName", []); }
	};
}
if(!window.wizUtils) {
	window.localStorage.setItem("appVersion",appVersion);
	window.localStorage.setItem("appBuild",appBuild);
} else {
	window.wizUtils.getBundleDisplayName(function(version) { window.localStorage.setItem("appVersion",version); });
	window.wizUtils.getBundleVersion(function(build)	   { window.localStorage.setItem("appBuild",build);     });
}*/









function buildHelpMenu() {
	//insert menu
	$("#appContent").append("<div id='appHelper'></div>");
var startLock = 1;
var helpTopics = LANG("HELP_TOPICS_ARRAY");

/*
for (var key in helpTopics) {
  if (helpTopics.hasOwnProperty(key))

    alert(helpTopics[key]);

}*/

var helpHtml = "";
var topicId  = 0;
$.each(helpTopics, function(key, value) {
if(key && value) {
	topicId++;
	helpHtml = helpHtml + "<li id='topic" + topicId + "'>" + key + "<div class='topicTitle'>" + key + "</div><div class='topicContent'>" + value + "</div></li>";
}
});







	$("#appHelper").html('\
	<h2><span id="backButton"></span><div id="helpTitle">Help</div></h2>\
	<ul>' + helpHtml + '</ul>');
		
	//$("#appHelper").hide();
	//$("#appHelper").css("opacity","0");
	//$('#appHelper').css("-webkit-transition-timing-function","ease");
	//$('#appHelper').css("-webkit-transition-duration",".25s");

//	$("#appHelper").show();
	//$("#appHelper").css("opacity",".7");	
	
	setTimeout(function() {
		$("#appHelper").css("opacity","1");
	},0);



	$//("#appHelper").css("opacity",1);


		setTimeout(function(){
				$("#appHelper").niceScroll({touchbehavior:true,cursorcolor:"#000",cursorborder: "1px solid transparent",cursoropacitymax:0.5,cursorwidth:3,horizrailenabled:false,hwacceleration:true});
				setTimeout(function() {
				startLock = 0;
				},300);
		},300);
		
if(isMobile.Android()) {
	//$("#appHelper").css("top",$("#appHeader").height()* + "px");
}

	//self-removal handler
	$("#appHelper ul li").on(tap,function(evt) {
		if(startLock != 0) { return; }
				
		//$("#appHelper").getNiceScroll().remove();
		
		var subTitle   = $("#" + $(this).attr("id") + " .topicTitle").html();
		var subContent = $("#" + $(this).attr("id") + " .topicContent").html();


//alert($(this).attr("id"));
//alert(evt.target.id);
		
		$("#appContent").append('<div id="appSubHelper">\
									<h2><span id="subBackButton"></span><div id="subHelpTitle">' + subTitle + '</div></h2>\
									<div id="subHelpContent">' + subContent + '</div>\
								</div>');
		//setTimeout(function(){
		//	$("#appSubHelper").niceScroll({touchbehavior:true,cursorcolor:"#000",cursorborder: "1px solid transparent",cursoropacitymax:0.5,cursorwidth:3,horizrailenabled:false,hwacceleration:true});
		//},600);
		
		$('#appSubHelper').on(transitionend,function(e) { 

niceResizer();
if(!$('#appSubHelper').hasClass("open")) {
	$('#appSubHelper').remove();

	setTimeout(function() {
		$('#appHelper').css("width","100%");
		//niceResizer();
	},100);
	
	
	
} else {

	setTimeout(function() {
		$("#appSubHelper").niceScroll({touchbehavior:true,cursorcolor:"#000",cursorborder: "1px solid transparent",cursoropacitymax:0.5,cursorwidth:3,horizrailenabled:false,hwacceleration:true});
	},100);
}
	

	setTimeout(function() {
		$('#appSubHelper').css("width","100%");
		//niceResizer();
	},100);


		});
	
		
	$("#subBackButton").on(touchend,function() {
		//remove
		$("#appSubHelper").removeClass("open");
		$("#appHelper").removeClass("out");
	});		
		
		//$('#appSubHelper').css("-webkit-transition-timing-function","ease");
		//$('#appSubHelper').css("-webkit-transition-duration",".25s");
		
		setTimeout(function(){
		$("#appSubHelper").niceScroll({touchbehavior:true,cursorcolor:"#000",cursorborder: "1px solid transparent",cursoropacitymax:0.5,cursorwidth:3,horizrailenabled:false,hwacceleration:true});
	if(!isMobile.iOS() && androidVersion() < 4.4) {
		//$("#appContent").css("overflow","hidden");
		setTimeout(function(){
			$("#appSubHelper").niceScroll({touchbehavior:true,cursorcolor:"#000",cursorborder: "1px solid transparent",cursoropacitymax:0.5,cursorwidth:3,horizrailenabled:false,hwacceleration:true});
		},0);
	}
		$("#appSubHelper").addClass("open");
		$("#appHelper").addClass("out");
		},0);
		$("#appContent").getNiceScroll().remove();


		//remove
		//$("#appHelper").fadeOut(200,function() {
		//	$("#appHelper").remove();
		//});
	});


	//self-removal handler
	$("#backButton").on(touchend,function() {
		//remove
		$("#appHelper").css("opacity","0");
		$('#appHelper').on(transitionend,function(e) { 
			$('#appHelper').remove();
		});
	});
	
	
	
}

























/*

var lib = new localStorageDB("library", localStorage);


// Check if the database was just created. Useful for initial database setup
if( lib.isNew() ) {

    // create the "books" table
    lib.createTable("books", ["code", "title", "author", "year", "copies"]);

    // insert some data
    lib.insert("books", {code: "B001", title: "Phantoms in the brain", author: "Ramachandran", year: 1999, copies: 10});
    lib.insert("books", {code: "B002", title: "The tell-tale brain", author: "Ramachandran", year: 2011, copies: 10});
    lib.insert("books", {code: "B003", title: "Freakonomics", author: "Levitt and Dubner", year: 2005, copies: 10});
    lib.insert("books", {code: "B004", title: "Predictably irrational", author: "Ariely", year: 2008, copies: 10});
    lib.insert("books", {code: "B005", title: "Tesla: Man out of time", author: "Cheney", year: 2001, copies: 10});
    lib.insert("books", {code: "B006", title: "Salmon fishing in the Yemen", author: "Torday", year: 2007, copies: 10});
    lib.insert("books", {code: "B007", title: "The user illusion", author: "Norretranders", year: 1999, copies: 10});
    lib.insert("books", {code: "B008", title: "Hubble: Window of the universe", author: "Sparrow", year: 2010, copies: 10});

    // commit the database to localStorage
    // all create/drop/insert/update/delete operations should be committed
    lib.commit();

}
*/

/*
// simple select queries
lib.query("books", {year: 2011});
lib.query("books", {year: 1999, author: "Norretranders"});

// select all books
lib.query("books");

// select all books published after 2003
lib.query("books", function(row) {  // the callback function is applied to every row in the table
    if(row.year > 2003) {       // if it returns true, the row is selected
        return true;
    } else {
        return false;
    }
});

// select all books by Torday and Sparrow
lib.query("books", function(row) {
    if(row.author == "Torday" || row.author == "Sparrow") {
        return true;
    } else {
        return false;
    }
});







// change the title of books published in 1999 to "Unknown"
lib.update("books", {year: 1999}, function(row) {
    row.title = "Unknown";

    // the update callback function returns to the modified record
    return row;
});

// add +5 copies to all books published after 2003
lib.update("books",
    function(row) { // select condition callback
        if(row.year > 2003) {
            return true;
        } else {
            return false;
        }
    },
    function(row) { // update function
        row.year+=5;
        return row;
    }
);


// if there's a book with code B003, update it, or insert it as a new row
lib.insertOrUpdate("books", {code: 'B003'}, {
						code: "B003",
                        title: "Freakonomics",
                        author: "Levitt and Dubner",
                        year: 2005,
                        copies: 15
});


*/