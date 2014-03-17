var appVersion = "1.1.7 (11703)";
////////////////////
// PREF. LANGUAGE //
////////////////////http://msdn.microsoft.com/en-us/library/ms533052(v=vs.85).aspx
//ru (Русский);
//es (Español)
//de (Deutsch)
//fr (Français)
//zh-CN (简体中文)
//zh-TW (繁體中文)
//ko (한국어)
//ja (日本語)
var lang = "en";
if (window.navigator.language || navigator.userLanguage) {
	lang = (window.navigator.language || navigator.userLanguage).slice(0, 2).toLowerCase();
//} else if (navigator.userLanguage) {
//	//wp8
//	lang = navigator.userLanguage.slice(0, 2).toLowerCase();
}
//dev
if(window.localStorage.getItem("devSetLang") == "pt") { lang = "pt"; }
//avaliable
if(!lang.match(/(en|pt|de|es|fr|ja|ko|ru|zh)/)) { lang = "en"; }
//lang = 'ru';
//bold from delete
//nowrap daily calories
//#//////////////#//
//# STRING ARRAY #//
//#//////////////#//
var LANG = {
	LANGUAGE : {
		en : "en",
		pt : "pt",
		de : '',
		es : 'es',
		fr : '',
		ja : 'ja',
		ko : '',
		ru : 'ru',
		zh : 'zh'	
	},
	LANGUAGE_FULL : {
		en : "en-US",
		pt : "pt-BR",
		de : '',
		es : 'en-US',
		fr : '',
		ja : 'en-US',
		ko : '',
		ru : 'en-US',
		zh : 'en-US'	
	},
	NO_ENTRIES : {
		en : "no entries",
		pt : "nenhum registro",
		de : '',
		es : 'no hay entradas',
		fr : '',
		ja : 'エントリーなし',
		ko : '',
		ru : 'Нет записей',
		zh : '无项目'
	},
	EXERCISE : {
		en : "exercise",
		pt : "exercício",
		de : '',
		es : 'ejercicio',
		fr : '',
		ja : 'エクササイズ',
		ko : '',
		ru : 'Упражнение',
		zh : '锻炼'
	},
	FOOD : {
		en : "food",
		pt : "alimento",
		de : '',
		es : 'comida',
		fr : '',
		ja : '食べ物',
		ko : '',
		ru : 'Продукт',
		zh : '食物'
	},
	DESCRIPTION : {
		en : "Description...",
		pt : "Descrição...",
		de : '',
		es : 'Descripción...',
		fr : '',
		ja : '説明...',
		ko : '',
		ru : 'Описание...',
		zh : '>描述...'
	},
	ADD_ENTRY : {
		en : "quick add",
		pt : "adicionar",
		de : '',
		es : 'añadir',
		fr : '',
		ja : 'クイック追加',
		ko : '',
		ru : 'Быстрая добавка',
		zh : '快速添加'
	},
	QUICK_ADD : {
		en : "quick add",
		pt : "adição rápida",
		de : '',
		es : 'agregar rápidamente',
		fr : '',
		ja : 'クイック追加',
		ko : '',
		ru : 'Быстрая добавка',
		zh : '快速添加'
	},
	ACTIVITY_LOG : {
		en : "activity log",
		pt : "atividades",
		de : '',
		es : 'registro de actividades',
		fr : '',
		ja : 'アクティビティ記録',
		ko : '',
		ru : 'Журнал действий',
		zh : '活动日志'
	},
	NOW : {
		en : "now",
		pt : "agora",
		de : '',
		es : 'ahora',
		fr : '',
		ja : '今',
		ko : '',
		ru : 'Сейчас',
		zh : '现在'
	},
	HOUR_AGO : {
		en : "hour ago",
		pt : "hora atrás",
		de : '',
		es : 'hace una hora',
		fr : '',
		ja : '時間前',
		ko : '',
		ru : 'час назад',
		zh : '小时前'
	},
	HOURS_AGO : {
		en : "hours ago",
		pt : "horas atrás",
		de : '',
		es : 'hace unas horas',
		fr : '',
		ja : '時間前',
		ko : '',
		ru : 'часов назад',
		zh : '小时前'
	},
	DAY_AGO : {
		en : "day ago",
		pt : "dia atrás",
		de : '',
		es : 'hace un día',
		fr : '',
		ja : '日前',
		ko : '',
		ru : 'день назад',
		zh : '天前'
	},
	DAYS_AGO : {
		en : "days ago",
		pt : "dias atrás",
		de : '',
		es : 'hace unos días',
		fr : '',
		ja : '日前',
		ko : '',
		ru : 'дней назад',
		zh : '天前'
	},
	RESET_COUNTER : {
		en : "reset counter",
		pt : "resetar contador",
		de : '',
		es : 'reiniciar contador',
		fr : '',
		ja : 'カウンターのリセット',
		ko : '',
		ru : 'Перезагрузить счётчик',
		zh : '重置计数器'
	},
	MINUTES : {
		en : "minutes",
		pt : "minutos",
		de : '',
		es : 'minutos',
		fr : '',
		ja : '分',
		ko : '',
		ru : 'минут',
		zh : '分钟'
	},
	HOURS : {
		en : "hours",
		pt : "horas",
		de : '',
		es : 'horas',
		fr : '',
		ja : '時間',
		ko : '',
		ru : 'часов',
		zh : '小时'
	},
	DAYS : {
		en : "days",
		pt : "dias",
		de : '',
		es : 'días',
		fr : '',
		ja : '日',
		ko : '',
		ru : 'дней',
		zh : '天'
	},
	MINUTE : {
		en : "minute",
		pt : "minuto",
		de : '',
		es : 'minuto',
		fr : '',
		ja : '分',
		ko : '',
		ru : 'минуту',
		zh : '分钟'
	},
	HOUR : {
		en : "hour",
		pt : "hora",
		de : '',
		es : 'hora',
		fr : '',
		ja : '時間',
		ko : '',
		ru : 'час',
		zh : '小时'
	},
	DAY : {
		en : "day",
		pt : "dia",
		de : '',
		es : 'día',
		fr : '',
		ja : '日',
		ko : '',
		ru : 'день',
		zh : '天'
	},
	AND : {
		en : "and",
		pt : "e",
		de : '',
		es : 'y',
		fr : '',
		ja : 'そして',
		ko : '',
		ru : 'и',
		zh : '和'
	},
	AGO : {
		en : "ago",
		pt : "atrás",
		de : '',
		es : 'hace',
		fr : '',
		ja : '前',
		ko : '',
		ru : 'назад',
		zh : '以前'
	},
	PREPARING_DB : {
		en : "preparing database",
		pt : "inicializando",
		de : '',
		es : 'preparando base de datos',
		fr : '',
		ja : 'データベースの準備中',
		ko : '',
		ru : 'создание базы данных',
		zh : '准备数据库'
	},
	BEEN_DIETING : {
		en : "Been dieting for",
		pt : "Iniciado há",
		de : '',
		es : 'Oniciado hace',
		fr : '',
		ja : 'のためにダイエット中',
		ko : '',
		ru : 'на диете в течение',
		zh : '已经节食'
	},
	DELETE : {
		en : "Delete",
		pt : "Apagar",
		de : '',
		es : 'Eliminar',
		fr : '',
		ja : '削除',
		ko : '',
		ru : 'Удалить',
		zh : '删除'
	},
	SWIPE_TOOLTIP : {
		en : "swipe to get started",
		pt : "deslize para iniciar",
		de : '',
		es : 'deslizar para empezar',
		fr : '',
		ja : '開始するにはスワイプ',
		ko : '',
		ru : 'проведите для начала',
		zh : '轻扫以开始'
	},
	ARE_YOU_SURE : {
		en : "are you sure?",
		pt : "confirmar?",
		de : '',
		es : '¿está seguro?',
		fr : '',
		ja : 'よろしいですか？',
		ko : '',
		ru : 'вы уверены?',
		zh : '您确定吗？'
	},
	WIPE_DIALOG : {
		en : "all data will be erased",
		pt : "todos os dados serão apagados",
		de : '',
		es : 'Toda la información será eliminada',
		fr : '',
		ja : 'すべてのデータが消去されます',
		ko : '',
		ru : 'Все данные будут удалены',
		zh : '所有的数据都将被删除'
	},
	OK : {
		en : "ok",
		pt : "ok",
		de : '',
		es : 'ok',
		fr : '',
		ja : 'ok',
		ko : '',
		ru : 'ok',
		zh : 'ok'
	},
	CANCEL : {
		en : "cancel",
		pt : "cancelar",
		de : '',
		es : 'cancelar',
		fr : '',
		ja : 'キャンセル',
		ko : '',
		ru : 'отмена',
		zh : '取消'
	},
	RESET_DIALOG : {
		en : "reset counter",
		pt : "resetar contador",
		de : '',
		es : 'reiniciar contador',
		fr : '',
		ja : 'カウンターのリセット',
		ko : '',
		ru : 'Перезагрузить счётчик',
		zh : '重置计数器'
	},
	RESET_ENTRY_DIALOG : {
		en : "Reset entry value",
		pt : "Resetar entrada",
		de : '',
		es : 'Restablecer valor introducido',
		fr : '',
		ja : 'エントリ値のリセット',
		ko : '',
		ru : 'Сброс значение записи',
		zh : '重置输入的值'
	},
	FOOD_SEARCH : {
		en : "Food search... (100g)",
		pt : "Buscar alimento... (100g)",
		de : '',
		es : 'Buscar comida... (100g)',
		fr : '',
		ja : '食べ物検索... （100グラム）',
		ko : '',
		ru : 'поиск продуктов (100 г)', 
		zh : '食物搜索... （100克）'
	},
	NO_MATCHES : {
		en : "no matches",
		pt : "nenhum resultado",
		de : '',
		es : 'Sin coincidencias',
		fr : '',
		ja : '該当なし',
		ko : '',
		ru : 'Соответствий не найдено',
		zh : '无匹配'
	},
	EXERCISE_SEARCH : {
		en : "Exercise search... (30 min)",
		pt : "Buscar exercício... (30 min)",
		de : '',
		es : 'Buscar ejercicio ... (30 min)',
		fr : '',
		ja : 'エクササイズ検索... （30分）',
		ko : '',
		ru : 'Поиск упражнений... (30 мин.)',
		zh : '运动搜索... （30分钟）'
	},
	ENTRY_HISTORY : {
		en : "Recent activities",
		pt : "Atividades recentes",
		de : '',
		es : 'Actividades recientes',
		fr : '',
		ja : '最近のアクティビティ',
		ko : '',
		ru : 'Последние действия',
		zh : '最近的活动'
	},
	PRO : {
		en : "pro",
		pt : "pro",
		de : '',
		es : 'pro',
		fr : '',
		ja : 'たんぱく質',
		ko : '',
		ru : 'белок',
		zh : '蛋白质'
	},
	CAR : {
		en : "car",
		pt : "car",
		de : '',
		es : 'car',
		fr : '',
		ja : '炭水化物',
		ko : '',
		ru : 'углевод',
		zh : '糖类'
	},
	FAT : {
		en : "fat",
		pt : "gor",
		de : '',
		es : 'gra',
		fr : '',
		ja : '脂肪',
		ko : '',
		ru : 'жир',
		zh : '脂肪'
	},
	PRE_FILL : {
		en : "pre-fill",
		pt : "preencher",
		de : '',
		es : 'completar',
		fr : '',
		ja : 'プレフィル',
		ko : '',
		ru : 'предварительное заполнение',
		zh : '预充'
	},
	ADD : {
		en : "add",
		pt : "adicionar",
		de : '',
		es : 'añadir',
		fr : '',
		ja : '追加',
		ko : '',
		ru : 'добавить',
		zh : '添加'
	},
	GRAMS : {
		en : "grams",
		pt : "gramas",
		de : '',
		es : 'gramos',
		fr : '',
		ja : 'グラム',
		ko : '',
		ru : 'граммов',
		zh : '克'
	},
	SURPLUS : {
		en : "surplus",
		pt : "excesso",
		de : '',
		es : 'exceso',
		fr : '',
		ja : '余剰',
		ko : '',
		ru : 'излишек',
		zh : '盈余'
	},
	DEFICIT : {
		en : "deficit",
		pt : "déficit",
		de : '',
		es : 'déficit',
		fr : '',
		ja : '不足',
		ko : '',
		ru : 'недостаток',
		zh : '赤字'
	},
	BALANCED : {
		en : "balanced",
		pt : "balanceado",
		de : '',
		es : 'equilibrado',
		fr : '',
		ja : 'バランスの取れた',
		ko : '',
		ru : 'сбалансированная',
		zh : '均衡'
	},
	ERROR : {
		en : "ERROR!",
		pt : "ERRO!",
		de : '',
		es : '¡ERROR!',
		fr : '',
		ja : 'エラー！',
		ko : '',
		ru : 'ОШИБКА!',
		zh : '错误！'
	},
	STOP : {
		en : "STOP!",
		pt : "PARE!",
		de : '',
		es : '¡PARAR!',
		fr : '',
		ja : 'ストップ！',
		ko : '',
		ru : 'ОСТАНОВИТЬСЯ!',
		zh : '停！'
	},
	EQ_TIME : {
		en : "eq. time",
		pt : "tempo eq.",
		de : '',
		es : 'tiempo eq.',
		fr : '',
		ja : '同等の長さの時間',
		ko : '',
		ru : 'экв. время',
		zh : '等于时间'
	},
	RANGE : {
		en : "range",
		pt : "(amplitude)",
		de : '',
		es : 'rango',
		fr : '',
		ja : '範囲',
		ko : '',
		ru : 'Диапазон',
		zh : '范围'
	},
	START_DATE : {
		en : "start date",
		pt : "data inicial",
		de : '',
		es : 'fecha de inicio',
		fr : '',
		ja : '開始日',
		ko : '',
		ru : 'Дата начала',
		zh : '开始日期'
	},
	STATUS : {
		en : "status",
		pt : "status",
		de : '',
		es : 'estado',
		fr : '',
		ja : 'ステータス',
		ko : '',
		ru : 'Состояние',
		zh : '状态'
	},
	DIARY : {
		en : "diary",
		pt : "diário",
		de : '',
		es : 'diario',
		fr : '',
		ja : '日記',
		ko : '',
		ru : 'Дневник',
		zh : '日志'
	},
	PROFILE : {
		en : "profile",
		pt : "perfil",
		de : '',
		es : 'perfil',
		fr : '',
		ja : 'プロフィール',
		ko : '',
		ru : 'профиль',
		zh : '资料'
	},
	SETTINGS : {
		en : "settings",
		pt : "configurar",
		de : '',
		es : 'ajustes',
		fr : '',
		ja : '設定',
		ko : '',
		ru : 'настройки',
		zh : '设置'
	},
	MEASURE_SYSTEM : {
		en : "System of measurement",
		pt : "Sistema de medição",
		de : '',
		es : 'Sistema de medición',
		fr : '',
		ja : '測定方式',
		ko : '',
		ru : 'Система измерения',
		zh : '测量系统'
	},
	MEASURE_SYSTEM_INFO : {
		en : "(height, weight etc.)",
		pt : "(peso, altura, etc.)",
		de : '',
		es : '(altura, peso, etc)',
		fr : '',
		ja : '（身長、体重など）',
		ko : '',
		ru : '(Рост, вес и т.д.)',
		zh : '（身高，体重等）'
	},
	IMPERIAL : {
		en : "imperial",
		pt : "imperial",
		de : '',
		es : 'imperial',
		fr : '',
		ja : '英国法定標準',
		ko : '',
		ru : 'стандарт',
		zh : '纸张尺寸'
	},
	METRIC : {
		en : "metric",
		pt : "métrico",
		de : '',
		es : 'métrico',
		fr : '',
		ja : 'メートル法',
		ko : '',
		ru : 'метрика',
		zh : '公制'
	},
	SETTINGS_CONTACT : {
		en : "Contact us",
		pt : "Contato",
		de : '',
		es : 'Contáctenos',
		fr : '',
		ja : 'お問い合わせ',
		ko : '',
		ru : 'Связаться с нами',
		zh : '联系我们'
	},
	SETTINGS_ABOUT : {
		en : "About",
		pt : "Sobre",
		de : '',
		es : 'Acerca de',
		fr : '',
		ja : '約',
		ko : '',
		ru : 'О нас',
		zh : '关于'
	},
	SETTINGS_FEEDBACK : {
		en : "Support Forum",
		pt : "Fórum de Suporte",
		de : '',
		es : 'Foro de Soporte',
		fr : '',
		ja : 'サポート掲示板',
		ko : '',
		ru : 'Форум поддержки',
		zh : '支持论坛'
	},
	SETTINGS_FEEDBACK_INFO : {
		en : "Post ideas and get support",
		pt : "Poste ideias e tire dúvidas",
		de : '',
		es : 'Publique su opinión y obtenga respuesta',
		fr : '',
		ja : '意見を投稿して、サポートしてもらいましょう',
		ko : '',
		ru : 'Поделитесь своими идеями и получите помощь',
		zh : '发表观点，并获得支持'
	},
	SETTINGS_REVIEW : {
		en : "Rate this App",
		pt : "Avalie este App",
		de : '',
		es : 'Valore esta Aplicación',
		fr : '',
		ja : 'このアプリを評価する',
		ko : '',
		ru : 'Оцените данное приложение',
		zh : '为该应用评分'
	},
	SETTINGS_REVIEW_INFO : {
		en : "Your opinion is important to us",
		pt : "Sua opinião é importante para nós",
		de : '',
		es : 'Su opinión es importante para nosotros',
		fr : '',
		ja : '貴重なご意見として承ります',
		ko : '',
		ru : 'Ваше мнение важно для нас.',
		zh : '您的意见对我们很重要'
	},
	SETTINGS_FACEBOOK : {
		en : "Keep your data safe and synced",
		pt : "Mantenha seus dados seguros e sincronizados",
		de : '',
		es : 'Mantenga sus datos seguros sincronizados',
		fr : '',
		ja : 'データを安全に保存して同期してください',
		ko : '',
		ru : 'Храните ваши данные в безопасности и синхронизируйте их',
		zh : '保持您的数据安全并同步'
	},
	SETTINGS_FACEBOOK_LOGGED : {
		en : "Logged in as ",
		pt : "Conectado como ",
		de : '',
		es : 'Conectado como ',
		fr : '',
		ja : 'としてログイン中 ',
		ko : '',
		ru : 'Зашли как ',
		zh : '登入身份为 '
	},
	SETTINGS_HELP : {
		en : "Help",
		pt : "Ajuda",
		de : '',
		es : 'Ayuda',
		fr : '',
		ja : 'ヘルプ',
		ko : '',
		ru : 'Помощь',
		zh : '帮助'
	},
	SETTINGS_HELP_INFO : {
		en : "Topics to help you get started",
		pt : "Respostas para as dúvidas frequentes",
		de : '',
		es : 'Temas que le ayudarán a empezar',
		fr : '',
		ja : '開始に役立つトピックス',
		ko : '',
		ru : 'Инструкции для начала работы',
		zh : '帮助您开始的话题'
	},
	SETTINGS_RESET : {
		en : "Reset settings",
		pt : "Apagar configurações",
		de : '',
		es : 'Restablecer configuración',
		fr : '',
		ja : '設定のリセット',
		ko : '',
		ru : 'Сбросить настройки',
		zh : '重新设置'
	},
	SETTINGS_SYNC : {
		en : "Automatic Backup",
		pt : "Backup Automático",
		de : '',
		es : 'Copia de seguridad automática',
		fr : '',
		ja : '自動バックアップ',
		ko : '',
		ru : 'Автоматическое резервное копирование',
		zh : '自动备份'
	},
	SETTINGS_SYNC_INFO : {
		en : "Keep your data safe and synced",
		pt : "Mantenha seus dados seguros e sincronizados",
		de : '',
		es : 'Mantenga sus datos seguros sincronizados',
		fr : '',
		ja : 'データを安全に保存して同期してください',
		ko : '',
		ru : 'Храните ваши данные в безопасности и синхронизируйте их.',
		zh : '保持您的数据安全并同步'
	},
	LAST_SYNC : {
		en : "last sync",
		pt : "última sincronização",
		de : '',
		es : 'última sincronización',
		fr : '',
		ja : '前回の同期',
		ko : '',
		ru : 'Последняя синхронизация',
		zh : '上次同步'
	},
	ABOUT_TITLE : {
		en : "MyLiveDiet v" + appVersion,
		pt : "MyLiveDiet v" + appVersion,
		de : "MyLiveDiet v" + appVersion,
		es : "MyLiveDiet v" + appVersion,
		fr : "MyLiveDiet v" + appVersion,
		ja : "MyLiveDiet v" + appVersion,
		ko : "MyLiveDiet v" + appVersion,
		ru : "MyLiveDiet v" + appVersion,
		zh : "MyLiveDiet v" + appVersion
	},
	ABOUT_DIALOG : {
		en : "Developed by André Cancian",
		pt : "Desenvolvido por André Cancian",
		de : '',
		es : 'Desarrollado por André Cancian',
		fr : '',
		ja : 'André Cancian開発',
		ko : '',
		ru : 'Разработано Андре Cancian',
		zh : '由AndréCancian开发'
	},
	WEIGHT_LOSS : {
		en : "weight loss",
		pt : "perda de peso",
		de : '',
		es : 'pérdida de peso',
		fr : '',
		ja : '減量',
		ko : '',
		ru : 'потеря веса',
		zh : '体重减少'
	},
	TIME_ELAPSED : {
		en : "elapsed time",
		pt : "tempo total",
		de : '',
		es : 'tiempo transcurrido',
		fr : '',
		ja : '経過時間',
		ko : '',
		ru : 'Прошло времени',
		zh : '经过的时间'
	},
	CALORIC_BALANCE : {
		en : "caloric balance",
		pt : "balanço calórico",
		de : '',
		es : 'equilibrio calórico',
		fr : '',
		ja : 'カロリー収支',
		ko : '',
		ru : 'баланс калорий',
		zh : '热量平衡'
	},
	RESET : {
		en : "reset",
		pt : "resetar",
		de : '',
		es : 'reiniciar',
		fr : '',
		ja : 'リセット',
		ko : '',
		ru : 'перезагрузка',
		zh : '重置'
	},
	START : {
		en : "start",
		pt : "iniciar",
		de : '',
		es : 'iniciar',
		fr : '',
		ja : 'スタート',
		ko : '',
		ru : 'начать',
		zh : '开始'
	},
	MALE : {
		en : "male",
		pt : "masculino",
		de : '',
		es : 'masculino',
		fr : '',
		ja : '男性',
		ko : '',
		ru : 'мужской',
		zh : '男'
	},
	FEMALE : {
		en : "female",
		pt : "feminino",
		de : '',
		es : 'femenino',
		fr : '',
		ja : '女性',
		ko : '',
		ru : 'женский',
		zh : '女'
	},
	YOUR_GENDER : {
		en : "Your gender",
		pt : "Gênero",
		de : '',
		es : 'Su género',
		fr : '',
		ja : '性別',
		ko : '',
		ru : 'Ваш пол',
		zh : '您的性别'
	},
	YOUR_HEIGHT : {
		en : "Your height",
		pt : "Altura",
		de : '',
		es : 'Su altura',
		fr : '',
		ja : '身長',
		ko : '',
		ru : 'Ваш рост',
		zh : '您的身高'
	},
	YOUR_WEIGHT : {
		en : "Your weight",
		pt : "Peso",
		de : '',
		es : 'Su peso',
		fr : '',
		ja : '体重',
		ko : '',
		ru : 'Ваш вес',
		zh : '您的体重'
	},
	YOUR_AGE : {
		en : "Your age",
		pt : "Idade",
		de : '',
		es : 'Su edad',
		fr : '',
		ja : '年齢',
		ko : '',
		ru : 'Ваш возраст',
		zh : '您的年龄'
	},
	YOUR_ACTIVITY : {
		en : "Your Activity",
		pt : "Nível de atividade",
		de : '',
		es : 'Su Actividad',
		fr : '',
		ja : 'アクティビティ',
		ko : '',
		ru : 'Ваша деятельность',
		zh : '您的活动状态'
	},
	YOUR_ACTIVITY_OPTION1 : {
		en : "Sedentary: Mostly sitting down (desk job, designer)",
		pt : "Sedentário: Quase sempre sentado (designer, escritor)",
		de : '',
		es : 'Sedentario: principalmente sentado (trabajo de oficina, diseñador)',
		fr : '',
		ja : 'あまり体を動かさない（事務職、デザイナー）',
		ko : '',
		ru : 'Сидячий образ жизни : в основном в положении сидя (работа за компьютером, дизайнер)',
		zh : '固定不动：大部分是坐着（办公室工作，设计师）'
	},
	YOUR_ACTIVITY_OPTION2 : {
		en : "Lightly Active: Occasionally sitting (teacher, salesman)",
		pt : "Pouco Ativo: Ocasionalmente sentado (professor, vendedor)",
		de : '',
		es : 'Ligeramente activo: se sienta de ven en cuando (profesor, vendedor)',
		fr : '',
		ja : '少し活動的：時々座る（教師、セールスマン）',
		ko : '',
		ru : 'Небольшая активность: иногда сидячая (преподаватель, продавец)',
		zh : '稍微活动：偶尔坐着（教师，销售人员）'
	},
	YOUR_ACTIVITY_OPTION3 : {
		en : "Active: Walking most of the time (waitress, mailman)",
		pt : "Ativo: Caminhando quase sempre (carteiro, garçonete)",
		de : '',
		es : 'Activo: camina la mayor parte del tiempo (camarera, cartero)',
		fr : '',
		ja : '活動的：ほとんど立っている（ウエイトレス、郵便配達人）',
		ko : '',
		ru : 'Активная: большая часть времени в движении (официант, почтальон)',
		zh : '活跃的：大部分时间都在走动（服务员，邮差）'
	},
	YOUR_ACTIVITY_OPTION4 : {
		en : "Very Active: Physically hard work (construction worker)",
		pt : "Muito Ativo: Trabalho fisicamente extenuante (pedreiro, carregador)",
		de : '',
		es : 'Muy activo: trabajo físico duro (trabajador de la construcción)',
		fr : '',
		ja : '非常に活動的：重労働（建設作業員）',
		ko : '',
		ru : 'Очень активная: тяжёлый физический труд (строитель)',
		zh : '非常活跃：繁重的体力劳动者（建筑工人）'
	},
	FEET_INCHES : {
		en : "feet/inches",
		pt : "pés/pol.",
		de : '',
		es : 'pies/pul.',
		fr : '',
		ja : 'フィート/インチ',
		ko : '',
		ru : 'Футов/дюймов',
		zh : '英尺/英寸'
	},
	CENTIMETERS : {
		en : "centimeters",
		pt : "centímetros",
		de : '',
		es : 'centímetros',
		fr : '',
		ja : 'センチ',
		ko : '',
		ru : 'сантиметров',
		zh : '厘米'
	},
	POUNDS : {
		en : "pounds",
		pt : "libras",
		de : '',
		es : 'libras',
		fr : '',
		ja : 'ポンド',
		ko : '',
		ru : 'фунтов',
		zh : '磅'
	},
	KILOGRAMS : {
		en : "kilograms",
		pt : "kilogramas",
		de : '',
		es : 'kilogramos',
		fr : '',
		ja : 'キロ',
		ko : '',
		ru : 'килограммов',
		zh : '公斤'
	},
	KEEP_WEIGHT : {
		en : "Keep current weight:",
		pt : "Manter peso atual:",
		de : '',
		es : 'Mantener peso actual:',
		fr : '',
		ja : '現在の体重を保存する：',
		ko : '',
		ru : 'Держите текущий вес:',
		zh : '保持当前体重：'
	},
	LOSE_WEIGHT : {
		en : "Lose weight by:",
		pt : "Perder peso:",
		de : '',
		es : 'Bajar peso en:',
		fr : '',
		ja : '体重を落とす：',
		ko : '',
		ru : 'сбросить вес с помощью:',
		zh : '减肥通过：'
	},
	GAIN_WEIGHT : {
		en : "Gain weight by:",
		pt : "Ganhar peso:",
		de : '',
		es : 'Aumentar peso en:',
		fr : '',
		ja : '体重を増やす：',
		ko : '',
		ru : 'набрать вес с помощью:',
		zh : '增胖通过：'
	},
	PER_WEEK : {
		en : "per week",
		pt : "por semana",
		de : '',
		es : 'por semana',
		fr : '',
		ja : '1週間に',
		ko : '',
		ru : 'в неделю',
		zh : '每周'
	},
	CALORIES_AVALIABLE : {
		en : "calories avaliable",
		pt : "calorias disponíveis",
		de : '',
		es : 'calorías disponibles',
		fr : '',
		ja : '利用可能なカロリー',
		ko : '',
		ru : 'калорий доступна',
		zh : '包含的卡路里'
	},
	DAILY_CALORIES : {
		en : "daily calories",
		pt : "calorias por dia",
		de : '',
		es : 'calorías diarias',
		fr : '',
		ja : '毎日のカロリー',
		ko : '',
		ru : 'калорий в день',
		zh : '每日的卡路里'
	},
	STATUS_EQ_TIME_1 : {
		en : "Wait at least ",
		pt : "Aguarde pelo menos ",
		de : '',
		es : 'Espere por lo menos ',
		fr : '',
		ja : '以上待つ ',
		ko : '',
		ru : 'подождите хотя бы ',
		zh : '至少等待'
	},
	STATUS_EQ_TIME_2 : {
		en : " before your next meal. \n\n(",
		pt : " antes de sua próxima refeição. \n\n(",
		de : '',
		es : ' antes de la próxima comida. \n\n(',
		fr : '',
		ja : ' 次の食事の前に\n\n （',
		ko : '',
		ru : ' До следующего приёма пищи. \n\n(',
		zh : ' 在您的下一餐之前。\n\n（'
	},
	STATUS_EQ_TIME_3 : {
		en : " calories above your ",
		pt : " calorias acima de sua meta de ",
		de : '',
		es : ' calorías por encima de su objetivo de ',
		fr : '',
		ja : ' 越えるカロリー ',
		ko : '',
		ru : ' Калории свыше ',
		zh : ' 卡路里以上的 '	 	
	},
	STATUS_EQ_TIME_4 : {
		en : " kcal/day target)",
		pt : " kcal/dia)",
		de : '',
		es : ' kcal/día)',
		fr : '',
		ja : ' キロカロリー/日の目標）',
		ko : '',
		ru : ' кка.л в день цель)',
		zh : ' 每日卡路里目标）'
	},
	STATUS_EQ_TIME_5 : {
		en : "Your next meal should have around ",
		pt : "Sua próxima refeição deve possuir aprox. ",
		de : '',
		es : 'Su próxima comida debe tener alrededor de ',
		fr : '',
		ja : 'あたりが次の食事では必要です ',
		ko : '',
		ru : 'Следующий приём пищи должен состояться примерно ',
		zh : '你的下一餐应约为 '
	},
	STATUS_EQ_TIME_6 : {
		en : " calories. \n\n(equivalent to ",
		pt : " calorias. \n\n(equivalente a ",
		de : '',
		es : ' calorías. \n\m(Equivalente a ',
		fr : '',
		ja : ' カロリー。 \n\n（に相当 ',
		ko : '',
		ru : ' калории. \n\n (эквивалентные ',
		zh : ' 卡路里。\n\n（相当于'
	},
	STATUS_EQ_TIME_7 : {
		en : " on a ",
		pt : " em uma meta de ",
		de : '',
		es : ' en un objetivo de ',
		fr : '',
		ja : ' 上 ',
		ko : '',
		ru : ' на ',
		zh : ' 在  上 '
	},
	STATUS_EQ_TIME_8 : {
		en : " kcal/day schedule)",
		pt : " kcal diárias)",
		de : '',
		es : ' kcal/día)',
		fr : '',
		ja : ' キロカロリー/日の目標',
		ko : '',
		ru : ' ежедневно калорий)',
		zh : ' 每日卡路里目标)'
	},
	STATUS_LOSS_1 : {
		en : "You have lost a total of ",
		pt : "Você perdeu um total de ",
		de : '',
		es : 'Ha perdido un total de ',
		fr : '',
		ja : 'が合計で落ちました ',
		ko : '',
		ru : 'Вы сбросили всего ',
		zh : '你共减掉了  '
	},
	STATUS_LOSS_2 : {
		en : "(based on a caloric restriction of ",
		pt : "(baseado em uma restrição calórica de ",
		de : '',
		es : '(basado en una restricción calórica de ',
		fr : '',
		ja : '（カロリー制限に基づいて ',
		ko : '',
		ru : '(Основано на ограничении калорий ',
		zh : '（基于对卡路里的限制 '
	},
	CALORIC_INTAKE : {
		en : "CALORIC INTAKE",
		pt : "INGESTÃO CALÓRICA",
		de : '',
		es : 'INGESTA DE CALORÍAS',
		fr : '',
		ja : 'カロリー摂取量',
		ko : '',
		ru : 'ПОТРЕБЛЕНИЕ КАЛОРИЙ',
		zh : '摄入卡路里'
	},
	STATUS_INTAKE_1 : {
		en : "Your daily caloric intake should be equal to (",
		pt : "Sua ingestão calórica deve ser igual a (",
		de : '',
		es : 'Su ingesta diaria de calorías debe ser igual a (',
		fr : '',
		ja : '適切な毎日のカロリー摂取量は （',
		ko : '',
		ru : 'Ваше ежедневное потребление калорий должно равняться (',
		zh : '您每日摄取的卡路里量应等于（'
	},
	STATUS_INTAKE_2 : {
		en : ") + (calories burned from exercise) \n\nThe more you exercise, the more you can eat!",
		pt : ") + (calorias queimadas em exercício) \n\nQuanto mais você se exercitar, mais poderá comer!",
		de : '',
		es : ') + (calorías quemadas por el ejercicio) \n\n¡Cuanto más ejercicio haga, más puede comer!',
		fr : '',
		ja : '） + （運動で燃焼したカロリー） \n\nエクササイズすればするほど、食べることができます！',
		ko : '',
		ru : ') + (Калории сжигаются при физических упражнениях) \n\nЧем больше упражнений вы делаете, тем больше вам можно есть.',
		zh : ') +（锻炼燃烧的卡路里）\n\n你锻炼得越多，就可以吃的越多！'
	},
	DELETE_ITEM : {
		en : "Delete item",
		pt : "Excluir item",
		de : '',
		es : 'Eliminar elemento',
		fr : '',
		ja : 'アイテムを削除',
		ko : '',
		ru : 'Удалить элемент',
		zh : '删除项目'
	},
	MY_FAVOURITES : {
		en : "favourites",
		pt : "favoritos",
		de : '',
		es : 'favoritos',
		fr : '',
		ja : 'お気に入り',
		ko : '',
		ru : 'избранное',
		zh : '我的最爱'
	},
	MY_FOODS : {
		en : "my foods",
		pt : "alimentos",
		de : '',
		es : 'comidas',
		fr : '',
		ja : '私の食べ物',
		ko : '',
		ru : 'продукты',
		zh : '我的食物'
	},
	MY_EXERCISES : {
		en : "my exercises",
		pt : "exercícios",
		de : '',
		es : 'ejercicios',
		fr : '',
		ja : '私のエクササイズ',
		ko : '',
		ru : 'упражнения',
		zh : '我的运动'
	},
	ADD_NEW_FOOD : {
		en : "add new food",
		pt : "adicionar novo alimento",
		de : '',
		es : 'añadir comida',
		fr : '',
		ja : '新しい食べ物を追加',
		ko : '',
		ru : 'Добавить новый продукт',
		zh : '添加新的食物'
	},
	ADD_NEW_EXERCISE : {
		en : "add new exercise",
		pt : "adicionar novo exercício",
		de : '',
		es : 'añadir ejercicio',
		fr : '',
		ja : '新しいエクササイズを追加',
		ko : '',
		ru : 'Добавить новое упражнение',
		zh : '添加新的运动'
	},
	ADD_NEW : {
		en : "save",
		pt : "gravar",
		de : '',
		es : 'guardar',
		fr : '',
		ja : '保存',
		ko : '',
		ru : 'сохранить',
		zh : '保存'
	},
	ADD_NAME : {
		en : "Name",
		pt : "Nome",
		de : '',
		es : 'Nombre',
		fr : '',
		ja : '名前',
		ko : '',
		ru : 'Название',
		zh : '名称'
	},
	ADD_AMMOUNT : {
		en : "Amount",
		pt : "Quantidade",
		de : '',
		es : 'Cantidad',
		fr : '',
		ja : '総量',
		ko : '',
		ru : 'Количество',
		zh : '数量'
	},
	ADD_DURATION : {
		en : "Duration",
		pt : "Duração",
		de : '',
		es : 'Duración',
		fr : '',
		ja : '期間',
		ko : '',
		ru : 'Продолжительность',
		zh : '时长'
	},
	PROTEINS : {
		en : "Proteins",
		pt : "Proteínas",
		de : '',
		es : 'Proteinas',
		fr : '',
		ja : 'たんぱく質',
		ko : '',
		ru : 'белки',
		zh : '蛋白质'
	},
	CARBS : {
		en : "Carbs",
		pt : "Carboidratos",
		de : '',
		es : 'Carbohidratos',
		fr : '',
		ja : '炭水化物',
		ko : '',
		ru : 'Углеводы',
		zh : '碳水化合物'
	},
	FATS : {
		en : "Fats",
		pt : "Gorduras",
		de : '',
		es : 'Grasas',
		fr : '',
		ja : '脂肪',
		ko : '',
		ru : 'Жиры',
		zh : '脂肪'
	},
	STATUS_BARS : {
		en : "Nutrients",
		pt : "Nutrição",
		de : '',
		es : 'Nutrientes',
		fr : '',
		ja : '栄養素',
		ko : '',
		ru : 'Питательные вещества',
		zh : '营养素'
	},
	NOTEPAD_DONE : {
		en : "done",
		pt : "ok",
		de : '',
		es : 'ok',
		fr : '',
		ja : 'ok',
		ko : '',
		ru : 'ok',
		zh : 'ok'
	},
	NOT_RUNNING_TITLE : {
		en : "The counter is currently stopped",
		pt : "O contador não está ativado",
		de : '',
		es : 'El contador está parado',
		fr : '',
		ja : '現在、カウンターの停止中',
		ko : '',
		ru : 'В данный момент счётчик не работает.',
		zh : '计数器现已停止'
	},
	NOT_RUNNING_DIALOG : {
		en : "Would you like to start it now?",
		pt : "Gostaria de iniciá-lo agora?",
		de : '',
		es : '¿Le gustaría empezar ahora?',
		fr : '',
		ja : '今すぐ始めますか？',
		ko : '',
		ru : 'Хотите запустить его сейчас?',
		zh : '您想现在开始?'
	},
	CLEAR_ALL : {
		en : "clear all",
		pt : "limpar tudo",
		de : '',
		es : 'eliminar todos',
		fr : '',
		ja : 'すべてクリア',
		ko : '',
		ru : 'очистить всё',
		zh : '清除全部'
	},
	CLEAR_ALL_TITLE : {
		en : "clear all entries",
		pt : "limpar todos itens",
		de : '',
		es : 'eliminar todos',
		fr : '',
		ja : 'すべてのエントリーをクリア',
		ko : '',
		ru : 'очистить все записи',
		zh : '清除所有条目'
	},
	LOGOUT_TITLE : {
		en : "Turn off automatic backup",
		pt : "Desativar backup automático",
		de : '',
		es : 'Desactivar copia de seguridad automática',
		fr : '',
		ja : '自動バックアップをオフにする',
		ko : '',
		ru : 'отключить автоматическое резервное копирование',
		zh : '关闭自动备份'
	},
	FOR : {
		en : "for",
		pt : "para",
		de : '',
		es : 'para',
		fr : '',
		ja : 'のために',
		ko : '',
		ru : 'в течение',
		zh : '为'
	},
	CALORIE_COUNTER : {
		en : "Calorie Counter",
		pt : "Contador de Calorias",
		de : '',
		es : 'Contador de calorías',
		fr : '',
		ja : 'カロリー・カウンター',
		ko : '',
		ru : 'Счётчик калорий',
		zh : '卡路里计数器'
	},
	SHARE_MESSAGE : {
		en : "I'm using MyLiveDiet to track calories in real-time! Check it out!",
		pt : "Estou usando MyLiveDiet - contador de calorias em tempo real! Confira!",
		de : '',
		es : '¡Estoy usando MyLiveDiet para realizar un seguimiento de calorías en tiempo real! ¡Échale un vistazo!',
		fr : '',
		ja : 'リアルタイムでのカロリーを監視にMyLiveDietを利用しています。すごいですよ！',
		ko : '',
		ru : 'Я использую MyLiveDiet, чтобы отслеживать потребляемые калории в реальном времени! Отметить!',
		zh : '我正在使用MyLiveDiet实时跟踪卡路里！快来看看吧！'
	},
	BLANK_FIELD_TITLE : {
		en : "Required fields have been left blank.",
		pt : "Campos obrigatórios foram deixados em branco.",
		de : '',
		es : 'Los campos obligatorios están en blanco.',
		fr : '',
		ja : '必須項目が入力されていません。',
		ko : '',
		ru : 'Поля, необходимые для заполнения, оставлены пустыми.',
		zh : '必填项已被留空。'
	},
	BLANK_FIELD_DIALOG : {
		en : "The missing information is highlighted in red.",
		pt : "A informação em falta está destacada em vermelho.",
		de : '',
		es : 'La información que falta se resalta en rojo.',
		fr : '',
		ja : '赤字で強調した部分が必要事項です。',
		ko : '',
		ru : 'Отсутствующая информация отмечена красным.',
		zh : '缺少的信息以红色高亮显示。'
	},
	START_APP : {
		en : "MyLiveDiet was designed to help you lose weight as easily as possibile.",
		pt : "MyLiveDiet foi desenvolvido para ajudá-lo a perder peso de maneira fácil e intuitiva.",
		de : '',
		es : 'MyLiveDiet fue diseñado para ayudarle a perder peso lo más fácilmente posible.',
		fr : '',
		ja : 'MyLiveDietが可能な限り体重を減らすお手伝いをします。',
		ko : '',
		ru : 'Приложение MyLiveDiet разработано, чтобы вы могли сбрасывать вес как можно легче.',
		zh : 'MyLiveDiet的设计目的是帮助您尽可能轻松地减肥。'
	},
	STEP_1 : {
		en : "Fill your Profile data",
		pt : "Preencha o Perfil",
		de : '',
		es : 'Rellene los datos de perfil',
		fr : '',
		ja : 'プロフィールを入力する',
		ko : '',
		ru : 'Заполните свой профиль',
		zh : '请填写您的个​​人资料'
	},
	STEP_2 : {
		en : "Hit start",
		pt : "Aperte iniciar",
		de : '',
		es : 'Presione iniciar',
		fr : '',
		ja : 'スタートボタンを押す',
		ko : '',
		ru : 'Щёлкните, чтобы начать',
		zh : '点选开始'
	},
	STEP_3 : {
		en : "There is no third step!",
		pt : "Não há terceiro passo!",
		de : '',
		es : '¡No hay tercer paso!',
		fr : '',
		ja : '3番目のステップはありません！',
		ko : '',
		ru : 'Нет третьей ступени!',
		zh : '没有第三步！'
	},
	CLOSE_INTRO : {
		en : "ok, let's get started",
		pt : "ok, vamos começar",
		de : '',
		es : 'ok, vamos a empezar',
		fr : '',
		ja : 'では、始めましょう！',
		ko : '',
		ru : 'ok, давайте начнём!',
		zh : '好，让我们开始吧'
	},
	TODAY : {
		en : "today",
		pt : "hoje",
		de : '',
		es : 'hoy',
		fr : '',
		ja : '今日',
		ko : '',
		ru : 'сегодня',
		zh : '今天'
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
/////////////////////////
// fallback to english //
/////////////////////////
if(lang != "en" && lang != "pt") { 
	LANG.HELP_TOPICS_ARRAY[lang] = LANG.HELP_TOPICS_ARRAY['en'];
}

