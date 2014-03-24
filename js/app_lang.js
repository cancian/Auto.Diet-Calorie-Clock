var appVersion = "1.1.8 (11800)";
var langArray  = /(en|pt|de|es|fr|it|ja|ko|ro|ru|zh)/;
var lang       = "en";
/////////////////////
// DETECT LANGUAGE //
/////////////////////
if(window.navigator.language || navigator.userLanguage) {
	lang = (window.navigator.language || navigator.userLanguage).slice(0, 2).toLowerCase();
}
//MANUAL SET (DEV)
if((langArray).test(window.localStorage.getItem("devSetLang"))) { 
	lang = window.localStorage.getItem("devSetLang"); 
}
//SAFETY
if(!lang.match(langArray)) { lang = "en"; }
//#////////////#//
//# LANG ARRAY #//
//#////////////#//
var LANG = {
	LANGUAGE : {
		en : "en",
		pt : "pt",
		de : 'de',
		es : 'es',
		fr : 'fr',
		it : 'it',
		ja : 'ja',
		ko : 'ko',
		ro : 'ro',
		ru : 'ru',
		zh : 'zh'	
	},
	LANGUAGE_FULL : {
		en : "en-US",
		pt : "pt-BR",
		de : 'en-US',
		es : 'en-US',
		fr : 'en-US',
		it : 'en-US',
		ja : 'en-US',
		ko : 'en-US',
		ro : 'en-US',
		ru : 'en-US',
		zh : 'en-US'	
	},
	CALORIE_COUNTER : {
		en : "Calorie Counter",
		pt : "Contador de Calorias",
		de : 'Kalorienzähler',
		es : 'Contador de calorías',
		fr : 'Compteur de calories',
		it : 'Calorie Counter',
		ja : 'カロリー・カウンター',
		ko : '칼로리 카운터',
		ro : 'Contor de calorii',
		ru : 'Счётчик калорий',
		zh : '卡路里计数器'
	},
	START : {
		en : "start",
		pt : "iniciar",
		de : 'Start',
		es : 'iniciar',
		fr : 'commencer',
		it : 'inizio',
		ja : 'スタート',
		ko : '시작',
		ro : 'începe',
		ru : 'начать',
		zh : '开始'
	},
	RESET : {
		en : "reset",
		pt : "resetar",
		de : 'Zurücksetzen',
		es : 'reiniciar',
		fr : 'réinitialiser',
		it : 'reset',
		ja : 'リセット',
		ko : '리셋',
		ro : 'Resetare',
		ru : 'перезагрузка',
		zh : '重置'
	},
	START_DATE : {
		en : "start date",
		pt : "data inicial",
		de : 'Startdatum',
		es : 'fecha de inicio',
		fr : 'date de début',
		it : 'data di inizio',
		ja : '開始日',
		ko : '시작일',
		ro : 'începe data ',
		ru : 'Дата начала',
		zh : '开始日期'
	},
	APP_INTRO : {
		en : "MyLiveDiet was designed to help you lose weight as easily as possibile.",
		pt : "MyLiveDiet foi desenvolvido para ajudá-lo a perder peso de maneira fácil e intuitiva.",
		de : 'MyLiveDiet wurde entwickelt, um Ihnen dabei zu helfen, so einfach wie möglich abzunehmen.',
		es : 'MyLiveDiet ha sido diseñada para ayudarle a perder peso lo más fácilmente posible.',
		fr : 'MyLiveDiet a été conçu pour vous aider à perdre du poids le plus facilement possible.',
		it : 'MyLiveDiet è stato progettato per aiutare a perdere peso facilmente come Possibile.',
		ja : 'MyLiveDietが可能な限り体重を減らすお手伝いをします。',
		ko : 'MyLiveDiet는 가능한 한 쉬운 체중 감량에 도움을 주도록 만들어졌습니다.',
		ro : 'MyLiveDiet a fost conceput pentru a vă ajuta să piardă în greutate la fel de ușor ca possibile.',
		ru : 'Приложение MyLiveDiet разработано, чтобы вы могли сбрасывать вес как можно легче.',
		zh : 'MyLiveDiet被设计为帮助你以最轻松的方法减肥。'
	},
	STEP_1 : {
		en : "Fill your Profile data",
		pt : "Preencha o Perfil",
		de : 'Ihre Profildaten ausfüllen',
		es : 'Rellene los datos de perfil',
		fr : 'Remplissez vos données de profil',
		it : 'Riempi il tuo Profilo',
		ja : 'プロフィールを入力する',
		ko : '프로필 정보를 쓰고',
		ro : 'completati datele dvs. de profil',
		ru : 'Заполните свой профиль',
		zh : '请填写您的个​​人资料'
	},
	STEP_2 : {
		en : "Hit start",
		pt : "Aperte iniciar",
		de : 'Start drücken',
		es : 'Presione iniciar',
		fr : 'Sélectionnez Commencer',
		it : 'Hit inizio',
		ja : 'スタートボタンを押す',
		ko : '시작합니다.',
		ro : 'lovit începe',
		ru : 'Щёлкните, чтобы начать',
		zh : '点击开始'
	},
	STEP_3 : {
		en : "There is no third step!",
		pt : "Não há terceiro passo!",
		de : 'Das war\'s!',
		es : '¡No hay tercer paso!',
		fr : 'Il n\'ya pas de troisième étape !',
		it : 'Non esiste un terzo passo!',
		ja : '3番目のステップはありません！',
		ko : '3단계는 없음!',
		ro : 'Nu există nici un al treilea pas!',
		ru : 'Нет третьей ступени!',
		zh : '没有第三步！'
	},
	CLOSE_INTRO : {
		en : "ok, let's get started",
		pt : "ok, vamos começar",
		de : 'Okay, fangen wir an!',
		es : 'ok, vamos a empezar',
		fr : 'Allons-y',
		it : 'ok, cominciamo',
		ja : 'では、始めましょう！',
		ko : '좋아요. 시작합시다.',
		ro : 'ok, hai să începem ',
		ru : 'ok, давайте начнём!',
		zh : '好，让我们开始吧'
	},
	EXERCISE : {
		en : "exercise",
		pt : "exercício",
		de : 'Übung',
		es : 'ejercicio',
		fr : 'exercice',
		it : 'esercizio',
		ja : 'エクササイズ',
		ko : '운동',
		ro : 'exercițiu',
		ru : 'Упражнение',
		zh : '运动'
	},
	FOOD : {
		en : "food",
		pt : "alimento",
		de : 'Ernährung',
		es : 'comida',
		fr : 'nourriture',
		it : 'cibo',
		ja : '食べ物',
		ko : '음식',
		ro : 'alimente',
		ru : 'Продукт',
		zh : '食物'
	},
	DESCRIPTION : {
		en : "Description...",
		pt : "Descrição...",
		de : 'Beschreibung...',
		es : 'Descripción...',
		fr : 'Description...',
		it : 'Descrizione...',
		ja : '説明...',
		ko : '설명...',
		ro : 'Descriere...',
		ru : 'Описание...',
		zh : '描述...'
	},
	PRE_FILL : {
		en : "pre-fill",
		pt : "preencher",
		de : 'Vorfüllen',
		es : 'completar',
		fr : 'pré-remplir',
		it : 'pre-fill',
		ja : '自動入力',
		ko : '자동 채우기',
		ro : 'pre-umplere',
		ru : 'предварительное заполнение',
		zh : '预充'
	},
	ADD_ENTRY : {
		en : "add entry",
		pt : "adicionar",
		de : 'Hinzufügen',
		es : 'añadir',
		fr : 'ajouter',
		it : 'aggiungere',
		ja : 'クイック追加',
		ko : '간단 추가',
		ro : 'adăuga intrare',
		ru : 'добавить',
		zh : '快速添加'
	},
	DELETE : {
		en : "Delete",
		pt : "Apagar",
		de : 'Löschen',
		es : 'Eliminar',
		fr : 'Supprimer',
		it : 'Elimina',
		ja : '削除',
		ko : '삭제',
		ro : 'șterge',
		ru : 'Удалить',
		zh : '删除'
	},
	CLEAR_ALL : {
		en : "clear all",
		pt : "limpar tudo",
		de : 'Alle löschen',
		es : 'eliminar todos',
		fr : 'effacer tout',
		it : 'cancellare tutte le',
		ja : 'すべてクリア',
		ko : '모두 지우기',
		ro : 'șterge toate',
		ru : 'очистить всё',
		zh : '清除全部'
	},
	ACTIVITY_LOG : {
		en : "activity log",
		pt : "atividades",
		de : 'Aktivitätsprotokoll',
		es : 'registro de actividades',
		fr : 'journal d\'activités',
		it : 'registro delle attività',
		ja : 'アクティビティログ',
		ko : '활동 기록',
		ro : 'jurnalul de activitate',
		ru : 'Журнал действий',
		zh : '活动日志'
	},
	FOOD_SEARCH : {
		en : "Food search... (100g)",
		pt : "Buscar alimento... (100g)",
		de : 'Lebensmittelsuche... (100 g)',
		es : 'Buscar comida... (100g)',
		fr : 'Recherche de nourriture (100g)',
		it : 'Ricerca di cibo ... (100g)',
		ja : '食べ物検索... (100g)', //（100グラム）',
		ko : '음식 찾기... (100g)',
		ro : 'Căutare de alimente... (100g)',
		ru : 'поиск продуктов (100 г)', 
		zh : '食物搜索... （100克）'
	},
	EXERCISE_SEARCH : {
		en : "Exercise search... (30 min)",
		pt : "Buscar exercício... (30 min)",
		de : 'Übungssuche... (30 Min.)',
		es : 'Buscar ejercicio ... (30 min)',
		fr : 'Recherche d\'exercice (30 min)',
		it : 'Ricerca Esercizio ... (30 min)',
		ja : 'エクササイズ検索... （30分）',
		ko : '운동 찾기 (30분)',
		ro : 'Căutare exercițiu... (30 min)',
		ru : 'Поиск упражнений (30 мин.)',
		zh : '运动搜索... （30分钟）'
	},
	NO_ENTRIES : {
		en : "no entries",
		pt : "nenhum registro",
		de : 'Keine Einträge',
		es : 'no hay entradas',
		fr : 'aucune entrée',
		it : 'nessuna voce',
		ja : 'エントリーなし',
		ko : '입력 없음',
		ro : 'nu există intrări',
		ru : 'Нет записей',
		zh : '无项目'
	},
	NO_MATCHES : {
		en : "no matches",
		pt : "nenhum resultado",
		de : 'Keine Treffer',
		es : 'Sin coincidencias',
		fr : 'aucune correspondance',
		it : 'nessun incontro',
		ja : '該当なし',
		ko : '일치 정보 없음',
		ro : 'nu există nici un meci',
		ru : 'Соответствий не найдено',
		zh : '无匹配'
	},
	PREPARING_DB : {
		en : "preparing database",
		pt : "inicializando",
		de : 'Bereite Datenbank vor...',
		es : 'preparando base de datos',
		fr : 'préparation de la base de données',
		it : 'preparazione del database',
		ja : 'データベースの準備中',
		ko : '데이터베이스 준비',
		ro : 'baza de date pregătește',
		ru : 'создание базы данных',
		zh : '准备数据库'
	},
	MY_FAVOURITES : {
		en : "favourites",
		pt : "favoritos",
		de : 'Favoriten',
		es : 'favoritos',
		fr : 'Favoris',
		it : 'preferiti',
		ja : 'お気に入り',
		ko : '즐겨찾기',
		ro : 'favorite',
		ru : 'избранное',
		zh : '我的最爱'
	},
	MY_FOODS : {
		en : "my foods",
		pt : "alimentos",
		de : 'Lebensmittel',
		es : 'comidas',
		fr : 'aliments',
		it : 'i miei cibi',
		ja : '食べ物',
		ko : '음식',
		ro : 'alimentele',
		ru : 'продукты',
		zh : '我的食物'
	},
	MY_EXERCISES : {
		en : "my exercises",
		pt : "exercícios",
		de : 'Übungen',
		es : 'ejercicios',
		fr : 'exercices',
		it : 'i miei esercizi',
		ja : 'エクササイズ',
		ko : '운동',
		ro : 'exercițiile',
		ru : 'упражнения',
		zh : '我的运动'
	},
	ADD_NEW_FOOD : {
		en : "add new food",
		pt : "adicionar novo alimento",
		de : 'Neues Lebensmittel hinzufügen',
		es : 'añadir comida',
		fr : 'ajouter un nouvel aliment',
		it : 'aggiungere nuovi alimenti',
		ja : '新しい食べ物を追加',
		ko : '음식 새로 추가',
		ro : 'adăuga noi alimente',
		ru : 'Добавить новый продукт',
		zh : '添加新的食物'
	},
	ADD_NEW_EXERCISE : {
		en : "add new exercise",
		pt : "adicionar novo exercício",
		de : 'Neue Übung hinzufügen',
		es : 'añadir ejercicio',
		fr : 'ajouter un nouvel exercice',
		it : 'aggiungere nuovo esercizio',
		ja : '新しいエクササイズを追加',
		ko : '운동 새로 추가',
		ro : 'adăuga noi exercițiu',
		ru : 'Добавить новое упражнение',
		zh : '添加新的运动'
	},
	ADD : {
		en : "add",
		pt : "adicionar",
		de : 'Hinzufügen',
		es : 'añadir',
		fr : 'ajouter',
		it : 'aggiungere',
		ja : '追加',
		ko : '추가',
		ro : 'adăuga',
		ru : 'добавить',
		zh : '添加'
	},
	SAVE : {
		en : "save",
		pt : "gravar",
		de : 'Speichern',
		es : 'guardar',
		fr : 'enregistrer',
		it : 'salva',
		ja : '保存',
		ko : '저장',
		ro : 'salva',
		ru : 'сохранить',
		zh : '保存'
	},
	ADD_NAME : {
		en : "Name",
		pt : "Nome",
		de : 'Name',
		es : 'Nombre',
		fr : 'Nom',
		it : 'Nome',
		ja : '名前',
		ko : '이름',
		ro : 'Nume',
		ru : 'Название',
		zh : '名称'
	},
	ADD_AMOUNT : {
		en : "Amount",
		pt : "Quantidade",
		de : 'Menge',
		es : 'Cantidad',
		fr : 'Quantité',
		it : 'Ammount', /////////////
		ja : '総量',
		ko : '양',
		ro : 'Cantitate',
		ru : 'Количество',
		zh : '数量'
	},
	ADD_DURATION : {
		en : "Duration",
		pt : "Duração",
		de : 'Dauer',
		es : 'Duración',
		fr : 'Durée',
		it : 'Durata',
		ja : '期間',
		ko : '기간',
		ro : 'Durată',
		ru : 'Продолжительность',
		zh : '持续时间'
	},
	DELETE_ITEM : {
		en : "Delete item",
		pt : "Excluir item",
		de : 'Artikel löschen',
		es : 'Eliminar elemento',
		fr : 'Supprimer l\'élément',
		it : 'Elimina voce',
		ja : 'アイテムを削除',
		ko : '아이템 삭제',
		ro : 'Ștergeți elementul',
		ru : 'Удалить элемент',
		zh : '删除项目'
	},
	CALORIES_AVALIABLE : {
		en : "calories avaliable",
		pt : "calorias disponíveis",
		de : 'Verfügbare Kalorien',
		es : 'calorías disponibles',
		fr : 'calories disponible',
		it : 'calorie disponibile',
		ja : '利用可能なカロリー',
		ko : '가능 칼로리',
		ro : 'calorii disponibile',
		ru : 'калорий доступно',
		zh : '包含的卡路里'
	},
	DAILY_CALORIES : {
		en : "daily calories",
		pt : "calorias por dia",
		de : 'Tägliche Kalorien',//Kalorien pro Tag
		es : 'calorías diarias',
		fr : 'kcal / jour', //'calories quotidiennes',
		it : 'calorie al giorno',
		ja : '毎日のカロリー',
		ko : '하루 칼로리',
		ro : 'calorii pe zi',
		ru : 'калорий в день',
		zh : '每日的卡路里'
	},
	CALORIC_INTAKE : {
		en : "caloric intake",
		pt : "ingestão calórica",
		de : 'Kalorienaufnahme',
		es : 'ingesta de calorías',
		fr : 'apport calorique',
		it : 'apporto calorico',
		ja : 'カロリー摂取量',
		ko : '칼로리 섭취',
		ro : 'aportul caloric',
		ru : 'потребление калорий',
		zh : '摄入卡路里'
	},
	WEIGHT_LOSS : {
		en : "weight loss",
		pt : "perda de peso",
		de : 'Gewichtsverlust',
		es : 'pérdida de peso',
		fr : 'perte de poids',
		it : 'perdita di peso',
		ja : '減量',
		ko : '체중 감량',
		ru : 'потеря веса',
		zh : '体重减少'
	},
	TIME_ELAPSED : {
		en : "elapsed time",
		pt : "tempo total",
		de : 'Verstrichene Zeit',
		es : 'tiempo transcurrido',
		fr : 'temps écoulé',
		it : 'tempo trascorso',
		ja : '経過時間',
		ko : '시간 경과',
		ru : 'Прошло времени',
		zh : '经过的时间'
	},
	CALORIC_BALANCE : {
		en : "caloric balance",
		pt : "balanço calórico",
		de : 'Kalorienbilanz',
		es : 'equilibrio calórico',
		fr : 'équilibre calorique',
		it : 'bilancio calorico',
		ja : 'カロリー収支',
		ko : '칼로리 밸런스',
		ru : 'баланс калорий',
		zh : '热量平衡'
	},
	SURPLUS : {
		en : "surplus",
		pt : "excesso",
		de : 'Überschuss',
		es : 'exceso',
		fr : 'excédent',
		it : 'eccesso',
		ja : '余剰',
		ko : '너무 많음',
		ru : 'излишек',
		zh : '盈余'
	},
	DEFICIT : {
		en : "deficit",
		pt : "déficit",
		de : 'Defizit',
		es : 'déficit',
		fr : 'déficit',
		it : 'deficit',
		ja : '不足',
		ko : '부족',
		ru : 'недостаток',
		zh : '赤字'
	},
	BALANCED : {
		en : "balanced",
		pt : "balanceado",
		de : 'Ausgeglichen',
		es : 'equilibrado',
		fr : 'équilibré',
		it : 'bilanciato',
		ja : 'バランスの取れた',
		ko : '균형',
		ru : 'сбалансированная',
		zh : '均衡'
	},
	MENU_STATUS : {
		en : "status",
		pt : "status",
		de : 'Status',
		es : 'estado',
		fr : 'statut',
		it : 'stato',
		ja : 'ステータス',
		ko : '상태',
		ro : 'status',
		ru : 'Состояние',
		zh : '状态'
	},
	MENU_DIARY : {
		en : "diary",
		pt : "diário",
		de : 'Tagebuch',
		es : 'diario',
		fr : 'journal',
		it : 'diario',
		ja : '日記',
		ko : '일기',
		ro : 'jurnal',
		ru : 'Дневник',
		zh : '日志'
	},
	MENU_PROFILE : {
		en : "profile",
		pt : "perfil",
		de : 'Profil',
		es : 'perfil',
		fr : 'profil',
		it : 'profilo',
		ja : 'プロフィール',
		ko : '프로필',
		ro : 'profil',
		ru : 'профиль',
		zh : '资料'
	},
	MENU_SETTINGS : {
		en : "settings",
		pt : "configurar",
		de : 'Einstellungen',
		es : 'ajustes',
		fr : 'paramètres',
		it : 'Impostazioni',
		ja : '設定',
		ko : '설정',
		ro : 'Setările',
		ru : 'настройки',
		zh : '设置'
	},
	NOW : {
		en : "now",
		pt : "agora",
		de : 'jetzt',
		es : 'ahora',
		fr : 'maintenant',
		it : 'ora',
		ja : '今',
		ko : '현재',
		ro : 'acum',
		ru : 'Сейчас',
		zh : '现在'
	},
	TODAY : {
		en : "today",
		pt : "hoje",
		de : 'heute',
		es : 'hoy',
		fr : 'aujourd\'hui',
		it : 'oggi',
		ja : '今日',
		ko : '오늘',
		ro : 'azi',
		ru : 'сегодня',
		zh : '今天'
	},
	MINUTE : {
		en : "minute",
		pt : "minuto",
		de : 'Minute',
		es : 'minuto',
		fr : 'minute',
		it : 'minuto',
		ja : '分',
		ko : '분',
		ro : 'minut',
		ru : 'минуту',
		zh : '分钟'
	},
	MINUTES : {
		en : "minutes",
		pt : "minutos",
		de : 'Minuten',
		es : 'minutos',
		fr : 'minutes',
		it : 'minuti',
		ja : '分',
		ko : '분',
		ro : 'minute',
		ru : 'минут',
		zh : '分钟'
	},
	MIN : {
		en : "min",
		pt : "min",
		de : 'Min',
		es : 'min',
		fr : 'min',
		it : 'min',
		ja : '分',
		ko : '분',
		ro : 'min',
		ru : 'мин.',
		zh : '分钟'
	},
	HOUR : {
		en : "hour",
		pt : "hora",
		de : 'Stunde',
		es : 'hora',
		fr : 'heure',
		it : 'ora',
		ja : '時間',
		ko : '시간',
		ro : 'oră',
		ru : 'час',
		zh : '小时'
	},
	HOURS : {
		en : "hours",
		pt : "horas",
		de : 'Stunden',
		es : 'horas',
		fr : 'heures',
		it : 'ore',
		ja : '時間',
		ko : '시간',
		ro : 'ore',
		ru : 'часов',
		zh : '小时'
	},
	DAY : {
		en : "day",
		pt : "dia",
		de : 'Tag',
		es : 'día',
		fr : 'jour',
		it : 'giorno',
		ja : '日',
		ko : '일',
		ro : 'zi',
		ru : 'день',
		zh : '天'
	},
	DAYS : {
		en : "days",
		pt : "dias",
		de : 'Tage',
		es : 'días',
		fr : 'jours',
		it : 'giorni',
		ja : '日',
		ko : '일',
		ro : 'zile',
		ru : 'дней',
		zh : '天'
	},
	AND : {
		en : "and",
		pt : "e",
		de : 'und',
		es : 'y',
		fr : 'et',
		it : 'e',
		ja : 'と',
		ko : '및',
		ro : 'și',
		ru : 'и',
		zh : '和'
	},
	AGO : {
		en : "ago",
		pt : "atrás",
		de : '',
		es : '',
		fr : '',
		it : 'fa',
		ja : '前',
		ko : '전',
		ro : 'în urma',
		ru : 'назад',
		zh : '前'
	},
	PREAGO : {
		en : "",
		pt : "",
		de : 'vor',
		es : 'hace',
		fr : 'il y a',
		it : '',
		ja : '',
		ko : '',
		ro : '',
		ru : '',
		zh : ''
	},	
	CALORIE : {
		en : "calorie",
		pt : "caloria",
		de : 'Kalorie',
		es : 'caloría',
		fr : 'calorie',
		it : 'caloria',
		ja : 'カロリー',
		ko : '칼로리',
		ro : 'calorie',
		ru : 'калория',
		zh : '卡路里'
	},
	CALORIES : {
		en : "calories",
		pt : "calorias",
		de : 'Kalorien',
		es : 'calorías',
		fr : 'calories',
		it : 'calorie',
		ja : 'カロリー',
		ko : '칼로리',
		ro : 'calorii',
		ru : 'калорий.',
		zh : '卡路里'
	},	
	KCAL : {
		en : "kcal",
		pt : "kcal",
		de : 'kcal',
		es : 'kcal',
		fr : 'kcal',
		it : 'kcal',
		ja : 'カロリー', //キロカロリー
		ko : '칼로리',  //킬로칼로리
		ro : 'kcal',
		ru : 'ккал',
		zh : '千卡'   //千卡
	},	
	CENTIMETERS : {
		en : "centimeters",
		pt : "centímetros",
		de : 'Zentimeter',
		es : 'centímetros',
		fr : 'centimètres',
		it : 'centimetri',
		ja : 'センチ',
		ko : '센티미터',
		ro : 'centimetri',
		ru : 'сантиметров',
		zh : '厘米'
	},
	FEET_INCHES : {
		en : "feet/inches",
		pt : "pés/pol.",
		de : 'Fuß/Zoll',
		es : 'pies/pul.',
		fr : 'pieds/pouces',
		it : 'piedi/pollici',
		ja : 'フィート/インチ',
		ko : '피트/인치',
		ro : 'picioare / inch',
		ru : 'Футов/дюймов',
		zh : '英尺/英寸'
	},
	GRAMS : {
		en : "grams",
		pt : "gramas",
		de : 'Gramm',
		es : 'gramos',
		fr : 'grammes',
		it : 'grammi',
		ja : 'グラム',
		ko : '그램',
		ro : 'grame',
		ru : 'граммов',
		zh : '克'
	},
	G : {
		en : "g",
		pt : "g",
		de : 'g',
		es : 'g',
		fr : 'g',
		it : 'g',
		ja : 'g', //'グラム',
		ko : 'g', //'그램',
		ro : 'g',
		ru : 'г', 
		zh : '克'
	},	
	KILOGRAMS : {
		en : "kilograms",
		pt : "kilogramas",
		de : 'Kilogramm',
		es : 'kilogramos',
		fr : 'kilogrammes',
		it : 'chilogrammi',
		ja : 'キロ',
		ko : '킬로그램',
		ro : 'kilograme',
		ru : 'килограммов',
		zh : '公斤'
	},
	KG : {
		en : "kg",
		pt : "kg",
		de : 'kg',
		es : 'kg',
		fr : 'kg',
		it : 'kg',
		ja : 'キロ.',
		ko : '킬로그램',
		ro : 'kg',
		ru : 'кг', 
		zh : '公斤'
	},
	POUNDS : {
		en : "pounds",
		pt : "libras",
		de : 'Pfund',
		es : 'libras',
		fr : 'livres',
		it : 'sterline',
		ja : 'ポンド',
		ko : '파운드',
		ro : 'livre',
		ru : 'фунтов',
		zh : '磅'
	},
	LB : {
		en : "lb",
		pt : "lb",
		de : 'lb',
		es : 'lb',
		fr : 'lb',
		it : 'lb',
		ja : 'ポンド',
		ko : '파운드',
		ro : 'lb',
		ru : 'фунтов', 
		zh : '磅'
	},
	PROTEINS : {
		en : "Proteins",
		pt : "Proteínas",
		de : 'Proteine',
		es : 'Proteinas',
		fr : 'Protéines',
		it : 'Proteine',
		ja : 'タンパク質',
		ko : '단백질',
		ro : 'proteine',
		ru : 'белки',
		zh : '蛋白质'
	},
	CARBS : {
		en : "carbohydrates",
		pt : "Carboidratos",
		de : 'Kohlenhydrate',
		es : 'Carbohidratos',
		fr : 'Glucides',
		it : 'Carboidrati',
		ja : '炭水化物',
		ko : '탄수화물',
		ro : 'Carbohidratii',
		ru : 'Углеводы',
		zh : '碳水化合物'
	},
	FATS : {
		en : "Fats",
		pt : "Gorduras",
		de : 'Fette',
		es : 'Grasas',
		fr : 'Graisses',
		it : 'Grassi',
		ja : '脂肪',
		ko : '지방',
		ro : 'grăsimi',
		ru : 'Жиры',
		zh : '脂肪'
	},
	PRO : {
		en : "pro",
		pt : "pro",
		de : 'Pro',
		es : 'pro',
		fr : 'pro',
		it : 'pro',
		ja : 'タンパク',
		ko : '단백질',
		ro : 'pro',
		ru : 'белок',
		zh : '蛋白质'
	},
	CAR : {
		en : "car",
		pt : "car",
		de : 'Kol',
		es : 'car',
		fr : 'glu',
		it : 'car',
		ja : '炭水化物',
		ko : '탄수화물',
		ro : 'car',
		ru : 'углевод',
		zh : '糖类'
	},
	FAT : {
		en : "fat",
		pt : "gor",
		de : 'Fet',
		es : 'gra',
		fr : 'gra',
		it : 'gra',
		ja : '脂肪',
		ko : '지방',
		ro : 'gră',
		ru : 'жир',
		zh : '脂肪'
	},
	ARE_YOU_SURE : {
		en : "are you sure?",
		pt : "confirmar?",
		de : 'Sind Sie sicher?',
		es : '¿está seguro?',
		fr : 'Vraiment?',
		it : 'sei sicuro?',
		ja : 'よろしいですか？',
		ko : '정말입니까?',
		ro : 'ești sigur?',
		ru : 'Вы уверены?',
		zh : '你确定吗？'
	},
	OK : {
		en : "ok",
		pt : "ok",
		de : 'ok',
		es : 'ok',
		fr : 'ok',
		it : 'ok',
		ja : 'ok',
		ko : '확인',
		ro : 'ok',
		ru : 'ok',
		zh : '好'
	},
	CANCEL : {
		en : "cancel",
		pt : "cancelar",
		de : 'Abbrechen',
		es : 'cancelar',
		fr : 'annuler',
		it : 'annulla',
		ja : 'キャンセル',
		ko : '취소',
		ro : 'anula',
		ru : 'отмена',
		zh : '取消'
	},
	SETTINGS_WIPE : {
		en : "Reset settings",
		pt : "Apagar configurações",
		de : 'Einstellungen zurücksetzen',
		es : 'Restablecer configuración',
		fr : 'Réinitialiser les paramètres',
		it : 'Ripristinare le impostazioni',
		ja : '設定のリセット',
		ko : '설정 리셋',
		ro : 'Reseta setările',
		ru : 'Сбросить настройки',
		zh : '重新设置'
	},
	SETTINGS_WIPE_TITLE : {
		en : "all data will be erased",
		pt : "todos os dados serão apagados",
		de : 'Alle Daten werden gelöscht',
		es : 'Toda la información será eliminada',
		fr : 'toutes les données seront effacées',
		it : 'tutti i dati saranno cancellati',
		ja : 'すべてのデータが消去されます',
		ko : '모든 데이터가 삭제됩니다.',
		ro : 'toate datele vor fi șterse',
		ru : 'Все данные будут удалены',
		zh : '所有数据都将被删除'
	},
	NOT_RUNNING_TITLE : {
		en : "The counter is currently stopped",
		pt : "O contador não está ativado",
		de : 'Der Zähler läuft derzeit nicht',
		es : 'El contador está parado',
		fr : 'Le compteur est actuellement arrêté',
		it : 'Il contatore è attualmente interrotto',
		ja : '現在、カウンターは停止中',
		ko : '현재 카운터가 멈췄습니다.',
		ro : 'Contorul este oprit',
		ru : 'В данный момент счётчик не работает.',
		zh : '计数器现已停止'
	},
	NOT_RUNNING_DIALOG : {
		en : "Would you like to start it now?",
		pt : "Gostaria de iniciá-lo agora?",
		de : 'Möchten Sie es jetzt beginnen?',
		es : '¿Le gustaría empezar ahora?',
		fr : 'Voulez-vous le lancer maintenant ?',
		it : 'Vuoi iniziare ora?',
		ja : '今すぐ始めますか？',
		ko : '지금 시작하겠습니까?',
		ro : 'Doriți să-l înceapă acum?',
		ru : 'Хотите запустить его сейчас?',
		zh : '你想现在开始?'
	},
	ABOUT_TITLE : {
		en : "MyLiveDiet v" + appVersion,
		pt : "MyLiveDiet v" + appVersion,
		de : "MyLiveDiet v" + appVersion,
		es : "MyLiveDiet v" + appVersion,
		fr : "MyLiveDiet v" + appVersion,
		it : "MyLiveDiet v" + appVersion,
		ja : "MyLiveDiet v" + appVersion,
		ko : "MyLiveDiet v" + appVersion,
		ro : "MyLiveDiet v" + appVersion,
		ru : "MyLiveDiet v" + appVersion,
		zh : "MyLiveDiet v" + appVersion
	},
	ABOUT_DIALOG : {
		en : "Developed by André Cancian",
		pt : "Desenvolvido por André Cancian",
		de : 'Entwickelt von André Cancian',
		es : 'Desarrollado por André Cancian',
		fr : 'Développé par André Cancian',
		it : 'Sviluppato da André Cancian',
		ja : 'André Cancian開発',
		ko : '개발자: André Cancian',
		ro : 'Dezvoltat de André Cancian',
		ru : 'РРазработано Андре Канчиан',
		zh : '由AndréCancian开发'
	},
	RESET_COUNTER_TITLE : {
		en : "reset counter",
		pt : "reiniciar contador",
		de : 'Zähler zurücksetzen',
		es : 'reiniciar contador',
		fr : 'réinitialiser le compteur',
		it : 'azzerare il contatore',
		ja : 'カウンターのリセット',
		ko : '카운터 리셋',
		ro : 'reseta counter',
		ru : 'Перезагрузить счётчик',
		zh : '重置计数器'
	},
	RESET_ENTRY_TITLE : {
		en : "Reset entry value",
		pt : "Resetar entrada",
		de : 'Eingabewert zurücksetzen',
		es : 'Restablecer valor introducido',
		fr : 'Réinitialiser la valeur d\'entrée',
		it : 'Ripristina valore di iscrizione',
		ja : 'エントリ値のリセット',
		ko : '입력값 리셋',
		ro : 'Reset valoare de intrare',
		ru : 'Сброс значения записи',
		zh : '重置输入的值'
	},
	BLANK_FIELD_TITLE : {
		en : "Required fields have been left blank.",
		pt : "Campos obrigatórios foram deixados em branco.",
		de : 'Erforderliche Felder sind leer geblieben.',
		es : 'Los campos obligatorios están en blanco.',
		fr : 'Des champs obligatoires sont vides.',
		it : 'I campi obbligatori sono state lasciate in bianco.',
		ja : '必須項目が入力されていません。',
		ko : '필수 입력칸이 비었습니다.',
		ro : 'Câmpurile necesare au fost lăsate goale.',
		ru : 'Поля, необходимые для заполнения, оставлены пустыми.',
		zh : '必填栏位已被留空。'
	},
	BLANK_FIELD_DIALOG : {
		en : "The missing information is highlighted in red.",
		pt : "A informação em falta está destacada em vermelho.",
		de : 'Die fehlende Information ist rot markiert.',
		es : 'La información que falta se resalta en rojo.',
		fr : 'Les informations manquantes sont surlignées en rouge.',
		it : 'Le informazioni mancanti è evidenziata in rosso.',
		ja : '赤字で強調した部分が必要事項です。',
		ko : '빈 입력칸은 붉게 표시되어 있습니다.',
		ro : 'Informațiile lipsă este evidențiată în roșu.',
		ru : 'Отсутствующая информация отмечена красным.',
		zh : '缺少的信息以红色高亮显示。'
	},
	CLEAR_ALL_TITLE : {
		en : "clear all entries",
		pt : "limpar todos itens",
		de : 'Alle Einträge löschen',
		es : 'eliminar todos',
		fr : 'effacer toutes les entrées',
		it : 'deselezionare tutte le voci',
		ja : 'すべてのエントリーをクリア',
		ko : '모든 입력값 지우기',
		ro : 'șterge toate intrările',
		ru : 'очистить все записи',
		zh : '清除所有条目'
	},
	MEASURE_SYSTEM : {
		en : "System of measurement",
		pt : "Sistema de medição",
		de : 'Einheitensystem',
		es : 'Sistema de medición',
		fr : 'Système de mesure',
		it : 'Sistema di misurazione',
		ja : '測定方式',
		ko : '정방법',
		ro : 'Sistem de măsurare',
		ru : 'Система измерения',
		zh : '测量系统'
	},
	MEASURE_SYSTEM_INFO : {
		en : "(height, weight etc.)",
		pt : "(peso, altura, etc.)",
		de : '(Größe, Gewicht etc.)',
		es : '(altura, peso, etc)',
		fr : '(taille, poids, etc)',
		it : '(Altezza, peso, ecc)',
		ja : '（身長、体重など）',
		ko : '(키, 무게 등)',
		ro : '(înălțime, greutate etc)',
		ru : '(рост, вес и т.д.)',
		zh : '（身高，体重等）'
	},
	IMPERIAL : {
		en : "imperial",
		pt : "imperial",
		de : 'Angloamerikanisch',
		es : 'imperial',
		fr : 'impérial',
		it : 'imperiale',
		ja : '英国法定標準',
		ko : '파운드법',
		ro : 'imperial',
		ru : 'стандарт',
		zh : '纸张尺寸'
	},
	METRIC : {
		en : "metric",
		pt : "métrico",
		de : 'Metrisch',
		es : 'métrico',
		fr : 'métrique',
		it : 'metrico',
		ja : 'メートル法',
		ko : '미터법',
		ro : 'metric',
		ru : 'метрика',
		zh : '公制'
	},
	SETTINGS_FEEDBACK : {
		en : "Support Forum",
		pt : "Fórum de Suporte",
		de : 'Support-Forum',
		es : 'Foro de Soporte',
		fr : 'Forum d\'aide',
		it : 'Forum di Supporto',
		ja : 'サポート掲示板',
		ko : '지원 포럼',
		ro : 'Suport Forum',
		ru : 'Форум поддержки',
		zh : '支持论坛'
	},
	SETTINGS_FEEDBACK_INFO : {
		en : "Post ideas and get support",
		pt : "Poste ideias e tire dúvidas",
		de : 'Senden Sie Ideen ein und erhalten Sie Unterstützung',
		es : 'Publique su opinión y obtenga respuesta',
		fr : 'Donnez-nous des idées et obtenez de l\'aide',
		it : 'Posta idee e ottenere sostegno',
		ja : '意見を投稿して、サポートしてもらいましょう',
		ko : '아이디어 제공 및 지원받기',
		ro : 'Posta idei și obține sprijin',
		ru : 'Поделитесь своими идеями и получите помощь',
		zh : '发表观点，并获得支持'
	},
	SETTINGS_REVIEW : {
		en : "Rate this App",
		pt : "Avalie este App",
		de : 'Diese App bewerten',
		es : 'Valore esta Aplicación',
		fr : 'Évaluer cette aplication',
		it : 'Vota questa applicazione',
		ja : 'このアプリを評価する',
		ko : '앱 평가하기',
		ro : 'Evaluați acest App',
		ru : 'Оцените данное приложение',
		zh : '为该应用程序评分'
	},
	SETTINGS_REVIEW_INFO : {
		en : "Your opinion is important to us",
		pt : "Sua opinião é importante para nós",
		de : 'Ihre Meinung ist uns wichtig',
		es : 'Su opinión es importante para nosotros',
		fr : 'Votre opinion est importante pour nous',
		it : 'La tua opinione è importante per noi',
		ja : '貴重なご意見として承ります',
		ko : '여러분의 의견은 소중합니다.',
		ro : 'Opinia dumneavoastră este importantă pentru noi',
		ru : 'Ваше мнение важно для нас.',
		zh : '你的意见对我们很重要'
	},	
	SETTINGS_BACKUP : {
		en : "Automatic Backup",
		pt : "Backup Automático",
		de : 'Automatische Sicherung',
		es : 'Copia de seguridad automática',
		fr : 'Sauvegarde automatique',
		it : 'Backup automatico',
		ja : '自動バックアップ',
		ko : '자동 백업',
		ro : 'Backup Automat',
		ru : 'Автоматическое резервное копирование',
		zh : '自动备份'
	},
	SETTINGS_BACKUP_INFO : {
		en : "Keep your data safe and synced",
		pt : "Mantenha seus dados seguros e sincronizados",
		de : 'Halten Sie Ihre Daten sicher und synchron',
		es : 'Mantenga sus datos seguros y sincronizados',
		fr : 'Gardez vos données sécurisés et synchronisées',
		it : 'Mantenere i vostri dati al sicuro e sincronizzati',
		ja : 'データを安全に保存して同期してください',
		ko : '데이터를 안전하게 동기화하세요.',
		ro : 'Menține datele în siguranță și sincronizate',
		ru : 'Храните ваши данные в безопасности и синхронизируйте их',
		zh : '保持你的数据安全并同步'
	},
	SETTINGS_BACKUP_INFO_LOGGED_AS : {
		en : "Logged in as ",
		pt : "Conectado como ",
		de : 'Angemeldet als ',
		es : 'Conectado como ',
		fr : 'Connecté en tant que ',
		it : 'Collegato come ',
		ja : 'としてログイン中 ',
		ko : '로그인 ',
		ro : 'conectat ca ',
		ru : 'Зашли как ',
		zh : '登入身份为 '
	},
	LOGOUT_TITLE : {
		en : "Turn off automatic backup",
		pt : "Desativar backup automático",
		de : 'Automatische Sicherung deaktivieren',
		es : 'Desactivar copia de seguridad automática',
		fr : 'Désactiver la sauvegarde automatique',
		it : 'Disattivare il backup automatico',
		ja : '自動バックアップをオフにする',
		ko : '자동 백업 끄기',
		ro : 'Dezactivați backup automat',
		ru : 'отключить автоматическое резервное копирование',
		zh : '关闭自动备份'
	},	
	LAST_SYNC : {
		en : "last sync",
		pt : "última sincronização",
		de : 'Letzte Synchronisierung',
		es : 'última sincronización',
		fr : 'dernière synchronisation',
		it : 'ultima sincronizzazione',
		ja : '前回の同期',
		ko : '마지막 동기화',
		ro : 'ultima sincronizare',
		ru : 'Последняя синхронизация',
		zh : '上次同步'
	},
	SETTINGS_HELP : {
		en : "Help",
		pt : "Ajuda",
		de : 'Hilfe',
		es : 'Ayuda',
		fr : 'Aide',
		it : 'Aiuto',
		ja : 'ヘルプ',
		ko : '도움말',
		ro : 'Ajuta',
		ru : 'Помощь',
		zh : '帮助'
	},
	SETTINGS_HELP_INFO : {
		en : "Topics to help you get started",
		pt : "Respostas para as dúvidas frequentes",
		de : 'Themen, die Ihnen den Einstieg erleichtern',
		es : 'Temas que le ayudarán a empezar',
		fr : 'Pour bien démarrer',
		it : 'Argomenti per aiutarti a iniziare',
		ja : '開始に役立つトピックス',
		ko : '시작 도움말',
		ro : 'Răspunsuri la întrebări frecvente',
		ru : 'Инструкции для начала работы',
		zh : '帮助你开始的话题'
	},
	SETTINGS_CONTACT : {
		en : "Contact us",
		pt : "Contato",
		de : 'Kontakt',
		es : 'Contáctenos',
		fr : 'Contact',
		it : 'Contattaci',
		ja : 'お問い合わせ',
		ko : '개발자',
		ro : 'Contactaţi-ne',
		ru : 'Связаться с нами',
		zh : '联系我们'
	},
	SETTINGS_ABOUT : {
		en : "About",
		pt : "Sobre",
		de : 'Über',
		es : 'Acerca de',
		fr : 'À propos',
		it : 'Circa',
		ja : '約',
		ko : '소개',
		ro : 'Despre',
		ru : 'О нас',
		zh : '关于'
	},
	MALE : {
		en : "male",
		pt : "masculino",
		de : 'männlich',
		es : 'masculino',
		fr : 'homme',
		it : 'maschio',
		ja : '男性',
		ko : '남성',
		ro : 'masculin',
		ru : 'мужской',
		zh : '男'
	},
	FEMALE : {
		en : "female",
		pt : "feminino",
		de : 'weiblich',
		es : 'femenino',
		fr : 'femme',
		it : 'femmina',
		ja : '女性',
		ko : '여성',
		ro : 'femeie',
		ru : 'женский',
		zh : '女'
	},
	YOUR_GENDER : {
		en : "Your gender",
		pt : "Gênero",
		de : 'Ihr Geschlecht',
		es : 'Su género',
		fr : 'Votre sexe',
		it : 'Il tuo sesso',
		ja : '性別',
		ko : '성별',
		ro : 'Sexul dvs.',
		ru : 'Ваш пол',
		zh : '你的性别'
	},
	YOUR_HEIGHT : {
		en : "Your height",
		pt : "Altura",
		de : 'Ihre Körpergröße',
		es : 'Su altura',
		fr : 'Votre taille',
		it : 'La sua altezza',
		ja : '身長',
		ko : '키',
		ro : 'Înălţimea Dvs.',
		ru : 'Ваш рост',
		zh : '你的身高'
	},
	YOUR_WEIGHT : {
		en : "Your weight",
		pt : "Peso",
		de : 'Ihr Gewicht',
		es : 'Su peso',
		fr : 'Votre poids',
		it : 'Il tuo peso',
		ja : '体重',
		ko : '몸무게',
		ro : 'Greutatea dvs.',
		ru : 'Ваш вес',
		zh : '你的体重'
	},
	YOUR_AGE : {
		en : "Your age",
		pt : "Idade",
		de : 'Ihr Alter',
		es : 'Su edad',
		fr : 'Votre âge',
		it : 'La tua età',
		ja : '年齢',
		ko : '나이',
		ro : 'Varsta ta',
		ru : 'Ваш возраст',
		zh : '你的年龄'
	},
	YOUR_ACTIVITY : {
		en : "Your Activity",
		pt : "Nível de atividade",
		de : 'Ihre Aktivität',
		es : 'Su Actividad',
		fr : 'Votre activité',
		it : 'La tua attività',
		ja : 'アクティビティ',
		ko : '활동',
		ro : 'Activitatea dumneavoastră',
		ru : 'Ваша деятельность',
		zh : '你的活动状态'
	},
	YOUR_ACTIVITY_OPTION1 : {
		en : "Sedentary: Mostly sitting down (desk job, designer)",
		pt : "Sedentário: Quase sempre sentado (designer, escritor)",
		de : 'Bewegungsmangel: Meistens sitzend (Schreibtisch-Job, Designer)',
		es : 'Sedentario: principalmente sentado (trabajo de oficina, diseñador)',
		fr : 'Sédentaire : surtout assis (emploi de bureau)',
		it : 'Sedentario: Principalmente seduto (lavoro d\'ufficio, designer)',
		ja : 'あまり体を動かさない:大抵座っている（事務職、デザイナー）',
		ko : '정적: 거의 앉아 있음 (사무직, 디자이너)',
		ro : 'Sedentar: Aproape sta jos (de locuri de muncă de birou, proiectant)',
		ru : 'Сидячий образ жизни : в основном в положении сидя (работа за компьютером, дизайнер)',
		zh : '固定不动：大部分是坐着（办公室工作，设计师）'
	},
	YOUR_ACTIVITY_OPTION2 : {
		en : "Lightly Active: Occasionally sitting (teacher, salesman)",
		pt : "Pouco Ativo: Ocasionalmente sentado (professor, vendedor)",
		de : 'Leicht aktiv: Gelegentlich sitzend (Lehrer, Verkäufer)',
		es : 'Ligeramente activo: se sienta de vez en cuando (profesor, vendedor)',
		fr : 'Un peu actif : parfois assis (vendeur, enseignant)',
		it : 'Leggermente attivo: Di tanto in tanto si siede (insegnante, venditore)',
		ja : '少し活動的：時々座る（教師、セールスマン）',
		ko : '약간 활동적: 가끔 앉음 (선생님, 세일즈맨)',
		ro : 'Ușor Activ: Ocazional ședinței (profesor, vânzător)',
		ru : 'Небольшая активность: иногда сидячая (преподаватель, продавец)',
		zh : '稍微活动：偶尔坐着（教师，销售人员）'
	},
	YOUR_ACTIVITY_OPTION3 : {
		en : "Active: Walking most of the time (waitress, mailman)",
		pt : "Ativo: Caminhando quase sempre (carteiro, garçonete)",
		de : 'Aktiv: Meistens laufend (Bedienung, Briefträger)',
		es : 'Activo: camina la mayor parte del tiempo (camarera, cartero)',
		fr : 'Actif : emploi physique (serveur, facteur)',
		it : 'Attivo: Camminando la maggior parte del tempo (cameriera, postino)',
		ja : '活動的：大抵歩いている（ウエイトレス、郵便配達人）',
		ko : '활동적: 거의 걸어다님 (승무원, 집배원)',
		ro : 'Activ: Plimbare cele mai multe ori (chelneriță, poștaș)',
		ru : 'Активная: большая часть времени в движении (официант, почтальон)',
		zh : '活跃的：大部分时间都在走动（服务员，邮差）'
	},
	YOUR_ACTIVITY_OPTION4 : {
		en : "Very Active: Physically hard work (construction worker)",
		pt : "Muito Ativo: Trabalho fisicamente extenuante (pedreiro, carregador)",
		de : 'Sehr aktiv: Körperlich harte Arbeit (Bauarbeiter)',
		es : 'Muy activo: trabajo físico duro (trabajador de la construcción)',
		fr : 'Très actif : emploi très physique (maçon)',
		it : 'Molto attivo: Fisicamente duro lavoro (operaio edile)',
		ja : '非常に活動的：重労働（建設作業員）',
		ko : '아주 활동적: 육체노동 (건설노동자)',
		ro : 'Foarte activă: lucru fizic greu (muncitor în construcții)',
		ru : 'Очень активная: тяжёлый физический труд (строитель)',
		zh : '非常活跃：繁重的体力劳动者（建筑工人）'
	},
	KEEP_WEIGHT : {
		en : "Keep current weight:",
		pt : "Manter peso atual:",
		de : 'Aktuelles Gewicht halten:',
		es : 'Mantener peso actual:',
		fr : 'Conserver poids actuel :',
		it : 'Mantenere il peso attuale:',
		ja : '現在の体重を維持する：',
		ko : '현재 몸무게 유지:',
		ro : '',
		ru : 'Держите текущий вес:',
		zh : '保持当前体重：'
	},
	LOSE_WEIGHT : {
		en : "Lose weight by:",
		pt : "Perder peso:",
		de : 'Abnehmen bis:',
		es : 'Bajar peso en:',
		fr : 'Perdre du poids avant le :',
		it : 'Perdere peso:',
		ja : 'キロ体重を落とす：',
		ko : '감량:',
		ro : 'Pierde in greutate:',
		ru : 'сбросить вес с помощью:',
		zh : '用什么样的方式来减肥：'
	},
	GAIN_WEIGHT : {
		en : "Gain weight by:",
		pt : "Ganhar peso:",
		de : 'Zunehmen bis:',
		es : 'Aumentar peso en:',
		fr : 'Gagner du poids avant le :',
		it : 'Aumento di peso:',
		ja : 'キロ体重を増やす：',
		ko : '증가:',
		ro : 'Creștere în greutate',
		ru : 'набрать вес с помощью:',
		zh : '用什么样的方式来增胖：'
	},
	PER_WEEK : {
		en : "per week",
		pt : "por semana",
		de : 'pro Woche',
		es : 'por semana',
		fr : 'par semaine',
		it : 'a settimana',
		ja : '1週間に',
		ko : '주당',
		ro : 'pe săptămână',
		ru : 'в неделю',
		zh : '每周'
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
/////////////////////////
// fallback to english //
/////////////////////////
if(lang != "en" && lang != "pt") { 
	LANG.HELP_TOPICS_ARRAY[lang] = LANG.HELP_TOPICS_ARRAY['en'];
}

