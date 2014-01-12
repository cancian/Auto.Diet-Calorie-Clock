var appVersion = "1.1.2 (11203)";
//#///////////////////////#//
//# CORE LANGUAGE MANAGER #//
//#///////////////////////#//
var appLang = (window.navigator.language.slice(0,2).toLowerCase() == "pt") ? 'pt' : 'en';
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
	en: "Feedback & support",
	pt: "Feedback e suporte"
};
var SETTINGS_REVIEW = {
	en: "Rate this app",
	pt: "Avalie este app"
};
var SETTINGS_RESET = {
	en: "Reset settings",
	pt: "Apagar configurações"
};
var SETTINGS_SYNC = {
	en: "Sync with mylivediet.com",
	pt: "Sincronizar com mylivediet.com"
};
var ABOUT_TITLE = {
	en: "MyLiveDiet v" + appVersion,
	pt: "MyLiveDiet v" + appVersion
};
var ABOUT_DIALOG = {
	en: "by André Cancian",
	pt: "por André Cancian"
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

var XXX = {
	en: "XXX",
	pt: "XXX"
};

////////////
// OUTPUT //
////////////
return eval(string)[appLang];
}

