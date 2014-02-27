//##/////////////##//
//## APP LIBRARY ##//
//##/////////////##//
var prefix = (/mozilla/.test(navigator.userAgent.toLowerCase()) &&
!/webkit/.test(navigator.userAgent.toLowerCase())) ? '-moz-'    :
(/webkit/.test(navigator.userAgent.toLowerCase())) ? '-webkit-' :
(/msie/.test(navigator.userAgent.toLowerCase()))   ? '-ms-'     :
(/opera/.test(navigator.userAgent.toLowerCase()))  ? '-o-'      : '';

console.log(prefix);