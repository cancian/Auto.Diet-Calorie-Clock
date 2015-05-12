var openFB = function () {
	function a(e, i, s) {
		n = e;
		if (i)
			r = i;
		if (s)
			t = s
	}
	function f(t, a, f) {
		function d(e) {
			var t = e.url;
			if (t.indexOf("access_token=") > 0 || t.indexOf("error=") > 0) {
				var n = 600 - ((new Date).getTime() - p);
				setTimeout(function () {
					h.close()
				}, n > 0 ? n : 0);
				l(t)
			}
		}
		function v() {
			console.log("exit and remove listeners");
			deferredLogin.reject({
				error : "user_cancelled",
				error_description : "User cancelled login process",
				error_reason : "user_cancelled"
			});
			h.removeEventListener("loadstop", d);
			h.removeEventListener("exit", v);
			h = null;
			console.log("done removing listeners")
		}
		var h,
		p;
		if (!n) {
			return f({
				error : "Facebook App Id not set."
			})
		}
		t = t || "";
		i = a;
		s = f;
		u = false;
		c();
		if (!r) {
			if (o) {
				r = "https://www.facebook.com/connect/login_success.html"
			} else {
				var m = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");
				r = m + "/oauthcallback.html"
			}
		}
		p = (new Date).getTime();
		h = window.open(e + "?client_id=" + n + "&redirect_uri=" + r + "&response_type=token&display=popup&scope=" + t, "_blank", "location=no");
		if (o) {
			h.addEventListener("loadstart", d);
			h.addEventListener("exit", v)
		}
	}
	function l(e) {
		var n,
		r;
		u = true;
		if (e.indexOf("access_token=") > 0) {
			n = e.substr(e.indexOf("#") + 1);
			r = d(n);
			t["fbtoken"] = r["access_token"];
			if (i)
				i()
		} else if (e.indexOf("error=") > 0) {
			n = e.substring(e.indexOf("?") + 1, e.indexOf("#"));
			r = d(n);
			if (s)
				s(r)
		} else {
			if (s)
				s()
		}
	}
	function c() {
		t["fbtoken"] = undefined
	}
	function h(e) {
		var n = e.method || "GET",
		r = e.params || {},
		i = new XMLHttpRequest,
		s;
		r["access_token"] = t["fbtoken"];
		s = "https://graph.facebook.com" + e.path + "?" + v(r);
		i.onreadystatechange = function () {
			if (i.readyState === 4) {
				if (i.status === 200) {
					if (e.success)
						e.success(JSON.parse(i.responseText))
				} else {
					var t = i.responseText ? JSON.parse(i.responseText).error : {
						message : "An error has occurred"
					};
					if (e.error)
						e.error(t)
				}
			}
		};
		i.open(n, s, true);
		i.send()
	}
	function p(e, n) {
		return h({
			method : "DELETE",
			path : "/me/permissions",
			success : function () {
				t["fbtoken"] = undefined;
				e()
			},
			error : n
		})
	}
	function d(e) {
		var t = decodeURIComponent(e),
		n = {},
		r = t.split("&");
		r.forEach(function (e) {
			var t = e.split("=");
			n[t[0]] = t[1]
		});
		return n
	}
	function v(e) {
		var t = [];
		for (var n in e) {
			if (e.hasOwnProperty(n)) {
				t.push(encodeURIComponent(n) + "=" + encodeURIComponent(e[n]))
			}
		}
		return t.join("&")
	}
	var e = "https://www.facebook.com/dialog/oauth",
	t = window.sessionStorage,
	n,
	r,
	i,
	s,
	o,
	u;
	document.addEventListener("deviceready", function () {
		o = true
	}, false);
	return {
		init : a,
		login : f,
		logout : c,
		revokePermissions : p,
		api : h,
		oauthCallback : l
	}
}
()
