/*!
 * jQuery Mobile Events
 * by Ben Major (www.ben-major.co.uk)
 *
 * Copyright 2011, Ben Major
 * Licensed under the MIT License:
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
(function ($) {
    $.attrFn = $.attrFn || {};

    // navigator.userAgent.toLowerCase() isn't reliable for Chrome installs
    // on mobile devices. As such, we will create a boolean isChromeDesktop
    // The reason that we need to do this is because Chrome annoyingly
    // purports support for touch events even if the underlying hardware
    // does not!
    var agent = navigator.userAgent.toLowerCase(),
        isChromeDesktop = ((agent.indexOf('chrome') > -1) && ((agent.indexOf('windows') > -1) || (agent.indexOf('macintosh') > -1) || (agent.indexOf('linux') > -1)) && agent.indexOf('chrome') < 0),

        settings = {
            SWIPE_h_threshold: 20,
            SWIPE_v_threshold: 20,
            LONGTAP_threshold: 750,
            DOUBLETAP_int: 400,

            touch_capable: ('ontouchstart' in document.documentElement && !isChromeDesktop),
            orientation_support: ('orientation' in window && 'onORIENTATIONCHANGE' in window),

            startevent: ('ontouchstart' in document.documentElement && !isChromeDesktop) ? 'touchstart' : 'mousedown',
            endevent: ('ontouchstart' in document.documentElement && !isChromeDesktop) ? 'touchend' : 'mouseup',
            moveevent: ('ontouchstart' in document.documentElement && !isChromeDesktop) ? 'touchmove' : 'mousemove',
            TAPevent: ('ontouchstart' in document.documentElement && !isChromeDesktop) ? 'TAP' : 'click',
            scrollevent: ('ontouchstart' in document.documentElement && !isChromeDesktop) ? 'touchmove' : 'scroll',

            hold_timer: null,
            TAP_timer: null
        };
    
    // Convenience functions:
    $.isTouchCapable = function() { return settings.touch_capable; };
    $.getStartEvent = function() { return settings.startevent; };
    $.getEndEvent = function() { return settings.endevent; };
    $.getMoveEvent = function() { return settings.moveevent; };
    $.getTAPEvent = function() { return settings.TAPevent; };
    $.getScrollEvent = function() { return settings.scrollevent; };
    
    // Add Event shortcuts:
    $.each(['TOUCHSTART', 'TOUCHEND', 'TAP', 'SINGLETAP', 'DOUBLETAP', 'LONGTAP', 'SWIPE', 'SWIPEUP', 'SWIPERIGHT', 'SWIPEDOWN', 'SWIPELEFT', 'SWIPEEND', 'SCROLLSTART', 'SCROLLEND', 'ORIENTATIONCHANGE'], function (i, name) {
        $.fn[name] = function (fn) {
            return fn ? this.bind(name, fn) : this.trigger(name);
        };

        $.attrFn[name] = true;
    });

    // TOUCHSTART Event:
    $.event.special.TOUCHSTART = {
        setup: function () {
            var thisObject = this,
                $this = $(thisObject);

            $this.bind(settings.startevent, function (e) {
                $this.data('callee', arguments.callee);
                if (e.which && e.which !== 1) {
                    return false;
                }

                var origEvent = e.originalEvent,
                    touchData = {
                        'position': {
                            'x': ((settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX),
                            'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY,
                        },
                        'offset': {
                            'x': (settings.touch_capable) ? origEvent.touches[0].pageX - origEvent.touches[0].target.offsetLeft : e.offsetX,
                            'y': (settings.touch_capable) ? origEvent.touches[0].pageY - origEvent.touches[0].target.offsetTop : e.offsetY,
                        },
                        'time': new Date().getTime(),
                        'target': e.target
                    };

                triggerCustomEvent(thisObject, 'TOUCHSTART', e, touchData);
                return true;
            });
        },

        remove: function () {
            $(this).unbind(settings.startevent, $(this).data.callee)
        }
    };

    // TOUCHEND Event:
    $.event.special.TOUCHEND = {
        setup: function () {
            var thisObject = this,
                $this = $(thisObject);

            $this.bind(settings.endevent, function (e) {
                // Touch event data:
                $this.data('callee', arguments.callee);

                var origEvent = e.originalEvent;
                var touchData = {
                    'position': {
                        'x': (settings.touch_capable) ? origEvent.changedTouches[0].screenX : e.screenX,
                        'y': (settings.touch_capable) ? origEvent.changedTouches[0].screenY : e.screenY
                    },
                    'offset': {
                        'x': (settings.touch_capable) ? origEvent.changedTouches[0].pageX - origEvent.changedTouches[0].target.offsetLeft : e.offsetX,
                        'y': (settings.touch_capable) ? origEvent.changedTouches[0].pageY - origEvent.changedTouches[0].target.offsetTop : e.offsetY
                    },
                    'time': new Date().getTime(),
                    'target': e.target
                };
                triggerCustomEvent(thisObject, 'TOUCHEND', e, touchData);
                return true;
            });
        },
        remove: function () {
            $(this).unbind(settings.endevent, $(this).data.callee)
        }
    };

    // LONGTAP Event:
    $.event.special.LONGTAP = {
        setup: function () {
            var thisObject = this,
                $this = $(thisObject),
                origTarget,
                timer,
                start_pos = {
                    x: 0,
                    y: 0
                };

            $this.bind(settings.startevent, function (e) {
                if (e.which && e.which !== 1) {
                    return false;
                } else {
                    $this.data('TAPheld', false);
                    origTarget = e.target;

                    var origEvent = e.originalEvent;
                    var start_time = new Date().getTime(),
                        startPosition = {
                            'x': (settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX,
                            'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
                        },
                        startOffset = {
                            'x': (settings.touch_capable) ? origEvent.touches[0].pageX - origEvent.touches[0].target.offsetLeft : e.offsetX,
                            'y': (settings.touch_capable) ? origEvent.touches[0].pageY - origEvent.touches[0].target.offsetTop : e.offsetY
                        };

                    start_pos.x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
                    start_pos.y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;

                    settings.hold_timer = window.setTimeout(function () {

                        var end_x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX,
                            end_y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;

                        if (e.target == origTarget && (start_pos.x == end_x && start_pos.y == end_y)) {
                            $this.data('TAPheld', true);

                            var end_time = new Date().getTime(),
                                endPosition = {
                                    'x': (settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX,
                                    'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
                                },
                                endOffset = {
                                    'x': (settings.touch_capable) ? origEvent.touches[0].pageX - origEvent.touches[0].target.offsetLeft : e.offsetX,
                                    'y': (settings.touch_capable) ? origEvent.touches[0].pageY - origEvent.touches[0].target.offsetTop : e.offsetY
                                };
                            duration = end_time - start_time;

                            // Build the touch data:
                            var touchData = {
                                'startTime': start_time,
                                'endTime': end_time,
                                'startPosition': startPosition,
                                'startOffset': startOffset,
                                'endPosition': endPosition,
                                'endOffset': endOffset,
                                'duration': duration,
                                'target': e.target
                            }
                            $this.data('callee1', arguments.callee);
                            triggerCustomEvent(thisObject, 'LONGTAP', e, touchData);
                        }
                    }, settings.LONGTAP_threshold);

                    return true;
                }
            }).bind(settings.endevent, function () {
                $this.data('callee2', arguments.callee);
                $this.data('TAPheld', false);
                window.clearTimeout(settings.hold_timer);
            });
        },

        remove: function () {
            $(this).unbind(settings.startevent, $(this).data.callee1).unbind(settings.endevent, $(this).data.callee2);
        }
    };

    // DOUBLETAP Event:
    $.event.special.DOUBLETAP = {
        setup: function () {
            var thisObject = this,
                $this = $(thisObject),
                origTarget,
                action,
                firstTAP,
                origEvent;

            $this.bind(settings.startevent, function (e) {
                if (e.which && e.which !== 1) {
                    return false;
                } else {
                    $this.data('DOUBLETAPped', false);
                    origTarget = e.target;
                    $this.data('callee1', arguments.callee);

                    origEvent = e.originalEvent;
                    firstTAP = {
                        'position': {
                            'x': (settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX,
                            'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
                        },
                        'offset': {
                            'x': (settings.touch_capable) ? origEvent.touches[0].pageX - origEvent.touches[0].target.offsetLeft : e.offsetX,
                            'y': (settings.touch_capable) ? origEvent.touches[0].pageY - origEvent.touches[0].target.offsetTop : e.offsetY
                        },
                        'time': new Date().getTime(),
                        'target': e.target
                    };

                    return true;
                }
            }).bind(settings.endevent, function (e) {
                var now = new Date().getTime();
                var lastTouch = $this.data('lastTouch') || now + 1;
                var delta = now - lastTouch;
                window.clearTimeout(action);
                $this.data('callee2', arguments.callee);

                if (delta < settings.DOUBLETAP_int && delta > 0 && (e.target == origTarget) && delta > 100) {
                    $this.data('DOUBLETAPped', true);
                    window.clearTimeout(settings.TAP_timer);

                    // Now get the current event:
                    var lastTAP = {
                        'position': {
                            'x': (settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX,
                            'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
                        },
                        'offset': {
                            'x': (settings.touch_capable) ? origEvent.touches[0].pageX - origEvent.touches[0].target.offsetLeft : e.offsetX,
                            'y': (settings.touch_capable) ? origEvent.touches[0].pageY - origEvent.touches[0].target.offsetTop : e.offsetY
                        },
                        'time': new Date().getTime(),
                        'target': e.target
                    }

                    var touchData = {
                        'firstTAP': firstTAP,
                        'secondTAP': lastTAP,
                        'interval': lastTAP.time - firstTAP.time
                    };

                    triggerCustomEvent(thisObject, 'DOUBLETAP', e, touchData);
                } else {
                    $this.data('lastTouch', now);
                    action = window.setTimeout(function (e) {
                        window.clearTimeout(action);
                    }, settings.DOUBLETAP_int, [e]);
                }
                $this.data('lastTouch', now);
            });
        },
        remove: function () {
            $(this).unbind(settings.startevent, $(this).data.callee1).unbind(settings.endevent, $(this).data.callee2);
        }
    };

    // SINGLETAP Event:
    // This is used in conjuction with DOUBLETAP when both events are needed on the same element
    $.event.special.SINGLETAP = {
        setup: function () {
            var thisObject = this,
                $this = $(thisObject),
                origTarget = null,
                startTime = null,
                start_pos = {
                    x: 0,
                    y: 0
                };

            $this.bind(settings.startevent, function (e) {
                if (e.which && e.which !== 1) {
                    return false;
                } else {
                    startTime = new Date().getTime();
                    origTarget = e.target;
                    $this.data('callee1', arguments.callee);

                    // Get the start x and y position:
                    start_pos.x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
                    start_pos.y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;
                    return true;
                }
            }).bind(settings.endevent, function (e) {
                $this.data('callee2', arguments.callee);
                if (e.target == origTarget) {
                    // Get the end point:
                    end_pos_x = (e.originalEvent.changedTouches) ? e.originalEvent.changedTouches[0].pageX : e.pageX;
                    end_pos_y = (e.originalEvent.changedTouches) ? e.originalEvent.changedTouches[0].pageY : e.pageY;
                    
                    // We need to check if it was a LONGTAP:

                    settings.TAP_timer = window.setTimeout(function () {
                        if (!$this.data('DOUBLETAPped') && !$this.data('TAPheld') && (start_pos.x == end_pos_x) && (start_pos.y == end_pos_y)) {
                            var origEvent = e.originalEvent;
                            var touchData = {
                                'position': {
                                    'x': (settings.touch_capable) ? origEvent.changedTouches[0].screenX : e.screenX,
                                    'y': (settings.touch_capable) ? origEvent.changedTouches[0].screenY : e.screenY,
                                },
                                'offset': {
                                    'x': (settings.touch_capable) ? origEvent.changedTouches[0].pageX - origEvent.changedTouches[0].target.offsetLeft : e.offsetX,
                                    'y': (settings.touch_capable) ? origEvent.changedTouches[0].pageY - origEvent.changedTouches[0].target.offsetTop : e.offsetY,
                                },
                                'time': new Date().getTime(),
                                'target': e.target
                            };
                            
                            // Was it a LONGTAP?
                            if((touchData.time - startTime) < settings.LONGTAP_threshold)
                            {
                                triggerCustomEvent(thisObject, 'SINGLETAP', e, touchData);
                            }
                        }
                    }, settings.DOUBLETAP_int);
                }
            });
        },

        remove: function () {
            $(this).unbind(settings.startevent, $(this).data.callee1).unbind(settings.endevent, $(this).data.callee2);
        }
    };

    // TAP Event:
    $.event.special.TAP = {
        setup: function () {
            var thisObject = this,
                $this = $(thisObject),
                started = false,
                origTarget = null,
                start_time,
                start_pos = {
                    x: 0,
                    y: 0
                };

            $this.bind(settings.startevent, function (e) {
                $this.data('callee1', arguments.callee);

                if (e.which && e.which !== 1) {
                    return false;
                } else {
                    started = true;
                    start_pos.x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
                    start_pos.y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;
                    start_time = new Date().getTime();
                    origTarget = e.target;
                    return true;
                }
            }).bind(settings.endevent, function (e) {
                $this.data('callee2', arguments.callee);

                // Only trigger if they've started, and the target matches:
                var end_x = (e.originalEvent.targetTouches) ? e.originalEvent.changedTouches[0].pageX : e.pageX,
                    end_y = (e.originalEvent.targetTouches) ? e.originalEvent.changedTouches[0].pageY : e.pageY;

                if (origTarget == e.target && started && ((new Date().getTime() - start_time) < settings.LONGTAP_threshold) && (start_pos.x == end_x && start_pos.y == end_y)) {
                    var origEvent = e.originalEvent;
                    var touchData = {
                        'position': {
                            'x': (settings.touch_capable) ? origEvent.changedTouches[0].screenX : e.screenX,
                            'y': (settings.touch_capable) ? origEvent.changedTouches[0].screenY : e.screenY,
                        },
                        'offset': {
                            'x': (settings.touch_capable) ? origEvent.changedTouches[0].pageX - origEvent.changedTouches[0].target.offsetLeft : e.offsetX,
                            'y': (settings.touch_capable) ? origEvent.changedTouches[0].pageY - origEvent.changedTouches[0].target.offsetTop : e.offsetY,
                        },
                        'time': new Date().getTime(),
                        'target': e.target
                    };

                    triggerCustomEvent(thisObject, 'TAP', e, touchData);
                }
            });
        },

        remove: function () {
            $(this).unbind(settings.startevent, $(this).data.callee1).unbind(settings.endevent, $(this).data.callee2);
        }
    };

    // SWIPE Event (also handles SWIPEUP, SWIPERIGHT, SWIPEDOWN and SWIPELEFT):
    $.event.special.SWIPE = {
        setup: function () {
            var thisObject = this,
                $this = $(thisObject),
                started = false,
                hasSWIPEd = false,
                originalCoord = {
                    x: 0,
                    y: 0
                },
                finalCoord = {
                    x: 0,
                    y: 0
                },
                startEvnt;

            // Screen touched, store the original coordinate

            function touchStart(e) {
                $this = $(e.target);
                $this.data('callee1', arguments.callee);
                originalCoord.x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
                originalCoord.y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;
                finalCoord.x = originalCoord.x;
                finalCoord.y = originalCoord.y;
                started = true;
                var origEvent = e.originalEvent;
                // Read event data into our startEvt:
                startEvnt = {
                    'position': {
                        'x': (settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX,
                        'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY,
                    },
                    'offset': {
                        'x': (settings.touch_capable) ? origEvent.touches[0].pageX - origEvent.touches[0].target.offsetLeft : e.offsetX,
                        'y': (settings.touch_capable) ? origEvent.touches[0].pageY - origEvent.touches[0].target.offsetTop : e.offsetY,
                    },
                    'time': new Date().getTime(),
                    'target': e.target
                };

                // For some reason, we need to add a 100ms pause in order to trigger swiping
                // on Playbooks:
                var dt = new Date();
                while ((new Date()) - dt < 100) {}
            }

            // Store coordinates as finger is swiping

            function touchMove(e) {
                $this = $(e.target);
                $this.data('callee2', arguments.callee);
                finalCoord.x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
                finalCoord.y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;
                window.clearTimeout(settings.hold_timer);

                var SWIPEdir;

                // We need to check if the element to which the event was bound contains a data-xthreshold | data-vthreshold:
                var ele_x_threshold = $this.data('xthreshold'),
                    ele_y_threshold = $this.data('ythreshold'),
                    h_threshold = (typeof ele_x_threshold !== 'undefined' && ele_x_threshold !== false && parseInt(ele_x_threshold)) ? parseInt(ele_x_threshold) : settings.SWIPE_h_threshold,
                    v_threshold = (typeof ele_y_threshold !== 'undefined' && ele_y_threshold !== false && parseInt(ele_y_threshold)) ? parseInt(ele_y_threshold) : settings.SWIPE_v_threshold;

                if (originalCoord.y > finalCoord.y && (originalCoord.y - finalCoord.y > v_threshold)) {
                    SWIPEdir = 'SWIPEUP';
                }
                if (originalCoord.x < finalCoord.x && (finalCoord.x - originalCoord.x > h_threshold)) {
                    SWIPEdir = 'SWIPERIGHT';
                }
                if (originalCoord.y < finalCoord.y && (finalCoord.y - originalCoord.y > v_threshold)) {
                    SWIPEdir = 'SWIPEDOWN';
                }
                if (originalCoord.x > finalCoord.x && (originalCoord.x - finalCoord.x > h_threshold)) {
                    SWIPEdir = 'SWIPELEFT';
                }
                if (SWIPEdir != undefined && started) {
                    originalCoord.x = 0;
                    originalCoord.y = 0;
                    finalCoord.x = 0;
                    finalCoord.y = 0;
                    started = false;

                    // Read event data into our endEvnt:
                    var origEvent = e.originalEvent;
                    endEvnt = {
                        'position': {
                            'x': (settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX,
                            'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY,
                        },
                        'offset': {
                            'x': (settings.touch_capable) ? origEvent.touches[0].pageX - origEvent.touches[0].target.offsetLeft : e.offsetX,
                            'y': (settings.touch_capable) ? origEvent.touches[0].pageY - origEvent.touches[0].target.offsetTop : e.offsetY,
                        },
                        'time': new Date().getTime(),
                        'target': e.target
                    };

                    // Calculate the SWIPE amount (normalized):
                    var xAmount = Math.abs(startEvnt.position.x - endEvnt.position.x),
                        yAmount = Math.abs(startEvnt.position.y - endEvnt.position.y);

                    var touchData = {
                        'startEvnt': startEvnt,
                        'endEvnt': endEvnt,
                        'direction': SWIPEdir.replace('SWIPE', ''),
                        'xAmount': xAmount,
                        'yAmount': yAmount,
                        'duration': endEvnt.time - startEvnt.time
                    }
                    hasSWIPEd = true;
                    $this.trigger('SWIPE', touchData).trigger(SWIPEdir, touchData);
                }
            }

            function touchEnd(e) {
                $this = $(e.target);
                var SWIPEdir = "";
                $this.data('callee3', arguments.callee);
                if (hasSWIPEd) {
                    // We need to check if the element to which the event was bound contains a data-xthreshold | data-vthreshold:
                    var ele_x_threshold = $this.data('xthreshold'),
                        ele_y_threshold = $this.data('ythreshold'),
                        h_threshold = (typeof ele_x_threshold !== 'undefined' && ele_x_threshold !== false && parseInt(ele_x_threshold)) ? parseInt(ele_x_threshold) : settings.SWIPE_h_threshold,
                        v_threshold = (typeof ele_y_threshold !== 'undefined' && ele_y_threshold !== false && parseInt(ele_y_threshold)) ? parseInt(ele_y_threshold) : settings.SWIPE_v_threshold;

                    var origEvent = e.originalEvent;
                    endEvnt = {
                        'position': {
                            'x': (settings.touch_capable) ? origEvent.changedTouches[0].screenX : e.screenX,
                            'y': (settings.touch_capable) ? origEvent.changedTouches[0].screenY : e.screenY,
                        },
                        'offset': {
                            'x': (settings.touch_capable) ? origEvent.changedTouches[0].pageX - origEvent.changedTouches[0].target.offsetLeft : e.offsetX,
                            'y': (settings.touch_capable) ? origEvent.changedTouches[0].pageY - origEvent.changedTouches[0].target.offsetTop : e.offsetY,
                        },
                        'time': new Date().getTime(),
                        'target': e.target
                    };

                    // Read event data into our endEvnt:
                    if (startEvnt.position.y > endEvnt.position.y && (startEvnt.position.y - endEvnt.position.y > v_threshold)) {
                        SWIPEdir = 'SWIPEUP';
                    }
                    if (startEvnt.position.x < endEvnt.position.x && (endEvnt.position.x - startEvnt.position.x > h_threshold)) {
                        SWIPEdir = 'SWIPERIGHT';
                    }
                    if (startEvnt.position.y < endEvnt.position.y && (endEvnt.position.y - startEvnt.position.y > v_threshold)) {
                        SWIPEdir = 'SWIPEDOWN';
                    }
                    if (startEvnt.position.x > endEvnt.position.x && (startEvnt.position.x - endEvnt.position.x > h_threshold)) {
                        SWIPEdir = 'SWIPELEFT';
                    }

                    // Calculate the SWIPE amount (normalized):
                    var xAmount = Math.abs(startEvnt.position.x - endEvnt.position.x),
                        yAmount = Math.abs(startEvnt.position.y - endEvnt.position.y);

                    var touchData = {
                        'startEvnt': startEvnt,
                        'endEvnt': endEvnt,
                        'direction': SWIPEdir.replace('SWIPE', ''),
                        'xAmount': xAmount,
                        'yAmount': yAmount,
                        'duration': endEvnt.time - startEvnt.time
                    }
                    $this.trigger('SWIPEEND', touchData);
                }

                started = false;
                hasSWIPEd = false;
            }

            $this.bind(settings.startevent, touchStart);
            $this.bind(settings.moveevent, touchMove);
            $this.bind(settings.endevent, touchEnd);
        },

        remove: function () {
            $(this).unbind(settings.startevent, $(this).data.callee1).unbind(settings.moveevent, $(this).data.callee2).unbind(settings.endevent, $(this).data.callee3);
        }
    };

    // SCROLLSTART Event (also handles SCROLLEND):
    $.event.special.SCROLLSTART = {
        setup: function () {
            var thisObject = this,
                $this = $(thisObject),
                scrolling,
                timer;

            function trigger(event, state) {
                scrolling = state;
                triggerCustomEvent(thisObject, scrolling ? 'SCROLLSTART' : 'SCROLLEND', event);
            }

            // iPhone triggers scroll after a small delay; use touchmove instead
            $this.bind(settings.scrollevent, function (event) {
                $this.data('callee', arguments.callee);

                if (!scrolling) {
                    trigger(event, true);
                }

                clearTimeout(timer);
                timer = setTimeout(function () {
                    trigger(event, false);
                }, 50);
            });
        },

        remove: function () {
            $(this).unbind(settings.scrollevent, $(this).data.callee);
        }
    };

    // This is the orientation change (largely borrowed from jQuery Mobile):
    var win = $(window),
        special_event,
        get_orientation,
        last_orientation,
        initial_orientation_is_landscape,
        initial_orientation_is_default,
        portrait_map = {
            '0': true,
            '180': true
        };

    if (settings.orientation_support) {
        var ww = window.innerWidth || $(window).width(),
            wh = window.innerHeight || $(window).height(),
            landscape_threshold = 50;

        initial_orientation_is_landscape = ww > wh && (ww - wh) > landscape_threshold;
        initial_orientation_is_default = portrait_map[window.orientation];

        if ((initial_orientation_is_landscape && initial_orientation_is_default) || (!initial_orientation_is_landscape && !initial_orientation_is_default)) {
            portrait_map = {
                '-90': true,
                '90': true
            };
        }
    }

    $.event.special.ORIENTATIONCHANGE = special_event = {
        setup: function () {
            // If the event is supported natively, return false so that jQuery
            // will bind to the event using DOM methods.
            if (settings.orientation_support) {
                return false;
            }

            // Get the current orientation to avoid initial double-triggering.
            last_orientation = get_orientation();

            win.bind('throttledresize', handler);
            return true;
        },
        teardown: function () {
            if (settings.orientation_support) {
                return false;
            }

            win.unbind('throttledresize', handler);
            return true;
        },
        add: function (handleObj) {
            // Save a reference to the bound event handler.
            var old_handler = handleObj.handler;

            handleObj.handler = function (event) {
                event.orientation = get_orientation();
                return old_handler.apply(this, arguments);
            };
        }
    };

    // If the event is not supported natively, this handler will be bound to
    // the window resize event to simulate the ORIENTATIONCHANGE event.

    function handler() {
        // Get the current orientation.
        var orientation = get_orientation();

        if (orientation !== last_orientation) {
            // The orientation has changed, so trigger the ORIENTATIONCHANGE event.
            last_orientation = orientation;
            win.trigger("ORIENTATIONCHANGE");
        }
    }

    $.event.special.ORIENTATIONCHANGE.orientation = get_orientation = function () {
        var isPortrait = true,
            elem = document.documentElement;

        if (settings.orientation_support) {
            isPortrait = portrait_map[window.orientation];
        } else {
            isPortrait = elem && elem.clientWidth / elem.clientHeight < 1.1;
        }

        return isPortrait ? 'portrait' : 'landscape';
    };

    // throttle Handler:
    $.event.special.throttledresize = {
        setup: function () {
            $(this).bind('resize', throttle_handler);
        },
        teardown: function () {
            $(this).unbind('resize', throttle_handler);
        }
    };

    var throttle = 250,
        throttle_handler = function () {
            curr = (new Date()).getTime();
            diff = curr - lastCall;

            if (diff >= throttle) {
                lastCall = curr;
                $(this).trigger('throttledresize');

            } else {
                if (heldCall) {
                    window.clearTimeout(heldCall);
                }

                // Promise a held call will still execute
                heldCall = window.setTimeout(handler, throttle - diff);
            }
        },
        lastCall = 0,
        heldCall,
        curr,
        diff;

    // Trigger a custom event:

    function triggerCustomEvent(obj, eventType, event, touchData) {
        var originalType = event.type;
        event.type = eventType;

        $.event.dispatch.call(obj, event, touchData);
        event.type = originalType;
    }

    // Correctly bind anything we've overloaded:
    $.each({
        SCROLLEND: 'SCROLLSTART',
        SWIPEUP: 'SWIPE',
        SWIPERIGHT: 'SWIPE',
        SWIPEDOWN: 'SWIPE',
        SWIPELEFT: 'SWIPE',
        SWIPEEND: 'SWIPE',
    }, function (e, srcE, touchData) {
        $.event.special[e] = {
            setup: function () {
                $(this).bind(srcE, $.noop);
            }
        };
    });

})(jQuery);
