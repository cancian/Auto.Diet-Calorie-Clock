/*  CARPE Slider 3.0c1, By Tom Hermansson Snickars, January 21, 2013.
    Copyright CARPE Design, http://carpe.ambiprospect.com/
    carpe@ambiprospect.com, tom@ambiprospect.com
*/
(function () {
    'use strict';
    var CARPE,
        Slider;
    CARPE = {
        common: { version: '1.0' },
        license: { pro: true, id: 'CC2013080201' },
        protocol: 'http://',
        baseURI: 'carpe.ambiprospect.com/',
        touch: document.createTouch || false,
        isFunction: function (func) {
            return !!(func && func.constructor && func.call && func.apply);
        },
        modPos: function (el, dir, val) {
            var camel = CARPE.camelize,
                style = el.style,
                unit = 'px';
            val = val || (val === 0) ? val : null;
            if (style) {
                if (typeof style[dir] === 'string') {
                    if (isNaN(val)) { // getter.
                        val = parseInt(style[dir], 10);
                    } else { // setter.
                        style[dir] = val.toString() + unit;
                    }
                } else if (style[camel('pixel-' + dir)]) {
                    if (isNaN(val)) { // getter.
                        val = style[camel('pixel-' + dir)];
                    } else { // setter.
                        style[camel('pixel' + dir)] = val;
                    }
                }
            }
            return val;
        },
        position: function (el, pos) { // get or set relative position:
            var result = el,
                mod = function (dir, val) {
                    return CARPE.modPos(el, dir, val);
                };
            if (!pos) { // getter.
                result = { x: mod('left'), y: mod('top') };
            } else { // setter.
                if (pos.x || pos.x === 0) {
                    mod('left', pos.x);
                }
                if (pos.y || pos.y === 0) {
                    mod('top', pos.y);
                }
            }
            return result;
        },
        getPos: function (el) {
            var pos = { x: 0, y: 0 };
            if (el.offsetParent) {
                pos = { x: el.offsetLeft, y: el.offsetTop };
                while ((el.offsetParent)) {
                    el = el.offsetParent;
                    pos.x += el.offsetLeft;
                    pos.y += el.offsetTop;
                }
            }
            return pos;
        },
        scroll: function () {
            var result = { x: 0, y: 0 },
                bd = document.body,
                de = document.documentElement;
            if (bd && (bd.scrollLeft || bd.scrollTop)) { // Standard.
                result = { x: bd.scrollLeft, y: bd.scrollTop };
            } else if (de && (de.scrollLeft || de.scrollTop)) { // IE 6.
                result = { x: de.scrollLeft, y: de.scrollTop };
            }
            return result;
        },
        style: function (elmnt, prop) {
            var css, val,
                camel = CARPE.camelize(prop),
                style = elmnt.style[camel],
                view = document.defaultView;
            if (!style || isNaN(style)) {
                if (view && view.getComputedStyle) {
                    css = view.getComputedStyle(elmnt, null);
                    val = css ? css[camel] : null;
                } else if (elmnt.currentStyle) {
                    val = elmnt.currentStyle[camel];
                }
            } else {
                val = style;
            }
            return val;
        },
        camelize: function (str, splitter) {
            var i,
                parts = str.split(splitter || '-'),
                camel = parts[0],
                len = parts.length;
            for (i = 1; i < len; i += 1) {
                camel += parts[i].charAt(0).toUpperCase() +
                        parts[i].substring(1);
            }
            return camel;
        },
        stop: function (evnt) {
            var e = evnt || window.event,
                stop = false;
            if (e) {
                if (e.preventDefault) { // Standard.
                    e.preventDefault();
                    e.stopPropagation();
                    stop = true;
                } else { // IE.
                    e.returnValue = false;
                    e.cancelBubble = true;
                    stop = true;
                }
            }
            return stop;
        },
        touchListener: function (e) {
            var touches = e.changedTouches,
                first = touches[0],
                type,
                simulated = document.createEvent('MouseEvent'),
                bubble = true,
                cancelable = true,
                view = window,
                clicks = 1;
            switch (e.type) {
            case 'touchstart':
                type = 'mousedown';
                break;
            case 'touchmove':
                type = 'mousemove';
                break;
            case 'touchend':
                type = 'mouseup';
                break;
            default:
                break;
            }
            if (type) {
                simulated.initMouseEvent(type, bubble, cancelable, view, clicks,
                        first.screenX, first.screenY, first.clientX, first.clientY,
                        false, false, false, false, 0, null);
                		first.target.dispatchEvent(simulated); //(EDIT) (Uncaught RangeError: Maximum call stack size exceeded.)
            }
            e.preventDefault();
            return;
        },
        addListener: (function () {
            var add;
            if (window.addEventListener) {
                add = function (obj, type, func) { // W3C.
                    obj.addEventListener(type, func, false);
                };
            }
            if (!window.addEventListener && document.attachEvent) {
                add = function (obj, type, func) { // IE.
                    obj.attachEvent('on' + type, func);
                };
            }
            return add;
        }()),
        removeListener: (function () {
            var remove;
            if (document.removeEventListener) {
                remove = function (obj, type, func) { // W3C.
                    if (obj.removeEventListener) {
                        obj.removeEventListener(type, func, false);
                    }
                };
            } else {
                remove = function (obj, type, func) { // IE.
                    if (obj.detachEvent) {
                        obj.detachEvent('on' + type, func);
                    }
                };
            }
            return remove;
        }()),
        sliders: {
            version: '3.0',
            objects: [], // Array that holds all slider objects in a page.
            init: function () {
                var i,
                    current,
                    type,
                    make,
                    objects = CARPE.sliders.objects,
                    makeAttr = 'data-carpe-slider',
                    inputs = document.getElementsByTagName('input'),
                    len = inputs.length;
                for (i = 0; i < len; i += 1) {
                    current = inputs[i];
                    type = current.getAttribute('type') || '';
                    make = current.getAttribute(makeAttr);
                    if (type && (type.toLowerCase() === 'range') &&
                            (make !== 'false') && (make !== 'no')) {
                        objects.push(new Slider(current));
                    }
                }
                CARPE.sliders.update();
                return;
            },
            update: function () {
                var i,
                    objects = CARPE.sliders.objects,
                    len = objects.length,
                    noAuto = true;
                for (i = 0; i < len; i += 1) {
                    objects[i].resetValue();
                    if (noAuto) {
                        if (objects[i].autoFocus && objects[i].panel &&
                                objects[i].panel.focus) {
                            objects[i].panel.focus();
                            noAuto = false;
                        }
                    }
                }
            }
        }
    };
    Slider = function (elmnt) { // The 'Slider' class constructor:
        var edgeProp1,
            edgeProp2,
            i,
            tabIndexTemp,
            totalSize,
            trackSize,
            linkTitleDefault = 'Drag or use arrow keys to adjust value.\n' +
                    'Double-click or delete key to reset.\n' +
                    'Click on slider panel to jump.\n' +
                    'Follow this link to learn more.',
            linkTitleTouchDefault = 'Slide to adjust value.\n' +
                    'Tap on slider panel to jump.\n' +
                    'Follow this link to learn more.',
            selector = 'carpe-slider-',
            linkTitlePrefix = 'CARPE Slider ' + CARPE.sliders.version +
                    (elmnt.disabled ? ' [disabled]' : ''),
            style = CARPE.style,
            edgeSize = function (el) {
                return parseInt(style(el, 'border-' + edgeProp1 +
                        '-width'), 10) + parseInt(style(el, 'border-' +
                        edgeProp2 + '-width'), 10);
            },
            attr = elmnt.attributes || [],
            path = CARPE.protocol + CARPE.baseURI + 'slider/',
            linkText = '', //'CARPE',
            unit = 'px';
        (function (o) { // Default and calculated values:
            o.form = elmnt.form || null;
            o.disabled = elmnt.disabled || false;
            o.tabIndex = elmnt.tabIndex;
            o.min = attr.min && !isNaN(attr.min.value) ?
                    parseFloat(attr.min.value, 10) : 0;
            o.max = attr.max && !isNaN(attr.max.value) ?
                    parseFloat(attr.max.value, 10) : 100;
            o.autoFocus = (attr.autofocus && attr.autofocus.value) || false;
            o.linkTitle = linkTitlePrefix + '\n' +
                    (attr['data-carpe-link-title'] ?
                        attr['data-carpe-link-title'].value :
                        linkTitleDefault);
            o.linkTitleTouch = linkTitlePrefix + '\n' +
                    (attr['data-carpe-link-title-touch'] ?
                        attr['data-carpe-link-title-touch'].value :
                        linkTitleTouchDefault);
            o.linkTitle = CARPE.touch ? o.linkTitleTouch : o.linkTitle;
            o.targets = attr['data-carpe-targets'] &&
                    attr['data-carpe-targets'].value ?
                        attr['data-carpe-targets'].value.
                        toString().split(/\s+/) : [];
            o.decimals = attr['data-carpe-decimals'] &&
                    !isNaN(attr['data-carpe-decimals'].value) ?
                        attr['data-carpe-decimals'].value : 14;
            o.vertical = elmnt.className.indexOf('vertical') > -1;
            o.sizeProp = o.vertical ? 'height' : 'width';
            o.dir = o.vertical ? 'y' : 'x';
            o.pointerProp = 'client' + o.dir.toUpperCase();
            edgeProp1 = o.vertical ? 'top' : 'left';
            edgeProp2 = o.vertical ? 'bottom' : 'right';
            o.inc = o.vertical ? -1 : 1;
            o.reversed = !!(o.min > o.max);
            o.range = o.max - o.min;
            o.valMin = Math.min(o.max, o.min);
            o.valMax = Math.max(o.max, o.min);
            o.floor = o.vertical ? o.max : o.min;
            o.valDefault = (attr.value && attr.value.value) || (o.max +
                    o.min) / 2;
            o.width = parseInt(style(elmnt, 'width'), 10);
            o.height = parseInt(style(elmnt, 'height'), 10);
            o.size = parseInt(o[o.sizeProp], 10) || 100;
            o.pxRange = o.vertical ? -o.size : o.size;
            o.pxCeiling = o.vertical ? (o.reversed ? o.size : 0) :
                    (o.reversed ? 0 : o.size);
            o.valRange = o.valMax - o.valMin;
            o.value = o.valDefault;
            o.value = isNaN(o.value) ? o.valDefault : o.value;
            o.value = (o.value > o.valMax) ? o.valMax : o.value;
            o.value = (o.value < o.valMin) ? o.valMin : o.value;
            o.knobTitle = o.value;
            o.pxScale = o.pxRange ? o.range / o.pxRange : 0;
            o.valScale = o.range ? o.pxRange / o.range : 0; // px per value.
            o.step = attr.step && !isNaN(attr.step.value) ?
                    attr.step.value : false;
            o.step = o.step && (o.step > o.valRange) ? o.valRange : o.step;
            o.step = o.step && (o.step < -o.valRange) ? -o.valRange : o.step;
            o.pxStep = o.step ? o.step / o.valRange * o.size : 1;
            o.pxPos = o.valScale ? (o.value - o.floor) * o.valScale : o.size;
            o.pxPos = o.vertical ? o.pxRange - o.pxPos : o.pxPos;
            o.lastStep = o.size - Math.floor(o.size / o.pxStep) * o.pxStep;
            o.CARPE = CARPE;
            for (i = 0; i < o.targets.length; i += 1) { // Slider targets
                o.targets[i] = document.getElementById(o.targets[i]);
            }
            tabIndexTemp = o.disabled ? -1 : parseInt(o.tabIndex, 10);
            o.hidden = o.createEl('input', selector + 'hidden');
            o.box  = o.createEl('div', selector + 'box');
            o.panel = o.createEl('a', selector + 'panel');
            o.link = o.createEl('a', selector + 'link');
            o.knob = o.createEl('div', selector + 'knob');
            o.track = o.createEl('div', selector + 'track');
            o.hidden.type = 'hidden';
            o.hidden.id = elmnt.id || null;
            o.hidden.name = elmnt.name || null;
            o.hidden.value = o.value;
            o.hidden.slider = o;
            o.box.style.cssText = elmnt.style.cssText || null;
            o.box.id = o.hidden.id ? selector + o.hidden.id : null;
            o.box.className += ' ' + elmnt.className;
            o.panel.href = '';
            o.panel.tabIndex = tabIndexTemp;
			if(elmnt.parentNode) {
	            elmnt.parentNode.replaceChild(o.box, elmnt);
			}
            o.box.appendChild(o.knob);
            o.knob.borderSize = edgeSize(o.knob);
            o.knob.title = o.knobTitle;
            o.knob.ondblclick = o.bind(o.resetValue, o);
            totalSize = o.size + parseInt(style(o.knob, o.sizeProp), 10) +
                    2 * o.knob.borderSize;
            o.box.style[o.sizeProp] = totalSize.toString() + unit;
            o.box.appendChild(o.hidden);
            o.box.appendChild(o.panel);
            o.panel.style[o.sizeProp] = totalSize.toString() + unit;
            o.knobSize = parseInt(style(o.knob, o.sizeProp), 10);
            o.halfKnob = parseInt((o.knobSize + o.knob.borderSize) / 2, 10);
            o.pxMin = parseInt(style(o.knob, edgeProp1), 10);
            o.panel.appendChild(o.track);
            o.track.borderSize = edgeSize(o.track);
            trackSize = o.size + o.knobSize - o.track.borderSize;
            o.track.style[o.sizeProp] = trackSize.toString() + unit;
            //o.link.href = path;
            //o.link.tabIndex = '-1';
            //o.link.title = o.linkTitle;
            //o.link.target = '_blank';
            //o.link.innerHTML = linkText;
            //o.box.appendChild(o.link);
            // Bind event listeners:
            o.hidden.onchange = elmnt.onchange ?
                    o.bind(elmnt.onchange, o.hidden) : null;
            o.panel.onmouseup = elmnt.onmouseup ?
                    o.bind(elmnt.onmouseup, o.hidden) : null;
            o.panel.onclick = function () {
                return false;
            };
            o.startListener = o.bind(o.start, o);
            o.jumpListener = o.bind(o.jump, o);
            o.keyListener = o.bind(o.key, o);
            o.moveListener = o.bind(o.move, o);
            o.stopListener = o.bind(o.stop, o);
        }(this));
        this.enabled(!this.disabled);
    };
    // The Slider class properties and methods:
    Slider.prototype.bind = function (method, context) {
        return function () {
            return method.apply(context, arguments);
        };
    };
    Slider.prototype.createEl = function (tag, className) {
        var elmnt = document.createElement(tag);
        elmnt.className = className;
        return elmnt;
    };
    Slider.prototype.setKnobPos = function () {
        var loc = {};
        loc[this.dir] = this.pxPos + this.pxMin;
        CARPE.position(this.knob, loc);
        return this;
    };
    Slider.prototype.start = function (e) {
        var evnt = e || window.event;
		$(".carpe-slider-knob").addClass("active");
        this.startOffset = this.pxPos - evnt[this.pointerProp];
        this.documentListeners(true);
        CARPE.stop(evnt);
        this.panel.focus();
        return false;
    };
    Slider.prototype.jump = function (e) {
		$(".carpe-slider-knob").addClass("active");
        var evnt = e || window.event,
            pos = evnt[this.pointerProp] - CARPE.getPos(this.knob)[this.dir] +
                    CARPE.scroll()[this.dir] + this.pxPos - this.halfKnob;
        return this.setPosition(pos).start(evnt);
    };
    Slider.prototype.move = function (e) {
        var evnt = e || window.event;
        this.setPosition(this.startOffset + evnt[this.pointerProp]);
        return false;
    };
    Slider.prototype.onMove = function () {
        if (this.hidden.onchange) {
            this.hidden.onchange();
        }
        return this;
    };
    Slider.prototype.stop = function (e) {
        var evnt = e || window.event;
		$(".carpe-slider-knob").removeClass("active");
        this.snap();
        this.documentListeners(false);
        this.onStop(evnt);
        CARPE.stop(evnt);
        if (this.reset) {
            this.reset.style.visibility = 'visible';
        }
        return false;
    };
    Slider.prototype.onStop = function (evnt) {
    // Handles a user supplied 'onmouseup' event on the input element.
        if (this.panel.onmouseup) {
            this.panel.onmouseup(evnt);
        }
        return this;
    };
    Slider.prototype.key = function (e) {
        var evnt = e || window.event,
            inc = this.inc,
            key = evnt.which || evnt.keyCode,
            result = false;
        if (key > 36 && key < 41) {
            inc = (key === 37 || key === 40) ? -inc : inc;
            CARPE.stop(evnt);
            this.increment(inc);
        } else if (key === 46) {
            this.resetValue();
        } else {
            result = true;
        }
        return result;
    };
    Slider.prototype.snap = function () {
        var pos = this.pxPos,
            step = (this.lastStep && ((this.size - pos) < this.lastStep)) ?
                    this.lastStep : this.pxStep;
        pos = (step !== 0) ? parseFloat(Math.round(pos / step) * step, 10) : pos;
		//
		//NEAREST 
		//
		this.setPosition(Math.round(pos));
		document.getElementById('entryTitle').value = Math.round(document.getElementById('entryTitle').value);
		//
		//
		//
		//
		//
		return;
    };
    Slider.prototype.setValue = function (val) {
        return this.val(val).pos().snap();
    };
    Slider.prototype.val = function (v) {
        var val = (v === undefined) ?
                    parseFloat(this.pxPos * this.pxScale + this.floor) : v;
        val = val < this.valMin ?
                this.valMin : (val > this.valMax ? this.valMax : val);
        this.value = val;
        this.hidden.value = (this.decimals > -1) ?
                parseFloat(val).toFixed(this.decimals) : val;
        this.knob.title = ''; //this.hidden.value; //(EDIT)
        return this;
    };
    Slider.prototype.getValue = function () {
        return this.hidden.value;
    };
    Slider.prototype.setPosition = function (pos) {
        return this.pos(pos).val().updateTargets();
    };
    Slider.prototype.pos = function (p) {
        var pos = (p === undefined) ? parseInt((this.value -
                    this.floor) * this.valScale, 10) : p,
            size = this.size;
        this.pxPos = (pos > size) ? size : ((pos < 0) ? 0 : pos);
        return this.setKnobPos();
    };
    Slider.prototype.getPos = function () {
        return CARPE.getPos(this.knob)[this.dir] - this.pxMin;
    };
    Slider.prototype.increment = function (inc) {
        var step = this.pxStep;
        step = (this.pxPos === this.pxCeiling) && this.lastStep ?
                this.lastStep : step;
        return this.setPosition(this.pxPos + Math.floor(inc) * step);
    };
    Slider.prototype.resetValue = function () {
        if (this.reset) {
            this.reset.style.visibility = 'hidden';
        }
        return this.setValue(this.valDefault);
    };
    Slider.prototype.updateTargets = function () {
        var i,
            target,
            isFunc = CARPE.isFunction,
            targets = this.targets || null,
            len = targets ? targets.length : 0,
            val = this.hidden.value;
        for (i = 0; i < len; i += 1) {
            if (targets[i]) {
                target = targets[i];
                if (target.update && isFunc(target.update)) {
                    target.update(val);
                } else if (target.constructor &&
                        target.constructor.toString().
                        toLowerCase().indexOf('input') >= 0) {
                    target.value = val;
                } else if ((target.innerHTML || (target.innerHTML === '')) &&
                        target.nodeType && (target.nodeType === 1)) {
                    target.innerHTML = val;
                }
            }
        }
        return this;
    };
    Slider.prototype.documentListeners = function (activate) {
        var fix = activate ? CARPE.addListener : CARPE.removeListener;
        fix(document, 'touchmove', CARPE.touchListener);
        fix(document, 'touchend', CARPE.touchListener);
        fix(document, 'mousemove', this.moveListener);
        fix(document, 'mouseup', this.stopListener);
        return;
    };
    Slider.prototype.sliderListeners = function () {
        var fix = this.disabled ? CARPE.removeListener : CARPE.addListener,
            knob = this.knob,
            panel = this.panel;
        fix(knob, 'mousedown', this.startListener);
        fix(panel, 'mousedown', this.jumpListener);
        fix(panel, 'keydown', this.keyListener);
        fix(knob, 'touchstart', CARPE.touchListener);
        fix(panel, 'touchstart', CARPE.touchListener);
        if (this.form) {
            fix(this.form, 'reset', CARPE.sliders.update);
        }
        return this;
    };
    Slider.prototype.enabled = function (enabled) {
        var box = this.box,
            panel = this.panel,
            result = !this.disabled; // Assume getter.
        if (enabled !== undefined) { // If setter:
            this.disabled = !enabled;
            this.sliderListeners();
            if (this.disabled) {
                box.setAttribute('disabled', 'disabled');
                panel.setAttribute('tabindex', '-1');
            } else {
                box.disabled = false;
                panel.setAttribute('tabindex', this.tabIndex);
            }
            result = this; // If 'setter' return the slider object. 
        }
        return result; // If 'getter' return true or false.
    };
////////////
// RESIZE //
////////////
function reSlider() {
	if(document.getElementById('slider')) {
		var sliderMemory = $("#entryTitle").val();
		$("#sliderWrapper").html('<input id="slider" type="range" min="-750" max="750" step="1" value="0" data-carpe-targets="entryTitle" data-carpe-decimals="8" />');
		CARPE.sliders.init();
		//desktop odd resize -1 bug
		if(Math.round(window.innerWidth % 2)) {
			$("#sliderWrapper").width(window.innerWidth-49);
		} else {
			$("#sliderWrapper").width(window.innerWidth-48);
		}
		$('#sliderNum').css("left",((Number($(".carpe-slider-knob").css("left").replace("px",""))) - (23)) + "px");
		document.getElementById('slider').slider.setValue(sliderMemory);
		$("#entryTitle").val(sliderMemory);
	}
}

$(window).resize(function(evt) {
reSlider();
setTimeout(function(evt) {
	reSlider();
},0);

});

$(document).on('sliderInit',function(evt) {
reSlider();
setTimeout(function(evt) {
	reSlider();		
},0);

});


}());

