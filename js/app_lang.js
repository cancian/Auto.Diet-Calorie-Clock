var appVersion = "1.1.7 (11703)";
var langArray = /(en|pt|de|es|fr|it|ja|ko|ru|zh)/;
////////////////////
// PREF. LANGUAGE //
////////////////////http://msdn.microsoft.com/en-us/library/ms533052(v=vs.85).aspx
//ru (Русский);
//es (Español)
//de (Deutsch)
//fr (Français)
//zh-CN (简体中文) - zh-TW (繁體中文)
//ko (한국어)
//ja (日本語)
//it ()
var lang = "en";
if (window.navigator.language || navigator.userLanguage) {
	lang = (window.navigator.language || navigator.userLanguage).slice(0, 2).toLowerCase();
}
//dev
if((langArray).test(window.localStorage.getItem("devSetLang"))) { lang = window.localStorage.getItem("devSetLang"); }
//avaliable
if(!lang.match(langArray)) { lang = "en"; }
//lang = 'en';
//lang = 'pt';
//lang = 'de';
//lang = 'es';
//lang = 'fr';
//lang = 'it';
//lang = 'ja';
//lang = 'ko';
//lang = 'ru';
//lang = 'zh';

//bold from delete
//nowrap daily calories
//#//////////////#//
//# STRING ARRAY #//
//#//////////////#//
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
		ru : 'en-US',
		zh : 'en-US'	
	},
	NO_ENTRIES : {
		en : "no entries",
		pt : "nenhum registro",
		de : 'Keine Einträge',
		es : 'no hay entradas',
		fr : 'aucune entrée',
		it : '',
		ja : 'エントリーなし',
		ko : '입력 없음',
		ru : 'Нет записей',
		zh : '无项目'
	},
	EXERCISE : {
		en : "exercise",
		pt : "exercício",
		de : 'Übung',
		es : 'ejercicio',
		fr : 'exercice',
		it : '',
		ja : 'エクササイズ',
		ko : '운동',
		ru : 'Упражнение',
		zh : '运动'
	},
	FOOD : {
		en : "food",
		pt : "alimento",
		de : 'Ernährung',
		es : 'comida',
		fr : 'nourriture',
		it : '',
		ja : '食べ物',
		ko : '음식',
		ru : 'Продукт',
		zh : '食物'
	},
	DESCRIPTION : {
		en : "Description...",
		pt : "Descrição...",
		de : 'Beschreibung...',
		es : 'Descripción...',
		fr : 'Description...',
		it : '',
		ja : '説明...',
		ko : '설명...',
		ru : 'Описание...',
		zh : '描述...'
	},
	ADD_ENTRY : {
		en : "add entry",
		pt : "adicionar",
		de : 'Hinzufügen',
		es : 'añadir',
		fr : 'ajouter',
		it : '',
		ja : 'クイック追加',
		ko : '간단 추가',
		ru : 'добавить',
		zh : '快速添加'
	},
	QUICK_ADD : {
		en : "quick add",
		pt : "adição rápida",
		de : 'Schnelles Hinzufügen',
		es : 'agregar rápidamente',
		fr : 'ajout rapide',
		it : '',
		ja : 'クイック追加',
		ko : '간단 추가',
		ru : 'Быстрое добавление',
		zh : '快速添加'
	},
	ACTIVITY_LOG : {
		en : "activity log",
		pt : "atividades",
		de : 'Aktivitätsprotokoll',
		es : 'registro de actividades',
		fr : 'journal d\'activités',
		it : '',
		ja : 'アクティビティログ',
		ko : '활동 기록',
		ru : 'Журнал действий',
		zh : '活动日志'
	},
	NOW : {
		en : "now",
		pt : "agora",
		de : 'jetzt',
		es : 'ahora',
		fr : 'maintenant',
		it : '',
		ja : '今',
		ko : '현재',
		ru : 'Сейчас',
		zh : '现在'
	},
	HOUR_AGO : {
		en : "hour ago",
		pt : "hora atrás",
		de : 'vor Stunde',
		es : 'hace una hora',
		fr : 'il y a heure',
		it : '',
		ja : '時間前',
		ko : '시간 전',
		ru : 'час назад',
		zh : '小时前'
	},
	HOURS_AGO : {
		en : "hours ago",
		pt : "horas atrás",
		de : 'vor Stunden',
		es : 'hace unas horas',
		fr : 'il y a heures',
		it : '',
		ja : '時間前',
		ko : '시간 전',
		ru : 'часов назад',
		zh : '小时前'
	},
	DAY_AGO : {
		en : "day ago",
		pt : "dia atrás",
		de : 'vor Tag',
		es : 'hace un día',
		fr : 'il y a jour',
		it : '',
		ja : '日前',
		ko : '일 전',
		ru : 'день назад',
		zh : '天前'
	},
	DAYS_AGO : {
		en : "days ago",
		pt : "dias atrás",
		de : 'vor Tagen',
		es : 'hace unos días',
		fr : 'il y a jours',
		it : '',
		ja : '日前',
		ko : '일 전',
		ru : 'дней назад',
		zh : '天前'
	},
	RESET_COUNTER : {
		en : "reset counter",
		pt : "resetar contador",
		de : 'Zähler zurücksetzen',
		es : 'reiniciar contador',
		fr : 'réinitialiser le compteur',
		it : '',
		ja : 'カウンターのリセット',
		ko : '카운터 리셋',
		ru : 'Перезагрузить счётчик',
		zh : '重置计数器'
	},
	MINUTES : {
		en : "minutes",
		pt : "minutos",
		de : 'Minuten',
		es : 'minutos',
		fr : 'minutes',
		it : '',
		ja : '分',
		ko : '분',
		ru : 'минут',
		zh : '分钟'
	},
	HOURS : {
		en : "hours",
		pt : "horas",
		de : 'Stunden',
		es : 'horas',
		fr : 'heures',
		it : '',
		ja : '時間',
		ko : '시간',
		ru : 'часов',
		zh : '小时'
	},
	DAYS : {
		en : "days",
		pt : "dias",
		de : 'Tage',
		es : 'días',
		fr : 'jours',
		it : '',
		ja : '日',
		ko : '일',
		ru : 'дней',
		zh : '天'
	},
	MINUTE : {
		en : "minute",
		pt : "minuto",
		de : 'Minute',
		es : 'minuto',
		fr : 'minute',
		it : '',
		ja : '分',
		ko : '분',
		ru : 'минуту',
		zh : '分钟'
	},
	HOUR : {
		en : "hour",
		pt : "hora",
		de : 'Stunde',
		es : 'hora',
		fr : 'heure',
		it : '',
		ja : '時間',
		ko : '시간',
		ru : 'час',
		zh : '小时'
	},
	DAY : {
		en : "day",
		pt : "dia",
		de : 'Tag',
		es : 'día',
		fr : 'jour',
		it : '',
		ja : '日',
		ko : '일',
		ru : 'день',
		zh : '天'
	},
	AND : {
		en : "and",
		pt : "e",
		de : 'und',
		es : 'y',
		fr : 'et',
		it : '',
		ja : 'と',
		ko : '및',
		ru : 'и',
		zh : '和'
	},
	AGO : {
		en : "ago",
		pt : "atrás",
		de : '',
		es : '',
		fr : '',
		it : '',
		ja : '前',
		ko : '전',
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
		ru : '',
		zh : ''
	},	
	PREPARING_DB : {
		en : "preparing database",
		pt : "inicializando",
		de : 'Bereite Datenbank vor...',
		es : 'preparando base de datos',
		fr : 'préparation de la base de données',
		it : '',
		ja : 'データベースの準備中',
		ko : '데이터베이스 준비',
		ru : 'создание базы данных',
		zh : '准备数据库'
	},
	BEEN_DIETING : {
		en : "Been dieting for",
		pt : "Iniciado há",
		de : 'Auf Diät seit',
		es : 'Oniciado hace',
		fr : 'Au régime depuis',
		it : '',
		ja : 'のためにダイエット中',
		ko : '다이어트 기간',
		ru : 'на диете в течение',
		zh : '已经节食'
	},
	DELETE : {
		en : "Delete",
		pt : "Apagar",
		de : 'Löschen',
		es : 'Eliminar',
		fr : 'Supprimer',
		it : '',
		ja : '削除',
		ko : '삭제',
		ru : 'Удалить',
		zh : '删除'
	},
	SWIPE_TOOLTIP : {
		en : "swipe to get started",
		pt : "deslize para iniciar",
		de : 'Swipen, um loszulegen',
		es : 'deslizar para empezar',
		fr : 'faites glisser pour commencer',
		it : '',
		ja : '開始するにはスワイプ',
		ko : '밀어서 시작하기',
		ru : 'проведите для начала',
		zh : '轻扫以开始'
	},
	ARE_YOU_SURE : {
		en : "are you sure?",
		pt : "confirmar?",
		de : 'Sind Sie sicher?',
		es : '¿está seguro?',
		fr : 'Vraiment?',
		it : '',
		ja : 'よろしいですか？',
		ko : '정말입니까?',
		ru : 'Вы уверены?',
		zh : '你确定吗？'
	},
	WIPE_DIALOG : {
		en : "all data will be erased",
		pt : "todos os dados serão apagados",
		de : 'Alle Daten werden gelöscht',
		es : 'Toda la información será eliminada',
		fr : 'toutes les données seront effacées',
		it : '',
		ja : 'すべてのデータが消去されます',
		ko : '모든 데이터가 삭제됩니다.',
		ru : 'Все данные будут удалены',
		zh : '所有数据都将被删除'
	},
	OK : {
		en : "ok",
		pt : "ok",
		de : 'ok',
		es : 'ok',
		fr : 'ok',
		it : '',
		ja : 'ok',
		ko : '확인',
		ru : 'ok',
		zh : '好'
	},
	CANCEL : {
		en : "cancel",
		pt : "cancelar",
		de : 'Abbrechen',
		es : 'cancelar',
		fr : 'annuler',
		it : '',
		ja : 'キャンセル',
		ko : '취소',
		ru : 'отмена',
		zh : '取消'
	},
	RESET_DIALOG : {
		en : "reset counter",
		pt : "resetar contador",
		de : 'Zähler zurücksetzen',
		es : 'reiniciar contador',
		fr : 'réinitialiser le compteur',
		it : '',
		ja : 'カウンターのリセット',
		ko : '카운터 리셋',
		ru : 'Перезагрузить счётчик',
		zh : '重置计数器'
	},
	RESET_ENTRY_DIALOG : {
		en : "Reset entry value",
		pt : "Resetar entrada",
		de : 'Eingabewert zurücksetzen',
		es : 'Restablecer valor introducido',
		fr : 'Réinitialiser la valeur d\'entrée',
		it : '',
		ja : 'エントリ値のリセット',
		ko : '입력값 리셋',
		ru : 'Сброс значения записи',
		zh : '重置输入的值'
	},
	FOOD_SEARCH : {
		en : "Food search... (100g)",
		pt : "Buscar alimento... (100g)",
		de : 'Lebensmittelsuche... (100 g)',
		es : 'Buscar comida... (100g)',
		fr : 'Recherche de nourriture (100g)',
		it : '',
		ja : '食べ物検索... (100g)', //（100グラム）',
		ko : '음식 찾기... (100g)',
		ru : 'поиск продуктов (100 г)', 
		zh : '食物搜索... （100克）'
	},
	NO_MATCHES : {
		en : "no matches",
		pt : "nenhum resultado",
		de : 'Keine Treffer',
		es : 'Sin coincidencias',
		fr : 'aucune correspondance',
		it : '',
		ja : '該当なし',
		ko : '일치 정보 없음',
		ru : 'Соответствий не найдено',
		zh : '无匹配'
	},
	EXERCISE_SEARCH : {
		en : "Exercise search... (30 min)",
		pt : "Buscar exercício... (30 min)",
		de : 'Übungssuche... (30 Min.)',
		es : 'Buscar ejercicio ... (30 min)',
		fr : 'Recherche d\'exercice (30 min)',
		it : '',
		ja : 'エクササイズ検索... （30分）',
		ko : '운동 찾기 (30분)',
		ru : 'Поиск упражнений (30 мин.)',
		zh : '运动搜索... （30分钟）'
	},
	MIN : {
		en : "min",
		pt : "min",
		de : 'Min',
		es : 'min',
		fr : 'min',
		it : '',
		ja : '分',
		ko : '분',
		ru : 'мин.',
		zh : '分钟'
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
		ru : 'ккал',
		zh : '千卡'   //千卡
	},	
	CALORIE : {
		en : "calorie",
		pt : "calorias",
		de : 'Kalorie',
		es : 'caloría',
		fr : 'calorie',
		it : 'caloria',
		ja : 'カロリー',
		ko : '칼로리',
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
		ru : 'калорий.',
		zh : '卡路里'
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
		ru : 'г', 
		zh : '克'
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
		ru : 'кг', 
		zh : '公斤'
	},
	LB : {
		en : "lb",
		pt : "lb",
		de : 'lb',
		es : 'lb',
		fr : 'lb',
		it : '',
		ja : 'ポンド',
		ko : '파운드',
		ru : 'фунтов', 
		zh : '磅'
	},
	ENTRY_HISTORY : {
		en : "Recent activities",
		pt : "Atividades recentes",
		de : 'Neueste Aktivitäten',
		es : 'Actividades recientes',
		fr : 'Activités récentes',
		it : '',
		ja : '最近のアクティビティ',
		ko : '최근 활동',
		ru : 'Последние действия',
		zh : '最近活动'
	},
	PRO : {
		en : "pro",
		pt : "pro",
		de : 'Pro',
		es : 'pro',
		fr : 'pro',
		it : '',
		ja : 'タンパク',
		ko : '단백질',
		ru : 'белок',
		zh : '蛋白质'
	},
	CAR : {
		en : "car",
		pt : "car",
		de : 'Kol',
		es : 'car',
		fr : 'glu',
		it : '',
		ja : '炭水化物',
		ko : '탄수화물',
		ru : 'углевод',
		zh : '糖类'
	},
	FAT : {
		en : "fat",
		pt : "gor",
		de : 'Fet',
		es : 'gra',
		fr : 'gra',
		it : '',
		ja : '脂肪',
		ko : '지방',
		ru : 'жир',
		zh : '脂肪'
	},
	PRE_FILL : {
		en : "pre-fill",
		pt : "preencher",
		de : 'Vorfüllen',
		es : 'completar',
		fr : 'pré-remplir',
		it : '',
		ja : '自動入力',
		ko : '자동 채우기',
		ru : 'предварительное заполнение',
		zh : '预充'
	},
	ADD : {
		en : "add",
		pt : "adicionar",
		de : 'Hinzufügen',
		es : 'añadir',
		fr : 'ajouter',
		it : '',
		ja : '追加',
		ko : '추가',
		ru : 'добавить',
		zh : '添加'
	},
	GRAMS : {
		en : "grams",
		pt : "gramas",
		de : 'Gramm',
		es : 'gramos',
		fr : 'grammes',
		it : '',
		ja : 'グラム',
		ko : '그램',
		ru : 'граммов',
		zh : '克'
	},
	SURPLUS : {
		en : "surplus",
		pt : "excesso",
		de : 'Überschuss',
		es : 'exceso',
		fr : 'excédent',
		it : '',
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
		it : '',
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
		it : '',
		ja : 'バランスの取れた',
		ko : '균형',
		ru : 'сбалансированная',
		zh : '均衡'
	},
	ERROR : {
		en : "ERROR!",
		pt : "ERRO!",
		de : 'FEHLER!',
		es : '¡ERROR!',
		fr : 'ERREUR !',
		it : '',
		ja : 'エラー！',
		ko : '에러!',
		ru : 'ОШИБКА!',
		zh : '错误！'
	},
	STOP : {
		en : "STOP!",
		pt : "PARE!",
		de : 'STOPP!',
		es : '¡PARAR!',
		fr : 'STOP !',
		it : '',
		ja : 'ストップ！',
		ko : '멈추시오!',
		ru : 'ОСТАНОВИТЬСЯ!',
		zh : '停！'
	},
	EQ_TIME : {
		en : "eq. time",
		pt : "tempo eq.",
		de : 'entspricht Zeit',
		es : 'tiempo eq.',
		fr : 'temps d\'éq.',
		it : '',
		ja : '等価時間',
		ko : '동일 시간',
		ru : 'экв. время',
		zh : '等于时间'
	},
	RANGE : {
		en : "range",
		pt : "(amplitude)",
		de : 'Bereich',
		es : 'rango',
		fr : 'plage',
		it : '',
		ja : '範囲',
		ko : '범위',
		ru : 'Диапазон',
		zh : '范围'
	},
	START_DATE : {
		en : "start date",
		pt : "data inicial",
		de : 'Startdatum',
		es : 'fecha de inicio',
		fr : 'date de début',
		it : '',
		ja : '開始日',
		ko : '시작일',
		ru : 'Дата начала',
		zh : '开始日期'
	},
	STATUS : {
		en : "status",
		pt : "status",
		de : 'Status',
		es : 'estado',
		fr : 'statut',
		it : '',
		ja : 'ステータス',
		ko : '상태',
		ru : 'Состояние',
		zh : '状态'
	},
	DIARY : {
		en : "diary",
		pt : "diário",
		de : 'Tagebuch',
		es : 'diario',
		fr : 'journal',
		it : '',
		ja : '日記',
		ko : '일기',
		ru : 'Дневник',
		zh : '日志'
	},
	PROFILE : {
		en : "profile",
		pt : "perfil",
		de : 'Profil',
		es : 'perfil',
		fr : 'profil',
		it : '',
		ja : 'プロフィール',
		ko : '프로필',
		ru : 'профиль',
		zh : '资料'
	},
	SETTINGS : {
		en : "settings",
		pt : "configurar",
		de : 'Einstellungen',
		es : 'ajustes',
		fr : 'paramètres',
		it : '',
		ja : '設定',
		ko : '설정',
		ru : 'настройки',
		zh : '设置'
	},
	MEASURE_SYSTEM : {
		en : "System of measurement",
		pt : "Sistema de medição",
		de : 'Einheitensystem',
		es : 'Sistema de medición',
		fr : 'Système de mesure',
		it : '',
		ja : '測定方式',
		ko : '정방법',
		ru : 'Система измерения',
		zh : '测量系统'
	},
	MEASURE_SYSTEM_INFO : {
		en : "(height, weight etc.)",
		pt : "(peso, altura, etc.)",
		de : '(Größe, Gewicht etc.)',
		es : '(altura, peso, etc)',
		fr : '(taille, poids, etc)',
		it : '',
		ja : '（身長、体重など）',
		ko : '(키, 무게 등)',
		ru : '(рост, вес и т.д.)',
		zh : '（身高，体重等）'
	},
	IMPERIAL : {
		en : "imperial",
		pt : "imperial",
		de : 'Angloamerikanisch',
		es : 'imperial',
		fr : 'impérial',
		it : '',
		ja : '英国法定標準',
		ko : '파운드법',
		ru : 'стандарт',
		zh : '纸张尺寸'
	},
	METRIC : {
		en : "metric",
		pt : "métrico",
		de : 'Metrisch',
		es : 'métrico',
		fr : 'métrique',
		it : '',
		ja : 'メートル法',
		ko : '미터법',
		ru : 'метрика',
		zh : '公制'
	},
	SETTINGS_CONTACT : {
		en : "Contact us",
		pt : "Contato",
		de : 'Kontakt',
		es : 'Contáctenos',
		fr : 'Contact',
		it : '',
		ja : 'お問い合わせ',
		ko : '개발자',
		ru : 'Связаться с нами',
		zh : '联系我们'
	},
	SETTINGS_ABOUT : {
		en : "About",
		pt : "Sobre",
		de : 'Über',
		es : 'Acerca de',
		fr : 'À propos',
		it : '',
		ja : '約',
		ko : '소개',
		ru : 'О нас',
		zh : '关于'
	},
	SETTINGS_FEEDBACK : {
		en : "Support Forum",
		pt : "Fórum de Suporte",
		de : 'Support-Forum',
		es : 'Foro de Soporte',
		fr : 'Forum d\'aide',
		it : '',
		ja : 'サポート掲示板',
		ko : '지원 포럼',
		ru : 'Форум поддержки',
		zh : '支持论坛'
	},
	SETTINGS_FEEDBACK_INFO : {
		en : "Post ideas and get support",
		pt : "Poste ideias e tire dúvidas",
		de : 'Senden Sie Ideen ein und erhalten Sie Unterstützung',
		es : 'Publique su opinión y obtenga respuesta',
		fr : 'Donnez-nous des idées et obtenez de l\'aide',
		it : '',
		ja : '意見を投稿して、サポートしてもらいましょう',
		ko : '아이디어 제공 및 지원받기',
		ru : 'Поделитесь своими идеями и получите помощь',
		zh : '发表观点，并获得支持'
	},
	SETTINGS_REVIEW : {
		en : "Rate this App",
		pt : "Avalie este App",
		de : 'Diese App bewerten',
		es : 'Valore esta Aplicación',
		fr : 'Évaluer cette aplication',
		it : '',
		ja : 'このアプリを評価する',
		ko : '앱 평가하기',
		ru : 'Оцените данное приложение',
		zh : '为该应用程序评分'
	},
	SETTINGS_REVIEW_INFO : {
		en : "Your opinion is important to us",
		pt : "Sua opinião é importante para nós",
		de : 'Ihre Meinung ist uns wichtig',
		es : 'Su opinión es importante para nosotros',
		fr : 'Votre opinion est importante pour nous',
		it : '',
		ja : '貴重なご意見として承ります',
		ko : '여러분의 의견은 소중합니다.',
		ru : 'Ваше мнение важно для нас.',
		zh : '你的意见对我们很重要'
	},
	SETTINGS_FACEBOOK : {
		en : "Keep your data safe and synced",
		pt : "Mantenha seus dados seguros e sincronizados",
		de : 'Halten Sie Ihre Daten sicher und synchron',
		es : 'Mantenga sus datos seguros y sincronizados',
		fr : 'Gardez vos données sécurisés et synchronisées',
		it : '',
		ja : 'データを安全に保存して同期してください',
		ko : '데이터를 안전하게 동기화하세요.',
		ru : 'Храните ваши данные в безопасности и синхронизируйте их',
		zh : '保持你的数据安全并同步'
	},
	SETTINGS_FACEBOOK_LOGGED : {
		en : "Logged in as ",
		pt : "Conectado como ",
		de : 'Angemeldet als ',
		es : 'Conectado como ',
		fr : 'Connecté en tant que ',
		it : '',
		ja : 'としてログイン中 ',
		ko : '로그인 ',
		ru : 'Зашли как ',
		zh : '登入身份为 '
	},
	SETTINGS_HELP : {
		en : "Help",
		pt : "Ajuda",
		de : 'Hilfe',
		es : 'Ayuda',
		fr : 'Aide',
		it : '',
		ja : 'ヘルプ',
		ko : '도움말',
		ru : 'Помощь',
		zh : '帮助'
	},
	SETTINGS_HELP_INFO : {
		en : "Topics to help you get started",
		pt : "Respostas para as dúvidas frequentes",
		de : 'Themen, die Ihnen den Einstieg erleichtern',
		es : 'Temas que le ayudarán a empezar',
		fr : 'Pour bien démarrer',
		it : '',
		ja : '開始に役立つトピックス',
		ko : '시작 도움말',
		ru : 'Инструкции для начала работы',
		zh : '帮助你开始的话题'
	},
	SETTINGS_RESET : {
		en : "Reset settings",
		pt : "Apagar configurações",
		de : 'Einstellungen zurücksetzen',
		es : 'Restablecer configuración',
		fr : 'Réinitialiser les paramètres',
		it : '',
		ja : '設定のリセット',
		ko : '설정 리셋',
		ru : 'Сбросить настройки',
		zh : '重新设置'
	},
	SETTINGS_SYNC : {
		en : "Automatic Backup",
		pt : "Backup Automático",
		de : 'Automatische Sicherung',
		es : 'Copia de seguridad automática',
		fr : 'Sauvegarde automatique',
		it : '',
		ja : '自動バックアップ',
		ko : '자동 백업',
		ru : 'Автоматическое резервное копирование',
		zh : '自动备份'
	},
	SETTINGS_SYNC_INFO : {
		en : "Keep your data safe and synced",
		pt : "Mantenha seus dados seguros e sincronizados",
		de : 'Halten Sie Ihre Daten sicher und synchron',
		es : 'Mantenga sus datos seguros sincronizados',
		fr : 'Gardez vos données sécurisés et synchronisées',
		it : '',
		ja : 'データを安全に保存して同期してください',
		ko : '데이터를 안전하게 동기화하세요.',
		ru : 'Храните ваши данные в безопасности и синхронизируйте их.',
		zh : '保持你的数据安全并同步'
	},
	LAST_SYNC : {
		en : "last sync",
		pt : "última sincronização",
		de : 'Letzte Synchronisierung',
		es : 'última sincronización',
		fr : 'dernière synchronisation',
		it : '',
		ja : '前回の同期',
		ko : '마지막 동기화',
		ru : 'Последняя синхронизация',
		zh : '上次同步'
	},
	ABOUT_TITLE : {
		en : "MyLiveDiet v" + appVersion,
		pt : "MyLiveDiet v" + appVersion,
		de : "MyLiveDiet v" + appVersion,
		es : "MyLiveDiet v" + appVersion,
		fr : "MyLiveDiet v" + appVersion,
		it : '',
		ja : "MyLiveDiet v" + appVersion,
		ko : "MyLiveDiet v" + appVersion,
		ru : "MyLiveDiet v" + appVersion,
		zh : "MyLiveDiet v" + appVersion
	},
	ABOUT_DIALOG : {
		en : "Developed by André Cancian",
		pt : "Desenvolvido por André Cancian",
		de : 'Entwickelt von André Cancian',
		es : 'Desarrollado por André Cancian',
		fr : 'Développé par André Cancian',
		it : '',
		ja : 'André Cancian開発',
		ko : '개발자: André Cancian',
		ru : 'РРазработано Андре Канчиан',
		zh : '由AndréCancian开发'
	},
	WEIGHT_LOSS : {
		en : "weight loss",
		pt : "perda de peso",
		de : 'Gewichtsverlust',
		es : 'pérdida de peso',
		fr : 'perte de poids',
		it : '',
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
		it : '',
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
		it : '',
		ja : 'カロリー収支',
		ko : '칼로리 밸런스',
		ru : 'баланс калорий',
		zh : '热量平衡'
	},
	RESET : {
		en : "reset",
		pt : "resetar",
		de : 'Zurücksetzen',
		es : 'reiniciar',
		fr : 'réinitialiser',
		it : '',
		ja : 'リセット',
		ko : '리셋',
		ru : 'перезагрузка',
		zh : '重置'
	},
	START : {
		en : "start",
		pt : "iniciar",
		de : 'Start',
		es : 'iniciar',
		fr : 'commencer',
		it : '',
		ja : 'スタート',
		ko : '시작',
		ru : 'начать',
		zh : '开始'
	},
	MALE : {
		en : "male",
		pt : "masculino",
		de : 'männlich',
		es : 'masculino',
		fr : 'homme',
		it : '',
		ja : '男性',
		ko : '남성',
		ru : 'мужской',
		zh : '男'
	},
	FEMALE : {
		en : "female",
		pt : "feminino",
		de : 'weiblich',
		es : 'femenino',
		fr : 'femme',
		it : '',
		ja : '女性',
		ko : '여성',
		ru : 'женский',
		zh : '女'
	},
	YOUR_GENDER : {
		en : "Your gender",
		pt : "Gênero",
		de : 'Ihr Geschlecht',
		es : 'Su género',
		fr : 'Votre sexe',
		it : '',
		ja : '性別',
		ko : '성별',
		ru : 'Ваш пол',
		zh : '你的性别'
	},
	YOUR_HEIGHT : {
		en : "Your height",
		pt : "Altura",
		de : 'Ihre Körpergröße',
		es : 'Su altura',
		fr : 'Votre taille',
		it : '',
		ja : '身長',
		ko : '키',
		ru : 'Ваш рост',
		zh : '你的身高'
	},
	YOUR_WEIGHT : {
		en : "Your weight",
		pt : "Peso",
		de : 'Ihr Gewicht',
		es : 'Su peso',
		fr : 'Votre poids',
		it : '',
		ja : '体重',
		ko : '몸무게',
		ru : 'Ваш вес',
		zh : '你的体重'
	},
	YOUR_AGE : {
		en : "Your age",
		pt : "Idade",
		de : 'Ihr Alter',
		es : 'Su edad',
		fr : 'Votre âge',
		it : '',
		ja : '年齢',
		ko : '나이',
		ru : 'Ваш возраст',
		zh : '你的年龄'
	},
	YOUR_ACTIVITY : {
		en : "Your Activity",
		pt : "Nível de atividade",
		de : 'Ihre Aktivität',
		es : 'Su Actividad',
		fr : 'Votre activité',
		it : '',
		ja : 'アクティビティ',
		ko : '활동',
		ru : 'Ваша деятельность',
		zh : '你的活动状态'
	},
	YOUR_ACTIVITY_OPTION1 : {
		en : "Sedentary: Mostly sitting down (desk job, designer)",
		pt : "Sedentário: Quase sempre sentado (designer, escritor)",
		de : 'Bewegungsmangel: Meistens sitzend (Schreibtisch-Job, Designer)',
		es : 'Sedentario: principalmente sentado (trabajo de oficina, diseñador)',
		fr : 'Sédentaire : surtout assis (emploi de bureau)',
		it : '',
		ja : 'あまり体を動かさない:大抵座っている（事務職、デザイナー）',
		ko : '정적: 거의 앉아 있음 (사무직, 디자이너)',
		ru : 'Сидячий образ жизни : в основном в положении сидя (работа за компьютером, дизайнер)',
		zh : '固定不动：大部分是坐着（办公室工作，设计师）'
	},
	YOUR_ACTIVITY_OPTION2 : {
		en : "Lightly Active: Occasionally sitting (teacher, salesman)",
		pt : "Pouco Ativo: Ocasionalmente sentado (professor, vendedor)",
		de : 'Leicht aktiv: Gelegentlich sitzend (Lehrer, Verkäufer)',
		es : 'Ligeramente activo: se sienta de vez en cuando (profesor, vendedor)',
		fr : 'Un peu actif : parfois assis (vendeur, enseignant)',
		it : '',
		ja : '少し活動的：時々座る（教師、セールスマン）',
		ko : '약간 활동적: 가끔 앉음 (선생님, 세일즈맨)',
		ru : 'Небольшая активность: иногда сидячая (преподаватель, продавец)',
		zh : '稍微活动：偶尔坐着（教师，销售人员）'
	},
	YOUR_ACTIVITY_OPTION3 : {
		en : "Active: Walking most of the time (waitress, mailman)",
		pt : "Ativo: Caminhando quase sempre (carteiro, garçonete)",
		de : 'Aktiv: Meistens laufend (Bedienung, Briefträger)',
		es : 'Activo: camina la mayor parte del tiempo (camarera, cartero)',
		fr : 'Actif : emploi physique (serveur, facteur)',
		it : '',
		ja : '活動的：大抵歩いている（ウエイトレス、郵便配達人）',
		ko : '활동적: 거의 걸어다님 (승무원, 집배원)',
		ru : 'Активная: большая часть времени в движении (официант, почтальон)',
		zh : '活跃的：大部分时间都在走动（服务员，邮差）'
	},
	YOUR_ACTIVITY_OPTION4 : {
		en : "Very Active: Physically hard work (construction worker)",
		pt : "Muito Ativo: Trabalho fisicamente extenuante (pedreiro, carregador)",
		de : 'Sehr aktiv: Körperlich harte Arbeit (Bauarbeiter)',
		es : 'Muy activo: trabajo físico duro (trabajador de la construcción)',
		fr : 'Très actif : emploi très physique (maçon)',
		it : '',
		ja : '非常に活動的：重労働（建設作業員）',
		ko : '아주 활동적: 육체노동 (건설노동자)',
		ru : 'Очень активная: тяжёлый физический труд (строитель)',
		zh : '非常活跃：繁重的体力劳动者（建筑工人）'
	},
	FEET_INCHES : {
		en : "feet/inches",
		pt : "pés/pol.",
		de : 'Fuß/Zoll',
		es : 'pies/pul.',
		fr : 'pieds/pouces',
		it : '',
		ja : 'フィート/インチ',
		ko : '피트/인치',
		ru : 'Футов/дюймов',
		zh : '英尺/英寸'
	},
	CENTIMETERS : {
		en : "centimeters",
		pt : "centímetros",
		de : 'Zentimeter',
		es : 'centímetros',
		fr : 'centimètres',
		it : '',
		ja : 'センチ',
		ko : '센티미터',
		ru : 'сантиметров',
		zh : '厘米'
	},
	POUNDS : {
		en : "pounds",
		pt : "libras",
		de : 'Pfund',
		es : 'libras',
		fr : 'livres',
		it : '',
		ja : 'ポンド',
		ko : '파운드',
		ru : 'фунтов',
		zh : '磅'
	},
	KILOGRAMS : {
		en : "kilograms",
		pt : "kilogramas",
		de : 'Kilogramm',
		es : 'kilogramos',
		fr : 'kilogrammes',
		it : '',
		ja : 'キロ',
		ko : '킬로그램',
		ru : 'килограммов',
		zh : '公斤'
	},
	KEEP_WEIGHT : {
		en : "Keep current weight:",
		pt : "Manter peso atual:",
		de : 'Aktuelles Gewicht halten:',
		es : 'Mantener peso actual:',
		fr : 'Conserver poids actuel :',
		it : '',
		ja : '現在の体重を維持する：',
		ko : '현재 몸무게 유지:',
		ru : 'Держите текущий вес:',
		zh : '保持当前体重：'
	},
	LOSE_WEIGHT : {
		en : "Lose weight by:",
		pt : "Perder peso:",
		de : 'Abnehmen bis:',
		es : 'Bajar peso en:',
		fr : 'Perdre du poids avant le :',
		it : '',
		ja : 'キロ体重を落とす：',
		ko : '감량:',
		ru : 'сбросить вес с помощью:',
		zh : '用什么样的方式来减肥：'
	},
	GAIN_WEIGHT : {
		en : "Gain weight by:",
		pt : "Ganhar peso:",
		de : 'Zunehmen bis:',
		es : 'Aumentar peso en:',
		fr : 'Gagner du poids avant le :',
		it : '',
		ja : 'キロ体重を増やす：',
		ko : '증가:',
		ru : 'набрать вес с помощью:',
		zh : '用什么样的方式来增胖：'
	},
	PER_WEEK : {
		en : "per week",
		pt : "por semana",
		de : 'pro Woche',
		es : 'por semana',
		fr : 'par semaine',
		it : '',
		ja : '1週間に',
		ko : '주당',
		ru : 'в неделю',
		zh : '每周'
	},
	CALORIES_AVALIABLE : {
		en : "calories avaliable",
		pt : "calorias disponíveis",
		de : 'Verfügbare Kalorien',
		es : 'calorías disponibles',
		fr : 'calories disponible',
		it : '',
		ja : '利用可能なカロリー',
		ko : '가능 칼로리',
		ru : 'калорий доступно',
		zh : '包含的卡路里'
	},
	DAILY_CALORIES : {
		en : "daily calories",
		pt : "calorias por dia",
		de : 'Tägliche Kalorien',
		      //Kalorien pro Tag)
		es : 'calorías diarias',
		fr : 'kcal / jour', //'calories quotidiennes',
		it : '',
		ja : '毎日のカロリー',
		ko : '하루 칼로리',
		ru : 'калорий в день',
		zh : '每日的卡路里'
	},
	STATUS_EQ_TIME_1 : {
		en : "Wait at least ",
		pt : "Aguarde pelo menos ",
		de : 'Warten Sie mindestens',
		es : 'Espere por lo menos ',
		fr : 'Attendez au moins ',
		it : '',
		ja : '以上待つ ',
		ko : '기다려야 하는 시간',
		ru : 'подождите хотя бы ',
		zh : '至少等待'
	},
	STATUS_EQ_TIME_2 : {
		en : " before your next meal. \n\n(",
		pt : " antes de sua próxima refeição. \n\n(",
		de : '  vor der nächsten Mahlzeit. \n\n(',
		es : ' antes de la próxima comida. \n\n(',
		fr : ' avant votre prochain repas.\n\n(',
		it : '',
		ja : ' 次の食事の前に \n\n（',
		ko : ' 다음 밥 먹을 때까지\n\n(',
		ru : ' До следующего приёма пищи. \n\n(',
		zh : ' 在你的下一餐之前。\n\n（'
	},
	STATUS_EQ_TIME_3 : {
		en : " calories above your ",
		pt : " calorias acima de sua meta de ",
		de : ' Kalorien über Ihrem ',
		es : ' calorías por encima de su objetivo de ',
		fr : ' calories au-dessus de votre cible de ',
		it : '',
		ja : ' 越えるカロリー ',
		ko : ' 칼로리 초과 ',
		ru : ' Калории свыше ',
		zh : ' 卡路里以上的 '	 	
	},
	STATUS_EQ_TIME_4 : {
		en : " kcal/day target)",
		pt : " kcal/dia)",
		de : ' Kalorien pro Tag)',
		es : ' kcal/día)',
		fr : ' kcal/jour)',
		it : '',
		ja : ' キロカロリー/日の目標）',
		ko : ' 하루 칼로리 목표)',
		ru : ' ккал / в день цель)',
		zh : ' 每日卡路里目标）'
	},
	STATUS_EQ_TIME_5 : {
		en : "Your next meal should have around ",
		pt : "Sua próxima refeição deve possuir aprox. ",
		de : 'Ihre nächste Mahlzeit sollte in etwa haben ',
		es : 'Su próxima comida debe tener alrededor de ',
		fr : 'Votre prochain repas devrait compter environ ',
		it : '',
		ja : '次の食事で必要なのは ',
		ko : '다음 식사는 ',
		ru : 'Следующий приём пищи должен содержать примерно ',
		zh : '你的下一餐应约为 '
	},
	STATUS_EQ_TIME_6 : {
		en : " calories. \n\n(equivalent to ",
		pt : " calorias. \n\n(equivalente a ",
		de : ' Kalorien. \n\n(entspricht ',
		es : ' calorías. \n\n(Equivalente a ',
		fr : ' calories.\n\n(Équivalent à ',
		it : '',
		ja : ' カロリー。 \n\n（に相当 ',
		ko : ' 칼로리 \n\n(동일 ',
		ru : ' калорий. \n\n (эквивалентных ',
		zh : ' 卡路里。\n\n（相当于'
	},
	STATUS_EQ_TIME_7 : {
		en : " on a ",
		pt : " em uma meta de ",
		de : ' in einem ',
		es : ' en un objetivo de ',
		fr : ' sur ',
		it : '',
		ja : ' 上 ',
		ko : ' 에 ',
		ru : ' на ',
		zh : ' 在  上 '
	},
	STATUS_EQ_TIME_8 : {
		en : " kcal/day schedule)",
		pt : " kcal diárias)",
		de : ' Kalorien pro Tag)',
		es : ' kcal/día)',
		fr : ' kcal/jour)',
		it : '',
		ja : ' キロカロリー/日の目標',
		ko : ' 하루 칼로리 목표)',
		ru : ' ежедневно калорий)',
		zh : ' 每日卡路里目标)'
	},
	STATUS_LOSS_1 : {
		en : "You have lost a total of ",
		pt : "Você perdeu um total de ",
		de : 'Sie haben insgesamt abgenommen ',
		es : 'Ha perdido un total de ',
		fr : 'Vous avez perdu un total de ',
		it : '',
		ja : 'が合計で減量されました ',
		ko : '총 감량무게 ',
		ru : 'Вы сбросили всего ',
		zh : '你共减掉了 '
	},
	STATUS_LOSS_2 : {
		en : "(based on a caloric restriction of ",
		pt : "(baseado em uma restrição calórica de ",
		de : '(basierend auf einer Kaloriebeschränkung von ',
		es : '(basado en una restricción calórica de ',
		fr : '(sur la base d\'une restriction calorique de ',
		it : '',
		ja : '（カロリー制限に基づいて ',
		ko : '(칼로리 제한에 기초 ',
		ru : '(Основано на ограничении калорий ',
		zh : '（基于对卡路里的限制 '
	},
	CALORIC_INTAKE : {
		en : "CALORIC INTAKE",
		pt : "INGESTÃO CALÓRICA",
		de : 'KALORIENAUFNAHME',
		es : 'INGESTA DE CALORÍAS',
		fr : 'APPORT CALORIQUE',
		it : '',
		ja : 'カロリー摂取量',
		ko : '칼로리 섭취',
		ru : 'ПОТРЕБЛЕНИЕ КАЛОРИЙ',
		zh : '摄入卡路里'
	},
	STATUS_INTAKE_1 : {
		en : "Your daily caloric intake should be equal to (",
		pt : "Sua ingestão calórica deve ser igual a (",
		de : 'Ihre tägliche Kalorienzufuhr sollte entsprechen (',
		es : 'Su ingesta diaria de calorías debe ser igual a (',
		fr : 'Votre apport calorique quotidien devrait être égal à (',
		it : '',
		ja : '適切な毎日のカロリー摂取量は （',
		ko : '1일 칼로리 섭취는 (',
		ru : 'Ваше ежедневное потребление калорий должно равняться (',
		zh : '你每日摄取的卡路里量应等于（'
	},
	STATUS_INTAKE_2 : {
		en : ") + (calories burned from exercise) \n\nThe more you exercise, the more you can eat!",
		pt : ") + (calorias queimadas em exercício) \n\nQuanto mais você se exercitar, mais poderá comer!",
		de : ') + (bei Training verbrannte Kalorien)\n\nJe mehr Sie trainieren, desto mehr können Sie essen!',
		es : ') + (calorías quemadas por el ejercicio) \n\n¡Cuanto más ejercicio haga, más puede comer!',
		fr : ') + (calories brûlées avec l\'exercice)\n\nPlus vous vous entraînez, plus vous pouvez manger !',
		it : '',
		ja : '） + （運動で燃焼したカロリー） \n\nエクササイズすればするほど、食べることができます！',
		ko : ') + (운동으로 연소된 칼로리)\n\n운동량이 많을수록 더 많이 먹을 수 있습니다.',
		ru : ') + (калории, сгоревшие от физических упражненийх) \n\nЧем больше упражнений вы делаете, тем больше вам можно есть!',
		zh : '）+（运动燃烧的卡路里）\n\n你运动得越多，就可以吃得越多！'
	},
	DELETE_ITEM : {
		en : "Delete item",
		pt : "Excluir item",
		de : 'Artikel löschen',
		es : 'Eliminar elemento',
		fr : 'Supprimer l\'élément',
		it : '',
		ja : 'アイテムを削除',
		ko : '아이템 삭제',
		ru : 'Удалить элемент',
		zh : '删除项目'
	},
	MY_FAVOURITES : {
		en : "favourites",
		pt : "favoritos",
		de : 'Favoriten',
		es : 'favoritos',
		fr : 'Favoris',
		it : '',
		ja : 'お気に入り',
		ko : '즐겨찾기',
		ru : 'избранное',
		zh : '我的最爱'
	},
	MY_FOODS : {
		en : "my foods",
		pt : "alimentos",
		de : 'Lebensmittel',
		es : 'comidas',
		fr : 'aliments',
		it : '',
		ja : '食べ物',
		ko : '음식',
		ru : 'продукты',
		zh : '我的食物'
	},
	MY_EXERCISES : {
		en : "my exercises",
		pt : "exercícios",
		de : 'Übungen',
		es : 'ejercicios',
		fr : 'exercices',
		it : '',
		ja : 'エクササイズ',
		ko : '운동',
		ru : 'упражнения',
		zh : '我的运动'
	},
	ADD_NEW_FOOD : {
		en : "add new food",
		pt : "adicionar novo alimento",
		de : 'Neues Lebensmittel hinzufügen',
		es : 'añadir comida',
		fr : 'ajouter un nouvel aliment',
		it : '',
		ja : '新しい食べ物を追加',
		ko : '음식 새로 추가',
		ru : 'Добавить новый продукт',
		zh : '添加新的食物'
	},
	ADD_NEW_EXERCISE : {
		en : "add new exercise",
		pt : "adicionar novo exercício",
		de : 'Neue Übung hinzufügen',
		es : 'añadir ejercicio',
		fr : 'ajouter un nouvel exercice',
		it : '',
		ja : '新しいエクササイズを追加',
		ko : '운동 새로 추가',
		ru : 'Добавить новое упражнение',
		zh : '添加新的运动'
	},
	ADD_NEW : {
		en : "save",
		pt : "gravar",
		de : 'Speichern',
		es : 'guardar',
		fr : 'enregistrer',
		it : '',
		ja : '保存',
		ko : '저장',
		ru : 'сохранить',
		zh : '保存'
	},
	ADD_NAME : {
		en : "Name",
		pt : "Nome",
		de : 'Name',
		es : 'Nombre',
		fr : 'Nom',
		it : '',
		ja : '名前',
		ko : '이름',
		ru : 'Название',
		zh : '名称'
	},
	ADD_AMMOUNT : {
		en : "Amount",
		pt : "Quantidade",
		de : 'Menge',
		es : 'Cantidad',
		fr : 'Quantité',
		it : '',
		ja : '総量',
		ko : '양',
		ru : 'Количество',
		zh : '数量'
	},
	ADD_DURATION : {
		en : "Duration",
		pt : "Duração",
		de : 'Dauer',
		es : 'Duración',
		fr : 'Durée',
		it : '',
		ja : '期間',
		ko : '기간',
		ru : 'Продолжительность',
		zh : '持续时间'
	},
	PROTEINS : {
		en : "Proteins",
		pt : "Proteínas",
		de : 'Proteine',
		es : 'Proteinas',
		fr : 'Protéines',
		it : '',
		ja : 'タンパク質',
		ko : '단백질',
		ru : 'белки',
		zh : '蛋白质'
	},
	CARBS : {
		en : "Carbs",
		pt : "Carboidratos",
		de : 'Kohlenhydrate',
		es : 'Carbohidratos',
		fr : 'Glucides',
		it : '',
		ja : '炭水化物',
		ko : '탄수화물',
		ru : 'Углеводы',
		zh : '碳水化合物'
	},
	FATS : {
		en : "Fats",
		pt : "Gorduras",
		de : 'Fette',
		es : 'Grasas',
		fr : 'Graisses',
		it : '',
		ja : '脂肪',
		ko : '지방',
		ru : 'Жиры',
		zh : '脂肪'
	},
	STATUS_BARS : {
		en : "Nutrients",
		pt : "Nutrição",
		de : 'Nährstoffe',
		es : 'Nutrientes',
		fr : 'Nutriments',
		it : '',
		ja : '栄養素',
		ko : '영양',
		ru : 'Питательные вещества',
		zh : '养分'
	},
	NOTEPAD_DONE : {
		en : "done",
		pt : "ok",
		de : 'ok',
		es : 'ok',
		fr : 'ok',
		it : '',
		ja : 'ok',
		ko : '완료',
		ru : 'ok',
		zh : '好'
	},
	NOT_RUNNING_TITLE : {
		en : "The counter is currently stopped",
		pt : "O contador não está ativado",
		de : 'Der Zähler läuft derzeit nicht',
		es : 'El contador está parado',
		fr : 'Le compteur est actuellement arrêté',
		it : '',
		ja : '現在、カウンターは停止中',
		ko : '현재 카운터가 멈췄습니다.',
		ru : 'В данный момент счётчик не работает.',
		zh : '计数器现已停止'
	},
	NOT_RUNNING_DIALOG : {
		en : "Would you like to start it now?",
		pt : "Gostaria de iniciá-lo agora?",
		de : 'Möchten Sie es jetzt beginnen?',
		es : '¿Le gustaría empezar ahora?',
		fr : 'Voulez-vous le lancer maintenant ?',
		it : '',
		ja : '今すぐ始めますか？',
		ko : '지금 시작하겠습니까?',
		ru : 'Хотите запустить его сейчас?',
		zh : '你想现在开始?'
	},
	CLEAR_ALL : {
		en : "clear all",
		pt : "limpar tudo",
		de : 'Alle löschen',
		es : 'eliminar todos',
		fr : 'effacer tout',
		it : '',
		ja : 'すべてクリア',
		ko : '모두 지우기',
		ru : 'очистить всё',
		zh : '清除全部'
	},
	CLEAR_ALL_TITLE : {
		en : "clear all entries",
		pt : "limpar todos itens",
		de : 'Alle Einträge löschen',
		es : 'eliminar todos',
		fr : 'effacer toutes les entrées',
		it : '',
		ja : 'すべてのエントリーをクリア',
		ko : '모든 입력값 지우기',
		ru : 'очистить все записи',
		zh : '清除所有条目'
	},
	LOGOUT_TITLE : {
		en : "Turn off automatic backup",
		pt : "Desativar backup automático",
		de : 'Automatische Sicherung deaktivieren',
		es : 'Desactivar copia de seguridad automática',
		fr : 'Désactiver la sauvegarde automatique',
		it : '',
		ja : '自動バックアップをオフにする',
		ko : '자동 백업 끄기',
		ru : 'отключить автоматическое резервное копирование',
		zh : '关闭自动备份'
	},
	FOR : {
		en : "for",
		pt : "para",
		de : 'für',
		es : 'para',
		fr : 'pour',
		it : '',
		ja : 'のために',
		ko : '동안',
		ru : 'в течение',
		zh : '为'
	},
	CALORIE_COUNTER : {
		en : "Calorie Counter",
		pt : "Contador de Calorias",
		de : 'Kalorienzähler',
		es : 'Contador de calorías',
		fr : 'Compteur de calories',
		it : '',
		ja : 'カロリー・カウンター',
		ko : '칼로리 카운터',
		ru : 'Счётчик калорий',
		zh : '卡路里计数器'
	},
	SHARE_MESSAGE : {
		en : "I'm using MyLiveDiet to track calories in real-time! Check it out!",
		pt : "Estou usando MyLiveDiet - contador de calorias em tempo real! Confira!",
		de : 'Ich verfolge mit MyLiveDiet meine Kalorien in Echtzeit! Jetzt ausprobieren!',
		es : '¡Estoy usando MyLiveDiet para realizar un seguimiento de calorías en tiempo real! ¡Échale un vistazo!',
		fr : 'J\'utilise MyLiveDiet pour surveiller mes calories en temps réel ! Essaie-le !',
		it : '',
		ja : 'リアルタイムでのカロリーの監視にMyLiveDietを利用しています。すごいですよ！',
		ko : '실시간으로 칼로리를 재어주는 MyLiveDiet를 쓰고 있습니다. 확인해 보세요.',
		ru : 'Я использую MyLiveDiet, чтобы отслеживать потребляемые калории в реальном времени! Отметить!',
		zh : '我正在使用MyLiveDiet实时跟踪卡路里！快来看看吧！'
	},
	BLANK_FIELD_TITLE : {
		en : "Required fields have been left blank.",
		pt : "Campos obrigatórios foram deixados em branco.",
		de : 'Erforderliche Felder sind leer geblieben.',
		es : 'Los campos obligatorios están en blanco.',
		fr : 'Des champs obligatoires sont vides.',
		it : '',
		ja : '必須項目が入力されていません。',
		ko : '필수 입력칸이 비었습니다.',
		ru : 'Поля, необходимые для заполнения, оставлены пустыми.',
		zh : '必填栏位已被留空。'
	},
	BLANK_FIELD_DIALOG : {
		en : "The missing information is highlighted in red.",
		pt : "A informação em falta está destacada em vermelho.",
		de : 'Die fehlende Information ist rot markiert.',
		es : 'La información que falta se resalta en rojo.',
		fr : 'Les informations manquantes sont surlignées en rouge.',
		it : '',
		ja : '赤字で強調した部分が必要事項です。',
		ko : '빈 입력칸은 붉게 표시되어 있습니다.',
		ru : 'Отсутствующая информация отмечена красным.',
		zh : '缺少的信息以红色高亮显示。'
	},
	START_APP : {
		en : "MyLiveDiet was designed to help you lose weight as easily as possibile.",
		pt : "MyLiveDiet foi desenvolvido para ajudá-lo a perder peso de maneira fácil e intuitiva.",
		de : 'MyLiveDiet wurde entwickelt, um Ihnen dabei zu helfen, so einfach wie möglich abzunehmen.',
		es : 'MyLiveDiet ha sido diseñada para ayudarle a perder peso lo más fácilmente posible.',
		fr : 'Les informations manquantes sont surlignées en rouge.',
		it : '',
		ja : 'MyLiveDietが可能な限り体重を減らすお手伝いをします。',
		ko : 'MyLiveDiet는 가능한 한 쉬운 체중 감량에 도움을 주도록 만들어졌습니다.',
		ru : 'Приложение MyLiveDiet разработано, чтобы вы могли сбрасывать вес как можно легче.',
		zh : 'MyLiveDiet被设计为帮助你以最轻松的方法减肥。'
	},
	STEP_1 : {
		en : "Fill your Profile data",
		pt : "Preencha o Perfil",
		de : 'Ihre Profildaten ausfüllen',
		es : 'Rellene los datos de perfil',
		fr : 'Remplissez vos données de profil',
		it : '',
		ja : 'プロフィールを入力する',
		ko : '프로필 정보를 쓰고',
		ru : 'Заполните свой профиль',
		zh : '请填写您的个​​人资料'
	},
	STEP_2 : {
		en : "Hit start",
		pt : "Aperte iniciar",
		de : 'Start drücken',
		es : 'Presione iniciar',
		fr : 'Sélectionnez Commencer',
		it : '',
		ja : 'スタートボタンを押す',
		ko : '시작합니다.',
		ru : 'Щёлкните, чтобы начать',
		zh : '点击开始'
	},
	STEP_3 : {
		en : "There is no third step!",
		pt : "Não há terceiro passo!",
		de : 'Das war\'s!',
		es : '¡No hay tercer paso!',
		fr : 'Il n\'ya pas de troisième étape !',
		it : '',
		ja : '3番目のステップはありません！',
		ko : '3단계는 없음!',
		ru : 'Нет третьей ступени!',
		zh : '没有第三步！'
	},
	CLOSE_INTRO : {
		en : "ok, let's get started",
		pt : "ok, vamos começar",
		de : 'Okay, fangen wir an!',
		es : 'ok, vamos a empezar',
		fr : 'Allons-y',
		it : '',
		ja : 'では、始めましょう！',
		ko : '좋아요. 시작합시다.',
		ru : 'ok, давайте начнём!',
		zh : '好，让我们开始吧'
	},
	TODAY : {
		en : "today",
		pt : "hoje",
		de : 'heute',
		es : 'hoy',
		fr : 'aujourd\'hui',
		it : '',
		ja : '今日',
		ko : '오늘',
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

