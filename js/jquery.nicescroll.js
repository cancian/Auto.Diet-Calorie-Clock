(function (e) {
	"function" === typeof define && define.amd ? define(["jquery"], e) : e(jQuery)
})(function (e) {
	var t = !1,
	n = !1,
	r = 0,
	i = 2e3,
	s = 0,
	o = ["webkit", "ms", "moz", "o"],
	u = window.requestAnimationFrame || !1,
	a = window.cancelAnimationFrame || !1;
	if (!u)
		for (var f in o) {
			var l = o[f];
			u || (u = window[l + "RequestAnimationFrame"]);
			a || (a = window[l + "CancelAnimationFrame"] || window[l + "CancelRequestAnimationFrame"])
		}
	var c = window.MutationObserver || window.WebKitMutationObserver || !1,
	h = {
		zindex : "auto",
		cursoropacitymin : 0,
		cursoropacitymax : 1,
		cursorcolor : "#424242",
		cursorwidth : "5px",
		cursorborder : "1px solid #fff",
		cursorborderradius : "5px",
		scrollspeed : 60,
		mousescrollstep : 24,
		touchbehavior : !1,
		hwacceleration : !0,
		usetransition : !0,
		boxzoom : !1,
		dblclickzoom : !0,
		gesturezoom : !0,
		grabcursorenabled : !0,
		autohidemode : !0,
		background : "",
		iframeautoresize : !0,
		cursorminheight : 32,
		preservenativescrolling : !0,
		railoffset : !1,
		railhoffset : !1,
		bouncescroll : !0,
		spacebarenabled : !0,
		railpadding : {
			top : 0,
			right : 0,
			left : 0,
			bottom : 0
		},
		disableoutline : !0,
		horizrailenabled : !0,
		railalign : "right",
		railvalign : "bottom",
		enabletranslate3d : !0,
		enablemousewheel : !0,
		enablekeyboard : !0,
		smoothscroll : !0,
		sensitiverail : !0,
		enablemouselockapi : !0,
		cursorfixedheight : !1,
		directionlockdeadzone : 6,
		hidecursordelay : 400,
		nativeparentscrolling : !0,
		enablescrollonselection : !0,
		overflowx : !0,
		overflowy : !0,
		cursordragspeed : .3,
		rtlmode : "auto",
		cursordragontouch : !1,
		oneaxismousemode : "auto",
		scriptpath : function () {
			var e = document.getElementsByTagName("script"),
			e = e[e.length - 1].src.split("?")[0];
			return 0 < e.split("/").length ? e.split("/").slice(0, -1).join("/") + "/" : ""
		}
		(),
		preventmultitouchscrolling : !0
	},
	p = !1,
	d = function () {
		if (p)
			return p;
		var e = document.createElement("DIV"),
		t = e.style,
		n = navigator.userAgent,
		r = navigator.platform,
		i = {
			haspointerlock : "pointerLockElement" in document || "webkitPointerLockElement" in document || "mozPointerLockElement" in document
		};
		i.isopera = "opera" in window;
		i.isopera12 = i.isopera && "getUserMedia" in navigator;
		i.isoperamini = "[object OperaMini]" === Object.prototype.toString.call(window.operamini);
		i.isie = "all" in document && "attachEvent" in e && !i.isopera;
		i.isieold = i.isie && !("msInterpolationMode" in t);
		i.isie7 = i.isie && !i.isieold && (!("documentMode" in document) || 7 == document.documentMode);
		i.isie8 = i.isie && "documentMode" in document && 8 == document.documentMode;
		i.isie9 = i.isie && "performance" in window && 9 <= document.documentMode;
		i.isie10 = i.isie && "performance" in window && 10 == document.documentMode;
		i.isie11 = "msRequestFullscreen" in e && 11 <= document.documentMode;
		i.isie9mobile = /iemobile.9/i.test(n);
		i.isie9mobile && (i.isie9 = !1);
		i.isie7mobile = !i.isie9mobile && i.isie7 && /iemobile/i.test(n);
		i.ismozilla = "MozAppearance" in t;
		i.iswebkit = "WebkitAppearance" in t;
		i.ischrome = "chrome" in window;
		i.ischrome22 = i.ischrome && i.haspointerlock;
		i.ischrome26 = i.ischrome && "transition" in t;
		i.cantouch = "ontouchstart" in document.documentElement || "ontouchstart" in window;
		i.hasmstouch = window.MSPointerEvent || !1;
		i.hasw3ctouch = window.PointerEvent || !1;
		i.ismac = /^mac$/i.test(r);
		i.isios = i.cantouch && /iphone|ipad|ipod/i.test(r);
		i.isios4 = i.isios && !("seal" in Object);
		i.isios7 = i.isios && "webkitHidden" in document;
		i.isandroid = /android/i.test(n);
		i.haseventlistener = "addEventListener" in e;
		i.trstyle = !1;
		i.hastransform = !1;
		i.hastranslate3d = !1;
		i.transitionstyle = !1;
		i.hastransition = !1;
		i.transitionend = !1;
		r = ["transform", "msTransform", "webkitTransform", "MozTransform", "OTransform"];
		for (n = 0; n < r.length; n++)
			if ("undefined" != typeof t[r[n]]) {
				i.trstyle = r[n];
				break
			}
		i.hastransform = !!i.trstyle;
		i.hastransform && (t[i.trstyle] = "translate3d(1px,2px,3px)", i.hastranslate3d = /translate3d/.test(t[i.trstyle]));
		i.transitionstyle = !1;
		i.prefixstyle = "";
		i.transitionend = !1;
		for (var r = "transition webkitTransition msTransition MozTransition OTransition OTransition KhtmlTransition".split(" "), s = " -webkit- -ms- -moz- -o- -o -khtml-".split(" "), o = "transitionend webkitTransitionEnd msTransitionEnd transitionend otransitionend oTransitionEnd KhtmlTransitionEnd".split(" "), n = 0; n < r.length; n++)
			if (r[n]in t) {
				i.transitionstyle = r[n];
				i.prefixstyle = s[n];
				i.transitionend = o[n];
				break
			}
		i.ischrome26 && (i.prefixstyle = s[1]);
		i.hastransition = i.transitionstyle;
		e : {
			n = ["-webkit-grab", "-moz-grab", "grab"];
			if (i.ischrome && !i.ischrome22 || i.isie)
				n = [];
			for (r = 0; r < n.length; r++)
				if (s = n[r], t.cursor = s, t.cursor == s) {
					t = s;
					break e
				}
			t = "url(css/openhand.cur),n-resize"
		}
		i.cursorgrabvalue = t;
		i.hasmousecapture = "setCapture" in e;
		i.hasMutationObserver = !1 !== c;
		return p = i
	},
	v = function (o, f) {
		function l() {
			var e = b.doc.css(E.trstyle);
			return e && "matrix" == e.substr(0, 6) ? e.replace(/^.*\((.*)\)$/g, "$1").replace(/px/g, "").split(/, +/) : !1
		}
		function p() {
			var e = b.win;
			if ("zIndex" in e)
				return e.zIndex();
			for (; 0 < e.length && 9 != e[0].nodeType; ) {
				var t = e.css("zIndex");
				if (!isNaN(t) && 0 != t)
					return parseInt(t);
				e = e.parent()
			}
			return !1
		}
		function v(e, t, n) {
			t = e.css(t);
			e = parseFloat(t);
			return isNaN(e) ? (e = k[t] || 0, n = 3 == e ? n ? b.win.outerHeight() - b.win.innerHeight() : b.win.outerWidth() - b.win.innerWidth() : 1, b.isie8 && e && (e += 1), n ? e : 0) : e
		}
		function g(e, t, n, r) {
			b._bind(e, t, function (r) {
				r = r ? r : window.event;
				var i = {
					original : r,
					target : r.target || r.srcElement,
					type : "wheel",
					deltaMode : "MozMousePixelScroll" == r.type ? 0 : 1,
					deltaX : 0,
					deltaZ : 0,
					preventDefault : function () {
						r.preventDefault ? r.preventDefault() : r.returnValue = !1;
						return !1
					},
					stopImmediatePropagation : function () {
						r.stopImmediatePropagation ? r.stopImmediatePropagation() : r.cancelBubble = !0
					}
				};
				"mousewheel" == t ? (i.deltaY =  - .025 * r.wheelDelta, r.wheelDeltaX && (i.deltaX =  - .025 * r.wheelDeltaX)) : i.deltaY = r.detail;
				return n.call(e, i)
			}, r)
		}
		function y(e, t, n) {
			var r,
			i;
			0 == e.deltaMode ? (r = -Math.floor(b.opt.mousescrollstep / 54 * e.deltaX), i = -Math.floor(b.opt.mousescrollstep / 54 * e.deltaY)) : 1 == e.deltaMode && (r = -Math.floor(e.deltaX * b.opt.mousescrollstep), i = -Math.floor(e.deltaY * b.opt.mousescrollstep));
			t && b.opt.oneaxismousemode && 0 == r && i && (r = i, i = 0, n && (0 > r ? b.getScrollLeft() >= b.page.maxw : 0 >= b.getScrollLeft()) && (i = r, r = 0));
			r && (b.scrollmom && b.scrollmom.stop(), b.lastdeltax += r, b.debounced("mousewheelx", function () {
					var e = b.lastdeltax;
					b.lastdeltax = 0;
					b.rail.drag || b.doScrollLeftBy(e)
				}, 15));
			if (i) {
				if (b.opt.nativeparentscrolling && n && !b.ispage && !b.zoomactive)
					if (0 > i) {
						if (b.getScrollTop() >= b.page.maxh)
							return !0
					} else if (0 >= b.getScrollTop())
						return !0;
				b.scrollmom && b.scrollmom.stop();
				b.lastdeltay += i;
				b.debounced("mousewheely", function () {
					var e = b.lastdeltay;
					b.lastdeltay = 0;
					b.rail.drag || b.doScrollBy(e)
				}, 15)
			}
			e.stopImmediatePropagation();
			return e.preventDefault()
		}
		var b = this;
		this.version = "3.6.0";
		this.name = "nicescroll";
		this.me = f;
		this.opt = {
			doc : e("body"),
			win : !1
		};
		e.extend(this.opt, h);
		this.opt.snapbackspeed = 80;
		if (o)
			for (var w in b.opt)
				"undefined" != typeof o[w] && (b.opt[w] = o[w]);
		this.iddoc = (this.doc = b.opt.doc) && this.doc[0] ? this.doc[0].id || "" : "";
		this.ispage = /^BODY|HTML/.test(b.opt.win ? b.opt.win[0].nodeName : this.doc[0].nodeName);
		this.haswrapper = !1 !== b.opt.win;
		this.win = b.opt.win || (this.ispage ? e(window) : this.doc);
		this.docscroll = this.ispage && !this.haswrapper ? e(window) : this.win;
		this.body = e("body");
		this.iframe = this.isfixed = this.viewport = !1;
		this.isiframe = "IFRAME" == this.doc[0].nodeName && "IFRAME" == this.win[0].nodeName;
		this.istextarea = "TEXTAREA" == this.win[0].nodeName;
		this.forcescreen = !1;
		this.canshowonmouseevent = "scroll" != b.opt.autohidemode;
		this.page = this.view = this.onzoomout = this.onzoomin = this.onscrollcancel = this.onscrollend = this.onscrollstart = this.onclick = this.ongesturezoom = this.onkeypress = this.onmousewheel = this.onmousemove = this.onmouseup = this.onmousedown = !1;
		this.scroll = {
			x : 0,
			y : 0
		};
		this.scrollratio = {
			x : 0,
			y : 0
		};
		this.cursorheight = 20;
		this.scrollvaluemax = 0;
		this.isrtlmode = "auto" == this.opt.rtlmode ? "rtl" == (this.win[0] == window ? this.body : this.win).css("direction") : !0 === this.opt.rtlmode;
		this.observerbody = this.observerremover = this.observer = this.scrollmom = this.scrollrunning = !1;
		do
			this.id = "ascrail" + i++;
		while (document.getElementById(this.id));
		this.hasmousefocus = this.hasfocus = this.zoomactive = this.zoom = this.selectiondrag = this.cursorfreezed = this.cursor = this.rail = !1;
		this.visibility = !0;
		this.hidden = this.locked = this.railslocked = !1;
		this.cursoractive = !0;
		this.wheelprevented = !1;
		this.overflowx = b.opt.overflowx;
		this.overflowy = b.opt.overflowy;
		this.nativescrollingarea = !1;
		this.checkarea = 0;
		this.events = [];
		this.saved = {};
		this.delaylist = {};
		this.synclist = {};
		this.lastdeltay = this.lastdeltax = 0;
		this.detected = d();
		var E = e.extend({}, this.detected);
		this.ishwscroll = (this.canhwscroll = E.hastransform && b.opt.hwacceleration) && b.haswrapper;
		this.hasreversehr = this.isrtlmode && !E.iswebkit;
		this.istouchcapable = !1;
		!E.cantouch || E.isios || E.isandroid || !E.iswebkit && !E.ismozilla || (this.istouchcapable = !0, E.cantouch = !1);
		b.opt.enablemouselockapi || (E.hasmousecapture = !1, E.haspointerlock = !1);
		this.debounced = function (e, t, n) {
			var r = b.delaylist[e];
			b.delaylist[e] = t;
			r || setTimeout(function () {
				try {
					var t = b.delaylist[e];
					b.delaylist[e] = !1;
					t.call(b)
				} catch (n) {}

			}, n)
		};
		var S = !1;
		this.synched = function (e, t) {
			b.synclist[e] = t;
			(function () {
				S || (u(function () {
						S = !1;
						try {
							for (var e in b.synclist) {
								var t = b.synclist[e];
								t && t.call(b);
								b.synclist[e] = !1
							}
						} catch (n) {}

					}), S = !0)
			})();
			return e
		};
		this.unsynched = function (e) {
			b.synclist[e] && (b.synclist[e] = !1)
		};
		this.css = function (e, t) {
			for (var n in t)
				b.saved.css.push([e, n, e.css(n)]), e.css(n, t[n])
		};
		this.scrollTop = function (e) {
			return "undefined" == typeof e ? b.getScrollTop() : b.setScrollTop(e)
		};
		this.scrollLeft = function (e) {
			return "undefined" == typeof e ? b.getScrollLeft() : b.setScrollLeft(e)
		};
		var T = function (e, t, n, r, i, s, o) {
			this.st = e;
			this.ed = t;
			this.spd = n;
			this.p1 = r || 0;
			this.p2 = i || 1;
			this.p3 = s || 0;
			this.p4 = o || 1;
			this.ts = (new Date).getTime();
			this.df = this.ed - this.st
		};
		T.prototype = {
			B2 : function (e) {
				return 3 * e * e * (1 - e)
			},
			B3 : function (e) {
				return 3 * e * (1 - e) * (1 - e)
			},
			B4 : function (e) {
				return (1 - e) * (1 - e) * (1 - e)
			},
			getNow : function () {
				var e = 1 - ((new Date).getTime() - this.ts) / this.spd,
				t = this.B2(e) + this.B3(e) + this.B4(e);
				return 0 > e ? this.ed : this.st + Math.round(this.df * t)
			},
			update : function (e, t) {
				this.st = this.getNow();
				this.ed = e;
				this.spd = t;
				this.ts = (new Date).getTime();
				this.df = this.ed - this.st;
				return this
			}
		};
		if (this.ishwscroll) {
			this.doc.translate = {
				x : 0,
				y : 0,
				tx : "0px",
				ty : "0px"
			};
			E.hastranslate3d && E.isios && this.doc.css("-webkit-backface-visibility", "hidden");
			this.getScrollTop = function (e) {
				if (!e) {
					if (e = l())
						return 16 == e.length ? -e[13] : -e[5];
					if (b.timerscroll && b.timerscroll.bz)
						return b.timerscroll.bz.getNow()
				}
				return b.doc.translate.y
			};
			this.getScrollLeft = function (e) {
				if (!e) {
					if (e = l())
						return 16 == e.length ? -e[12] : -e[4];
					if (b.timerscroll && b.timerscroll.bh)
						return b.timerscroll.bh.getNow()
				}
				return b.doc.translate.x
			};
			this.notifyScrollEvent = function (e) {
				var t = document.createEvent("UIEvents");
				t.initUIEvent("scroll", !1, !0, window, 1);
				t.niceevent = !0;
				e.dispatchEvent(t)
			};
			var C = this.isrtlmode ? 1 : -1;
			E.hastranslate3d && b.opt.enabletranslate3d ? (this.setScrollTop = function (e, t) {
				b.doc.translate.y = e;
				b.doc.translate.ty = -1 * e + "px";
				b.doc.css(E.trstyle, "translate3d(" + b.doc.translate.tx + "," + b.doc.translate.ty + ",0px)");
				t || b.notifyScrollEvent(b.win[0])
			}, this.setScrollLeft = function (e, t) {
				b.doc.translate.x = e;
				b.doc.translate.tx = e * C + "px";
				b.doc.css(E.trstyle, "translate3d(" + b.doc.translate.tx + "," + b.doc.translate.ty + ",0px)");
				t || b.notifyScrollEvent(b.win[0])
			}) : (this.setScrollTop = function (e, t) {
				b.doc.translate.y = e;
				b.doc.translate.ty = -1 * e + "px";
				b.doc.css(E.trstyle, "translate(" + b.doc.translate.tx + "," + b.doc.translate.ty + ")");
				t || b.notifyScrollEvent(b.win[0])
			}, this.setScrollLeft = function (e, t) {
				b.doc.translate.x = e;
				b.doc.translate.tx = e * C + "px";
				b.doc.css(E.trstyle, "translate(" + b.doc.translate.tx + "," + b.doc.translate.ty + ")");
				t || b.notifyScrollEvent(b.win[0])
			})
		} else
			this.getScrollTop = function () {
				return b.docscroll.scrollTop()
			},
		this.setScrollTop = function (e) {
			return b.docscroll.scrollTop(e)
		},
		this.getScrollLeft = function () {
			return b.detected.ismozilla && b.isrtlmode ? Math.abs(b.docscroll.scrollLeft()) : b.docscroll.scrollLeft()
		},
		this.setScrollLeft = function (e) {
			return b.docscroll.scrollLeft(b.detected.ismozilla && b.isrtlmode ? -e : e)
		};
		this.getTarget = function (e) {
			return e ? e.target ? e.target : e.srcElement ? e.srcElement : !1 : !1
		};
		this.hasParent = function (e, t) {
			if (!e)
				return !1;
			for (var n = e.target || e.srcElement || e || !1; n && n.id != t; )
				n = n.parentNode || !1;
			return !1 !== n
		};
		var k = {
			thin : 1,
			medium : 3,
			thick : 5
		};
		this.getDocumentScrollOffset = function () {
			return {
				top : window.pageYOffset || document.documentElement.scrollTop,
				left : window.pageXOffset || document.documentElement.scrollLeft
			}
		};
		this.getOffset = function () {
			if (b.isfixed) {
				var e = b.win.offset(),
				t = b.getDocumentScrollOffset();
				e.top -= t.top;
				e.left -= t.left;
				return e
			}
			e = b.win.offset();
			if (!b.viewport)
				return e;
			t = b.viewport.offset();
			return {
				top : e.top - t.top,
				left : e.left - t.left
			}
		};
		this.updateScrollBar = function (e) {
			if (b.ishwscroll)
				b.rail.css({
					height : b.win.innerHeight() - (b.opt.railpadding.top + b.opt.railpadding.bottom)
				}), b.railh && b.railh.css({
					width : b.win.innerWidth() - (b.opt.railpadding.left + b.opt.railpadding.right)
				});
			else {
				var t = b.getOffset(),
				n = t.top,
				r = t.left - (b.opt.railpadding.left + b.opt.railpadding.right),
				n = n + v(b.win, "border-top-width", !0),
				r = r + (b.rail.align ? b.win.outerWidth() - v(b.win, "border-right-width") - b.rail.width : v(b.win, "border-left-width")),
				i = b.opt.railoffset;
				i && (i.top && (n += i.top), b.rail.align && i.left && (r += i.left));
				b.railslocked || b.rail.css({
					top : n,
					left : r,
					height : (e ? e.h : b.win.innerHeight()) - (b.opt.railpadding.top + b.opt.railpadding.bottom)
				});
				b.zoom && b.zoom.css({
					top : n + 1,
					left : 1 == b.rail.align ? r - 20 : r + b.rail.width + 4
				});
				if (b.railh && !b.railslocked) {
					n = t.top;
					r = t.left;
					if (i = b.opt.railhoffset)
						i.top && (n += i.top), i.left && (r += i.left);
					e = b.railh.align ? n + v(b.win, "border-top-width", !0) + b.win.innerHeight() - b.railh.height : n + v(b.win, "border-top-width", !0);
					r += v(b.win, "border-left-width");
					b.railh.css({
						top : e - (b.opt.railpadding.top + b.opt.railpadding.bottom),
						left : r,
						width : b.railh.width
					})
				}
			}
		};
		this.doRailClick = function (e, t, n) {
			var r;
			b.railslocked || (b.cancelEvent(e), t ? (t = n ? b.doScrollLeft : b.doScrollTop, r = n ? (e.pageX - b.railh.offset().left - b.cursorwidth / 2) * b.scrollratio.x : (e.pageY - b.rail.offset().top - b.cursorheight / 2) * b.scrollratio.y, t(r)) : (t = n ? b.doScrollLeftBy : b.doScrollBy, r = n ? b.scroll.x : b.scroll.y, e = n ? e.pageX - b.railh.offset().left : e.pageY - b.rail.offset().top, n = n ? b.view.w : b.view.h, t(r >= e ? n : -n)))
		};
		b.hasanimationframe = u;
		b.hascancelanimationframe = a;
		b.hasanimationframe ? b.hascancelanimationframe || (a = function () {
			b.cancelAnimationFrame = !0
		}) : (u = function (e) {
			return setTimeout(e, 15 - Math.floor( + (new Date) / 1e3) % 16)
		}, a = clearInterval);
		this.init = function () {
			b.saved.css = [];
			if (E.isie7mobile || E.isoperamini)
				return !0;
			E.hasmstouch && b.css(b.ispage ? e("html") : b.win, {
				"-ms-touch-action" : "none"
			});
			b.zindex = "auto";
			b.zindex = b.ispage || "auto" != b.opt.zindex ? b.opt.zindex : p() || "auto";
			!b.ispage && "auto" != b.zindex && b.zindex > s && (s = b.zindex);
			b.isie && 0 == b.zindex && "auto" == b.opt.zindex && (b.zindex = "auto");
			if (!b.ispage || !E.cantouch && !E.isieold && !E.isie9mobile) {
				var i = b.docscroll;
				b.ispage && (i = b.haswrapper ? b.win : b.doc);
				E.isie9mobile || b.css(i, {
					"overflow-y" : "hidden"
				});
				b.ispage && E.isie7 && ("BODY" == b.doc[0].nodeName ? b.css(e("html"), {
						"overflow-y" : "hidden"
					}) : "HTML" == b.doc[0].nodeName && b.css(e("body"), {
						"overflow-y" : "hidden"
					}));
				!E.isios || b.ispage || b.haswrapper || b.css(e("body"), {
					"-webkit-overflow-scrolling" : "touch"
				});
				var o = e(document.createElement("div"));
				o.css({
					position : "relative",
					top : 0,
					"float" : "right",
					width : b.opt.cursorwidth,
					height : "0px",
					"background-color" : b.opt.cursorcolor,
					border : b.opt.cursorborder,
					"background-clip" : "padding-box",
					"-webkit-border-radius" : b.opt.cursorborderradius,
					"-moz-border-radius" : b.opt.cursorborderradius,
					"border-radius" : b.opt.cursorborderradius
				});
				o.hborder = parseFloat(o.outerHeight() - o.innerHeight());
				o.addClass("nicescroll-cursors");
				b.cursor = o;
				var u = e(document.createElement("div"));
				u.attr("id", b.id);
				u.addClass("nicescroll-rails nicescroll-rails-vr");
				var a,
				f,
				l = ["left", "right", "top", "bottom"],
				h;
				for (h in l)
					f = l[h], (a = b.opt.railpadding[f]) ? u.css("padding-" + f, a + "px") : b.opt.railpadding[f] = 0;
				u.append(o);
				u.width = Math.max(parseFloat(b.opt.cursorwidth), o.outerWidth());
				u.css({
					width : u.width + "px",
					zIndex : b.zindex,
					background : b.opt.background,
					cursor : "default"
				});
				u.visibility = !0;
				u.scrollable = !0;
				u.align = "left" == b.opt.railalign ? 0 : 1;
				b.rail = u;
				o = b.rail.drag = !1;
				!b.opt.boxzoom || b.ispage || E.isieold || (o = document.createElement("div"), b.bind(o, "click", b.doZoom), b.bind(o, "mouseenter", function () {
						b.zoom.css("opacity", b.opt.cursoropacitymax)
					}), b.bind(o, "mouseleave", function () {
						b.zoom.css("opacity", b.opt.cursoropacitymin)
					}), b.zoom = e(o), b.zoom.css({
						cursor : "pointer",
						"z-index" : b.zindex,
						backgroundImage : "url(" + b.opt.scriptpath + "zoomico.png)",
						height : 18,
						width : 18,
						backgroundPosition : "0px 0px"
					}), b.opt.dblclickzoom && b.bind(b.win, "dblclick", b.doZoom), E.cantouch && b.opt.gesturezoom && (b.ongesturezoom = function (e) {
						1.5 < e.scale && b.doZoomIn(e);
						.8 > e.scale && b.doZoomOut(e);
						return b.cancelEvent(e)
					}, b.bind(b.win, "gestureend", b.ongesturezoom)));
				b.railh = !1;
				var d;
				b.opt.horizrailenabled && (b.css(i, {
						"overflow-x" : "hidden"
					}), o = e(document.createElement("div")), o.css({
						position : "absolute",
						top : 0,
						height : b.opt.cursorwidth,
						width : "0px",
						"background-color" : b.opt.cursorcolor,
						border : b.opt.cursorborder,
						"background-clip" : "padding-box",
						"-webkit-border-radius" : b.opt.cursorborderradius,
						"-moz-border-radius" : b.opt.cursorborderradius,
						"border-radius" : b.opt.cursorborderradius
					}), E.isieold && o.css({
						overflow : "hidden"
					}), o.wborder = parseFloat(o.outerWidth() - o.innerWidth()), o.addClass("nicescroll-cursors"), b.cursorh = o, d = e(document.createElement("div")), d.attr("id", b.id + "-hr"), d.addClass("nicescroll-rails nicescroll-rails-hr"), d.height = Math.max(parseFloat(b.opt.cursorwidth), o.outerHeight()), d.css({
						height : d.height + "px",
						zIndex : b.zindex,
						background : b.opt.background
					}), d.append(o), d.visibility = !0, d.scrollable = !0, d.align = "top" == b.opt.railvalign ? 0 : 1, b.railh = d, b.railh.drag = !1);
				b.ispage ? (u.css({
						position : "fixed",
						top : "0px",
						height : "100%"
					}), u.align ? u.css({
						right : "0px"
					}) : u.css({
						left : "0px"
					}), b.body.append(u), b.railh && (d.css({
							position : "fixed",
							left : "0px",
							width : "100%"
						}), d.align ? d.css({
							bottom : "0px"
						}) : d.css({
							top : "0px"
						}), b.body.append(d))) : (b.ishwscroll ? ("static" == b.win.css("position") && b.css(b.win, {
							position : "relative"
						}), i = "HTML" == b.win[0].nodeName ? b.body : b.win, e(i).scrollTop(0).scrollLeft(0), b.zoom && (b.zoom.css({
								position : "absolute",
								top : 1,
								right : 0,
								"margin-right" : u.width + 4
							}), i.append(b.zoom)), u.css({
							position : "absolute",
							top : 0
						}), u.align ? u.css({
							right : 0
						}) : u.css({
							left : 0
						}), i.append(u), d && (d.css({
								position : "absolute",
								left : 0,
								bottom : 0
							}), d.align ? d.css({
								bottom : 0
							}) : d.css({
								top : 0
							}), i.append(d))) : (b.isfixed = "fixed" == b.win.css("position"), i = b.isfixed ? "fixed" : "absolute", b.isfixed || (b.viewport = b.getViewport(b.win[0])), b.viewport && (b.body = b.viewport, 0 == /fixed|absolute/.test(b.viewport.css("position")) && b.css(b.viewport, {
								position : "relative"
							})), u.css({
							position : i
						}), b.zoom && b.zoom.css({
							position : i
						}), b.updateScrollBar(), b.body.append(u), b.zoom && b.body.append(b.zoom), b.railh && (d.css({
								position : i
							}), b.body.append(d))), E.isios && b.css(b.win, {
						"-webkit-tap-highlight-color" : "rgba(0,0,0,0)",
						"-webkit-touch-callout" : "none"
					}), E.isie && b.opt.disableoutline && b.win.attr("hideFocus", "true"), E.iswebkit && b.opt.disableoutline && b.win.css({
						outline : "none"
					}));
				!1 === b.opt.autohidemode ? (b.autohidedom = !1, b.rail.css({
						opacity : b.opt.cursoropacitymax
					}), b.railh && b.railh.css({
						opacity : b.opt.cursoropacitymax
					})) : !0 === b.opt.autohidemode || "leave" === b.opt.autohidemode ? (b.autohidedom = e().add(b.rail), E.isie8 && (b.autohidedom = b.autohidedom.add(b.cursor)), b.railh && (b.autohidedom = b.autohidedom.add(b.railh)), b.railh && E.isie8 && (b.autohidedom = b.autohidedom.add(b.cursorh))) : "scroll" == b.opt.autohidemode ? (b.autohidedom = e().add(b.rail), b.railh && (b.autohidedom = b.autohidedom.add(b.railh))) : "cursor" == b.opt.autohidemode ? (b.autohidedom = e().add(b.cursor), b.railh && (b.autohidedom = b.autohidedom.add(b.cursorh))) : "hidden" == b.opt.autohidemode && (b.autohidedom = !1, b.hide(), b.railslocked = !1);
				if (E.isie9mobile)
					b.scrollmom = new m(b), b.onmangotouch = function () {
						var e = b.getScrollTop(),
						t = b.getScrollLeft();
						if (e == b.scrollmom.lastscrolly && t == b.scrollmom.lastscrollx)
							return !0;
						var n = e - b.mangotouch.sy,
						r = t - b.mangotouch.sx;
						if (0 != Math.round(Math.sqrt(Math.pow(r, 2) + Math.pow(n, 2)))) {
							var i = 0 > n ? -1 : 1,
							s = 0 > r ? -1 : 1,
							o =  + (new Date);
							b.mangotouch.lazy && clearTimeout(b.mangotouch.lazy);
							80 < o - b.mangotouch.tm || b.mangotouch.dry != i || b.mangotouch.drx != s ? (b.scrollmom.stop(), b.scrollmom.reset(t, e), b.mangotouch.sy = e, b.mangotouch.ly = e, b.mangotouch.sx = t, b.mangotouch.lx = t, b.mangotouch.dry = i, b.mangotouch.drx = s, b.mangotouch.tm = o) : (b.scrollmom.stop(), b.scrollmom.update(b.mangotouch.sx - r, b.mangotouch.sy - n), b.mangotouch.tm = o, n = Math.max(Math.abs(b.mangotouch.ly - e), Math.abs(b.mangotouch.lx - t)), b.mangotouch.ly = e, b.mangotouch.lx = t, 2 < n && (b.mangotouch.lazy = setTimeout(function () {
											b.mangotouch.lazy = !1;
											b.mangotouch.dry = 0;
											b.mangotouch.drx = 0;
											b.mangotouch.tm = 0;
											b.scrollmom.doMomentum(30)
										}, 100)))
						}
					},
				u = b.getScrollTop(),
				d = b.getScrollLeft(),
				b.mangotouch = {
					sy : u,
					ly : u,
					dry : 0,
					sx : d,
					lx : d,
					drx : 0,
					lazy : !1,
					tm : 0
				},
				b.bind(b.docscroll, "scroll", b.onmangotouch);
				else {
					if (E.cantouch || b.istouchcapable || b.opt.touchbehavior || E.hasmstouch) {
						b.scrollmom = new m(b);
						b.ontouchstart = function (t) {
							if (t.pointerType && 2 != t.pointerType && "touch" != t.pointerType)
								return !1;
							b.hasmoving = !1;
							if (!b.railslocked) {
								var n;
								if (E.hasmstouch)
									for (n = t.target ? t.target : !1; n; ) {
										var r = e(n).getNiceScroll();
										if (0 < r.length && r[0].me == b.me)
											break;
										if (0 < r.length)
											return !1;
										if ("DIV" == n.nodeName && n.id == b.id)
											break;
										n = n.parentNode ? n.parentNode : !1
									}
								b.cancelScroll();
								if ((n = b.getTarget(t)) && /INPUT/i.test(n.nodeName) && /range/i.test(n.type))
									return b.stopPropagation(t);
								!("clientX" in t) && "changedTouches" in t && (t.clientX = t.changedTouches[0].clientX, t.clientY = t.changedTouches[0].clientY);
								b.forcescreen && (r = t, t = {
										original : t.original ? t.original : t
									}, t.clientX = r.screenX, t.clientY = r.screenY);
								b.rail.drag = {
									x : t.clientX,
									y : t.clientY,
									sx : b.scroll.x,
									sy : b.scroll.y,
									st : b.getScrollTop(),
									sl : b.getScrollLeft(),
									pt : 2,
									dl : !1
								};
								if (b.ispage || !b.opt.directionlockdeadzone)
									b.rail.drag.dl = "f";
								else {
									var r = e(window).width(),
									i = e(window).height(),
									s = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
									o = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
									i = Math.max(0, o - i),
									r = Math.max(0, s - r);
									b.rail.drag.ck = !b.rail.scrollable && b.railh.scrollable ? 0 < i ? "v" : !1 : b.rail.scrollable && !b.railh.scrollable ? 0 < r ? "h" : !1 : !1;
									b.rail.drag.ck || (b.rail.drag.dl = "f")
								}
								b.opt.touchbehavior && b.isiframe && E.isie && (r = b.win.position(), b.rail.drag.x += r.left, b.rail.drag.y += r.top);
								b.hasmoving = !1;
								b.lastmouseup = !1;
								b.scrollmom.reset(t.clientX, t.clientY);
								if (!E.cantouch && !this.istouchcapable && !t.pointerType) {
									if (!n || !/INPUT|SELECT|TEXTAREA/i.test(n.nodeName))
										return !b.ispage && E.hasmousecapture && n.setCapture(), b.opt.touchbehavior ? (n.onclick && !n._onclick && (n._onclick = n.onclick, n.onclick = function (e) {
												if (b.hasmoving)
													return !1;
												n._onclick.call(this, e)
											}), b.cancelEvent(t)) : b.stopPropagation(t);
									/SUBMIT|CANCEL|BUTTON/i.test(e(n).attr("type")) && (pc = {
											tg : n,
											click : !1
										}, b.preventclick = pc)
								}
							}
						};
						b.ontouchend = function (e) {
							if (!b.rail.drag)
								return !0;
							if (2 == b.rail.drag.pt) {
								if (e.pointerType && 2 != e.pointerType && "touch" != e.pointerType)
									return !1;
								b.scrollmom.doMomentum();
								b.rail.drag = !1;
								if (b.hasmoving && (b.lastmouseup = !0, b.hideCursor(), E.hasmousecapture && document.releaseCapture(), !E.cantouch))
									return b.cancelEvent(e)
							} else if (1 == b.rail.drag.pt)
								return b.onmouseup(e)
						};
						var v = b.opt.touchbehavior && b.isiframe && !E.hasmousecapture;
						b.ontouchmove = function (t, n) {
							if (!b.rail.drag || t.targetTouches && b.opt.preventmultitouchscrolling && 1 < t.targetTouches.length || t.pointerType && 2 != t.pointerType && "touch" != t.pointerType)
								return !1;
							if (2 == b.rail.drag.pt) {
								if (E.cantouch && E.isios && "undefined" == typeof t.original)
									return !0;
								b.hasmoving = !0;
								b.preventclick && !b.preventclick.click && (b.preventclick.click = b.preventclick.tg.onclick || !1, b.preventclick.tg.onclick = b.onpreventclick);
								t = e.extend({
										original : t
									}, t);
								"changedTouches" in t && (t.clientX = t.changedTouches[0].clientX, t.clientY = t.changedTouches[0].clientY);
								if (b.forcescreen) {
									var r = t;
									t = {
										original : t.original ? t.original : t
									};
									t.clientX = r.screenX;
									t.clientY = r.screenY
								}
								var i,
								r = i = 0;
								v && !n && (i = b.win.position(), r = -i.left, i = -i.top);
								var s = t.clientY + i;
								i = s - b.rail.drag.y;
								var o = t.clientX + r,
								u = o - b.rail.drag.x,
								a = b.rail.drag.st - i;
								b.ishwscroll && b.opt.bouncescroll ? 0 > a ? a = Math.round(a / 2) : a > b.page.maxh && (a = b.page.maxh + Math.round((a - b.page.maxh) / 2)) : (0 > a && (s = a = 0), a > b.page.maxh && (a = b.page.maxh, s = 0));
								var f;
								b.railh && b.railh.scrollable && (f = b.isrtlmode ? u - b.rail.drag.sl : b.rail.drag.sl - u, b.ishwscroll && b.opt.bouncescroll ? 0 > f ? f = Math.round(f / 2) : f > b.page.maxw && (f = b.page.maxw + Math.round((f - b.page.maxw) / 2)) : (0 > f && (o = f = 0), f > b.page.maxw && (f = b.page.maxw, o = 0)));
								r = !1;
								if (b.rail.drag.dl)
									r = !0, "v" == b.rail.drag.dl ? f = b.rail.drag.sl : "h" == b.rail.drag.dl && (a = b.rail.drag.st);
								else {
									i = Math.abs(i);
									var u = Math.abs(u),
									l = b.opt.directionlockdeadzone;
									if ("v" == b.rail.drag.ck) {
										if (i > l && u <= .3 * i)
											return b.rail.drag = !1, !0;
										u > l && (b.rail.drag.dl = "f", e("body").scrollTop(e("body").scrollTop()))
									} else if ("h" == b.rail.drag.ck) {
										if (u > l && i <= .3 * u)
											return b.rail.drag = !1, !0;
										i > l && (b.rail.drag.dl = "f", e("body").scrollLeft(e("body").scrollLeft()))
									}
								}
								b.synched("touchmove", function () {
									b.rail.drag && 2 == b.rail.drag.pt && (b.prepareTransition && b.prepareTransition(0), b.rail.scrollable && b.setScrollTop(a), b.scrollmom.update(o, s), b.railh && b.railh.scrollable ? (b.setScrollLeft(f), b.showCursor(a, f)) : b.showCursor(a), E.isie10 && document.selection.clear())
								});
								E.ischrome && b.istouchcapable && (r = !1);
								if (r)
									return b.cancelEvent(t)
							} else if (1 == b.rail.drag.pt)
								return b.onmousemove(t)
						}
					}
					b.onmousedown = function (e, t) {
						if (!b.rail.drag || 1 == b.rail.drag.pt) {
							if (b.railslocked)
								return b.cancelEvent(e);
							b.cancelScroll();
							b.rail.drag = {
								x : e.clientX,
								y : e.clientY,
								sx : b.scroll.x,
								sy : b.scroll.y,
								pt : 1,
								hr : !!t
							};
							var n = b.getTarget(e);
							!b.ispage && E.hasmousecapture && n.setCapture();
							b.isiframe && !E.hasmousecapture && (b.saved.csspointerevents = b.doc.css("pointer-events"), b.css(b.doc, {
									"pointer-events" : "none"
								}));
							b.hasmoving = !1;
							return b.cancelEvent(e)
						}
					};
					b.onmouseup = function (e) {
						if (b.rail.drag) {
							if (1 != b.rail.drag.pt)
								return !0;
							E.hasmousecapture && document.releaseCapture();
							b.isiframe && !E.hasmousecapture && b.doc.css("pointer-events", b.saved.csspointerevents);
							b.rail.drag = !1;
							b.hasmoving && b.triggerScrollEnd();
							return b.cancelEvent(e)
						}
					};
					b.onmousemove = function (e) {
						if (b.rail.drag && 1 == b.rail.drag.pt) {
							if (E.ischrome && 0 == e.which)
								return b.onmouseup(e);
							b.cursorfreezed = !0;
							b.hasmoving = !0;
							if (b.rail.drag.hr) {
								b.scroll.x = b.rail.drag.sx + (e.clientX - b.rail.drag.x);
								0 > b.scroll.x && (b.scroll.x = 0);
								var t = b.scrollvaluemaxw;
								b.scroll.x > t && (b.scroll.x = t)
							} else
								b.scroll.y = b.rail.drag.sy + (e.clientY - b.rail.drag.y), 0 > b.scroll.y && (b.scroll.y = 0), t = b.scrollvaluemax, b.scroll.y > t && (b.scroll.y = t);
							b.synched("mousemove", function () {
								b.rail.drag && 1 == b.rail.drag.pt && (b.showCursor(), b.rail.drag.hr ? b.hasreversehr ? b.doScrollLeft(b.scrollvaluemaxw - Math.round(b.scroll.x * b.scrollratio.x), b.opt.cursordragspeed) : b.doScrollLeft(Math.round(b.scroll.x * b.scrollratio.x), b.opt.cursordragspeed) : b.doScrollTop(Math.round(b.scroll.y * b.scrollratio.y), b.opt.cursordragspeed))
							});
							return b.cancelEvent(e)
						}
					};
					if (E.cantouch || b.opt.touchbehavior)
						b.onpreventclick = function (e) {
							if (b.preventclick)
								return b.preventclick.tg.onclick = b.preventclick.click, b.preventclick = !1, b.cancelEvent(e)
						},
					b.bind(b.win, "mousedown", b.ontouchstart),
					b.onclick = E.isios ? !1 : function (e) {
						return b.lastmouseup ? (b.lastmouseup = !1, b.cancelEvent(e)) : !0
					},
					b.opt.grabcursorenabled && E.cursorgrabvalue && (b.css(b.ispage ? b.doc : b.win, {
							cursor : E.cursorgrabvalue
						}), b.css(b.rail, {
							cursor : E.cursorgrabvalue
						}));
					else {
						var g = function (e) {
							if (b.selectiondrag) {
								if (e) {
									var t = b.win.outerHeight();
									e = e.pageY - b.selectiondrag.top;
									0 < e && e < t && (e = 0);
									e >= t && (e -= t);
									b.selectiondrag.df = e
								}
								0 != b.selectiondrag.df && (b.doScrollBy(2 * -Math.floor(b.selectiondrag.df / 6)), b.debounced("doselectionscroll", function () {
										g()
									}, 50))
							}
						};
						b.hasTextSelected = "getSelection" in document ? function () {
							return 0 < document.getSelection().rangeCount
						}
						 : "selection" in document ? function () {
							return "None" != document.selection.type
						}
						 : function () {
							return !1
						};
						b.onselectionstart = function (e) {
							b.ispage || (b.selectiondrag = b.win.offset())
						};
						b.onselectionend = function (e) {
							b.selectiondrag = !1
						};
						b.onselectiondrag = function (e) {
							b.selectiondrag && b.hasTextSelected() && b.debounced("selectionscroll", function () {
								g(e)
							}, 250)
						}
					}
					E.hasw3ctouch ? (b.css(b.rail, {
							"touch-action" : "none"
						}), b.css(b.cursor, {
							"touch-action" : "none"
						}), b.bind(b.win, "pointerdown", b.ontouchstart), b.bind(document, "pointerup", b.ontouchend), b.bind(document, "pointermove", b.ontouchmove)) : E.hasmstouch ? (b.css(b.rail, {
							"-ms-touch-action" : "none"
						}), b.css(b.cursor, {
							"-ms-touch-action" : "none"
						}), b.bind(b.win, "MSPointerDown", b.ontouchstart), b.bind(document, "MSPointerUp", b.ontouchend), b.bind(document, "MSPointerMove", b.ontouchmove), b.bind(b.cursor, "MSGestureHold", function (e) {
							e.preventDefault()
						}), b.bind(b.cursor, "contextmenu", function (e) {
							e.preventDefault()
						})) : this.istouchcapable && (b.bind(b.win, "touchstart", b.ontouchstart), b.bind(document, "touchend", b.ontouchend), b.bind(document, "touchcancel", b.ontouchend), b.bind(document, "touchmove", b.ontouchmove));
					if (b.opt.cursordragontouch || !E.cantouch && !b.opt.touchbehavior)
						b.rail.css({
							cursor : "default"
						}), b.railh && b.railh.css({
							cursor : "default"
						}), b.jqbind(b.rail, "mouseenter", function () {
							if (!b.ispage && !b.win.is(":visible"))
								return !1;
							b.canshowonmouseevent && b.showCursor();
							b.rail.active = !0
						}), b.jqbind(b.rail, "mouseleave", function () {
							b.rail.active = !1;
							b.rail.drag || b.hideCursor()
						}), b.opt.sensitiverail && (b.bind(b.rail, "click", function (e) {
								b.doRailClick(e, !1, !1)
							}), b.bind(b.rail, "dblclick", function (e) {
								b.doRailClick(e, !0, !1)
							}), b.bind(b.cursor, "click", function (e) {
								b.cancelEvent(e)
							}), b.bind(b.cursor, "dblclick", function (e) {
								b.cancelEvent(e)
							})), b.railh && (b.jqbind(b.railh, "mouseenter", function () {
								if (!b.ispage && !b.win.is(":visible"))
									return !1;
								b.canshowonmouseevent && b.showCursor();
								b.rail.active = !0
							}), b.jqbind(b.railh, "mouseleave", function () {
								b.rail.active = !1;
								b.rail.drag || b.hideCursor()
							}), b.opt.sensitiverail && (b.bind(b.railh, "click", function (e) {
									b.doRailClick(e, !1, !0)
								}), b.bind(b.railh, "dblclick", function (e) {
									b.doRailClick(e, !0, !0)
								}), b.bind(b.cursorh, "click", function (e) {
									b.cancelEvent(e)
								}), b.bind(b.cursorh, "dblclick", function (e) {
									b.cancelEvent(e)
								})));
					E.cantouch || b.opt.touchbehavior ? (b.bind(E.hasmousecapture ? b.win : document, "mouseup", b.ontouchend), b.bind(document, "mousemove", b.ontouchmove), b.onclick && b.bind(document, "click", b.onclick), b.opt.cursordragontouch && (b.bind(b.cursor, "mousedown", b.onmousedown), b.bind(b.cursor, "mouseup", b.onmouseup), b.cursorh && b.bind(b.cursorh, "mousedown", function (e) {
								b.onmousedown(e, !0)
							}), b.cursorh && b.bind(b.cursorh, "mouseup", b.onmouseup))) : (b.bind(E.hasmousecapture ? b.win : document, "mouseup", b.onmouseup), b.bind(document, "mousemove", b.onmousemove), b.onclick && b.bind(document, "click", b.onclick), b.bind(b.cursor, "mousedown", b.onmousedown), b.bind(b.cursor, "mouseup", b.onmouseup), b.railh && (b.bind(b.cursorh, "mousedown", function (e) {
								b.onmousedown(e, !0)
							}), b.bind(b.cursorh, "mouseup", b.onmouseup)), !b.ispage && b.opt.enablescrollonselection && (b.bind(b.win[0], "mousedown", b.onselectionstart), b.bind(document, "mouseup", b.onselectionend), b.bind(b.cursor, "mouseup", b.onselectionend), b.cursorh && b.bind(b.cursorh, "mouseup", b.onselectionend), b.bind(document, "mousemove", b.onselectiondrag)), b.zoom && (b.jqbind(b.zoom, "mouseenter", function () {
								b.canshowonmouseevent && b.showCursor();
								b.rail.active = !0
							}), b.jqbind(b.zoom, "mouseleave", function () {
								b.rail.active = !1;
								b.rail.drag || b.hideCursor()
							})));
					b.opt.enablemousewheel && (b.isiframe || b.bind(E.isie && b.ispage ? document : b.win, "mousewheel", b.onmousewheel), b.bind(b.rail, "mousewheel", b.onmousewheel), b.railh && b.bind(b.railh, "mousewheel", b.onmousewheelhr));
					b.ispage || E.cantouch || /HTML|^BODY/.test(b.win[0].nodeName) || (b.win.attr("tabindex") || b.win.attr({
							tabindex : r++
						}), b.jqbind(b.win, "focus", function (e) {
							t = b.getTarget(e).id || !0;
							b.hasfocus = !0;
							b.canshowonmouseevent && b.noticeCursor()
						}), b.jqbind(b.win, "blur", function (e) {
							t = !1;
							b.hasfocus = !1
						}), b.jqbind(b.win, "mouseenter", function (e) {
							n = b.getTarget(e).id || !0;
							b.hasmousefocus = !0;
							b.canshowonmouseevent && b.noticeCursor()
						}), b.jqbind(b.win, "mouseleave", function () {
							n = !1;
							b.hasmousefocus = !1;
							b.rail.drag || b.hideCursor()
						}))
				}
				b.onkeypress = function (r) {
					if (b.railslocked && 0 == b.page.maxh)
						return !0;
					r = r ? r : window.e;
					var i = b.getTarget(r);
					if (i && /INPUT|TEXTAREA|SELECT|OPTION/.test(i.nodeName) && (!i.getAttribute("type") && !i.type || !/submit|button|cancel/i.tp) || e(i).attr("contenteditable"))
						return !0;
					if (b.hasfocus || b.hasmousefocus && !t || b.ispage && !t && !n) {
						i = r.keyCode;
						if (b.railslocked && 27 != i)
							return b.cancelEvent(r);
						var s = r.ctrlKey || !1,
						o = r.shiftKey || !1,
						u = !1;
						switch (i) {
						case 38:
						case 63233:
							b.doScrollBy(72);
							u = !0;
							break;
						case 40:
						case 63235:
							b.doScrollBy(-72);
							u = !0;
							break;
						case 37:
						case 63232:
							b.railh && (s ? b.doScrollLeft(0) : b.doScrollLeftBy(72), u = !0);
							break;
						case 39:
						case 63234:
							b.railh && (s ? b.doScrollLeft(b.page.maxw) : b.doScrollLeftBy(-72), u = !0);
							break;
						case 33:
						case 63276:
							b.doScrollBy(b.view.h);
							u = !0;
							break;
						case 34:
						case 63277:
							b.doScrollBy(-b.view.h);
							u = !0;
							break;
						case 36:
						case 63273:
							b.railh && s ? b.doScrollPos(0, 0) : b.doScrollTo(0);
							u = !0;
							break;
						case 35:
						case 63275:
							b.railh && s ? b.doScrollPos(b.page.maxw, b.page.maxh) : b.doScrollTo(b.page.maxh);
							u = !0;
							break;
						case 32:
							b.opt.spacebarenabled && (o ? b.doScrollBy(b.view.h) : b.doScrollBy(-b.view.h), u = !0);
							break;
						case 27:
							b.zoomactive && (b.doZoom(), u = !0)
						}
						if (u)
							return b.cancelEvent(r)
					}
				};
				b.opt.enablekeyboard && b.bind(document, E.isopera && !E.isopera12 ? "keypress" : "keydown", b.onkeypress);
				b.bind(document, "keydown", function (e) {
					e.ctrlKey && (b.wheelprevented = !0)
				});
				b.bind(document, "keyup", function (e) {
					if(b) {
						e.ctrlKey || (b.wheelprevented = !1)
					}
				});
				b.bind(window, "blur", function (e) {
					if(b) {
						b.wheelprevented = !1
					}
				});
				b.bind(window, "resize", b.lazyResize);
				b.bind(window, "orientationchange", b.lazyResize);
				b.bind(window, "load", b.lazyResize);
				if (E.ischrome && !b.ispage && !b.haswrapper) {
					var y = b.win.attr("style"),
					u = parseFloat(b.win.css("width")) + 1;
					b.win.css("width", u);
					b.synched("chromefix", function () {
						b.win.attr("style", y)
					})
				}
				b.onAttributeChange = function (e) {
					b.lazyResize(b.isieold ? 250 : 30)
				};
				!1 !== c && (b.observerbody = new c(function (t) {
							t.forEach(function (t) {
								if ("attributes" == t.type)
									return e("body").hasClass("modal-open") ? b.hide() : b.show()
							});
							if (document.body.scrollHeight != b.page.maxh)
								return b.lazyResize(30)
						}), b.observerbody.observe(document.body, {
						childList : !0,
						subtree : !0,
						characterData : !1,
						attributes : !0,
						attributeFilter : ["class"]
					}));
				b.ispage || b.haswrapper || (!1 !== c ? (b.observer = new c(function (e) {
								e.forEach(b.onAttributeChange)
							}), b.observer.observe(b.win[0], {
							childList : !0,
							characterData : !1,
							attributes : !0,
							subtree : !1
						}), b.observerremover = new c(function (e) {
								e.forEach(function (e) {
									if (0 < e.removedNodes.length)
										for (var t in e.removedNodes)
											if (b && e.removedNodes[t] == b.win[0])
												return b.remove()
								})
							}), b.observerremover.observe(b.win[0].parentNode, {
							childList : !0,
							characterData : !1,
							attributes : !1,
							subtree : !1
						})) : (b.bind(b.win, E.isie && !E.isie9 ? "propertychange" : "DOMAttrModified", b.onAttributeChange), E.isie9 && b.win[0].attachEvent("onpropertychange", b.onAttributeChange), b.bind(b.win, "DOMNodeRemoved", function (e) {
							e.target == b.win[0] && b.remove()
						})));
				!b.ispage && b.opt.boxzoom && b.bind(window, "resize", b.resizeZoom);
				b.istextarea && b.bind(b.win, "mouseup", b.lazyResize);
				b.lazyResize(30)
			}
			if ("IFRAME" == this.doc[0].nodeName) {
				var w = function () {
					b.iframexd = !1;
					var t;
					try {
						t = "contentDocument" in this ? this.contentDocument : this.contentWindow.document
					} catch (n) {
						b.iframexd = !0,
						t = !1
					}
					if (b.iframexd)
						return "console" in window && console.log("NiceScroll error: policy restriced iframe"), !0;
					b.forcescreen = !0;
					b.isiframe && (b.iframe = {
							doc : e(t),
							html : b.doc.contents().find("html")[0],
							body : b.doc.contents().find("body")[0]
						}, b.getContentSize = function () {
						return {
							w : Math.max(b.iframe.html.scrollWidth, b.iframe.body.scrollWidth),
							h : Math.max(b.iframe.html.scrollHeight, b.iframe.body.scrollHeight)
						}
					}, b.docscroll = e(b.iframe.body));
					if (!E.isios && b.opt.iframeautoresize && !b.isiframe) {
						b.win.scrollTop(0);
						b.doc.height("");
						var r = Math.max(t.getElementsByTagName("html")[0].scrollHeight, t.body.scrollHeight);
						b.doc.height(r)
					}
					b.lazyResize(30);
					E.isie7 && b.css(e(b.iframe.html), {
						"overflow-y" : "hidden"
					});
					b.css(e(b.iframe.body), {
						"overflow-y" : "hidden"
					});
					E.isios && b.haswrapper && b.css(e(t.body), {
						"-webkit-transform" : "translate3d(0,0,0)"
					});
					"contentWindow" in this ? b.bind(this.contentWindow, "scroll", b.onscroll) : b.bind(t, "scroll", b.onscroll);
					b.opt.enablemousewheel && b.bind(t, "mousewheel", b.onmousewheel);
					b.opt.enablekeyboard && b.bind(t, E.isopera ? "keypress" : "keydown", b.onkeypress);
					if (E.cantouch || b.opt.touchbehavior)
						b.bind(t, "mousedown", b.ontouchstart), b.bind(t, "mousemove", function (e) {
							return b.ontouchmove(e, !0)
						}), b.opt.grabcursorenabled && E.cursorgrabvalue && b.css(e(t.body), {
							cursor : E.cursorgrabvalue
						});
					b.bind(t, "mouseup", b.ontouchend);
					b.zoom && (b.opt.dblclickzoom && b.bind(t, "dblclick", b.doZoom), b.ongesturezoom && b.bind(t, "gestureend", b.ongesturezoom))
				};
				this.doc[0].readyState && "complete" == this.doc[0].readyState && setTimeout(function () {
					w.call(b.doc[0], !1)
				}, 500);
				b.bind(this.doc, "load", w)
			}
		};
		this.showCursor = function (e, t) {
			b.cursortimeout && (clearTimeout(b.cursortimeout), b.cursortimeout = 0);
			if (b.rail) {
				b.autohidedom && (b.autohidedom.stop().css({
						opacity : b.opt.cursoropacitymax
					}), b.cursoractive = !0);
				b.rail.drag && 1 == b.rail.drag.pt || ("undefined" != typeof e && !1 !== e && (b.scroll.y = Math.round(1 * e / b.scrollratio.y)), "undefined" != typeof t && (b.scroll.x = Math.round(1 * t / b.scrollratio.x)));
				b.cursor.css({
					height : b.cursorheight,
					top : b.scroll.y
				});
				if (b.cursorh) {
					var n = b.hasreversehr ? b.scrollvaluemaxw - b.scroll.x : b.scroll.x;
					!b.rail.align && b.rail.visibility ? b.cursorh.css({
						width : b.cursorwidth,
						left : n + b.rail.width
					}) : b.cursorh.css({
						width : b.cursorwidth,
						left : n
					});
					b.cursoractive = !0
				}
				b.zoom && b.zoom.stop().css({
					opacity : b.opt.cursoropacitymax
				})
			}
		};
		this.hideCursor = function (e) {
			b.cursortimeout || !b.rail || !b.autohidedom || b.hasmousefocus && "leave" == b.opt.autohidemode || (b.cursortimeout = setTimeout(function () {
						b.rail.active && b.showonmouseevent || (b.autohidedom.stop().animate({
								opacity : b.opt.cursoropacitymin
							}), b.zoom && b.zoom.stop().animate({
								opacity : b.opt.cursoropacitymin
							}), b.cursoractive = !1);
						b.cursortimeout = 0
					}, e || b.opt.hidecursordelay))
		};
		this.noticeCursor = function (e, t, n) {
			b.showCursor(t, n);
			b.rail.active || b.hideCursor(e)
		};
		this.getContentSize = b.ispage ? function () {
			return {
				w : Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
				h : Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
			}
		}
		 : b.haswrapper ? function () {
			return {
				w : b.doc.outerWidth() + parseInt(b.win.css("paddingLeft")) + parseInt(b.win.css("paddingRight")),
				h : b.doc.outerHeight() + parseInt(b.win.css("paddingTop")) + parseInt(b.win.css("paddingBottom"))
			}
		}
		 : function () {
			return {
				w : b.docscroll[0].scrollWidth,
				h : b.docscroll[0].scrollHeight
			}
		};
		this.onResize = function (e, t) {
			if (!b || !b.win)
				return !1;
			if (!b.haswrapper && !b.ispage) {
				if ("none" == b.win.css("display"))
					return b.visibility && b.hideRail().hideRailHr(), !1;
				b.hidden || b.visibility || b.showRail().showRailHr()
			}
			var n = b.page.maxh,
			r = b.page.maxw,
			i = b.view.h,
			s = b.view.w;
			b.view = {
				w : b.ispage ? b.win.width() : parseInt(b.win[0].clientWidth),
				h : b.ispage ? b.win.height() : parseInt(b.win[0].clientHeight)
			};
			b.page = t ? t : b.getContentSize();
			b.page.maxh = Math.max(0, b.page.h - b.view.h);
			b.page.maxw = Math.max(0, b.page.w - b.view.w);
			if (b.page.maxh == n && b.page.maxw == r && b.view.w == s && b.view.h == i) {
				if (b.ispage)
					return b;
				n = b.win.offset();
				if (b.lastposition && (r = b.lastposition, r.top == n.top && r.left == n.left))
					return b;
				b.lastposition = n
			}
			0 == b.page.maxh ? (b.hideRail(), b.scrollvaluemax = 0, b.scroll.y = 0, b.scrollratio.y = 0, b.cursorheight = 0, b.setScrollTop(0), b.rail.scrollable = !1) : (b.page.maxh -= b.opt.railpadding.top + b.opt.railpadding.bottom, b.rail.scrollable = !0);
			0 == b.page.maxw ? (b.hideRailHr(), b.scrollvaluemaxw = 0, b.scroll.x = 0, b.scrollratio.x = 0, b.cursorwidth = 0, b.setScrollLeft(0), b.railh.scrollable = !1) : (b.page.maxw -= b.opt.railpadding.left + b.opt.railpadding.right, b.railh.scrollable = !0);
			b.railslocked = b.locked || 0 == b.page.maxh && 0 == b.page.maxw;
			if (b.railslocked)
				return b.ispage || b.updateScrollBar(b.view), !1;
			b.hidden || b.visibility ? b.hidden || b.railh.visibility || b.showRailHr() : b.showRail().showRailHr();
			b.istextarea && b.win.css("resize") && "none" != b.win.css("resize") && (b.view.h -= 20);
			b.cursorheight = Math.min(b.view.h, Math.round(b.view.h / b.page.h * b.view.h));
			b.cursorheight = b.opt.cursorfixedheight ? b.opt.cursorfixedheight : Math.max(b.opt.cursorminheight, b.cursorheight);
			b.cursorwidth = Math.min(b.view.w, Math.round(b.view.w / b.page.w * b.view.w));
			b.cursorwidth = b.opt.cursorfixedheight ? b.opt.cursorfixedheight : Math.max(b.opt.cursorminheight, b.cursorwidth);
			b.scrollvaluemax = b.view.h - b.cursorheight - b.cursor.hborder - (b.opt.railpadding.top + b.opt.railpadding.bottom);
			b.railh && (b.railh.width = 0 < b.page.maxh ? b.view.w - b.rail.width : b.view.w, b.scrollvaluemaxw = b.railh.width - b.cursorwidth - b.cursorh.wborder - (b.opt.railpadding.left + b.opt.railpadding.right));
			b.ispage || b.updateScrollBar(b.view);
			b.scrollratio = {
				x : b.page.maxw / b.scrollvaluemaxw,
				y : b.page.maxh / b.scrollvaluemax
			};
			b.getScrollTop() > b.page.maxh ? b.doScrollTop(b.page.maxh) : (b.scroll.y = Math.round(b.getScrollTop() * (1 / b.scrollratio.y)), b.scroll.x = Math.round(b.getScrollLeft() * (1 / b.scrollratio.x)), b.cursoractive && b.noticeCursor());
			b.scroll.y && 0 == b.getScrollTop() && b.doScrollTo(Math.floor(b.scroll.y * b.scrollratio.y));
			return b
		};
		this.resize = b.onResize;
		this.lazyResize = function (e) {
			e = isNaN(e) ? 30 : e;
			b.debounced("resize", b.resize, e);
			return b
		};
		this.jqbind = function (t, n, r) {
			b.events.push({
				e : t,
				n : n,
				f : r,
				q : !0
			});
			e(t).bind(n, r)
		};
		this.bind = function (e, t, n, r) {
			var i = "jquery" in e ? e[0] : e;
			"mousewheel" == t ? window.addEventListener || "onwheel" in document ? b._bind(i, "wheel", n, r || !1) : (e = "undefined" != typeof document.onmousewheel ? "mousewheel" : "DOMMouseScroll", g(i, e, n, r || !1), "DOMMouseScroll" == e && g(i, "MozMousePixelScroll", n, r || !1)) : i.addEventListener ? (E.cantouch && /mouseup|mousedown|mousemove/.test(t) && b._bind(i, "mousedown" == t ? "touchstart" : "mouseup" == t ? "touchend" : "touchmove", function (e) {
					if (e.touches) {
						if (2 > e.touches.length) {
							var t = e.touches.length ? e.touches[0] : e;
							t.original = e;
							n.call(this, t)
						}
					} else
						e.changedTouches && (t = e.changedTouches[0], t.original = e, n.call(this, t))
				}, r || !1), b._bind(i, t, n, r || !1), E.cantouch && "mouseup" == t && b._bind(i, "touchcancel", n, r || !1)) : b._bind(i, t, function (e) {
				(e = e || window.event || !1) && e.srcElement && (e.target = e.srcElement);
				"pageY" in e || (e.pageX = e.clientX + document.documentElement.scrollLeft, e.pageY = e.clientY + document.documentElement.scrollTop);
				return !1 === n.call(i, e) || !1 === r ? b.cancelEvent(e) : !0
			})
		};
		E.haseventlistener ? (this._bind = function (e, t, n, r) {
			b.events.push({
				e : e,
				n : t,
				f : n,
				b : r,
				q : !1
			});
			e.addEventListener(t, n, r || !1)
		}, this.cancelEvent = function (e) {
			if (!e)
				return !1;
			e = e.original ? e.original : e;
			e.preventDefault();
			e.stopPropagation();
			e.preventManipulation && e.preventManipulation();
			return !1
		}, this.stopPropagation = function (e) {
			if (!e)
				return !1;
			e = e.original ? e.original : e;
			e.stopPropagation();
			return !1
		}, this._unbind = function (e, t, n, r) {
			e.removeEventListener(t, n, r)
		}) : (this._bind = function (e, t, n, r) {
			b.events.push({
				e : e,
				n : t,
				f : n,
				b : r,
				q : !1
			});
			e.attachEvent ? e.attachEvent("on" + t, n) : e["on" + t] = n
		}, this.cancelEvent = function (e) {
			e = window.event || !1;
			if (!e)
				return !1;
			e.cancelBubble = !0;
			e.cancel = !0;
			return e.returnValue = !1
		}, this.stopPropagation = function (e) {
			e = window.event || !1;
			if (!e)
				return !1;
			e.cancelBubble = !0;
			return !1
		}, this._unbind = function (e, t, n, r) {
			e.detachEvent ? e.detachEvent("on" + t, n) : e["on" + t] = !1
		});
		this.unbindAll = function () {
			for (var e = 0; e < b.events.length; e++) {
				var t = b.events[e];
				t.q ? t.e.unbind(t.n, t.f) : b._unbind(t.e, t.n, t.f, t.b)
			}
		};
		this.showRail = function () {
			0 == b.page.maxh || !b.ispage && "none" == b.win.css("display") || (b.visibility = !0, b.rail.visibility = !0, b.rail.css("display", "block"));
			return b
		};
		this.showRailHr = function () {
			if (!b.railh)
				return b;
			0 == b.page.maxw || !b.ispage && "none" == b.win.css("display") || (b.railh.visibility = !0, b.railh.css("display", "block"));
			return b
		};
		this.hideRail = function () {
			b.visibility = !1;
			b.rail.visibility = !1;
			b.rail.css("display", "none");
			return b
		};
		this.hideRailHr = function () {
			if (!b.railh)
				return b;
			b.railh.visibility = !1;
			b.railh.css("display", "none");
			return b
		};
		this.show = function () {
			b.hidden = !1;
			b.railslocked = !1;
			return b.showRail().showRailHr()
		};
		this.hide = function () {
			b.hidden = !0;
			b.railslocked = !0;
			return b.hideRail().hideRailHr()
		};
		this.toggle = function () {
			return b.hidden ? b.show() : b.hide()
		};
		this.remove = function () {
			b.stop();
			b.cursortimeout && clearTimeout(b.cursortimeout);
			b.doZoomOut();
			b.unbindAll();
			E.isie9 && b.win[0].detachEvent("onpropertychange", b.onAttributeChange);
			!1 !== b.observer && b.observer.disconnect();
			!1 !== b.observerremover && b.observerremover.disconnect();
			!1 !== b.observerbody && b.observerbody.disconnect();
			b.events = null;
			b.cursor && b.cursor.remove();
			b.cursorh && b.cursorh.remove();
			b.rail && b.rail.remove();
			b.railh && b.railh.remove();
			b.zoom && b.zoom.remove();
			for (var t = 0; t < b.saved.css.length; t++) {
				var n = b.saved.css[t];
				n[0].css(n[1], "undefined" == typeof n[2] ? "" : n[2])
			}
			b.saved = !1;
			b.me.data("__nicescroll", "");
			var r = e.nicescroll;
			r.each(function (e) {
				if (this && this.id === b.id) {
					delete r[e];
					for (var t = ++e; t < r.length; t++, e++)
						r[e] = r[t];
					r.length--;
					r.length && delete r[r.length]
				}
			});
			for (var i in b)
				b[i] = null, delete b[i];
			b = null
		};
		this.scrollstart = function (e) {
			this.onscrollstart = e;
			return b
		};
		this.scrollend = function (e) {
			this.onscrollend = e;
			return b
		};
		this.scrollcancel = function (e) {
			this.onscrollcancel = e;
			return b
		};
		this.zoomin = function (e) {
			this.onzoomin = e;
			return b
		};
		this.zoomout = function (e) {
			this.onzoomout = e;
			return b
		};
		this.isScrollable = function (t) {
			t = t.target ? t.target : t;
			if ("OPTION" == t.nodeName)
				return !0;
			for (; t && 1 == t.nodeType && !/^BODY|HTML/.test(t.nodeName); ) {
				var n = e(t),
				n = n.css("overflowY") || n.css("overflowX") || n.css("overflow") || "";
				if (/scroll|auto/.test(n))
					return t.clientHeight != t.scrollHeight;
				t = t.parentNode ? t.parentNode : !1
			}
			return !1
		};
		this.getViewport = function (t) {
			for (t = t && t.parentNode ? t.parentNode : !1; t && 1 == t.nodeType && !/^BODY|HTML/.test(t.nodeName); ) {
				var n = e(t);
				if (/fixed|absolute/.test(n.css("position")))
					return n;
				var r = n.css("overflowY") || n.css("overflowX") || n.css("overflow") || "";
				if (/scroll|auto/.test(r) && t.clientHeight != t.scrollHeight || 0 < n.getNiceScroll().length)
					return n;
				t = t.parentNode ? t.parentNode : !1
			}
			return !1
		};
		this.triggerScrollEnd = function () {
			if (b.onscrollend) {
				var e = b.getScrollLeft(),
				t = b.getScrollTop();
				b.onscrollend.call(b, {
					type : "scrollend",
					current : {
						x : e,
						y : t
					},
					end : {
						x : e,
						y : t
					}
				})
			}
		};
		this.onmousewheel = function (e) {
			if (!b.wheelprevented) {
				if (b.railslocked)
					return b.debounced("checkunlock", b.resize, 250), !0;
				if (b.rail.drag)
					return b.cancelEvent(e);
				"auto" == b.opt.oneaxismousemode && 0 != e.deltaX && (b.opt.oneaxismousemode = !1);
				if (b.opt.oneaxismousemode && 0 == e.deltaX && !b.rail.scrollable)
					return b.railh && b.railh.scrollable ? b.onmousewheelhr(e) : !0;
				var t =  + (new Date),
				n = !1;
				b.opt.preservenativescrolling && b.checkarea + 600 < t && (b.nativescrollingarea = b.isScrollable(e), n = !0);
				b.checkarea = t;
				if (b.nativescrollingarea)
					return !0;
				if (e = y(e, !1, n))
					b.checkarea = 0;
				return e
			}
		};
		this.onmousewheelhr = function (e) {
			if (!b.wheelprevented) {
				if (b.railslocked || !b.railh.scrollable)
					return !0;
				if (b.rail.drag)
					return b.cancelEvent(e);
				var t =  + (new Date),
				n = !1;
				b.opt.preservenativescrolling && b.checkarea + 600 < t && (b.nativescrollingarea = b.isScrollable(e), n = !0);
				b.checkarea = t;
				return b.nativescrollingarea ? !0 : b.railslocked ? b.cancelEvent(e) : y(e, !0, n)
			}
		};
		this.stop = function () {
			b.cancelScroll();
			b.scrollmon && b.scrollmon.stop();
			b.cursorfreezed = !1;
			b.scroll.y = Math.round(b.getScrollTop() * (1 / b.scrollratio.y));
			b.noticeCursor();
			return b
		};
		this.getTransitionSpeed = function (e) {
			var t = Math.round(10 * b.opt.scrollspeed);
			e = Math.min(t, Math.round(e / 20 * b.opt.scrollspeed));
			return 20 < e ? e : 0
		};
		b.opt.smoothscroll ? b.ishwscroll && E.hastransition && b.opt.usetransition && b.opt.smoothscroll ? (this.prepareTransition = function (e, t) {
			var n = t ? 20 < e ? e : 0 : b.getTransitionSpeed(e),
			r = n ? E.prefixstyle + "transform " + n + "ms ease-out" : "";
			b.lasttransitionstyle && b.lasttransitionstyle == r || (b.lasttransitionstyle = r, b.doc.css(E.transitionstyle, r));
			return n
		}, this.doScrollLeft = function (e, t) {
			var n = b.scrollrunning ? b.newscrolly : b.getScrollTop();
			b.doScrollPos(e, n, t)
		}, this.doScrollTop = function (e, t) {
			var n = b.scrollrunning ? b.newscrollx : b.getScrollLeft();
			b.doScrollPos(n, e, t)
		}, this.doScrollPos = function (e, t, n) {
			var r = b.getScrollTop(),
			i = b.getScrollLeft();
			(0 > (b.newscrolly - r) * (t - r) || 0 > (b.newscrollx - i) * (e - i)) && b.cancelScroll();
			0 == b.opt.bouncescroll && (0 > t ? t = 0 : t > b.page.maxh && (t = b.page.maxh), 0 > e ? e = 0 : e > b.page.maxw && (e = b.page.maxw));
			if (b.scrollrunning && e == b.newscrollx && t == b.newscrolly)
				return !1;
			b.newscrolly = t;
			b.newscrollx = e;
			b.newscrollspeed = n || !1;
			if (b.timer)
				return !1;
			b.timer = setTimeout(function () {
					var n = b.getScrollTop(),
					r = b.getScrollLeft(),
					i,
					s;
					i = e - r;
					s = t - n;
					i = Math.round(Math.sqrt(Math.pow(i, 2) + Math.pow(s, 2)));
					i = b.newscrollspeed && 1 < b.newscrollspeed ? b.newscrollspeed : b.getTransitionSpeed(i);
					b.newscrollspeed && 1 >= b.newscrollspeed && (i *= b.newscrollspeed);
					b.prepareTransition(i, !0);
					b.timerscroll && b.timerscroll.tm && clearInterval(b.timerscroll.tm);
					0 < i && (!b.scrollrunning && b.onscrollstart && b.onscrollstart.call(b, {
							type : "scrollstart",
							current : {
								x : r,
								y : n
							},
							request : {
								x : e,
								y : t
							},
							end : {
								x : b.newscrollx,
								y : b.newscrolly
							},
							speed : i
						}), E.transitionend ? b.scrollendtrapped || (b.scrollendtrapped = !0, b.bind(b.doc, E.transitionend, b.onScrollTransitionEnd, !1)) : (b.scrollendtrapped && clearTimeout(b.scrollendtrapped), b.scrollendtrapped = setTimeout(b.onScrollTransitionEnd, i)), b.timerscroll = {
							bz : new T(n, b.newscrolly, i, 0, 0, .58, 1),
							bh : new T(r, b.newscrollx, i, 0, 0, .58, 1)
						}, b.cursorfreezed || (b.timerscroll.tm = setInterval(function () {
									b.showCursor(b.getScrollTop(), b.getScrollLeft())
								}, 60)));
					b.synched("doScroll-set", function () {
						b.timer = 0;
						b.scrollendtrapped && (b.scrollrunning = !0);
						b.setScrollTop(b.newscrolly);
						b.setScrollLeft(b.newscrollx);
						if (!b.scrollendtrapped)
							b.onScrollTransitionEnd()
					})
				}, 50)
		}, this.cancelScroll = function () {
			if (!b.scrollendtrapped)
				return !0;
			var e = b.getScrollTop(),
			t = b.getScrollLeft();
			b.scrollrunning = !1;
			E.transitionend || clearTimeout(E.transitionend);
			b.scrollendtrapped = !1;
			b._unbind(b.doc[0], E.transitionend, b.onScrollTransitionEnd);
			b.prepareTransition(0);
			b.setScrollTop(e);
			b.railh && b.setScrollLeft(t);
			b.timerscroll && b.timerscroll.tm && clearInterval(b.timerscroll.tm);
			b.timerscroll = !1;
			b.cursorfreezed = !1;
			b.showCursor(e, t);
			return b
		}, this.onScrollTransitionEnd = function () {
			b.scrollendtrapped && b._unbind(b.doc[0], E.transitionend, b.onScrollTransitionEnd);
			b.scrollendtrapped = !1;
			b.prepareTransition(0);
			b.timerscroll && b.timerscroll.tm && clearInterval(b.timerscroll.tm);
			b.timerscroll = !1;
			var e = b.getScrollTop(),
			t = b.getScrollLeft();
			b.setScrollTop(e);
			b.railh && b.setScrollLeft(t);
			b.noticeCursor(!1, e, t);
			b.cursorfreezed = !1;
			0 > e ? e = 0 : e > b.page.maxh && (e = b.page.maxh);
			0 > t ? t = 0 : t > b.page.maxw && (t = b.page.maxw);
			if (e != b.newscrolly || t != b.newscrollx)
				return b.doScrollPos(t, e, b.opt.snapbackspeed);
			b.onscrollend && b.scrollrunning && b.triggerScrollEnd();
			b.scrollrunning = !1
		}) : (this.doScrollLeft = function (e, t) {
			var n = b.scrollrunning ? b.newscrolly : b.getScrollTop();
			b.doScrollPos(e, n, t)
		}, this.doScrollTop = function (e, t) {
			var n = b.scrollrunning ? b.newscrollx : b.getScrollLeft();
			b.doScrollPos(n, e, t)
		}, this.doScrollPos = function (e, t, n) {
			function r() {
				if (b.cancelAnimationFrame)
					return !0;
				b.scrollrunning = !0;
				if (c = 1 - c)
					return b.timer = u(r) || 1;
				var e = 0,
				t,
				n,
				i = n = b.getScrollTop();
				if (b.dst.ay) {
					i = b.bzscroll ? b.dst.py + b.bzscroll.getNow() * b.dst.ay : b.newscrolly;
					t = i - n;
					if (0 > t && i < b.newscrolly || 0 < t && i > b.newscrolly)
						i = b.newscrolly;
					b.setScrollTop(i);
					i == b.newscrolly && (e = 1)
				} else
					e = 1;
				n = t = b.getScrollLeft();
				if (b.dst.ax) {
					n = b.bzscroll ? b.dst.px + b.bzscroll.getNow() * b.dst.ax : b.newscrollx;
					t = n - t;
					if (0 > t && n < b.newscrollx || 0 < t && n > b.newscrollx)
						n = b.newscrollx;
					b.setScrollLeft(n);
					n == b.newscrollx && (e += 1)
				} else
					e += 1;
				2 == e ? (b.timer = 0, b.cursorfreezed = !1, b.bzscroll = !1, b.scrollrunning = !1, 0 > i ? i = 0 : i > b.page.maxh && (i = b.page.maxh), 0 > n ? n = 0 : n > b.page.maxw && (n = b.page.maxw), n != b.newscrollx || i != b.newscrolly ? b.doScrollPos(n, i) : b.onscrollend && b.triggerScrollEnd()) : b.timer = u(r) || 1
			}
			t = "undefined" == typeof t || !1 === t ? b.getScrollTop(!0) : t;
			if (b.timer && b.newscrolly == t && b.newscrollx == e)
				return !0;
			b.timer && a(b.timer);
			b.timer = 0;
			var i = b.getScrollTop(),
			s = b.getScrollLeft();
			(0 > (b.newscrolly - i) * (t - i) || 0 > (b.newscrollx - s) * (e - s)) && b.cancelScroll();
			b.newscrolly = t;
			b.newscrollx = e;
			b.bouncescroll && b.rail.visibility || (0 > b.newscrolly ? b.newscrolly = 0 : b.newscrolly > b.page.maxh && (b.newscrolly = b.page.maxh));
			b.bouncescroll && b.railh.visibility || (0 > b.newscrollx ? b.newscrollx = 0 : b.newscrollx > b.page.maxw && (b.newscrollx = b.page.maxw));
			b.dst = {};
			b.dst.x = e - s;
			b.dst.y = t - i;
			b.dst.px = s;
			b.dst.py = i;
			var o = Math.round(Math.sqrt(Math.pow(b.dst.x, 2) + Math.pow(b.dst.y, 2)));
			b.dst.ax = b.dst.x / o;
			b.dst.ay = b.dst.y / o;
			var f = 0,
			l = o;
			0 == b.dst.x ? (f = i, l = t, b.dst.ay = 1, b.dst.py = 0) : 0 == b.dst.y && (f = s, l = e, b.dst.ax = 1, b.dst.px = 0);
			o = b.getTransitionSpeed(o);
			n && 1 >= n && (o *= n);
			b.bzscroll = 0 < o ? b.bzscroll ? b.bzscroll.update(l, o) : new T(f, l, o, 0, 1, 0, 1) : !1;
			if (!b.timer) {
				(i == b.page.maxh && t >= b.page.maxh || s == b.page.maxw && e >= b.page.maxw) && b.checkContentSize();
				var c = 1;
				b.cancelAnimationFrame = !1;
				b.timer = 1;
				b.onscrollstart && !b.scrollrunning && b.onscrollstart.call(b, {
					type : "scrollstart",
					current : {
						x : s,
						y : i
					},
					request : {
						x : e,
						y : t
					},
					end : {
						x : b.newscrollx,
						y : b.newscrolly
					},
					speed : o
				});
				r();
				(i == b.page.maxh && t >= i || s == b.page.maxw && e >= s) && b.checkContentSize();
				b.noticeCursor()
			}
		}, this.cancelScroll = function () {
			b.timer && a(b.timer);
			b.timer = 0;
			b.bzscroll = !1;
			b.scrollrunning = !1;
			return b
		}) : (this.doScrollLeft = function (e, t) {
			var n = b.getScrollTop();
			b.doScrollPos(e, n, t)
		}, this.doScrollTop = function (e, t) {
			var n = b.getScrollLeft();
			b.doScrollPos(n, e, t)
		}, this.doScrollPos = function (e, t, n) {
			var r = e > b.page.maxw ? b.page.maxw : e;
			0 > r && (r = 0);
			var i = t > b.page.maxh ? b.page.maxh : t;
			0 > i && (i = 0);
			b.synched("scroll", function () {
				b.setScrollTop(i);
				b.setScrollLeft(r)
			})
		}, this.cancelScroll = function () {});
		this.doScrollBy = function (e, t) {
			var n = 0,
			n = t ? Math.floor((b.scroll.y - e) * b.scrollratio.y) : (b.timer ? b.newscrolly : b.getScrollTop(!0)) - e;
			if (b.bouncescroll) {
				var r = Math.round(b.view.h / 2);
				n < -r ? n = -r : n > b.page.maxh + r && (n = b.page.maxh + r)
			}
			b.cursorfreezed = !1;
			r = b.getScrollTop(!0);
			if (0 > n && 0 >= r)
				return b.noticeCursor();
			if (n > b.page.maxh && r >= b.page.maxh)
				return b.checkContentSize(), b.noticeCursor();
			b.doScrollTop(n)
		};
		this.doScrollLeftBy = function (e, t) {
			var n = 0,
			n = t ? Math.floor((b.scroll.x - e) * b.scrollratio.x) : (b.timer ? b.newscrollx : b.getScrollLeft(!0)) - e;
			if (b.bouncescroll) {
				var r = Math.round(b.view.w / 2);
				n < -r ? n = -r : n > b.page.maxw + r && (n = b.page.maxw + r)
			}
			b.cursorfreezed = !1;
			r = b.getScrollLeft(!0);
			if (0 > n && 0 >= r || n > b.page.maxw && r >= b.page.maxw)
				return b.noticeCursor();
			b.doScrollLeft(n)
		};
		this.doScrollTo = function (e, t) {
			t && Math.round(e * b.scrollratio.y);
			b.cursorfreezed = !1;
			b.doScrollTop(e)
		};
		this.checkContentSize = function () {
			var e = b.getContentSize();
			e.h == b.page.h && e.w == b.page.w || b.resize(!1, e)
		};
		b.onscroll = function (e) {
			b.rail.drag || b.cursorfreezed || b.synched("scroll", function () {
				b.scroll.y = Math.round(b.getScrollTop() * (1 / b.scrollratio.y));
				b.railh && (b.scroll.x = Math.round(b.getScrollLeft() * (1 / b.scrollratio.x)));
				b.noticeCursor()
			})
		};
		b.bind(b.docscroll, "scroll", b.onscroll);
		this.doZoomIn = function (t) {
			if (!b.zoomactive) {
				b.zoomactive = !0;
				b.zoomrestore = {
					style : {}

				};
				var n = "position top left zIndex backgroundColor marginTop marginBottom marginLeft marginRight".split(" "),
				r = b.win[0].style,
				i;
				for (i in n) {
					var o = n[i];
					b.zoomrestore.style[o] = "undefined" != typeof r[o] ? r[o] : ""
				}
				b.zoomrestore.style.width = b.win.css("width");
				b.zoomrestore.style.height = b.win.css("height");
				b.zoomrestore.padding = {
					w : b.win.outerWidth() - b.win.width(),
					h : b.win.outerHeight() - b.win.height()
				};
				E.isios4 && (b.zoomrestore.scrollTop = e(window).scrollTop(), e(window).scrollTop(0));
				b.win.css({
					position : E.isios4 ? "absolute" : "fixed",
					top : 0,
					left : 0,
					"z-index" : s + 100,
					margin : "0px"
				});
				n = b.win.css("backgroundColor");
				("" == n || /transparent|rgba\(0, 0, 0, 0\)|rgba\(0,0,0,0\)/.test(n)) && b.win.css("backgroundColor", "#fff");
				b.rail.css({
					"z-index" : s + 101
				});
				b.zoom.css({
					"z-index" : s + 102
				});
				b.zoom.css("backgroundPosition", "0px -18px");
				b.resizeZoom();
				b.onzoomin && b.onzoomin.call(b);
				return b.cancelEvent(t)
			}
		};
		this.doZoomOut = function (t) {
			if (b.zoomactive)
				return b.zoomactive = !1, b.win.css("margin", ""), b.win.css(b.zoomrestore.style), E.isios4 && e(window).scrollTop(b.zoomrestore.scrollTop), b.rail.css({
					"z-index" : b.zindex
				}), b.zoom.css({
					"z-index" : b.zindex
				}), b.zoomrestore = !1, b.zoom.css("backgroundPosition", "0px 0px"), b.onResize(), b.onzoomout && b.onzoomout.call(b), b.cancelEvent(t)
		};
		this.doZoom = function (e) {
			return b.zoomactive ? b.doZoomOut(e) : b.doZoomIn(e)
		};
		this.resizeZoom = function () {
			if (b.zoomactive) {
				var t = b.getScrollTop();
				b.win.css({
					width : e(window).width() - b.zoomrestore.padding.w + "px",
					height : e(window).height() - b.zoomrestore.padding.h + "px"
				});
				b.onResize();
				b.setScrollTop(Math.min(b.page.maxh, t))
			}
		};
		this.init();
		e.nicescroll.push(this)
	},
	m = function (e) {
		var t = this;
		this.nc = e;
		this.steptime = this.lasttime = this.speedy = this.speedx = this.lasty = this.lastx = 0;
		this.snapy = this.snapx = !1;
		this.demuly = this.demulx = 0;
		this.lastscrolly = this.lastscrollx = -1;
		this.timer = this.chky = this.chkx = 0;
		this.time = function () {
			return  + (new Date)
		};
		this.reset = function (e, n) {
			t.stop();
			var r = t.time();
			t.steptime = 0;
			t.lasttime = r;
			t.speedx = 0;
			t.speedy = 0;
			t.lastx = e;
			t.lasty = n;
			t.lastscrollx = -1;
			t.lastscrolly = -1
		};
		this.update = function (e, n) {
			var r = t.time();
			t.steptime = r - t.lasttime;
			t.lasttime = r;
			var r = n - t.lasty,
			i = e - t.lastx,
			s = t.nc.getScrollTop(),
			o = t.nc.getScrollLeft(),
			s = s + r,
			o = o + i;
			t.snapx = 0 > o || o > t.nc.page.maxw;
			t.snapy = 0 > s || s > t.nc.page.maxh;
			t.speedx = i;
			t.speedy = r;
			t.lastx = e;
			t.lasty = n
		};
		this.stop = function () {
			try {
				t.nc.unsynched("domomentum2d");
				t.timer && clearTimeout(t.timer);
				t.timer = 0;
				t.lastscrollx = -1;
				t.lastscrolly = -1
			} catch (e) {}

		};
		this.doSnapy = function (e, n) {
			var r = !1;
			0 > n ? (n = 0, r = !0) : n > t.nc.page.maxh && (n = t.nc.page.maxh, r = !0);
			0 > e ? (e = 0, r = !0) : e > t.nc.page.maxw && (e = t.nc.page.maxw, r = !0);
			r ? t.nc.doScrollPos(e, n, t.nc.opt.snapbackspeed) : t.nc.triggerScrollEnd()
		};
		this.doMomentum = function (e) {
			var n = t.time(),
			r = e ? n + e : t.lasttime;
			e = t.nc.getScrollLeft();
			var i = t.nc.getScrollTop(),
			s = t.nc.page.maxh,
			o = t.nc.page.maxw;
			t.speedx = 0 < o ? Math.min(60, t.speedx) : 0;
			t.speedy = 0 < s ? Math.min(60, t.speedy) : 0;
			r = r && 60 >= n - r;
			if (0 > i || i > s || 0 > e || e > o)
				r = !1;
			e = t.speedx && r ? t.speedx : !1;
			if (t.speedy && r && t.speedy || e) {
				var u = Math.max(16, t.steptime);
				50 < u && (e = u / 50, t.speedx *= e, t.speedy *= e, u = 50);
				t.demulxy = 0;
				t.lastscrollx = t.nc.getScrollLeft();
				t.chkx = t.lastscrollx;
				t.lastscrolly = t.nc.getScrollTop();
				t.chky = t.lastscrolly;
				var a = t.lastscrollx,
				f = t.lastscrolly,
				l = function () {
					var e = 600 < t.time() - n ? .04 : .02;
					t.speedx && (r = Math.floor(t.lastscrollx - t.speedx * (1 - t.demulxy)), t.lastscrollx = r, 0 > r || r > o) && (e = .1);
					t.speedy && (f = Math.floor(t.lastscrolly - t.speedy * (1 - t.demulxy)), t.lastscrolly = f, 0 > f || f > s) && (e = .1);
					t.demulxy = Math.min(1, t.demulxy + e);
					try {
						t.nc.synched("domomentum2d", function () {
							t.speedx && (t.nc.getScrollLeft() != t.chkx && t.stop(), t.chkx = r, t.nc.setScrollLeft(r));
							t.speedy && (t.nc.getScrollTop() != t.chky && t.stop(), t.chky = f, t.nc.setScrollTop(f));
							t.timer || (t.nc.hideCursor(), t.doSnapy(r, f))
						});
						1 > t.demulxy ? t.timer = setTimeout(l, u) : (t.stop(), t.nc.hideCursor(), t.doSnapy(r, f))
					} catch (r) {}

				};
				l()
			} else
				t.doSnapy(t.nc.getScrollLeft(), t.nc.getScrollTop())
		}
	},
	g = e.fn.scrollTop;
	e.cssHooks.pageYOffset = {
		get : function (t, n, r) {
			return (n = e.data(t, "__nicescroll") || !1) && n.ishwscroll ? n.getScrollTop() : g.call(t)
		},
		set : function (t, n) {
			var r = e.data(t, "__nicescroll") || !1;
			r && r.ishwscroll ? r.setScrollTop(parseInt(n)) : g.call(t, n);
			return this
		}
	};
	e.fn.scrollTop = function (t) {
		if ("undefined" == typeof t) {
			var n = this[0] ? e.data(this[0], "__nicescroll") || !1 : !1;
			return n && n.ishwscroll ? n.getScrollTop() : g.call(this)
		}
		return this.each(function () {
			var n = e.data(this, "__nicescroll") || !1;
			n && n.ishwscroll ? n.setScrollTop(parseInt(t)) : g.call(e(this), t)
		})
	};
	var y = e.fn.scrollLeft;
	e.cssHooks.pageXOffset = {
		get : function (t, n, r) {
			return (n = e.data(t, "__nicescroll") || !1) && n.ishwscroll ? n.getScrollLeft() : y.call(t)
		},
		set : function (t, n) {
			var r = e.data(t, "__nicescroll") || !1;
			r && r.ishwscroll ? r.setScrollLeft(parseInt(n)) : y.call(t, n);
			return this
		}
	};
	e.fn.scrollLeft = function (t) {
		if ("undefined" == typeof t) {
			var n = this[0] ? e.data(this[0], "__nicescroll") || !1 : !1;
			return n && n.ishwscroll ? n.getScrollLeft() : y.call(this)
		}
		return this.each(function () {
			var n = e.data(this, "__nicescroll") || !1;
			n && n.ishwscroll ? n.setScrollLeft(parseInt(t)) : y.call(e(this), t)
		})
	};
	var b = function (t) {
		var n = this;
		this.length = 0;
		this.name = "nicescrollarray";
		this.each = function (e) {
			for (var t = 0, r = 0; t < n.length; t++)
				e.call(n[t], r++);
			return n
		};
		this.push = function (e) {
			n[n.length] = e;
			n.length++
		};
		this.eq = function (e) {
			return n[e]
		};
		if (t)
			for (var r = 0; r < t.length; r++) {
				var i = e.data(t[r], "__nicescroll") || !1;
				i && (this[this.length] = i, this.length++)
			}
		return this
	};
	(function (e, t, n) {
		for (var r = 0; r < t.length; r++)
			n(e, t[r])
	})(b.prototype, "show hide toggle onResize resize remove stop doScrollPos".split(" "), function (e, t) {
		e[t] = function () {
			var e = arguments;
			return this.each(function () {
				this[t].apply(this, e)
			})
		}
	});
	e.fn.getNiceScroll = function (t) {
		return "undefined" == typeof t ? new b(this) : this[t] && e.data(this[t], "__nicescroll") || !1
	};
	e.extend(e.expr[":"], {
		nicescroll : function (t) {
			return e.data(t, "__nicescroll") ? !0 : !1
		}
	});
	e.fn.niceScroll = function (t, n) {
		"undefined" != typeof n || "object" != typeof t || "jquery" in t || (n = t, t = !1);
		n = e.extend({}, n);
		var r = new b;
		"undefined" == typeof n && (n = {});
		t && (n.doc = e(t), n.win = e(this));
		var i = !("doc" in n);
		i || "win" in n || (n.win = e(this));
		this.each(function () {
			var t = e(this).data("__nicescroll") || !1;
			t || (n.doc = i ? e(this) : n.doc, t = new v(n, e(this)), e(this).data("__nicescroll", t));
			r.push(t)
		});
		return 1 == r.length ? r[0] : r
	};
	window.NiceScroll = {
		getjQuery : function () {
			return e
		}
	};
	e.nicescroll || (e.nicescroll = new b, e.nicescroll.options = h)
})
