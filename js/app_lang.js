var appVersion = "1.1.7 (11703)";
////////////////////
// PREF. LANGUAGE //
////////////////////
var lang = "en";
if (window.navigator.language) {
	lang = (window.navigator.language.slice(0, 2).toLowerCase() == "pt") ? 'pt' : 'en';
} else if (navigator.userLanguage) {
	//wp8
	lang = (navigator.userLanguage.slice(0, 2).toLowerCase() == "pt") ? 'pt' : 'en';
}
if (window.localStorage.getItem("devSetLang") == "pt") {
	lang = "pt";
}
//#//////////////#//
//# STRING ARRAY #//
//#//////////////#//
var LANG = {
	LANGUAGE : {
		en : "en",
		pt : "pt"
	},
	LANGUAGE_FULL : {
		en : "en-US",
		pt : "pt-BR"
	},
	NO_ENTRIES : {
		en : "no entries",
		pt : "nenhum registro"
	},
	EXERCISE : {
		en : "exercise",
		pt : "exercício"
	},
	FOOD : {
		en : "food",
		pt : "alimento"
	},
	DESCRIPTION : {
		en : "Description...",
		pt : "Descrição..."
	},
	ADD_ENTRY : {
		en : "quick add",
		pt : "adicionar"
	},
	QUICK_ADD : {
		en : "quick add",
		pt : "adição rápida"
	},
	ACTIVITY_LOG : {
		en : "activity log",
		pt : "atividades"
	},
	NOW : {
		en : "now",
		pt : "agora"
	},
	HOUR_AGO : {
		en : "hour ago",
		pt : "hora atrás"
	},
	HOURS_AGO : {
		en : "hours ago",
		pt : "horas atrás"
	},
	DAY_AGO : {
		en : "day ago",
		pt : "dia atrás"
	},
	DAYS_AGO : {
		en : "days ago",
		pt : "dias atrás"
	},
	RESET_COUNTER : {
		en : "reset counter",
		pt : "resetar contador"
	},
	MINUTES : {
		en : "minutes",
		pt : "minutos"
	},
	HOURS : {
		en : "hours",
		pt : "horas"
	},
	DAYS : {
		en : "days",
		pt : "dias"
	},
	MINUTE : {
		en : "minute",
		pt : "minuto"
	},
	HOUR : {
		en : "hour",
		pt : "hora"
	},
	DAY : {
		en : "day",
		pt : "dia"
	},
	AND : {
		en : "and",
		pt : "e"
	},
	AGO : {
		en : "ago",
		pt : "atrás"
	},
	PREPARING_DB : {
		en : "preparing database",
		pt : "inicializando"
	},
	BEEN_DIETING : {
		en : "Been dieting for",
		pt : "Iniciado há"
	},
	DELETE : {
		en : "Delete",
		pt : "Apagar"
	},
	SWIPE_TOOLTIP : {
		en : "swipe to get started",
		pt : "deslize para iniciar"
	},
	ARE_YOU_SURE : {
		en : "are you sure?",
		pt : "confirmar?"
	},
	WIPE_DIALOG : {
		en : "all data will be erased",
		pt : "todos os dados serão apagados"
	},
	OK : {
		en : "ok",
		pt : "ok"
	},
	CANCEL : {
		en : "cancel",
		pt : "cancelar"
	},
	RESET_DIALOG : {
		en : "reset counter",
		pt : "resetar contador"
	},
	RESET_ENTRY_DIALOG : {
		en : "Reset entry value",
		pt : "Resetar entrada"
	},
	FOOD_SEARCH : {
		en : "Food search... (100g)",
		pt : "Buscar alimento... (100g)"
	},
	NO_MATCHES : {
		en : "no matches",
		pt : "nenhum resultado"
	},
	EXERCISE_SEARCH : {
		en : "Exercise search... (30 min)",
		pt : "Buscar exercício... (30 min)"
	},
	ENTRY_HISTORY : {
		en : "Recent activities",
		pt : "Atividades recentes"
	},
	PRO : {
		en : "pro",
		pt : "pro"
	},
	CAR : {
		en : "car",
		pt : "car"
	},
	FAT : {
		en : "fat",
		pt : "gor"
	},
	PRE_FILL : {
		en : "pre-fill",
		pt : "preencher"
	},
	ADD : {
		en : "add",
		pt : "adicionar"
	},
	GRAMS : {
		en : "grams",
		pt : "gramas"
	},
	SURPLUS : {
		en : "surplus",
		pt : "excesso"
	},
	DEFICIT : {
		en : "deficit",
		pt : "deficit"
	},
	BALANCED : {
		en : "balanced",
		pt : "balanceado"
	},
	ERROR : {
		en : "ERROR!",
		pt : "ERRO!"
	},
	STOP : {
		en : "STOP!",
		pt : "PARE!"
	},
	EQ_TIME : {
		en : "eq. time",
		pt : "tempo eq."
	},
	RANGE : {
		en : "range",
		pt : "(amplitude)"
	},
	START_DATE : {
		en : "start date",
		pt : "data inicial"
	},
	STATUS : {
		en : "status",
		pt : "status"
	},
	DIARY : {
		en : "diary",
		pt : "diário"
	},
	PROFILE : {
		en : "profile",
		pt : "perfil"
	},
	SETTINGS : {
		en : "settings",
		pt : "configurar"
	},
	MEASURE_SYSTEM : {
		en : "System of measurement",
		pt : "Sistema de medição"
	},
	MEASURE_SYSTEM_INFO : {
		en : "(height, weight etc.)",
		pt : "(peso, altura, etc.)"
	},
	IMPERIAL : {
		en : "imperial",
		pt : "imperial"
	},
	METRIC : {
		en : "metric",
		pt : "métrico"
	},
	SETTINGS_CONTACT : {
		en : "Contact us",
		pt : "Contato"
	},
	SETTINGS_ABOUT : {
		en : "About",
		pt : "Sobre"
	},
	SETTINGS_FEEDBACK : {
		en : "Support Forum",
		pt : "Fórum de Suporte"
	},
	SETTINGS_FEEDBACK_INFO : {
		en : "Post ideas and get support",
		pt : "Poste ideias e tire dúvidas"
	},
	SETTINGS_REVIEW : {
		en : "Rate this App",
		pt : "Avalie este App"
	},
	SETTINGS_REVIEW_INFO : {
		en : "Your opinion is important to us",
		pt : "Sua opinião é importante para nós"
	},
	/*
	SETTINGS_FACEBOOK: {
	en: "Sign in with Facebook",
	pt: "Conectar com Facebook"
	},*/
	SETTINGS_FACEBOOK : {
		en : "Keep your data safe and synced",
		pt : "Mantenha seus dados seguros e sincronizados"
	},
	SETTINGS_FACEBOOK_LOGGED : {
		en : "Logged in as ",
		pt : "Conectado como "
	},
	SETTINGS_HELP : {
		en : "Help",
		pt : "Ajuda"
	},
	SETTINGS_HELP_INFO : {
		en : "Topics to help you get started",
		pt : "Respostas para as dúvidas frequentes"
	},
	SETTINGS_RESET : {
		en : "Reset settings",
		pt : "Apagar configurações"
	},
	SETTINGS_SYNC : {
		en : "Automatic Backup",
		pt : "Backup Automático"
	},
	SETTINGS_SYNC_INFO : {
		en : "Keep your data safe and synced",
		pt : "Mantenha seus dados seguros e sincronizados"
	},
	LAST_SYNC : {
		en : "last sync",
		pt : "última sincronização"
	},
	ABOUT_TITLE : {
		en : "MyLiveDiet v" + appVersion,
		pt : "MyLiveDiet v" + appVersion
	},
	ABOUT_DIALOG : {
		en : "Developed by André Cancian",
		pt : "Desenvolvido por André Cancian"
	},
	WEIGHT_LOSS : {
		en : "weight loss",
		pt : "perda de peso"
	},
	TIME_ELAPSED : {
		en : "time elapsed",
		pt : "tempo total"
	},
	CALORIC_BALANCE : {
		en : "caloric balance",
		pt : "balanço calórico"
	},
	RESET : {
		en : "reset",
		pt : "resetar"
	},
	START : {
		en : "start",
		pt : "iniciar"
	},
	MALE : {
		en : "male",
		pt : "masculino"
	},
	FEMALE : {
		en : "female",
		pt : "feminino"
	},
	YOUR_GENDER : {
		en : "Your gender",
		pt : "Gênero"
	},
	YOUR_HEIGHT : {
		en : "Your height",
		pt : "Altura"
	},
	YOUR_WEIGHT : {
		en : "Your weight",
		pt : "Peso"
	},
	YOUR_AGE : {
		en : "Your age",
		pt : "Idade"
	},
	YOUR_ACTIVITY : {
		en : "Your Activity",
		pt : "Nível de atividade"
	},
	YOUR_ACTIVITY_OPTION1 : {
		en : "Sedentary: Mostly sitting down (desk job, designer)",
		pt : "Sedentário: Quase sempre sentado (designer, escritor)"
	},
	YOUR_ACTIVITY_OPTION2 : {
		en : "Lightly Active: Occasionally sitting (teacher, salesman)",
		pt : "Pouco Ativo: Ocasionalmente sentado (professor, vendedor)"
	},
	YOUR_ACTIVITY_OPTION3 : {
		en : "Active: Walking most of the time (waitress, mailman)",
		pt : "Ativo: Caminhando quase sempre (carteiro, garçonete)"
	},
	YOUR_ACTIVITY_OPTION4 : {
		en : "Very Active: Physically hard work (construction worker)",
		pt : "Muito Ativo: Trabalho fisicamente extenuante (pedreiro, carregador)"
	},
	FEET_INCHES : {
		en : "feet/inches",
		pt : "pés/pol."
	},
	CENTIMETERS : {
		en : "centimeters",
		pt : "centímetros"
	},
	POUNDS : {
		en : "pounds",
		pt : "libras"
	},
	KILOGRAMS : {
		en : "kilograms",
		pt : "kilogramas"
	},
	KEEP_WEIGHT : {
		en : "Keep current weight:",
		pt : "Manter peso atual:"
	},
	LOSE_WEIGHT : {
		en : "Lose weight by:",
		pt : "Perder peso:"
	},
	GAIN_WEIGHT : {
		en : "Gain weight by:",
		pt : "Ganhar peso:"
	},
	PER_WEEK : {
		en : "per week",
		pt : "por semana"
	},
	CALORIES_AVALIABLE : {
		en : "calories avaliable",
		pt : "calorias disponíveis"
	},
	DAILY_CALORIES : {
		en : "daily calories",
		pt : "calorias por dia"
	},
	STATUS_EQ_TIME_1 : {
		en : "Wait at least ",
		pt : "Aguarde pelo menos "
	},
	STATUS_EQ_TIME_2 : {
		en : " before your next meal. \n\n(",
		pt : " antes de sua próxima refeição. \n\n("
	},
	STATUS_EQ_TIME_3 : {
		en : " calories above your ",
		pt : " calorias acima de sua meta de "
	},
	STATUS_EQ_TIME_4 : {
		en : " kcal/day target)",
		pt : " kcal/dia)"
	},
	STATUS_EQ_TIME_5 : {
		en : "Your next meal should have around ",
		pt : "Sua próxima refeição deve possuir aprox. "
	},
	STATUS_EQ_TIME_6 : {
		en : " calories. \n\n(equivalent to ",
		pt : " calorias. \n\n(equivalente a "
	},
	STATUS_EQ_TIME_7 : {
		en : " on a ",
		pt : " em uma meta de "
	},
	STATUS_EQ_TIME_8 : {
		en : " kcal/day schedule)",
		pt : " kcal diárias)"
	},
	STATUS_LOSS_1 : {
		en : "You have lost a total of ",
		pt : "Você perdeu um total de "
	},
	STATUS_LOSS_2 : {
		en : "(based on a caloric restriction of ",
		pt : "(baseado em uma restrição calórica de "
	},
	CALORIC_INTAKE : {
		en : "CALORIC INTAKE",
		pt : "INGESTÃO CALÓRICA"
	},
	STATUS_INTAKE_1 : {
		en : "Your daily caloric intake should be equal to (",
		pt : "Sua ingestão calórica deve ser igual a ("
	},
	STATUS_INTAKE_2 : {
		en : ") + (calories burned from exercise) \n\nThe more you exercise, the more you can eat!",
		pt : ") + (calorias queimadas em exercício) \n\nQuanto mais você se exercitar, mais poderá comer!"
	},
	DELETE_ITEM : {
		en : "Delete item",
		pt : "Excluir item"
	},
	MY_FAVOURITES : {
		en : "favourites",
		pt : "favoritos"
	},
	MY_FOODS : {
		en : "my foods",
		pt : "alimentos"
	},
	MY_EXERCISES : {
		en : "my exercises",
		pt : "exercícios"
	},
	ADD_NEW_FOOD : {
		en : "add new food",
		pt : "adicionar novo alimento"
	},
	ADD_NEW_EXERCISE : {
		en : "add new exercise",
		pt : "adicionar novo exercício"
	},
	ADD_NEW : {
		en : "save",
		pt : "gravar"
	},
	ADD_NAME : {
		en : "Name",
		pt : "Nome"
	},
	ADD_AMMOUNT : {
		en : "Ammount",
		pt : "Quantidade"
	},
	ADD_DURATION : {
		en : "Duration",
		pt : "Duração"
	},
	PROTEINS : {
		en : "Proteins",
		pt : "Proteínas"
	},
	CARBS : {
		en : "Carbs",
		pt : "Carboidratos"
	},
	FATS : {
		en : "Fats",
		pt : "Gorduras"
	},
	STATUS_BARS : {
		en : "Nutrients",
		pt : "Nutrição"
	},
	NOTEPAD_DONE : {
		en : "done",
		pt : "ok"
	},
	NOT_RUNNING_TITLE : {
		en : "The counter is currently stopped",
		pt : "O contador não está ativado"
	},
	NOT_RUNNING_DIALOG : {
		en : "Would you like to start it now?",
		pt : "Gostaria de iniciá-lo agora?"
	},
	CLEAR_ALL : {
		en : "clear all",
		pt : "limpar tudo"
	},
	CLEAR_ALL_TITLE : {
		en : "clear all entries",
		pt : "limpar todos itens"
	},
	CLEAR_ALL_TITLE : {
		en : "clear all entries",
		pt : "limpar todos itens"
	},
	LOGOUT_TITLE : {
		en : "Turn off automatic backup",
		pt : "Desatibackup automático"
	},
	FOR : {
		en : "for",
		pt : "para"
	},
	CALORIE_COUNTER : {
		en : "Calorie Counter",
		pt : "Contador de Calorias"
	},
	SHARE_MESSAGE : {
		en : "I'm using MyLiveDiet to track calories in real-time! Check it out!",
		pt : "Estou usando MyLiveDiet - contador de calorias em tempo real! Confira!"
	},
	SETTINGS_HELP : {
		en : "Help",
		pt : "Ajuda"
	},
	BLANK_FIELD_TITLE : {
		en : "Required fields have been left blank.",
		pt : "Campos obrigatórios foram deixados em branco."
	},
	BLANK_FIELD_DIALOG : {
		en : "The missing information is highlighted in red.",
		pt : "A informação em falta está destacada em vermelho."
	},
	START_APP : {
		en : "MyLiveDiet was designed to help you lose weight as easily as possibile.",
		pt : "MyLiveDiet foi desenvolvido para ajudá-lo a perder peso de maneira fácil e intuitiva."
	},
	STEP_1 : {
		en : "Fill your Profile data",
		pt : "Preencha o Perfil"
	},
	STEP_2 : {
		en : "Hit start",
		pt : "Aperte iniciar"
	},
	STEP_3 : {
		en : "There is no third step!",
		pt : "Não há terceiro passo!"
	},
	CLOSE_INTRO : {
		en : "ok, let's get started",
		pt : "ok, vamos começar"
	},
	TODAY : {
		en : "today",
		pt : "hoje"
	},
	HELP_TOPICS_ARRAY : {
		////////////
		en : { //
			////////////
			"Getting started" : "\
				<p>Your body does not restart its calories every 24 hours, so why should your calorie counter? MyLiveDiet simulates the way the body actually uses energy, giving you a more realistic, real-time feedback.</p>\
				<p>First, fill your profile data. Based on this information, the app will calculate how many calories you need in order to keep your current weight.</p>\
				<p>Then you should define a weight loss rate, given in lb/kg per week.</p>\
				<p>The resulting value will include the necessary caloric restriction for you to achieve that goal.</p>\
				<p>Now hit start, and the app will show how many calories you have burned over time, so you'll always know exactly how many calories you should consume at any given moment - with the caloric restriction calculation already included.</p>\
				<p>For instance:</p>\
				<p>2400 per day / 24 hours = 100 calories per hour</p>\
				<p>So, after 30 minutes, the counter will indicate you have “50 calories available”. Its that simple!</p>\
				<p>All you have to do is keep the counter around zero, and you will be automatically walking towards your goal!</p>\
			",
			////////////
			"The Main Counter" : "\
				<p>The main counter has 3 states: balanced (between -300 and 300, shown in blue), surplus (-300 and below, shown in red), and deficit (300 and up, shown in green).</p>\
				<p>When the counter hits +/-600, the “caloric status” block on the status screen will turn yellow to indicate you are getting too distant from the balanced state. The value 600 was chosen because it is usually the highest amount of calories recommend per meal.</p>\
				<p>Note that the counter units are given in “calories available” for the sake of simplicity, so as to quickly indicate whether you ate too much (negative values) or too little (positive values), as if you were “gaining points” over time. The actual caloric (energetic) balance of your body would be the opposite (negative for eating too little, positive for eating too much), but since this seems to reward over-eating by giving it a positive value, the “calories available” approach seemed generally preferable.</p>\
			",
			////////////
			"Changing the Start Date" : "\
				<p>The default behaviour of the app is to start counting from the moment you hit Start. If for some reason you would like to adjust that value (e.g. you started dieting this morning, but only had time to setup app in the afternoon), just tap the down arrow on the Start button to reveal the date picker.</p>\
			",
			////////////
			"Calculating Calories" : "\
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
			////////////
		},
		////////////
		pt : { //
			////////////
			"Como começar?" : "\
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
			"O Contador Principal" : "\
				<p>O contador principal possui 3 estados: balanceado (entre -300 e 300, mostrado em azul), excesso (-300 e abaixo, mostrado em vermelho), e deficit (300 e acima, mostrado em verde). </p>\
				<p>Quando o contador chega em +/-600, o bloco “status calórico” na tela de status fica amarelo para indicar que você está distanciando-se demais do balanço calórico ideal (zero). O valor 600 foi escolhido porque esse é geralmente o número máximo de calorias recomendado por refeição.</p>\
				<p>Note que o contador utiliza “calorias disponíveis” como medida por questão de praticidade, para indicar rapidamente se você comeu demais (valores negativos) ou de menos (valores positivos), como se estivesse “ganhando pontos” com o passar do tempo. O balanço calórico (energético) real de seu corpo seria o oposto (negativo para comer pouco, positivo para comer demais), mas isso parece recompensar o consumo excessivo de calorias, de modo que o esquema de “calorias disponíveis” pareceu preferível.</p>\
			",
			////////////
			"Mudar Data Inicial" : "\
				<p>O comportamento padrão do aplicativo é começar a contagem a partir do momento em que o botão Iniciar é pressionado. Porém, se por algum motivo você precisar ajustar esse valor (e.g. você começou a dieta esta manhã, mas só teve tempo de configurar o aplicativo à tarde), basta pressionar a seta para baixo (no botão Iniciar) para revelar o seletor de data.</p>\
			",
			////////////
			"Calculando Calorias" : "\
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
			////////////
		}
	}
};
/*
			"TITLE" : "\
				<p></p>\
				<p></p>\
			",
*/

