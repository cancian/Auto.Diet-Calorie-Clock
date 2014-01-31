//CSS
//document.write("<style type'text/css'>@font-face { font-family: 'FontAwesome'; src: url('css/font/fontawesome-webfont.eot?v=4.0.3'); src: url('css/font/fontawesome-webfont.eot?#iefix&v=4.0.3') format('embedded-opentype'), url('css/font/fontawesome-webfont.woff?v=4.0.3') format('woff'), url('css/font/fontawesome-webfont.ttf?v=4.0.3') format('truetype'), url('css/font/fontawesome-webfont.svg#fontawesomeregular?v=4.0.3') format('svg'); font-weight: normal;  font-style: normal; } </style>");
document.write("<style type'text/css'>@font-face { font-family: 'FontAwesome'; src: url('css/font/fontawesome-webfont.ttf?v=4.0.3') format('truetype'); font-weight: normal; font-style: normal; -webkit-font-smoothing: antialiased; } </style>");
//document.write("<style type'text/css'>@font-face { font-family: 'Helvetica Neue'; src: url('css/font/HelveticaNeue.ttf') format('truetype'); font-weight: normal; font-style: normal; -webkit-font-smoothing: antialiased; } </style>");
//document.write("<style type'text/css'>@font-face { font-family: 'Helvetica Neue Bold'; src: url('css/font/HelveticaNeue-Bold.ttf') format('truetype'); font-weight: normal; font-style: normal; -webkit-font-smoothing: antialiased;} </style>");
//document.write("<style type'text/css'>@font-face { font-family: 'Helvetica Neue Light'; src: url('css/font/HelveticaNeue-Light.ttf') format('truetype'); font-weight: normal; font-style: normal; -webkit-font-smoothing: antialiased;} </style>");
document.write("<link rel='stylesheet' type='text/css' href='css/mobiscroll.2.9.0.css' />");
document.write("<link rel='stylesheet' type='text/css' href='" + hostLocal + "css/index.css?"+newDate+"' />");
//CORDOVA
if(document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1 && navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
	document.write("<script type='text/javascript' src='js/cordova.js'><\/script>");
	//FB
	document.write("<script type='text/javascript' src='js/cdv-plugin-fb-connect.js'><\/script>");
	document.write("<script type='text/javascript' src='js/facebook-js-sdk.js'><\/script>");
} else {
	document.write("<script type='text/javascript' src='js/facebook-js-sdk.min.js'><\/script>");
}
//JS
//document.write("<script type='text/javascript' src='js/jquery-2.1.0.min.js'><\/script>");
document.write("<script type='text/javascript' src='js/jquery-2.0.3.min.js'><\/script>");
document.write("<script type='text/javascript' src='js/jquery-ui-1.10.3.min.js'><\/script>");
document.write("<script type='text/javascript' src='js/mobiscroll.2.9.0.js'><\/script>");
document.write("<script type='text/javascript' src='js/jquery.nicescroll.min.js'><\/script>");
document.write("<script type='text/javascript' src='js/jquery.color-2.1.0.min.js'><\/script>");
//document.write("<script type='text/javascript' src='js/jquery.mobileCheckbox.js'><\/script>");
document.write("<script type='text/javascript' src='js/jquery.touchSwipe.js'><\/script>");
document.write("<script type='text/javascript' src='js/spin.min.js'><\/script>");
document.write("<script type='text/javascript' src='js/quo.js'><\/script>");
document.write("<script type='text/javascript' src='js/html5sql.js'><\/script>");
document.write("<script type='text/javascript' src='js/UserVoice.js'><\/script>");
document.write("<script type='text/javascript' src='js/calculator.js'><\/script>");
document.write("<script type='text/javascript' src='js/carpe_slider.js'><\/script>");
document.write("<script type='text/javascript' src='" + hostLocal + "js/app_lang.js?"+newDate+"'><\/script>");
document.write("<script type='text/javascript' src='" + hostLocal + "js/app_setup.js?"+newDate+"'><\/script>");
document.write("<script type='text/javascript' src='" + hostLocal + "js/app_build.js?"+newDate+"'><\/script>");
document.write("<script type='text/javascript' src='" + hostLocal + "js/app_static.js?"+newDate+"'><\/script>");
document.write("<script type='text/javascript' src='" + hostLocal + "js/app_dynamic.js?"+newDate+"'><\/script>");
document.write("<script type='text/javascript' src='" + hostLocal + "js/app_custom_core.js?"+newDate+"'><\/script>");

