//#///////////////////////#//
//# CORE LANGUAGE MANAGER #//
//#///////////////////////#//
function LANG(string) {
////////////////////////
// GET PREF. LANGUAGE //
////////////////////////
var prefLanguage = window.navigator.userLanguage || window.navigator.language;
var configLang   = prefLanguage.slice(0,2);
var configLang   = configLang.toLowerCase();
     //FORMAT
     if(configLang == "en")         { configLang = "en"; }
else if(configLang == "po")         { configLang = "pt"; }
else if(configLang == "pt")         { configLang = "pt"; }
else if(configLang == "english")    { configLang = "en"; }
else if(configLang == "português")  { configLang = "pt"; }
else if(configLang == "portugues")  { configLang = "pt"; }
else if(configLang == "portuguese") { configLang = "pt"; }
else if(configLang == "null")       { configLang = "en"; }
else                                { configLang = "en"; }
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
/*
var OVERSCROLL = {
	en: "swipe right for instructions ►<br />◄ swipe left for calorie calculator",
	pt: "deslize à direita para instruções ►<br />◄ à esquerda para calculadora de calorias"
};*/
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
	en: "add entry",
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
	en: "been dieting for",
	pt: "iniciado há"
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
	en: "wipe all data",
	pt: "apagar todos os dados"
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
////////////
// OUTPUT //
////////////
return eval(string)[configLang];
}

