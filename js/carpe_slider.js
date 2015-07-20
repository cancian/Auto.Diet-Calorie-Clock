(function () {
	function r() {
		if (document.getElementById("slider")) {
			var e = parseInt($("#entryTitle").val());
			$("#sliderWrapper").html('<input id="slider" type="range" min="-750" max="750" step="1" value="0" data-carpe-targets="entryTitle" data-carpe-decimals="8" />');
			t.sliders.init();
			document.getElementById("slider").slider.setValue(e);
			$("#entryTitle").val(e);
			$("#loadingDiv").hide()
		}
	}
	function i() {
		if (document.getElementById("sliderProRange")) {
			var e = parseInt($("#sliderProInput").val());
			var n = parseInt($("#sliderCarInput").val());
			var r = parseInt($("#sliderFatInput").val());
			$("#sliderProWrapper").html('<input id="sliderProRange" type="range" min="0" max="100" step="1" value="0" data-carpe-targets="sliderProInput" data-carpe-decimals="0" />');
			$("#sliderCarWrapper").html('<input id="sliderCarRange" type="range" min="0" max="100" step="1" value="0" data-carpe-targets="sliderCarInput" data-carpe-decimals="0" />');
			$("#sliderFatWrapper").html('<input id="sliderFatRange" type="range" min="0" max="100" step="1" value="0" data-carpe-targets="sliderFatInput" data-carpe-decimals="0" />');
			t.sliders.init();
			document.getElementById("sliderProRange").slider.setValue(e);
			document.getElementById("sliderCarRange").slider.setValue(n);
			document.getElementById("sliderFatRange").slider.setValue(r)
		}
	}
	function s() {
		if ($("#diaryNotesWrapper").length) {
			return
		}
		if (!/IEMobile/i.test(navigator.userAgent)) {
			r();
			i()
		}
	}
	var e = function () {
		if (!window.localStorage.getItem("app_zoom")) {
			window.localStorage.setItem("app_zoom", 1)
		}
		return parseFloat(window.localStorage.getItem("app_zoom"))
	};
	var t,
	n;
	t = {
		common : {
			version : "1.0"
		},
		license : {
			pro : true,
			id : "CC2013080201"
		},
		protocol : "http://",
		baseURI : "carpe.ambiprospect.com/",
		touch : document.createTouch || false,
		isFunction : function (e) {
			return !!(e && e.constructor && e.call && e.apply)
		},
		modPos : function (e, n, r) {
			var i = t.camelize,
			s = e.style,
			o = "px";
			r = r || r === 0 ? r : null;
			if (s) {
				if (typeof s[n] === "string") {
					if (isNaN(r)) {
						r = parseInt(s[n], 10)
					} else {
						s[n] = r.toString() + o
					}
				} else if (s[i("pixel-" + n)]) {
					if (isNaN(r)) {
						r = s[i("pixel-" + n)]
					} else {
						s[i("pixel" + n)] = r
					}
				}
			}
			return r
		},
		position : function (e, n) {
			var r = e,
			i = function (n, r) {
				return t.modPos(e, n, r)
			};
			if (!n) {
				r = {
					x : i("left"),
					y : i("top")
				}
			} else {
				if (n.x || n.x === 0) {
					i("left", n.x)
				}
				if (n.y || n.y === 0) {
					i("top", n.y)
				}
			}
			return r
		},
		getPos : function (e) {
			var t = {
				x : 0,
				y : 0
			};
			if (e.offsetParent) {
				t = {
					x : e.offsetLeft,
					y : e.offsetTop
				};
				while (e.offsetParent) {
					e = e.offsetParent;
					t.x += e.offsetLeft;
					t.y += e.offsetTop
				}
			}
			return t
		},
		scroll : function () {
			var e = {
				x : 0,
				y : 0
			},
			t = document.body,
			n = document.documentElement;
			if (t && (t.scrollLeft || t.scrollTop)) {
				e = {
					x : t.scrollLeft,
					y : t.scrollTop
				}
			} else if (n && (n.scrollLeft || n.scrollTop)) {
				e = {
					x : n.scrollLeft,
					y : n.scrollTop
				}
			}
			return e
		},
		style : function (e, n) {
			var r,
			i,
			s = t.camelize(n),
			o = e.style[s],
			u = document.defaultView;
			if (!o || isNaN(o)) {
				if (u && u.getComputedStyle) {
					r = u.getComputedStyle(e, null);
					i = r ? r[s] : null
				} else if (e.currentStyle) {
					i = e.currentStyle[s]
				}
			} else {
				i = o
			}
			return i
		},
		camelize : function (e, t) {
			var n,
			r = e.split(t || "-"),
			i = r[0],
			s = r.length;
			for (n = 1; n < s; n += 1) {
				i += r[n].charAt(0).toUpperCase() + r[n].substring(1)

			}
			return i
		},
		stop : function (e) {
			var t = e || window.event,
			n = false;
			if (t) {
				if (t.preventDefault) {
					t.preventDefault();
					t.stopPropagation();
					n = true
				} else {
					t.returnValue = false;
					t.cancelBubble = true;
					n = true
				}
			}
			return n
		},
		touchListener : function (e) {
			var t = e.changedTouches,
			n = t[0],
			r,
			i = document.createEvent("MouseEvent"),
			s = true,
			o = true,
			u = window,
			a = 1;
			switch (e.type) {
			case "touchstart":
				r = "mousedown";
				break;
			case "touchmove":
				r = "mousemove";
				break;
			case "touchend":
				r = "mouseup";
				break;
			default:
				break
			}
			if (r) {
				i.initMouseEvent(r, s, o, u, a, n.screenX, n.screenY, n.clientX, n.clientY, false, false, false, false, 0, null);
				n.target.dispatchEvent(i)
			}
			e.preventDefault();
			return
		},
		addListener : function () {
			var e;
			if (window.addEventListener) {
				e = function (e, t, n) {
					e.addEventListener(t, n, false)
				}
			}
			if (!window.addEventListener && document.attachEvent) {
				e = function (e, t, n) {
					e.attachEvent("on" + t, n)
				}
			}
			return e
		}
		(),
		removeListener : function () {
			var e;
			if (document.removeEventListener) {
				e = function (e, t, n) {
					if (e.removeEventListener) {
						e.removeEventListener(t, n, false)
					}
				}
			} else {
				e = function (e, t, n) {
					if (e.detachEvent) {
						e.detachEvent("on" + t, n)
					}
				}
			}
			return e
		}
		(),
		sliders : {
			version : "3.0",
			objects : [],
			init : function () {
				var e,
				r,
				i,
				s,
				o = t.sliders.objects,
				u = "data-carpe-slider",
				a = document.getElementsByTagName("input"),
				f = a.length;
				for (e = 0; e < f; e += 1) {
					r = a[e];
					i = r.getAttribute("type") || "";
					s = r.getAttribute(u);
					if (i && i.toLowerCase() === "range" && s !== "false" && s !== "no") {
						o.push(new n(r))
					}
				}
				t.sliders.update();
				return
			},
			update : function () {
				var e,
				n = t.sliders.objects,
				r = n.length,
				i = true;
				for (e = 0; e < r; e += 1) {
					n[e].resetValue();
					if (i) {
						if (n[e].autoFocus && n[e].panel && n[e].panel.focus) {
							n[e].panel.focus();
							i = false
						}
					}
				}
			}
		}
	};
	n = function (e) {
		var n,
		r,
		i,
		s,
		o,
		u,
		a = "Drag or use arrow keys to adjust value.\n" + "Double-click or delete key to reset.\n" + "Click on slider panel to jump.\n" + "Follow this link to learn more.",
		f = "Slide to adjust value.\n" + "Tap on slider panel to jump.\n" + "Follow this link to learn more.",
		l = "carpe-slider-",
		c = "CARPE Slider " + t.sliders.version + (e.disabled ? " [disabled]" : ""),
		h = t.style,
		p = function (e) {
			return parseInt(h(e, "border-" + n + "-width"), 10) + parseInt(h(e, "border-" + r + "-width"), 10)
		},
		d = e.attributes || [],
		v = t.protocol + t.baseURI + "slider/",
		m = "",
		g = "px";
		(function (v) {
			v.form = e.form || null;
			v.disabled = e.disabled || false;
			v.tabIndex = e.tabIndex;
			v.min = d.min && !isNaN(d.min.value) ? parseFloat(d.min.value, 10) : 0;
			v.max = d.max && !isNaN(d.max.value) ? parseFloat(d.max.value, 10) : 100;
			v.autoFocus = d.autofocus && d.autofocus.value || false;
			v.linkTitle = c + "\n" + (d["data-carpe-link-title"] ? d["data-carpe-link-title"].value : a);
			v.linkTitleTouch = c + "\n" + (d["data-carpe-link-title-touch"] ? d["data-carpe-link-title-touch"].value : f);
			v.linkTitle = t.touch ? v.linkTitleTouch : v.linkTitle;
			v.targets = d["data-carpe-targets"] && d["data-carpe-targets"].value ? d["data-carpe-targets"].value.toString().split(/\s+/) : [];
			v.decimals = d["data-carpe-decimals"] && !isNaN(d["data-carpe-decimals"].value) ? d["data-carpe-decimals"].value : 14;
			v.vertical = e.className.indexOf("vertical") > -1;
			v.sizeProp = v.vertical ? "height" : "width";
			v.dir = v.vertical ? "y" : "x";
			v.pointerProp = "client" + v.dir.toUpperCase();
			n = v.vertical ? "top" : "left";
			r = v.vertical ? "bottom" : "right";
			v.inc = v.vertical ? -1 : 1;
			v.reversed = !!(v.min > v.max);
			v.range = v.max - v.min;
			v.valMin = Math.min(v.max, v.min);
			v.valMax = Math.max(v.max, v.min);
			v.floor = v.vertical ? v.max : v.min;
			v.valDefault = d.value && d.value.value || (v.max + v.min) / 2;
			v.width = parseInt(h(e, "width"), 10);
			v.height = parseInt(h(e, "height"), 10);
			v.size = parseInt(v[v.sizeProp], 10) || 100;
			v.pxRange = v.vertical ? -v.size : v.size;
			v.pxCeiling = v.vertical ? v.reversed ? v.size : 0 : v.reversed ? 0 : v.size;
			v.valRange = v.valMax - v.valMin;
			v.value = v.valDefault;
			v.value = isNaN(v.value) ? v.valDefault : v.value;
			v.value = v.value > v.valMax ? v.valMax : v.value;
			v.value = v.value < v.valMin ? v.valMin : v.value;
			v.knobTitle = v.value;
			v.pxScale = v.pxRange ? v.range / v.pxRange : 0;
			v.valScale = v.range ? v.pxRange / v.range : 0;
			v.step = d.step && !isNaN(d.step.value) ? d.step.value : false;
			v.step = v.step && v.step > v.valRange ? v.valRange : v.step;
			v.step = v.step && v.step < -v.valRange ? -v.valRange : v.step;
			v.pxStep = v.step ? v.step / v.valRange * v.size : 1;
			v.pxPos = v.valScale ? (v.value - v.floor) * v.valScale : v.size;
			v.pxPos = v.vertical ? v.pxRange - v.pxPos : v.pxPos;
			v.lastStep = v.size - Math.floor(v.size / v.pxStep) * v.pxStep;
			v.CARPE = t;
			for (i = 0; i < v.targets.length; i += 1) {
				v.targets[i] = document.getElementById(v.targets[i])
			}
			s = v.disabled ? -1 : parseInt(v.tabIndex, 10);
			v.hidden = v.createEl("input", l + "hidden");
			v.box = v.createEl("div", l + "box");
			v.panel = v.createEl("a", l + "panel");
			v.link = v.createEl("a", l + "link");
			v.knob = v.createEl("div", l + "knob");
			v.track = v.createEl("div", l + "track");
			v.hidden.type = "hidden";
			v.hidden.id = e.id || null;
			v.hidden.name = e.name || null;
			v.hidden.value = v.value;
			v.hidden.slider = v;
			v.box.style.cssText = e.style.cssText || null;
			v.box.id = v.hidden.id ? l + v.hidden.id : null;
			v.box.className += " " + e.className;
			v.panel.href = "";
			v.panel.tabIndex = s;
			if (e.parentNode) {
				e.parentNode.replaceChild(v.box, e)
			}
			v.box.appendChild(v.knob);
			v.knob.borderSize = p(v.knob);
			v.knob.title = v.knobTitle;
			v.knob.ondblclick = v.bind(v.resetValue, v);
			o = v.size + parseInt(h(v.knob, v.sizeProp), 10) + 2 * v.knob.borderSize;
			v.box.style[v.sizeProp] = o.toString() + g;
			v.box.appendChild(v.hidden);
			v.box.appendChild(v.panel);
			v.panel.style[v.sizeProp] = o.toString() + g;
			v.knobSize = parseInt(h(v.knob, v.sizeProp), 10);
			v.halfKnob = parseInt((v.knobSize + v.knob.borderSize) / 2, 10);
			v.pxMin = parseInt(h(v.knob, n), 10);
			v.panel.appendChild(v.track);
			v.track.borderSize = p(v.track);
			u = v.size + v.knobSize - v.track.borderSize;
			v.track.style[v.sizeProp] = u.toString() + g;
			v.hidden.onchange = e.onchange ? v.bind(e.onchange, v.hidden) : null;
			v.panel.onmouseup = e.onmouseup ? v.bind(e.onmouseup, v.hidden) : null;
			v.panel.onclick = function () {
				return false
			};
			v.startListener = v.bind(v.start, v);
			v.jumpListener = v.bind(v.jump, v);
			v.keyListener = v.bind(v.key, v);
			v.moveListener = v.bind(v.move, v);
			v.stopListener = v.bind(v.stop, v)
		})(this);
		this.enabled(!this.disabled)
	};
	n.prototype.bind = function (e, t) {
		return function () {
			return e.apply(t, arguments)
		}
	};
	n.prototype.createEl = function (e, t) {
		var n = document.createElement(e);
		n.className = t;
		return n
	};
	n.prototype.setKnobPos = function () {
		var e = {};
		e[this.dir] = this.pxPos + this.pxMin;
		t.position(this.knob, e);
		return this
	};
	n.prototype.start = function (n) {
		var r = n || window.event;
		if (!$(".carpe-slider-knob").hasClass("active")) {
			$(".carpe-slider-knob").addClass("active")
		}
		this.startOffset = this.pxPos - r[this.pointerProp] / e();
		this.documentListeners(true);
		t.stop(r);
		this.panel.focus();
		return false
	};
	n.prototype.jump = function (n) {
		if (!$(".carpe-slider-knob").hasClass("active")) {
			$(".carpe-slider-knob").addClass("active")
		}
		var r = n || window.event,
		i = r[this.pointerProp] / e() - t.getPos(this.knob)[this.dir] + t.scroll()[this.dir] + this.pxPos - this.halfKnob;
		return this.setPosition(i).start(r)
	};
	n.prototype.move = function (t) {
		var n = t || window.event;
		this.setPosition(this.startOffset + n[this.pointerProp] / e());
		return false
	};
	n.prototype.onMove = function () {
		if (this.hidden.onchange) {
			this.hidden.onchange()
		}
		return this
	};
	n.prototype.stop = function (e) {
		var n = e || window.event;
		if ($(".carpe-slider-knob").hasClass("active")) {
			$(".carpe-slider-knob").removeClass("active")
		}
		this.snap();
		this.documentListeners(false);
		this.onStop(n);
		t.stop(n);
		if (this.reset) {
			this.reset.style.visibility = "visible"
		}
		return false
	};
	n.prototype.onStop = function (e) {
		if (this.panel.onmouseup) {
			this.panel.onmouseup(e)
		}
		return this
	};
	n.prototype.key = function (e) {
		var n = e || window.event,
		r = this.inc,
		i = n.which || n.keyCode,
		s = false;
		if (i > 36 && i < 41) {
			r = i === 37 || i === 40 ? -r : r;
			t.stop(n);
			this.increment(r)
		} else if (i === 46) {
			this.resetValue()
		} else {
			s = true
		}
		return s
	};
	n.prototype.snap = function () {
		var e = this.pxPos,
		t = this.lastStep && this.size - e < this.lastStep ? this.lastStep : this.pxStep;
		this.setPosition(Math.round(e));
		return
	};
	n.prototype.setValue = function (e) {
		return this.val(e).pos().snap()
	};
	n.prototype.val = function (e) {
		var t = e === undefined ? parseFloat(this.pxPos * this.pxScale + this.floor) : e;
		t = t < this.valMin ? this.valMin : t > this.valMax ? this.valMax : t;
		this.value = t;
		this.hidden.value = this.decimals > -1 ? parseFloat(t).toFixed(this.decimals) : t;
		this.knob.title = "";
		return this
	};
	n.prototype.getValue = function () {
		return this.hidden.value
	};
	n.prototype.setPosition = function (e) {
		return this.pos(e).val().updateTargets()
	};
	n.prototype.pos = function (e) {
		var t = e === undefined ? parseInt((this.value - this.floor) * this.valScale, 10) : e,
		n = this.size;
		this.pxPos = t > n ? n : t < 0 ? 0 : t;
		return this.setKnobPos()
	};
	n.prototype.getPos = function () {
		return t.getPos(this.knob)[this.dir] - this.pxMin
	};
	n.prototype.increment = function (e) {
		var t = this.pxStep;
		t = this.pxPos === this.pxCeiling && this.lastStep ? this.lastStep : t;
		return this.setPosition(this.pxPos + Math.floor(e) * t)
	};
	n.prototype.resetValue = function () {
		if (this.reset) {
			this.reset.style.visibility = "hidden"
		}
		return this.setValue(this.valDefault)
	};
	n.prototype.updateTargets = function () {
		var e,
		n,
		r = t.isFunction,
		i = this.targets || null,
		s = i ? i.length : 0,
		o = this.hidden.value;
		for (e = 0; e < s; e += 1) {
			if (i[e]) {
				n = i[e];
				if (n.update && r(n.update)) {
					n.update(o)
				} else if (n.constructor && n.constructor.toString().toLowerCase().indexOf("input") >= 0) {
					n.value = o
				} else if ((n.innerHTML || n.innerHTML === "") && n.nodeType && n.nodeType === 1) {
					n.innerHTML = o
				}
			}
		}
		return this
	};
	n.prototype.documentListeners = function (e) {
		var n = e ? t.addListener : t.removeListener;
		n(document, "touchmove", t.touchListener);
		n(document, "touchend", t.touchListener);
		n(document, "mousemove", this.moveListener);
		n(document, "mouseup", this.stopListener);
		return
	};
	n.prototype.sliderListeners = function () {
		var e = this.disabled ? t.removeListener : t.addListener,
		n = this.knob,
		r = this.panel;
		e(n, "mousedown", this.startListener);
		e(r, "mousedown", this.jumpListener);
		e(r, "keydown", this.keyListener);
		e(n, "touchstart", t.touchListener);
		e(r, "touchstart", t.touchListener);
		if (this.form) {
			e(this.form, "reset", t.sliders.update)
		}
		return this
	};
	n.prototype.enabled = function (e) {
		var t = this.box,
		n = this.panel,
		r = !this.disabled;
		if (e !== undefined) {
			this.disabled = !e;
			this.sliderListeners();
			if (this.disabled) {
				t.setAttribute("disabled", "disabled");
				n.setAttribute("tabindex", "-1")
			} else {
				t.disabled = false;
				n.setAttribute("tabindex", this.tabIndex)
			}
			r = this
		}
		return r
	};
	var o;
	$(window).on("resize", function (e) {
		clearTimeout(o);
		o = setTimeout(function () {
				s()
			}, 50);
		s()
	});
	$(document).on("sliderInit", function (e) {
		r()
	});
	$(document).on("carpeSlider", function (e) {
		i()
	})
})();