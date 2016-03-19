/////////////////////
// GA-LOCALSTORATE //
/////////////////////
(function () {
	var VERSION = '1.6';
	var IS_DEBUG = false;
	var Local_Storage = function (key, initial_value) {
		if (localStorage.getItem(key) == null && initial_value != null) {
			localStorage.setItem(key, initial_value);
		}
		this._get = function () {
			return localStorage.getItem(key);
		};
		this._set = function (value) {
			return localStorage.setItem(key, value);
		};
		this._remove = function () {
			return localStorage.removeItem(key);
		};
		this.toString = function () {
			return this._get();
		};
	};
	ga_storage = new function () {
		var https = 'https://';
		var that = this;
		var initialized = false;
		var tracking_code_url = https + 'www.google-analytics.com/analytics.js';
		var beacon_url        = https + 'www.google-analytics.com/__utm.gif';
		var last_url = '/';
		var last_nav_url = '/';
		var last_page_title = '-';
		var timer;
		var utmac = false;
		var utmhn = false;
		var utmwv = '4.3';
		var utmcs = 'UTF-8';
		var utmul = navigator.language || navigator.browserLanguage;
		if (utmul.length) {
			utmul = utmul.slice(0, 2).toLowerCase();
		} else {
			utmul = "en";
		}
		var utmdt = '-';
		var utmn = 0;
		var utmt = 'event';
		var utmhid = 0;
		var event_map = {
			hidden : {
				path : '/popup_hidden',
				event : 'PopupHidden'
			},
			blurred : {
				path : '/popup_blurred',
				event : 'PopupBlurred'
			},
			focused : {
				path : '{last_nav_url}',
				event : 'PopupFocused'
			}
		};
		var uid = new Local_Storage('ga_storage_uid');
		var uid_rand = new Local_Storage('ga_storage_uid_rand');
		var session_cnt = new Local_Storage('ga_storage_session_cnt');
		var f_session = new Local_Storage('ga_storage_f_session');
		var l_session = new Local_Storage('ga_storage_l_session');
		var first_run = new Local_Storage('ga_storage_first_run');
		var visitor_custom_vars = new Local_Storage('ga_storage_visitor_custom_vars');
		var c_session = 0;
		var custom_vars = visitor_custom_vars._get() ? JSON.parse(visitor_custom_vars._get()) : ['dummy'];
		var request_cnt = 0;
		function rand(min, max) {
			return min + Math.floor(Math.random() * (max - min));
		}
		function get_random() {
			return rand(100000000, 999999999);
		}
		function return_cookies(source, medium, campaign) {
			source = source || '(direct)';
			medium = medium || '(none)';
			campaign = campaign || '(direct)';
			var cookie = uid._get();
			var ret = '__utma=' + cookie + '.' + uid_rand._get() + '.' + f_session._get() + '.' + l_session._get() + '.' + c_session + '.' + session_cnt._get() + ';';
			ret += '+__utmz=' + cookie + '.' + c_session + '.1.1.utmcsr=' + source + '|utmccn=' + campaign + '|utmcmd=' + medium + ';';
			ret += '+__utmc=' + cookie + ';';
			ret += '+__utmb=' + cookie + '.' + request_cnt + '.10.' + c_session + ';';
			return ret;
		}
		function generate_query_string(params) {
			var qa = [];
			for (var key in params) {
				qa.push(key + '=' + encodeURIComponent(params[key]));
			}
			return '?' + qa.join('&');
		}
		function reset_session(c_session) {
			if (IS_DEBUG)
				console.log('resetting session');
			l_session._set(c_session);
			request_cnt = 0;
			utmhid = get_random();
		}
		function gainit() {
			c_session = (new Date()).getTime();
			if (IS_DEBUG)
				console.log('gainit', c_session);
			request_cnt = 0;
			utmhid = get_random();
			if (uid._get() == null) {
				uid._set(rand(10000000, 99999999));
				uid_rand._set(rand(1000000000, 2147483647));
			}
			if (session_cnt._get() == null) {
				session_cnt._set(1);
			} else {
				session_cnt._set(parseInt(session_cnt._get()) + 1);
			}
			if (f_session._get() == null) {
				f_session._set(c_session);
			}
			if (l_session._get() == null) {
				l_session._set(c_session);
			}
			var state = 'hidden';
			var latestState = '';
			var handleState = function () {
				if (!utmac || !utmhn)
					return;
				if (IS_DEBUG)
					console.log('current state:', state, 'latest state:', latestState);
				switch (state) {
				case 'shown':
					if (latestState == 'hidden') {
						that._trackPageview(last_nav_url);
					}
					that._trackEvent('User', 'IconClick');
					if (first_run._get() == null) {
						that._trackEvent('User', 'FirstRun');
						first_run._set(1);
					}
					break;
				case 'hidden':
					that._trackPageview(event_map.hidden.path);
					that._trackEvent('User', event_map.hidden.event);
					reset_session(c_session);
					break;
				case 'focused':
					that._trackPageview(last_nav_url);
					break;
				case 'blurred':
					that._trackPageview(event_map.blurred.path);
					break;
				}
				latestState = state;
			};
		}
		this._initPlatformCustomVar = function (customVarSlot) {
			customVarSlot = customVarSlot || 1;
		};
		this._setAccount = function (account_id) {
			if (IS_DEBUG)
				console.log(account_id);
			utmac = account_id;
			gainit();
		};
		this._setDomain = function (domain) {
			if (IS_DEBUG)
				console.log(domain);
			utmhn = domain;
		};
		this._setLocale = function (lng, country) {
			lng = (typeof lng === 'string' && lng.match(/^[a-z][a-z]$/i)) ? lng.toLowerCase() : 'en';
			country = (typeof country === 'string' && country.match(/^[a-z][a-z]$/i)) ? country.toLowerCase() : 'us';
			utmul = lng + '-' + country;
			if (IS_DEBUG)
				console.log(utmul);
		};
		this._setCustomVar = function (index, name, value, opt_scope) {
			if (index < 1 || index > 5)
				return false;
			var params = {
				name : name,
				value : value,
				scope : opt_scope
			};
			custom_vars[index] = params;
			if (opt_scope === 1) {
				var vcv = visitor_custom_vars._get() ? JSON.parse(visitor_custom_vars._get()) : ['dummy'];
				vcv[index] = params;
				visitor_custom_vars._set(JSON.stringify(vcv));
			}
			if (IS_DEBUG) {
				console.log(custom_vars);
			}
			return true;
		};
		this._trackPageview = function (path, title, source, medium, campaign) {
			if (IS_DEBUG) {
				console.log('Track Page View', arguments);
			}
			clearTimeout(timer);
			request_cnt++;
			if (!path) {
				path = '/';
			}
			if (!title) {
				title = utmdt;
			}
			var event = '';
			if (custom_vars.length > 1) {
				var names = '';
				var values = '';
				var scopes = '';
				for (var i = 1; i < custom_vars.length; i++) {
					names += custom_vars[i].name;
					values += custom_vars[i].value;
					scopes += (custom_vars[i].scope == null ? 3 : custom_vars[i].scope);
					if (i + 1 < custom_vars.length) {
						names += '*';
						values += '*';
						scopes += '*';
					}
				}
				event += '8(' + names + ')';
				event += '9(' + values + ')';
				event += '11(' + scopes + ')';
			}
			last_url = path;
			last_page_title = title;
			if ([event_map.hidden.path, event_map.blurred.path].indexOf(path) < 0) {
				last_nav_url = path;
			}
			var params = {
				utmwv : utmwv,
				utmn : get_random(),
				utmhn : utmhn,
				utmcs : utmcs,
				utmul : utmul,
				utmdt : title,
				utmhid : utmhid,
				utmp : path,
				utmac : utmac,
				utmcc : return_cookies(source, medium, campaign)
			};
			if (event != '') {
				params.utme = event;
			}
			var url = beacon_url + generate_query_string(params);
			var img = new Image();
			img.src = url;
		};
		this._trackEvent = function (category, action, label, value, source, medium, campaign) {
			if (IS_DEBUG) {
				console.log('Track Event', arguments);
			}
			request_cnt++;
			var event = '5(' + category + '*' + action;
			if (label) {
				event += '*' + label + ')';
			} else {
				event += ')';
			}
			if (value) {
				event += '(' + value + ')'
			}
			if (custom_vars.length > 1) {
				var names = '';
				var values = '';
				var scopes = '';
				for (var i = 1; i < custom_vars.length; i++) {
					names += custom_vars[i].name;
					values += custom_vars[i].value;
					scopes += (custom_vars[i].scope == null ? 3 : custom_vars[i].scope);
					if (i + 1 < custom_vars.length) {
						names += '*';
						values += '*';
						scopes += '*';
					}
				}
				event += '8(' + names + ')';
				event += '9(' + values + ')';
				event += '11(' + scopes + ')';
			}
			var params = {
				utmwv : utmwv,
				utmn : get_random(),
				utmhn : utmhn,
				utmcs : utmcs,
				utmul : utmul,
				utmt : utmt,
				utme : event,
				utmhid : utmhid,
				utmdt : last_page_title,
				utmp : last_url,
				utmac : utmac,
				utmcc : return_cookies(source, medium, campaign)
			};
			var url = beacon_url + generate_query_string(params);
			var img = new Image();
			img.src = url;
		};
		this._trackBlur = function () {
			var e;
			if (document.createEvent) {
				e = document.createEvent('HTMLEvents');
				e.initEvent('blur', true, true);
			} else {
				e = document.createEventObject();
				e.eventType = 'blur';
			}
			if (document.createEvent) {
				window.dispatchEvent(e);
			} else {
				window.fireEvent('on', +e.eventType, e);
			}
		};
		this._trackFocus = function () {
			var e;
			if (document.createEvent) {
				e = document.createEvent('HTMLEvents');
				e.initEvent('focus', true, true);
			} else {
				e = document.createEventObject();
				e.eventType = 'focus';
			}
			if (document.createEvent) {
				window.dispatchEvent(e);
			} else {
				window.fireEvent('on', +e.eventType, e);
			}
		};
	};
})();
