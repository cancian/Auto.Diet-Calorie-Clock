//##/////////////##//
//## APP LIBRARY ##//
//##/////////////##//
var prefix = (/mozilla/.test(navigator.userAgent.toLowerCase()) &&
!/webkit/.test(navigator.userAgent.toLowerCase())) ? ''    :
(/webkit/.test(navigator.userAgent.toLowerCase())) ? '-webkit-' :
(/msie/.test(navigator.userAgent.toLowerCase()))   ? ''     :
(/opera/.test(navigator.userAgent.toLowerCase()))  ? ''      : '';

var transitionend = (/mozilla/.test(navigator.userAgent.toLowerCase()) &&
!/webkit/.test(navigator.userAgent.toLowerCase())) ? 'transitionend' :
(/webkit/.test(navigator.userAgent.toLowerCase())) ? 'webkitTransitionEnd' :
(/msie/.test(navigator.userAgent.toLowerCase()))   ? 'transitionend' :
(/opera/.test(navigator.userAgent.toLowerCase()))  ? 'transitionend' : '';