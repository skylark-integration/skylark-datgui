/**
 * skylark-datgui - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-datgui/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-datgui/color/toString',[],function () {
    'use strict';
    return function (color, forceCSSHex) {
        const colorFormat = color.__state.conversionName.toString();
        const r = Math.round(color.r);
        const g = Math.round(color.g);
        const b = Math.round(color.b);
        const a = color.a;
        const h = Math.round(color.h);
        const s = color.s.toFixed(1);
        const v = color.v.toFixed(1);
        if (forceCSSHex || colorFormat === 'THREE_CHAR_HEX' || colorFormat === 'SIX_CHAR_HEX') {
            let str = color.hex.toString(16);
            while (str.length < 6) {
                str = '0' + str;
            }
            return '#' + str;
        } else if (colorFormat === 'CSS_RGB') {
            return 'rgb(' + r + ',' + g + ',' + b + ')';
        } else if (colorFormat === 'CSS_RGBA') {
            return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        } else if (colorFormat === 'HEX') {
            return '0x' + color.hex.toString(16);
        } else if (colorFormat === 'RGB_ARRAY') {
            return '[' + r + ',' + g + ',' + b + ']';
        } else if (colorFormat === 'RGBA_ARRAY') {
            return '[' + r + ',' + g + ',' + b + ',' + a + ']';
        } else if (colorFormat === 'RGB_OBJ') {
            return '{r:' + r + ',g:' + g + ',b:' + b + '}';
        } else if (colorFormat === 'RGBA_OBJ') {
            return '{r:' + r + ',g:' + g + ',b:' + b + ',a:' + a + '}';
        } else if (colorFormat === 'HSV_OBJ') {
            return '{h:' + h + ',s:' + s + ',v:' + v + '}';
        } else if (colorFormat === 'HSVA_OBJ') {
            return '{h:' + h + ',s:' + s + ',v:' + v + ',a:' + a + '}';
        }
        return 'unknown format';
    };
});
define('skylark-datgui/utils/common',[],function () {
    'use strict';
    const ARR_EACH = Array.prototype.forEach;
    const ARR_SLICE = Array.prototype.slice;
    const Common = {
        BREAK: {},
        extend: function (target) {
            this.each(ARR_SLICE.call(arguments, 1), function (obj) {
                const keys = this.isObject(obj) ? Object.keys(obj) : [];
                keys.forEach(function (key) {
                    if (!this.isUndefined(obj[key])) {
                        target[key] = obj[key];
                    }
                }.bind(this));
            }, this);
            return target;
        },
        defaults: function (target) {
            this.each(ARR_SLICE.call(arguments, 1), function (obj) {
                const keys = this.isObject(obj) ? Object.keys(obj) : [];
                keys.forEach(function (key) {
                    if (this.isUndefined(target[key])) {
                        target[key] = obj[key];
                    }
                }.bind(this));
            }, this);
            return target;
        },
        compose: function () {
            const toCall = ARR_SLICE.call(arguments);
            return function () {
                let args = ARR_SLICE.call(arguments);
                for (let i = toCall.length - 1; i >= 0; i--) {
                    args = [toCall[i].apply(this, args)];
                }
                return args[0];
            };
        },
        each: function (obj, itr, scope) {
            if (!obj) {
                return;
            }
            if (ARR_EACH && obj.forEach && obj.forEach === ARR_EACH) {
                obj.forEach(itr, scope);
            } else if (obj.length === obj.length + 0) {
                let key;
                let l;
                for (key = 0, l = obj.length; key < l; key++) {
                    if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) {
                        return;
                    }
                }
            } else {
                for (const key in obj) {
                    if (itr.call(scope, obj[key], key) === this.BREAK) {
                        return;
                    }
                }
            }
        },
        defer: function (fnc) {
            setTimeout(fnc, 0);
        },
        debounce: function (func, threshold, callImmediately) {
            let timeout;
            return function () {
                const obj = this;
                const args = arguments;
                function delayed() {
                    timeout = null;
                    if (!callImmediately)
                        func.apply(obj, args);
                }
                const callNow = callImmediately || !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(delayed, threshold);
                if (callNow) {
                    func.apply(obj, args);
                }
            };
        },
        toArray: function (obj) {
            if (obj.toArray)
                return obj.toArray();
            return ARR_SLICE.call(obj);
        },
        isUndefined: function (obj) {
            return obj === undefined;
        },
        isNull: function (obj) {
            return obj === null;
        },
        isNaN: function (obj) {
            return isNaN(obj);
        },
        isArray: Array.isArray || function (obj) {
            return obj.constructor === Array;
        },
        isObject: function (obj) {
            return obj === Object(obj);
        },
        isNumber: function (obj) {
            return obj === obj + 0;
        },
        isString: function (obj) {
            return obj === obj + '';
        },
        isBoolean: function (obj) {
            return obj === false || obj === true;
        },
        isFunction: function (obj) {
            return obj instanceof Function;
        }
    };
    return Common;
});
define('skylark-datgui/color/interpret',[
    './toString',
    '../utils/common'
], function (toString, common) {
    'use strict';
    const INTERPRETATIONS = [
        {
            litmus: common.isString,
            conversions: {
                THREE_CHAR_HEX: {
                    read: function (original) {
                        const test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
                        if (test === null) {
                            return false;
                        }
                        return {
                            space: 'HEX',
                            hex: parseInt('0x' + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString(), 0)
                        };
                    },
                    write: toString
                },
                SIX_CHAR_HEX: {
                    read: function (original) {
                        const test = original.match(/^#([A-F0-9]{6})$/i);
                        if (test === null) {
                            return false;
                        }
                        return {
                            space: 'HEX',
                            hex: parseInt('0x' + test[1].toString(), 0)
                        };
                    },
                    write: toString
                },
                CSS_RGB: {
                    read: function (original) {
                        const test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
                        if (test === null) {
                            return false;
                        }
                        return {
                            space: 'RGB',
                            r: parseFloat(test[1]),
                            g: parseFloat(test[2]),
                            b: parseFloat(test[3])
                        };
                    },
                    write: toString
                },
                CSS_RGBA: {
                    read: function (original) {
                        const test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
                        if (test === null) {
                            return false;
                        }
                        return {
                            space: 'RGB',
                            r: parseFloat(test[1]),
                            g: parseFloat(test[2]),
                            b: parseFloat(test[3]),
                            a: parseFloat(test[4])
                        };
                    },
                    write: toString
                }
            }
        },
        {
            litmus: common.isNumber,
            conversions: {
                HEX: {
                    read: function (original) {
                        return {
                            space: 'HEX',
                            hex: original,
                            conversionName: 'HEX'
                        };
                    },
                    write: function (color) {
                        return color.hex;
                    }
                }
            }
        },
        {
            litmus: common.isArray,
            conversions: {
                RGB_ARRAY: {
                    read: function (original) {
                        if (original.length !== 3) {
                            return false;
                        }
                        return {
                            space: 'RGB',
                            r: original[0],
                            g: original[1],
                            b: original[2]
                        };
                    },
                    write: function (color) {
                        return [
                            color.r,
                            color.g,
                            color.b
                        ];
                    }
                },
                RGBA_ARRAY: {
                    read: function (original) {
                        if (original.length !== 4)
                            return false;
                        return {
                            space: 'RGB',
                            r: original[0],
                            g: original[1],
                            b: original[2],
                            a: original[3]
                        };
                    },
                    write: function (color) {
                        return [
                            color.r,
                            color.g,
                            color.b,
                            color.a
                        ];
                    }
                }
            }
        },
        {
            litmus: common.isObject,
            conversions: {
                RGBA_OBJ: {
                    read: function (original) {
                        if (common.isNumber(original.r) && common.isNumber(original.g) && common.isNumber(original.b) && common.isNumber(original.a)) {
                            return {
                                space: 'RGB',
                                r: original.r,
                                g: original.g,
                                b: original.b,
                                a: original.a
                            };
                        }
                        return false;
                    },
                    write: function (color) {
                        return {
                            r: color.r,
                            g: color.g,
                            b: color.b,
                            a: color.a
                        };
                    }
                },
                RGB_OBJ: {
                    read: function (original) {
                        if (common.isNumber(original.r) && common.isNumber(original.g) && common.isNumber(original.b)) {
                            return {
                                space: 'RGB',
                                r: original.r,
                                g: original.g,
                                b: original.b
                            };
                        }
                        return false;
                    },
                    write: function (color) {
                        return {
                            r: color.r,
                            g: color.g,
                            b: color.b
                        };
                    }
                },
                HSVA_OBJ: {
                    read: function (original) {
                        if (common.isNumber(original.h) && common.isNumber(original.s) && common.isNumber(original.v) && common.isNumber(original.a)) {
                            return {
                                space: 'HSV',
                                h: original.h,
                                s: original.s,
                                v: original.v,
                                a: original.a
                            };
                        }
                        return false;
                    },
                    write: function (color) {
                        return {
                            h: color.h,
                            s: color.s,
                            v: color.v,
                            a: color.a
                        };
                    }
                },
                HSV_OBJ: {
                    read: function (original) {
                        if (common.isNumber(original.h) && common.isNumber(original.s) && common.isNumber(original.v)) {
                            return {
                                space: 'HSV',
                                h: original.h,
                                s: original.s,
                                v: original.v
                            };
                        }
                        return false;
                    },
                    write: function (color) {
                        return {
                            h: color.h,
                            s: color.s,
                            v: color.v
                        };
                    }
                }
            }
        }
    ];
    let result;
    let toReturn;
    const interpret = function () {
        toReturn = false;
        const original = arguments.length > 1 ? common.toArray(arguments) : arguments[0];
        common.each(INTERPRETATIONS, function (family) {
            if (family.litmus(original)) {
                common.each(family.conversions, function (conversion, conversionName) {
                    result = conversion.read(original);
                    if (toReturn === false && result !== false) {
                        toReturn = result;
                        result.conversionName = conversionName;
                        result.conversion = conversion;
                        return common.BREAK;
                    }
                });
                return common.BREAK;
            }
        });
        return toReturn;
    };
    return interpret;
});
define('skylark-datgui/color/math',[],function () {
    'use strict';
    let tmpComponent;
    const ColorMath = {
        hsv_to_rgb: function (h, s, v) {
            const hi = Math.floor(h / 60) % 6;
            const f = h / 60 - Math.floor(h / 60);
            const p = v * (1 - s);
            const q = v * (1 - f * s);
            const t = v * (1 - (1 - f) * s);
            const c = [
                [
                    v,
                    t,
                    p
                ],
                [
                    q,
                    v,
                    p
                ],
                [
                    p,
                    v,
                    t
                ],
                [
                    p,
                    q,
                    v
                ],
                [
                    t,
                    p,
                    v
                ],
                [
                    v,
                    p,
                    q
                ]
            ][hi];
            return {
                r: c[0] * 255,
                g: c[1] * 255,
                b: c[2] * 255
            };
        },
        rgb_to_hsv: function (r, g, b) {
            const min = Math.min(r, g, b);
            const max = Math.max(r, g, b);
            const delta = max - min;
            let h;
            let s;
            if (max !== 0) {
                s = delta / max;
            } else {
                return {
                    h: NaN,
                    s: 0,
                    v: 0
                };
            }
            if (r === max) {
                h = (g - b) / delta;
            } else if (g === max) {
                h = 2 + (b - r) / delta;
            } else {
                h = 4 + (r - g) / delta;
            }
            h /= 6;
            if (h < 0) {
                h += 1;
            }
            return {
                h: h * 360,
                s: s,
                v: max / 255
            };
        },
        rgb_to_hex: function (r, g, b) {
            let hex = this.hex_with_component(0, 2, r);
            hex = this.hex_with_component(hex, 1, g);
            hex = this.hex_with_component(hex, 0, b);
            return hex;
        },
        component_from_hex: function (hex, componentIndex) {
            return hex >> componentIndex * 8 & 255;
        },
        hex_with_component: function (hex, componentIndex, value) {
            return value << (tmpComponent = componentIndex * 8) | hex & ~(255 << tmpComponent);
        }
    };
    return ColorMath;
});
define('skylark-datgui/color/Color',[
    './interpret',
    './math',
    './toString',
    '../utils/common'
], function (interpret, math, colorToString, common) {
    'use strict';
    class Color {
        constructor() {
            this.__state = interpret.apply(this, arguments);
            if (this.__state === false) {
                throw new Error('Failed to interpret color arguments');
            }
            this.__state.a = this.__state.a || 1;
        }
        toString() {
            return colorToString(this);
        }
        toHexString() {
            return colorToString(this, true);
        }
        toOriginal() {
            return this.__state.conversion.write(this);
        }
    }
    function defineRGBComponent(target, component, componentHexIndex) {
        Object.defineProperty(target, component, {
            get: function () {
                if (this.__state.space === 'RGB') {
                    return this.__state[component];
                }
                Color.recalculateRGB(this, component, componentHexIndex);
                return this.__state[component];
            },
            set: function (v) {
                if (this.__state.space !== 'RGB') {
                    Color.recalculateRGB(this, component, componentHexIndex);
                    this.__state.space = 'RGB';
                }
                this.__state[component] = v;
            }
        });
    }
    function defineHSVComponent(target, component) {
        Object.defineProperty(target, component, {
            get: function () {
                if (this.__state.space === 'HSV') {
                    return this.__state[component];
                }
                Color.recalculateHSV(this);
                return this.__state[component];
            },
            set: function (v) {
                if (this.__state.space !== 'HSV') {
                    Color.recalculateHSV(this);
                    this.__state.space = 'HSV';
                }
                this.__state[component] = v;
            }
        });
    }
    Color.recalculateRGB = function (color, component, componentHexIndex) {
        if (color.__state.space === 'HEX') {
            color.__state[component] = math.component_from_hex(color.__state.hex, componentHexIndex);
        } else if (color.__state.space === 'HSV') {
            common.extend(color.__state, math.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
        } else {
            throw new Error('Corrupted color state');
        }
    };
    Color.recalculateHSV = function (color) {
        const result = math.rgb_to_hsv(color.r, color.g, color.b);
        common.extend(color.__state, {
            s: result.s,
            v: result.v
        });
        if (!common.isNaN(result.h)) {
            color.__state.h = result.h;
        } else if (common.isUndefined(color.__state.h)) {
            color.__state.h = 0;
        }
    };
    Color.COMPONENTS = [
        'r',
        'g',
        'b',
        'h',
        's',
        'v',
        'hex',
        'a'
    ];
    defineRGBComponent(Color.prototype, 'r', 2);
    defineRGBComponent(Color.prototype, 'g', 1);
    defineRGBComponent(Color.prototype, 'b', 0);
    defineHSVComponent(Color.prototype, 'h');
    defineHSVComponent(Color.prototype, 's');
    defineHSVComponent(Color.prototype, 'v');
    Object.defineProperty(Color.prototype, 'a', {
        get: function () {
            return this.__state.a;
        },
        set: function (v) {
            this.__state.a = v;
        }
    });
    Object.defineProperty(Color.prototype, 'hex', {
        get: function () {
            if (this.__state.space !== 'HEX') {
                this.__state.hex = math.rgb_to_hex(this.r, this.g, this.b);
                this.__state.space = 'HEX';
            }
            return this.__state.hex;
        },
        set: function (v) {
            this.__state.space = 'HEX';
            this.__state.hex = v;
        }
    });
    return Color;
});
define('skylark-datgui/controllers/Controller',[],function () {
    'use strict';
    class Controller {
        constructor(object, property) {
            this.initialValue = object[property];
            this.domElement = document.createElement('div');
            this.object = object;
            this.property = property;
            this.__onChange = undefined;
            this.__onFinishChange = undefined;
        }
        onChange(fnc) {
            this.__onChange = fnc;
            return this;
        }
        onFinishChange(fnc) {
            this.__onFinishChange = fnc;
            return this;
        }
        setValue(newValue) {
            this.object[this.property] = newValue;
            if (this.__onChange) {
                this.__onChange.call(this, newValue);
            }
            this.updateDisplay();
            return this;
        }
        getValue() {
            return this.object[this.property];
        }
        updateDisplay() {
            return this;
        }
        isModified() {
            return this.initialValue !== this.getValue();
        }
    }
    return Controller;
});
define('skylark-datgui/dom/dom',['../utils/common'], function (common) {
    'use strict';
    const EVENT_MAP = {
        HTMLEvents: ['change'],
        MouseEvents: [
            'click',
            'mousemove',
            'mousedown',
            'mouseup',
            'mouseover'
        ],
        KeyboardEvents: ['keydown']
    };
    const EVENT_MAP_INV = {};
    common.each(EVENT_MAP, function (v, k) {
        common.each(v, function (e) {
            EVENT_MAP_INV[e] = k;
        });
    });
    const CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;
    function cssValueToPixels(val) {
        if (val === '0' || common.isUndefined(val)) {
            return 0;
        }
        const match = val.match(CSS_VALUE_PIXELS);
        if (!common.isNull(match)) {
            return parseFloat(match[1]);
        }
        return 0;
    }
    const dom = {
        makeSelectable: function (elem, selectable) {
            if (elem === undefined || elem.style === undefined)
                return;
            elem.onselectstart = selectable ? function () {
                return false;
            } : function () {
            };
            elem.style.MozUserSelect = selectable ? 'auto' : 'none';
            elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
            elem.unselectable = selectable ? 'on' : 'off';
        },
        makeFullscreen: function (elem, hor, vert) {
            let vertical = vert;
            let horizontal = hor;
            if (common.isUndefined(horizontal)) {
                horizontal = true;
            }
            if (common.isUndefined(vertical)) {
                vertical = true;
            }
            elem.style.position = 'absolute';
            if (horizontal) {
                elem.style.left = 0;
                elem.style.right = 0;
            }
            if (vertical) {
                elem.style.top = 0;
                elem.style.bottom = 0;
            }
        },
        fakeEvent: function (elem, eventType, pars, aux) {
            const params = pars || {};
            const className = EVENT_MAP_INV[eventType];
            if (!className) {
                throw new Error('Event type ' + eventType + ' not supported.');
            }
            const evt = document.createEvent(className);
            switch (className) {
            case 'MouseEvents': {
                    const clientX = params.x || params.clientX || 0;
                    const clientY = params.y || params.clientY || 0;
                    evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0, 0, clientX, clientY, false, false, false, false, 0, null);
                    break;
                }
            case 'KeyboardEvents': {
                    const init = evt.initKeyboardEvent || evt.initKeyEvent;
                    common.defaults(params, {
                        cancelable: true,
                        ctrlKey: false,
                        altKey: false,
                        shiftKey: false,
                        metaKey: false,
                        keyCode: undefined,
                        charCode: undefined
                    });
                    init(eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode);
                    break;
                }
            default: {
                    evt.initEvent(eventType, params.bubbles || false, params.cancelable || true);
                    break;
                }
            }
            common.defaults(evt, aux);
            elem.dispatchEvent(evt);
        },
        bind: function (elem, event, func, newBool) {
            const bool = newBool || false;
            if (elem.addEventListener) {
                elem.addEventListener(event, func, bool);
            } else if (elem.attachEvent) {
                elem.attachEvent('on' + event, func);
            }
            return dom;
        },
        unbind: function (elem, event, func, newBool) {
            const bool = newBool || false;
            if (elem.removeEventListener) {
                elem.removeEventListener(event, func, bool);
            } else if (elem.detachEvent) {
                elem.detachEvent('on' + event, func);
            }
            return dom;
        },
        addClass: function (elem, className) {
            if (elem.className === undefined) {
                elem.className = className;
            } else if (elem.className !== className) {
                const classes = elem.className.split(/ +/);
                if (classes.indexOf(className) === -1) {
                    classes.push(className);
                    elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
                }
            }
            return dom;
        },
        removeClass: function (elem, className) {
            if (className) {
                if (elem.className === className) {
                    elem.removeAttribute('class');
                } else {
                    const classes = elem.className.split(/ +/);
                    const index = classes.indexOf(className);
                    if (index !== -1) {
                        classes.splice(index, 1);
                        elem.className = classes.join(' ');
                    }
                }
            } else {
                elem.className = undefined;
            }
            return dom;
        },
        hasClass: function (elem, className) {
            return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
        },
        getWidth: function (elem) {
            const style = getComputedStyle(elem);
            return cssValueToPixels(style['border-left-width']) + cssValueToPixels(style['border-right-width']) + cssValueToPixels(style['padding-left']) + cssValueToPixels(style['padding-right']) + cssValueToPixels(style.width);
        },
        getHeight: function (elem) {
            const style = getComputedStyle(elem);
            return cssValueToPixels(style['border-top-width']) + cssValueToPixels(style['border-bottom-width']) + cssValueToPixels(style['padding-top']) + cssValueToPixels(style['padding-bottom']) + cssValueToPixels(style.height);
        },
        getOffset: function (el) {
            let elem = el;
            const offset = {
                left: 0,
                top: 0
            };
            if (elem.offsetParent) {
                do {
                    offset.left += elem.offsetLeft;
                    offset.top += elem.offsetTop;
                    elem = elem.offsetParent;
                } while (elem);
            }
            return offset;
        },
        isActive: function (elem) {
            return elem === document.activeElement && (elem.type || elem.href);
        }
    };
    return dom;
});
define('skylark-datgui/controllers/BooleanController',[
    './Controller',
    '../dom/dom'
], function (Controller, dom) {
    'use strict';
    class BooleanController extends Controller {
        constructor(object, property) {
            super(object, property);
            const _this = this;
            this.__prev = this.getValue();
            this.__checkbox = document.createElement('input');
            this.__checkbox.setAttribute('type', 'checkbox');
            function onChange() {
                _this.setValue(!_this.__prev);
            }
            dom.bind(this.__checkbox, 'change', onChange, false);
            this.domElement.appendChild(this.__checkbox);
            this.updateDisplay();
        }
        setValue(v) {
            const toReturn = super.setValue(v);
            if (this.__onFinishChange) {
                this.__onFinishChange.call(this, this.getValue());
            }
            this.__prev = this.getValue();
            return toReturn;
        }
        updateDisplay() {
            if (this.getValue() === true) {
                this.__checkbox.setAttribute('checked', 'checked');
                this.__checkbox.checked = true;
                this.__prev = true;
            } else {
                this.__checkbox.checked = false;
                this.__prev = false;
            }
            return super.updateDisplay();
        }
    }
    return BooleanController;
});
define('skylark-datgui/controllers/OptionController',[
    './Controller',
    '../dom/dom',
    '../utils/common'
], function (Controller, dom, common) {
    'use strict';
    class OptionController extends Controller {
        constructor(object, property, opts) {
            super(object, property);
            let options = opts;
            const _this = this;
            this.__select = document.createElement('select');
            if (common.isArray(options)) {
                const map = {};
                common.each(options, function (element) {
                    map[element] = element;
                });
                options = map;
            }
            common.each(options, function (value, key) {
                const opt = document.createElement('option');
                opt.innerHTML = key;
                opt.setAttribute('value', value);
                _this.__select.appendChild(opt);
            });
            this.updateDisplay();
            dom.bind(this.__select, 'change', function () {
                const desiredValue = this.options[this.selectedIndex].value;
                _this.setValue(desiredValue);
            });
            this.domElement.appendChild(this.__select);
        }
        setValue(v) {
            const toReturn = super.setValue(v);
            if (this.__onFinishChange) {
                this.__onFinishChange.call(this, this.getValue());
            }
            return toReturn;
        }
        updateDisplay() {
            if (dom.isActive(this.__select))
                return this;
            this.__select.value = this.getValue();
            return super.updateDisplay();
        }
    }
    return OptionController;
});
define('skylark-datgui/controllers/StringController',[
    './Controller',
    '../dom/dom'
], function (Controller, dom) {
    'use strict';
    class StringController extends Controller {
        constructor(object, property) {
            super(object, property);
            const _this = this;
            function onChange() {
                _this.setValue(_this.__input.value);
            }
            function onBlur() {
                if (_this.__onFinishChange) {
                    _this.__onFinishChange.call(_this, _this.getValue());
                }
            }
            this.__input = document.createElement('input');
            this.__input.setAttribute('type', 'text');
            dom.bind(this.__input, 'keyup', onChange);
            dom.bind(this.__input, 'change', onChange);
            dom.bind(this.__input, 'blur', onBlur);
            dom.bind(this.__input, 'keydown', function (e) {
                if (e.keyCode === 13) {
                    this.blur();
                }
            });
            this.updateDisplay();
            this.domElement.appendChild(this.__input);
        }
        updateDisplay() {
            if (!dom.isActive(this.__input)) {
                this.__input.value = this.getValue();
            }
            return super.updateDisplay();
        }
    }
    return StringController;
});
define('skylark-datgui/controllers/NumberController',[
    './Controller',
    '../utils/common'
], function (Controller, common) {
    'use strict';
    function numDecimals(x) {
        const _x = x.toString();
        if (_x.indexOf('.') > -1) {
            return _x.length - _x.indexOf('.') - 1;
        }
        return 0;
    }
    class NumberController extends Controller {
        constructor(object, property, params) {
            super(object, property);
            const _params = params || {};
            this.__min = _params.min;
            this.__max = _params.max;
            this.__step = _params.step;
            if (common.isUndefined(this.__step)) {
                if (this.initialValue === 0) {
                    this.__impliedStep = 1;
                } else {
                    this.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(this.initialValue)) / Math.LN10)) / 10;
                }
            } else {
                this.__impliedStep = this.__step;
            }
            this.__precision = numDecimals(this.__impliedStep);
        }
        setValue(v) {
            let _v = v;
            if (this.__min !== undefined && _v < this.__min) {
                _v = this.__min;
            } else if (this.__max !== undefined && _v > this.__max) {
                _v = this.__max;
            }
            if (this.__step !== undefined && _v % this.__step !== 0) {
                _v = Math.round(_v / this.__step) * this.__step;
            }
            return super.setValue(_v);
        }
        min(minValue) {
            this.__min = minValue;
            return this;
        }
        max(maxValue) {
            this.__max = maxValue;
            return this;
        }
        step(stepValue) {
            this.__step = stepValue;
            this.__impliedStep = stepValue;
            this.__precision = numDecimals(stepValue);
            return this;
        }
    }
    return NumberController;
});
define('skylark-datgui/controllers/NumberControllerBox',[
    './NumberController',
    '../dom/dom',
    '../utils/common'
], function (NumberController, dom, common) {
    'use strict';
    function roundToDecimal(value, decimals) {
        const tenTo = Math.pow(10, decimals);
        return Math.round(value * tenTo) / tenTo;
    }
    class NumberControllerBox extends NumberController {
        constructor(object, property, params) {
            super(object, property, params);
            this.__truncationSuspended = false;
            const _this = this;
            let prevY;
            function onChange() {
                const attempted = parseFloat(_this.__input.value);
                if (!common.isNaN(attempted)) {
                    _this.setValue(attempted);
                }
            }
            function onFinish() {
                if (_this.__onFinishChange) {
                    _this.__onFinishChange.call(_this, _this.getValue());
                }
            }
            function onBlur() {
                onFinish();
            }
            function onMouseDrag(e) {
                const diff = prevY - e.clientY;
                _this.setValue(_this.getValue() + diff * _this.__impliedStep);
                prevY = e.clientY;
            }
            function onMouseUp() {
                dom.unbind(window, 'mousemove', onMouseDrag);
                dom.unbind(window, 'mouseup', onMouseUp);
                onFinish();
            }
            function onMouseDown(e) {
                dom.bind(window, 'mousemove', onMouseDrag);
                dom.bind(window, 'mouseup', onMouseUp);
                prevY = e.clientY;
            }
            this.__input = document.createElement('input');
            this.__input.setAttribute('type', 'text');
            dom.bind(this.__input, 'change', onChange);
            dom.bind(this.__input, 'blur', onBlur);
            dom.bind(this.__input, 'mousedown', onMouseDown);
            dom.bind(this.__input, 'keydown', function (e) {
                if (e.keyCode === 13) {
                    _this.__truncationSuspended = true;
                    this.blur();
                    _this.__truncationSuspended = false;
                    onFinish();
                }
            });
            this.updateDisplay();
            this.domElement.appendChild(this.__input);
        }
        updateDisplay() {
            this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
            return super.updateDisplay();
        }
    }
    return NumberControllerBox;
});
define('skylark-datgui/controllers/NumberControllerSlider',[
    './NumberController',
    '../dom/dom'
], function (NumberController, dom) {
    'use strict';
    function map(v, i1, i2, o1, o2) {
        return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
    }
    class NumberControllerSlider extends NumberController {
        constructor(object, property, min, max, step) {
            super(object, property, {
                min: min,
                max: max,
                step: step
            });
            const _this = this;
            this.__background = document.createElement('div');
            this.__foreground = document.createElement('div');
            dom.bind(this.__background, 'mousedown', onMouseDown);
            dom.bind(this.__background, 'touchstart', onTouchStart);
            dom.addClass(this.__background, 'slider');
            dom.addClass(this.__foreground, 'slider-fg');
            function onMouseDown(e) {
                document.activeElement.blur();
                dom.bind(window, 'mousemove', onMouseDrag);
                dom.bind(window, 'mouseup', onMouseUp);
                onMouseDrag(e);
            }
            function onMouseDrag(e) {
                e.preventDefault();
                const bgRect = _this.__background.getBoundingClientRect();
                _this.setValue(map(e.clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
                return false;
            }
            function onMouseUp() {
                dom.unbind(window, 'mousemove', onMouseDrag);
                dom.unbind(window, 'mouseup', onMouseUp);
                if (_this.__onFinishChange) {
                    _this.__onFinishChange.call(_this, _this.getValue());
                }
            }
            function onTouchStart(e) {
                if (e.touches.length !== 1) {
                    return;
                }
                dom.bind(window, 'touchmove', onTouchMove);
                dom.bind(window, 'touchend', onTouchEnd);
                onTouchMove(e);
            }
            function onTouchMove(e) {
                const clientX = e.touches[0].clientX;
                const bgRect = _this.__background.getBoundingClientRect();
                _this.setValue(map(clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
            }
            function onTouchEnd() {
                dom.unbind(window, 'touchmove', onTouchMove);
                dom.unbind(window, 'touchend', onTouchEnd);
                if (_this.__onFinishChange) {
                    _this.__onFinishChange.call(_this, _this.getValue());
                }
            }
            this.updateDisplay();
            this.__background.appendChild(this.__foreground);
            this.domElement.appendChild(this.__background);
        }
        updateDisplay() {
            const pct = (this.getValue() - this.__min) / (this.__max - this.__min);
            this.__foreground.style.width = pct * 100 + '%';
            return super.updateDisplay();
        }
    }
    return NumberControllerSlider;
});
define('skylark-datgui/controllers/FunctionController',[
    './Controller',
    '../dom/dom'
], function (Controller, dom) {
    'use strict';
    class FunctionController extends Controller {
        constructor(object, property, text) {
            super(object, property);
            const _this = this;
            this.__button = document.createElement('div');
            this.__button.innerHTML = text === undefined ? 'Fire' : text;
            dom.bind(this.__button, 'click', function (e) {
                e.preventDefault();
                _this.fire();
                return false;
            });
            dom.addClass(this.__button, 'button');
            this.domElement.appendChild(this.__button);
        }
        fire() {
            if (this.__onChange) {
                this.__onChange.call(this);
            }
            this.getValue().call(this.object);
            if (this.__onFinishChange) {
                this.__onFinishChange.call(this, this.getValue());
            }
        }
    }
    return FunctionController;
});
define('skylark-datgui/controllers/ColorController',[
    './Controller',
    '../dom/dom',
    '../color/Color',
    '../color/interpret',
    '../utils/common'
], function (Controller, dom, Color, interpret, common) {
    'use strict';
    class ColorController extends Controller {
        constructor(object, property) {
            super(object, property);
            this.__color = new Color(this.getValue());
            this.__temp = new Color(0);
            const _this = this;
            this.domElement = document.createElement('div');
            dom.makeSelectable(this.domElement, false);
            this.__selector = document.createElement('div');
            this.__selector.className = 'selector';
            this.__saturation_field = document.createElement('div');
            this.__saturation_field.className = 'saturation-field';
            this.__field_knob = document.createElement('div');
            this.__field_knob.className = 'field-knob';
            this.__field_knob_border = '2px solid ';
            this.__hue_knob = document.createElement('div');
            this.__hue_knob.className = 'hue-knob';
            this.__hue_field = document.createElement('div');
            this.__hue_field.className = 'hue-field';
            this.__input = document.createElement('input');
            this.__input.type = 'text';
            this.__input_textShadow = '0 1px 1px ';
            dom.bind(this.__input, 'keydown', function (e) {
                if (e.keyCode === 13) {
                    onBlur.call(this);
                }
            });
            dom.bind(this.__input, 'blur', onBlur);
            dom.bind(this.__selector, 'mousedown', function () {
                dom.addClass(this, 'drag').bind(window, 'mouseup', function () {
                    dom.removeClass(_this.__selector, 'drag');
                });
            });
            dom.bind(this.__selector, 'touchstart', function () {
                dom.addClass(this, 'drag').bind(window, 'touchend', function () {
                    dom.removeClass(_this.__selector, 'drag');
                });
            });
            const valueField = document.createElement('div');
            common.extend(this.__selector.style, {
                width: '122px',
                height: '102px',
                padding: '3px',
                backgroundColor: '#222',
                boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
            });
            common.extend(this.__field_knob.style, {
                position: 'absolute',
                width: '12px',
                height: '12px',
                border: this.__field_knob_border + (this.__color.v < 0.5 ? '#fff' : '#000'),
                boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
                borderRadius: '12px',
                zIndex: 1
            });
            common.extend(this.__hue_knob.style, {
                position: 'absolute',
                width: '15px',
                height: '2px',
                borderRight: '4px solid #fff',
                zIndex: 1
            });
            common.extend(this.__saturation_field.style, {
                width: '100px',
                height: '100px',
                border: '1px solid #555',
                marginRight: '3px',
                display: 'inline-block',
                cursor: 'pointer'
            });
            common.extend(valueField.style, {
                width: '100%',
                height: '100%',
                background: 'none'
            });
            linearGradient(valueField, 'top', 'rgba(0,0,0,0)', '#000');
            common.extend(this.__hue_field.style, {
                width: '15px',
                height: '100px',
                border: '1px solid #555',
                cursor: 'ns-resize',
                position: 'absolute',
                top: '3px',
                right: '3px'
            });
            hueGradient(this.__hue_field);
            common.extend(this.__input.style, {
                outline: 'none',
                textAlign: 'center',
                color: '#fff',
                border: 0,
                fontWeight: 'bold',
                textShadow: this.__input_textShadow + 'rgba(0,0,0,0.7)'
            });
            dom.bind(this.__saturation_field, 'mousedown', fieldDown);
            dom.bind(this.__saturation_field, 'touchstart', fieldDown);
            dom.bind(this.__field_knob, 'mousedown', fieldDown);
            dom.bind(this.__field_knob, 'touchstart', fieldDown);
            dom.bind(this.__hue_field, 'mousedown', fieldDownH);
            dom.bind(this.__hue_field, 'touchstart', fieldDownH);
            function fieldDown(e) {
                setSV(e);
                dom.bind(window, 'mousemove', setSV);
                dom.bind(window, 'touchmove', setSV);
                dom.bind(window, 'mouseup', fieldUpSV);
                dom.bind(window, 'touchend', fieldUpSV);
            }
            function fieldDownH(e) {
                setH(e);
                dom.bind(window, 'mousemove', setH);
                dom.bind(window, 'touchmove', setH);
                dom.bind(window, 'mouseup', fieldUpH);
                dom.bind(window, 'touchend', fieldUpH);
            }
            function fieldUpSV() {
                dom.unbind(window, 'mousemove', setSV);
                dom.unbind(window, 'touchmove', setSV);
                dom.unbind(window, 'mouseup', fieldUpSV);
                dom.unbind(window, 'touchend', fieldUpSV);
                onFinish();
            }
            function fieldUpH() {
                dom.unbind(window, 'mousemove', setH);
                dom.unbind(window, 'touchmove', setH);
                dom.unbind(window, 'mouseup', fieldUpH);
                dom.unbind(window, 'touchend', fieldUpH);
                onFinish();
            }
            function onBlur() {
                const i = interpret(this.value);
                if (i !== false) {
                    _this.__color.__state = i;
                    _this.setValue(_this.__color.toOriginal());
                } else {
                    this.value = _this.__color.toString();
                }
            }
            function onFinish() {
                if (_this.__onFinishChange) {
                    _this.__onFinishChange.call(_this, _this.__color.toOriginal());
                }
            }
            this.__saturation_field.appendChild(valueField);
            this.__selector.appendChild(this.__field_knob);
            this.__selector.appendChild(this.__saturation_field);
            this.__selector.appendChild(this.__hue_field);
            this.__hue_field.appendChild(this.__hue_knob);
            this.domElement.appendChild(this.__input);
            this.domElement.appendChild(this.__selector);
            this.updateDisplay();
            function setSV(e) {
                if (e.type.indexOf('touch') === -1) {
                    e.preventDefault();
                }
                const fieldRect = _this.__saturation_field.getBoundingClientRect();
                const {clientX, clientY} = e.touches && e.touches[0] || e;
                let s = (clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
                let v = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
                if (v > 1) {
                    v = 1;
                } else if (v < 0) {
                    v = 0;
                }
                if (s > 1) {
                    s = 1;
                } else if (s < 0) {
                    s = 0;
                }
                _this.__color.v = v;
                _this.__color.s = s;
                _this.setValue(_this.__color.toOriginal());
                return false;
            }
            function setH(e) {
                if (e.type.indexOf('touch') === -1) {
                    e.preventDefault();
                }
                const fieldRect = _this.__hue_field.getBoundingClientRect();
                const {clientY} = e.touches && e.touches[0] || e;
                let h = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
                if (h > 1) {
                    h = 1;
                } else if (h < 0) {
                    h = 0;
                }
                _this.__color.h = h * 360;
                _this.setValue(_this.__color.toOriginal());
                return false;
            }
        }
        updateDisplay() {
            const i = interpret(this.getValue());
            if (i !== false) {
                let mismatch = false;
                common.each(Color.COMPONENTS, function (component) {
                    if (!common.isUndefined(i[component]) && !common.isUndefined(this.__color.__state[component]) && i[component] !== this.__color.__state[component]) {
                        mismatch = true;
                        return {};
                    }
                }, this);
                if (mismatch) {
                    common.extend(this.__color.__state, i);
                }
            }
            common.extend(this.__temp.__state, this.__color.__state);
            this.__temp.a = 1;
            const flip = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0;
            const _flip = 255 - flip;
            common.extend(this.__field_knob.style, {
                marginLeft: 100 * this.__color.s - 7 + 'px',
                marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
                backgroundColor: this.__temp.toHexString(),
                border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
            });
            this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px';
            this.__temp.s = 1;
            this.__temp.v = 1;
            linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toHexString());
            this.__input.value = this.__color.toString();
            common.extend(this.__input.style, {
                backgroundColor: this.__color.toHexString(),
                color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
                textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
            });
        }
    }
    const vendors = [
        '-moz-',
        '-o-',
        '-webkit-',
        '-ms-',
        ''
    ];
    function linearGradient(elem, x, a, b) {
        elem.style.background = '';
        common.each(vendors, function (vendor) {
            elem.style.cssText += 'background: ' + vendor + 'linear-gradient(' + x + ', ' + a + ' 0%, ' + b + ' 100%); ';
        });
    }
    function hueGradient(elem) {
        elem.style.background = '';
        elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
        elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
        elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
        elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
        elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
    }
    return ColorController;
});
define('skylark-datgui/utils/css',[],function () {
    'use strict';
    const css = {
        load: function (url, indoc) {
            const doc = indoc || document;
            const link = doc.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = url;
            doc.getElementsByTagName('head')[0].appendChild(link);
        },
        inject: function (cssContent, indoc) {
            const doc = indoc || document;
            const injected = document.createElement('style');
            injected.type = 'text/css';
            injected.innerHTML = cssContent;
            const head = doc.getElementsByTagName('head')[0];
            try {
                head.appendChild(injected);
            } catch (e) {
            }
        }
    };
    return css;
});
define('skylark-datgui/gui/saveDialogue.html',[],function () {
    'use strict';
    const saveDialogContents = `<div id="dg-save" class="dg dialogue">

  Here's the new load parameter for your <code>GUI</code>'s constructor:

  <textarea id="dg-new-constructor"></textarea>

  <div id="dg-save-locally">

    <input id="dg-local-storage" type="checkbox"/> Automatically save
    values to <code>localStorage</code> on exit.

    <div id="dg-local-explain">The values saved to <code>localStorage</code> will
      override those passed to <code>dat.GUI</code>'s constructor. This makes it
      easier to work incrementally, but <code>localStorage</code> is fragile,
      and your friends may not see the same values you do.

    </div>

  </div>

</div>`;
    return saveDialogContents;
});
define('skylark-datgui/controllers/ControllerFactory',[
    './OptionController',
    './NumberControllerBox',
    './NumberControllerSlider',
    './StringController',
    './FunctionController',
    './BooleanController',
    '../utils/common'
], function (OptionController, NumberControllerBox, NumberControllerSlider, StringController, FunctionController, BooleanController, common) {
    'use strict';
    const ControllerFactory = function (object, property) {
        const initialValue = object[property];
        if (common.isArray(arguments[2]) || common.isObject(arguments[2])) {
            return new OptionController(object, property, arguments[2]);
        }
        if (common.isNumber(initialValue)) {
            if (common.isNumber(arguments[2]) && common.isNumber(arguments[3])) {
                if (common.isNumber(arguments[4])) {
                    return new NumberControllerSlider(object, property, arguments[2], arguments[3], arguments[4]);
                }
                return new NumberControllerSlider(object, property, arguments[2], arguments[3]);
            }
            if (common.isNumber(arguments[4])) {
                return new NumberControllerBox(object, property, {
                    min: arguments[2],
                    max: arguments[3],
                    step: arguments[4]
                });
            }
            return new NumberControllerBox(object, property, {
                min: arguments[2],
                max: arguments[3]
            });
        }
        if (common.isString(initialValue)) {
            return new StringController(object, property);
        }
        if (common.isFunction(initialValue)) {
            return new FunctionController(object, property, '');
        }
        if (common.isBoolean(initialValue)) {
            return new BooleanController(object, property);
        }
        return null;
    };
    return ControllerFactory;
});
define('skylark-datgui/utils/requestAnimationFrame',[],function () {
    'use strict';
    function requestAnimationFrame(callback) {
        setTimeout(callback, 1000 / 60);
    }
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame;
});
define('skylark-datgui/dom/CenteredDiv',[
    '../dom/dom',
    '../utils/common'
], function (dom, common) {
    'use strict';
    class CenteredDiv {
        constructor() {
            this.backgroundElement = document.createElement('div');
            common.extend(this.backgroundElement.style, {
                backgroundColor: 'rgba(0,0,0,0.8)',
                top: 0,
                left: 0,
                display: 'none',
                zIndex: '1000',
                opacity: 0,
                WebkitTransition: 'opacity 0.2s linear',
                transition: 'opacity 0.2s linear'
            });
            dom.makeFullscreen(this.backgroundElement);
            this.backgroundElement.style.position = 'fixed';
            this.domElement = document.createElement('div');
            common.extend(this.domElement.style, {
                position: 'fixed',
                display: 'none',
                zIndex: '1001',
                opacity: 0,
                WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear',
                transition: 'transform 0.2s ease-out, opacity 0.2s linear'
            });
            document.body.appendChild(this.backgroundElement);
            document.body.appendChild(this.domElement);
            const _this = this;
            dom.bind(this.backgroundElement, 'click', function () {
                _this.hide();
            });
        }
        show() {
            const _this = this;
            this.backgroundElement.style.display = 'block';
            this.domElement.style.display = 'block';
            this.domElement.style.opacity = 0;
            this.domElement.style.webkitTransform = 'scale(1.1)';
            this.layout();
            common.defer(function () {
                _this.backgroundElement.style.opacity = 1;
                _this.domElement.style.opacity = 1;
                _this.domElement.style.webkitTransform = 'scale(1)';
            });
        }
        hide() {
            const _this = this;
            const hide = function () {
                _this.domElement.style.display = 'none';
                _this.backgroundElement.style.display = 'none';
                dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
                dom.unbind(_this.domElement, 'transitionend', hide);
                dom.unbind(_this.domElement, 'oTransitionEnd', hide);
            };
            dom.bind(this.domElement, 'webkitTransitionEnd', hide);
            dom.bind(this.domElement, 'transitionend', hide);
            dom.bind(this.domElement, 'oTransitionEnd', hide);
            this.backgroundElement.style.opacity = 0;
            this.domElement.style.opacity = 0;
            this.domElement.style.webkitTransform = 'scale(1.1)';
        }
        layout() {
            this.domElement.style.left = window.innerWidth / 2 - dom.getWidth(this.domElement) / 2 + 'px';
            this.domElement.style.top = window.innerHeight / 2 - dom.getHeight(this.domElement) / 2 + 'px';
        }
    }
    return CenteredDiv;
});
define('skylark-datgui/gui/GUI',[
    '../utils/css',
    './saveDialogue.html',
    '../controllers/ControllerFactory',
    '../controllers/Controller',
    '../controllers/BooleanController',
    '../controllers/FunctionController',
    '../controllers/NumberControllerBox',
    '../controllers/NumberControllerSlider',
    '../controllers/ColorController',
    '../utils/requestAnimationFrame',
    '../dom/CenteredDiv',
    '../dom/dom',
    '../utils/common'
], function (css, saveDialogueContents, ControllerFactory, Controller, BooleanController, FunctionController, NumberControllerBox, NumberControllerSlider, ColorController, requestAnimationFrame, CenteredDiv, dom, common, styleSheet) {
    'use strict';

    //css.inject(styleSheet);

    const CSS_NAMESPACE = 'dg';
    const HIDE_KEY_CODE = 72;
    const CLOSE_BUTTON_HEIGHT = 20;
    const DEFAULT_DEFAULT_PRESET_NAME = 'Default';
    const SUPPORTS_LOCAL_STORAGE = function () {
        try {
            return !!window.localStorage;
        } catch (e) {
            return false;
        }
    }();
    let SAVE_DIALOGUE;
    let autoPlaceVirgin = true;
    let autoPlaceContainer;
    let hide = false;
    const hideableGuis = [];
    const GUI = function (pars) {
        const _this = this;
        let params = pars || {};
        this.domElement = document.createElement('div');
        this.__ul = document.createElement('ul');
        this.domElement.appendChild(this.__ul);
        dom.addClass(this.domElement, CSS_NAMESPACE);
        this.__folders = {};
        this.__controllers = [];
        this.__rememberedObjects = [];
        this.__rememberedObjectIndecesToControllers = [];
        this.__listening = [];
        params = common.defaults(params, {
            closeOnTop: false,
            autoPlace: true,
            width: GUI.DEFAULT_WIDTH
        });
        params = common.defaults(params, {
            resizable: params.autoPlace,
            hideable: params.autoPlace
        });
        if (!common.isUndefined(params.load)) {
            if (params.preset) {
                params.load.preset = params.preset;
            }
        } else {
            params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };
        }
        if (common.isUndefined(params.parent) && params.hideable) {
            hideableGuis.push(this);
        }
        params.resizable = common.isUndefined(params.parent) && params.resizable;
        if (params.autoPlace && common.isUndefined(params.scrollable)) {
            params.scrollable = true;
        }
        let useLocalStorage = SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';
        let saveToLocalStorage;
        let titleRow;
        Object.defineProperties(this, {
            parent: {
                get: function () {
                    return params.parent;
                }
            },
            scrollable: {
                get: function () {
                    return params.scrollable;
                }
            },
            autoPlace: {
                get: function () {
                    return params.autoPlace;
                }
            },
            closeOnTop: {
                get: function () {
                    return params.closeOnTop;
                }
            },
            preset: {
                get: function () {
                    if (_this.parent) {
                        return _this.getRoot().preset;
                    }
                    return params.load.preset;
                },
                set: function (v) {
                    if (_this.parent) {
                        _this.getRoot().preset = v;
                    } else {
                        params.load.preset = v;
                    }
                    setPresetSelectIndex(this);
                    _this.revert();
                }
            },
            width: {
                get: function () {
                    return params.width;
                },
                set: function (v) {
                    params.width = v;
                    setWidth(_this, v);
                }
            },
            name: {
                get: function () {
                    return params.name;
                },
                set: function (v) {
                    params.name = v;
                    if (titleRow) {
                        titleRow.innerHTML = params.name;
                    }
                }
            },
            closed: {
                get: function () {
                    return params.closed;
                },
                set: function (v) {
                    params.closed = v;
                    if (params.closed) {
                        dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
                    } else {
                        dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
                    }
                    this.onResize();
                    if (_this.__closeButton) {
                        _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
                    }
                }
            },
            load: {
                get: function () {
                    return params.load;
                }
            },
            useLocalStorage: {
                get: function () {
                    return useLocalStorage;
                },
                set: function (bool) {
                    if (SUPPORTS_LOCAL_STORAGE) {
                        useLocalStorage = bool;
                        if (bool) {
                            dom.bind(window, 'unload', saveToLocalStorage);
                        } else {
                            dom.unbind(window, 'unload', saveToLocalStorage);
                        }
                        localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
                    }
                }
            }
        });
        if (common.isUndefined(params.parent)) {
            this.closed = params.closed || false;
            dom.addClass(this.domElement, GUI.CLASS_MAIN);
            dom.makeSelectable(this.domElement, false);
            if (SUPPORTS_LOCAL_STORAGE) {
                if (useLocalStorage) {
                    _this.useLocalStorage = true;
                    const savedGui = localStorage.getItem(getLocalStorageHash(this, 'gui'));
                    if (savedGui) {
                        params.load = JSON.parse(savedGui);
                    }
                }
            }
            this.__closeButton = document.createElement('div');
            this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
            dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
            if (params.closeOnTop) {
                dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_TOP);
                this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0]);
            } else {
                dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BOTTOM);
                this.domElement.appendChild(this.__closeButton);
            }
            dom.bind(this.__closeButton, 'click', function () {
                _this.closed = !_this.closed;
            });
        } else {
            if (params.closed === undefined) {
                params.closed = true;
            }
            const titleRowName = document.createTextNode(params.name);
            dom.addClass(titleRowName, 'controller-name');
            titleRow = addRow(_this, titleRowName);
            const onClickTitle = function (e) {
                e.preventDefault();
                _this.closed = !_this.closed;
                return false;
            };
            dom.addClass(this.__ul, GUI.CLASS_CLOSED);
            dom.addClass(titleRow, 'title');
            dom.bind(titleRow, 'click', onClickTitle);
            if (!params.closed) {
                this.closed = false;
            }
        }
        if (params.autoPlace) {
            if (common.isUndefined(params.parent)) {
                if (autoPlaceVirgin) {
                    autoPlaceContainer = document.createElement('div');
                    dom.addClass(autoPlaceContainer, CSS_NAMESPACE);
                    dom.addClass(autoPlaceContainer, GUI.CLASS_AUTO_PLACE_CONTAINER);
                    document.body.appendChild(autoPlaceContainer);
                    autoPlaceVirgin = false;
                }
                autoPlaceContainer.appendChild(this.domElement);
                dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
            }
            if (!this.parent) {
                setWidth(_this, params.width);
            }
        }
        this.__resizeHandler = function () {
            _this.onResizeDebounced();
        };
        dom.bind(window, 'resize', this.__resizeHandler);
        dom.bind(this.__ul, 'webkitTransitionEnd', this.__resizeHandler);
        dom.bind(this.__ul, 'transitionend', this.__resizeHandler);
        dom.bind(this.__ul, 'oTransitionEnd', this.__resizeHandler);
        this.onResize();
        if (params.resizable) {
            addResizeHandle(this);
        }
        saveToLocalStorage = function () {
            if (SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(_this, 'isLocal')) === 'true') {
                localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
            }
        };
        this.saveToLocalStorageIfPossible = saveToLocalStorage;
        function resetWidth() {
            const root = _this.getRoot();
            root.width += 1;
            common.defer(function () {
                root.width -= 1;
            });
        }
        if (!params.parent) {
            resetWidth();
        }
    };
    GUI.toggleHide = function () {
        hide = !hide;
        common.each(hideableGuis, function (gui) {
            gui.domElement.style.display = hide ? 'none' : '';
        });
    };
    GUI.CLASS_AUTO_PLACE = 'a';
    GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
    GUI.CLASS_MAIN = 'main';
    GUI.CLASS_CONTROLLER_ROW = 'cr';
    GUI.CLASS_TOO_TALL = 'taller-than-window';
    GUI.CLASS_CLOSED = 'closed';
    GUI.CLASS_CLOSE_BUTTON = 'close-button';
    GUI.CLASS_CLOSE_TOP = 'close-top';
    GUI.CLASS_CLOSE_BOTTOM = 'close-bottom';
    GUI.CLASS_DRAG = 'drag';
    GUI.DEFAULT_WIDTH = 245;
    GUI.TEXT_CLOSED = 'Close Controls';
    GUI.TEXT_OPEN = 'Open Controls';
    GUI._keydownHandler = function (e) {
        if (document.activeElement.type !== 'text' && (e.which === HIDE_KEY_CODE || e.keyCode === HIDE_KEY_CODE)) {
            GUI.toggleHide();
        }
    };
    dom.bind(window, 'keydown', GUI._keydownHandler, false);
    common.extend(GUI.prototype, {
        add: function (object, property) {
            return add(this, object, property, { factoryArgs: Array.prototype.slice.call(arguments, 2) });
        },
        addColor: function (object, property) {
            return add(this, object, property, { color: true });
        },
        remove: function (controller) {
            this.__ul.removeChild(controller.__li);
            this.__controllers.splice(this.__controllers.indexOf(controller), 1);
            const _this = this;
            common.defer(function () {
                _this.onResize();
            });
        },
        destroy: function () {
            if (this.parent) {
                throw new Error('Only the root GUI should be removed with .destroy(). ' + 'For subfolders, use gui.removeFolder(folder) instead.');
            }
            if (this.autoPlace) {
                autoPlaceContainer.removeChild(this.domElement);
            }
            const _this = this;
            common.each(this.__folders, function (subfolder) {
                _this.removeFolder(subfolder);
            });
            dom.unbind(window, 'keydown', GUI._keydownHandler, false);
            removeListeners(this);
        },
        addFolder: function (name) {
            if (this.__folders[name] !== undefined) {
                throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
            }
            const newGuiParams = {
                name: name,
                parent: this
            };
            newGuiParams.autoPlace = this.autoPlace;
            if (this.load && this.load.folders && this.load.folders[name]) {
                newGuiParams.closed = this.load.folders[name].closed;
                newGuiParams.load = this.load.folders[name];
            }
            const gui = new GUI(newGuiParams);
            this.__folders[name] = gui;
            const li = addRow(this, gui.domElement);
            dom.addClass(li, 'folder');
            return gui;
        },
        removeFolder: function (folder) {
            this.__ul.removeChild(folder.domElement.parentElement);
            delete this.__folders[folder.name];
            if (this.load && this.load.folders && this.load.folders[folder.name]) {
                delete this.load.folders[folder.name];
            }
            removeListeners(folder);
            const _this = this;
            common.each(folder.__folders, function (subfolder) {
                folder.removeFolder(subfolder);
            });
            common.defer(function () {
                _this.onResize();
            });
        },
        open: function () {
            this.closed = false;
        },
        close: function () {
            this.closed = true;
        },
        hide: function () {
            this.domElement.style.display = 'none';
        },
        show: function () {
            this.domElement.style.display = '';
        },
        onResize: function () {
            const root = this.getRoot();
            if (root.scrollable) {
                const top = dom.getOffset(root.__ul).top;
                let h = 0;
                common.each(root.__ul.childNodes, function (node) {
                    if (!(root.autoPlace && node === root.__save_row)) {
                        h += dom.getHeight(node);
                    }
                });
                if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
                    dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
                    root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
                } else {
                    dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
                    root.__ul.style.height = 'auto';
                }
            }
            if (root.__resize_handle) {
                common.defer(function () {
                    root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
                });
            }
            if (root.__closeButton) {
                root.__closeButton.style.width = root.width + 'px';
            }
        },
        onResizeDebounced: common.debounce(function () {
            this.onResize();
        }, 50),
        remember: function () {
            if (common.isUndefined(SAVE_DIALOGUE)) {
                SAVE_DIALOGUE = new CenteredDiv();
                SAVE_DIALOGUE.domElement.innerHTML = saveDialogueContents;
            }
            if (this.parent) {
                throw new Error('You can only call remember on a top level GUI.');
            }
            const _this = this;
            common.each(Array.prototype.slice.call(arguments), function (object) {
                if (_this.__rememberedObjects.length === 0) {
                    addSaveMenu(_this);
                }
                if (_this.__rememberedObjects.indexOf(object) === -1) {
                    _this.__rememberedObjects.push(object);
                }
            });
            if (this.autoPlace) {
                setWidth(this, this.width);
            }
        },
        getRoot: function () {
            let gui = this;
            while (gui.parent) {
                gui = gui.parent;
            }
            return gui;
        },
        getSaveObject: function () {
            const toReturn = this.load;
            toReturn.closed = this.closed;
            if (this.__rememberedObjects.length > 0) {
                toReturn.preset = this.preset;
                if (!toReturn.remembered) {
                    toReturn.remembered = {};
                }
                toReturn.remembered[this.preset] = getCurrentPreset(this);
            }
            toReturn.folders = {};
            common.each(this.__folders, function (element, key) {
                toReturn.folders[key] = element.getSaveObject();
            });
            return toReturn;
        },
        save: function () {
            if (!this.load.remembered) {
                this.load.remembered = {};
            }
            this.load.remembered[this.preset] = getCurrentPreset(this);
            markPresetModified(this, false);
            this.saveToLocalStorageIfPossible();
        },
        saveAs: function (presetName) {
            if (!this.load.remembered) {
                this.load.remembered = {};
                this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
            }
            this.load.remembered[presetName] = getCurrentPreset(this);
            this.preset = presetName;
            addPresetOption(this, presetName, true);
            this.saveToLocalStorageIfPossible();
        },
        revert: function (gui) {
            common.each(this.__controllers, function (controller) {
                if (!this.getRoot().load.remembered) {
                    controller.setValue(controller.initialValue);
                } else {
                    recallSavedValue(gui || this.getRoot(), controller);
                }
                if (controller.__onFinishChange) {
                    controller.__onFinishChange.call(controller, controller.getValue());
                }
            }, this);
            common.each(this.__folders, function (folder) {
                folder.revert(folder);
            });
            if (!gui) {
                markPresetModified(this.getRoot(), false);
            }
        },
        listen: function (controller) {
            const init = this.__listening.length === 0;
            this.__listening.push(controller);
            if (init) {
                updateDisplays(this.__listening);
            }
        },
        updateDisplay: function () {
            common.each(this.__controllers, function (controller) {
                controller.updateDisplay();
            });
            common.each(this.__folders, function (folder) {
                folder.updateDisplay();
            });
        }
    });
    function addRow(gui, newDom, liBefore) {
        const li = document.createElement('li');
        if (newDom) {
            li.appendChild(newDom);
        }
        if (liBefore) {
            gui.__ul.insertBefore(li, liBefore);
        } else {
            gui.__ul.appendChild(li);
        }
        gui.onResize();
        return li;
    }
    function removeListeners(gui) {
        dom.unbind(window, 'resize', gui.__resizeHandler);
        if (gui.saveToLocalStorageIfPossible) {
            dom.unbind(window, 'unload', gui.saveToLocalStorageIfPossible);
        }
    }
    function markPresetModified(gui, modified) {
        const opt = gui.__preset_select[gui.__preset_select.selectedIndex];
        if (modified) {
            opt.innerHTML = opt.value + '*';
        } else {
            opt.innerHTML = opt.value;
        }
    }
    function augmentController(gui, li, controller) {
        controller.__li = li;
        controller.__gui = gui;
        common.extend(controller, {
            options: function (options) {
                if (arguments.length > 1) {
                    const nextSibling = controller.__li.nextElementSibling;
                    controller.remove();
                    return add(gui, controller.object, controller.property, {
                        before: nextSibling,
                        factoryArgs: [common.toArray(arguments)]
                    });
                }
                if (common.isArray(options) || common.isObject(options)) {
                    const nextSibling = controller.__li.nextElementSibling;
                    controller.remove();
                    return add(gui, controller.object, controller.property, {
                        before: nextSibling,
                        factoryArgs: [options]
                    });
                }
            },
            name: function (name) {
                controller.__li.firstElementChild.firstElementChild.innerHTML = name;
                return controller;
            },
            listen: function () {
                controller.__gui.listen(controller);
                return controller;
            },
            remove: function () {
                controller.__gui.remove(controller);
                return controller;
            }
        });
        if (controller instanceof NumberControllerSlider) {
            const box = new NumberControllerBox(controller.object, controller.property, {
                min: controller.__min,
                max: controller.__max,
                step: controller.__step
            });
            common.each([
                'updateDisplay',
                'onChange',
                'onFinishChange',
                'step',
                'min',
                'max'
            ], function (method) {
                const pc = controller[method];
                const pb = box[method];
                controller[method] = box[method] = function () {
                    const args = Array.prototype.slice.call(arguments);
                    pb.apply(box, args);
                    return pc.apply(controller, args);
                };
            });
            dom.addClass(li, 'has-slider');
            controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
        } else if (controller instanceof NumberControllerBox) {
            const r = function (returned) {
                if (common.isNumber(controller.__min) && common.isNumber(controller.__max)) {
                    const oldName = controller.__li.firstElementChild.firstElementChild.innerHTML;
                    const wasListening = controller.__gui.__listening.indexOf(controller) > -1;
                    controller.remove();
                    const newController = add(gui, controller.object, controller.property, {
                        before: controller.__li.nextElementSibling,
                        factoryArgs: [
                            controller.__min,
                            controller.__max,
                            controller.__step
                        ]
                    });
                    newController.name(oldName);
                    if (wasListening)
                        newController.listen();
                    return newController;
                }
                return returned;
            };
            controller.min = common.compose(r, controller.min);
            controller.max = common.compose(r, controller.max);
        } else if (controller instanceof BooleanController) {
            dom.bind(li, 'click', function () {
                dom.fakeEvent(controller.__checkbox, 'click');
            });
            dom.bind(controller.__checkbox, 'click', function (e) {
                e.stopPropagation();
            });
        } else if (controller instanceof FunctionController) {
            dom.bind(li, 'click', function () {
                dom.fakeEvent(controller.__button, 'click');
            });
            dom.bind(li, 'mouseover', function () {
                dom.addClass(controller.__button, 'hover');
            });
            dom.bind(li, 'mouseout', function () {
                dom.removeClass(controller.__button, 'hover');
            });
        } else if (controller instanceof ColorController) {
            dom.addClass(li, 'color');
            controller.updateDisplay = common.compose(function (val) {
                li.style.borderLeftColor = controller.__color.toString();
                return val;
            }, controller.updateDisplay);
            controller.updateDisplay();
        }
        controller.setValue = common.compose(function (val) {
            if (gui.getRoot().__preset_select && controller.isModified()) {
                markPresetModified(gui.getRoot(), true);
            }
            return val;
        }, controller.setValue);
    }
    function recallSavedValue(gui, controller) {
        const root = gui.getRoot();
        const matchedIndex = root.__rememberedObjects.indexOf(controller.object);
        if (matchedIndex !== -1) {
            let controllerMap = root.__rememberedObjectIndecesToControllers[matchedIndex];
            if (controllerMap === undefined) {
                controllerMap = {};
                root.__rememberedObjectIndecesToControllers[matchedIndex] = controllerMap;
            }
            controllerMap[controller.property] = controller;
            if (root.load && root.load.remembered) {
                const presetMap = root.load.remembered;
                let preset;
                if (presetMap[gui.preset]) {
                    preset = presetMap[gui.preset];
                } else if (presetMap[DEFAULT_DEFAULT_PRESET_NAME]) {
                    preset = presetMap[DEFAULT_DEFAULT_PRESET_NAME];
                } else {
                    return;
                }
                if (preset[matchedIndex] && preset[matchedIndex][controller.property] !== undefined) {
                    const value = preset[matchedIndex][controller.property];
                    controller.initialValue = value;
                    controller.setValue(value);
                }
            }
        }
    }
    function add(gui, object, property, params) {
        if (object[property] === undefined) {
            throw new Error(`Object "${ object }" has no property "${ property }"`);
        }
        let controller;
        if (params.color) {
            controller = new ColorController(object, property);
        } else {
            const factoryArgs = [
                object,
                property
            ].concat(params.factoryArgs);
            controller = ControllerFactory.apply(gui, factoryArgs);
        }
        if (params.before instanceof Controller) {
            params.before = params.before.__li;
        }
        recallSavedValue(gui, controller);
        dom.addClass(controller.domElement, 'c');
        const name = document.createElement('span');
        dom.addClass(name, 'property-name');
        name.innerHTML = controller.property;
        const container = document.createElement('div');
        container.appendChild(name);
        container.appendChild(controller.domElement);
        const li = addRow(gui, container, params.before);
        dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);
        if (controller instanceof ColorController) {
            dom.addClass(li, 'color');
        } else {
            dom.addClass(li, typeof controller.getValue());
        }
        augmentController(gui, li, controller);
        gui.__controllers.push(controller);
        return controller;
    }
    function getLocalStorageHash(gui, key) {
        return document.location.href + '.' + key;
    }
    function addPresetOption(gui, name, setSelected) {
        const opt = document.createElement('option');
        opt.innerHTML = name;
        opt.value = name;
        gui.__preset_select.appendChild(opt);
        if (setSelected) {
            gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
        }
    }
    function showHideExplain(gui, explain) {
        explain.style.display = gui.useLocalStorage ? 'block' : 'none';
    }
    function addSaveMenu(gui) {
        const div = gui.__save_row = document.createElement('li');
        dom.addClass(gui.domElement, 'has-save');
        gui.__ul.insertBefore(div, gui.__ul.firstChild);
        dom.addClass(div, 'save-row');
        const gears = document.createElement('span');
        gears.innerHTML = '&nbsp;';
        dom.addClass(gears, 'button gears');
        const button = document.createElement('span');
        button.innerHTML = 'Save';
        dom.addClass(button, 'button');
        dom.addClass(button, 'save');
        const button2 = document.createElement('span');
        button2.innerHTML = 'New';
        dom.addClass(button2, 'button');
        dom.addClass(button2, 'save-as');
        const button3 = document.createElement('span');
        button3.innerHTML = 'Revert';
        dom.addClass(button3, 'button');
        dom.addClass(button3, 'revert');
        const select = gui.__preset_select = document.createElement('select');
        if (gui.load && gui.load.remembered) {
            common.each(gui.load.remembered, function (value, key) {
                addPresetOption(gui, key, key === gui.preset);
            });
        } else {
            addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
        }
        dom.bind(select, 'change', function () {
            for (let index = 0; index < gui.__preset_select.length; index++) {
                gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
            }
            gui.preset = this.value;
        });
        div.appendChild(select);
        div.appendChild(gears);
        div.appendChild(button);
        div.appendChild(button2);
        div.appendChild(button3);
        if (SUPPORTS_LOCAL_STORAGE) {
            const explain = document.getElementById('dg-local-explain');
            const localStorageCheckBox = document.getElementById('dg-local-storage');
            const saveLocally = document.getElementById('dg-save-locally');
            saveLocally.style.display = 'block';
            if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
                localStorageCheckBox.setAttribute('checked', 'checked');
            }
            showHideExplain(gui, explain);
            dom.bind(localStorageCheckBox, 'change', function () {
                gui.useLocalStorage = !gui.useLocalStorage;
                showHideExplain(gui, explain);
            });
        }
        const newConstructorTextArea = document.getElementById('dg-new-constructor');
        dom.bind(newConstructorTextArea, 'keydown', function (e) {
            if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
                SAVE_DIALOGUE.hide();
            }
        });
        dom.bind(gears, 'click', function () {
            newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
            SAVE_DIALOGUE.show();
            newConstructorTextArea.focus();
            newConstructorTextArea.select();
        });
        dom.bind(button, 'click', function () {
            gui.save();
        });
        dom.bind(button2, 'click', function () {
            const presetName = prompt('Enter a new preset name.');
            if (presetName) {
                gui.saveAs(presetName);
            }
        });
        dom.bind(button3, 'click', function () {
            gui.revert();
        });
    }
    function addResizeHandle(gui) {
        let pmouseX;
        gui.__resize_handle = document.createElement('div');
        common.extend(gui.__resize_handle.style, {
            width: '6px',
            marginLeft: '-3px',
            height: '200px',
            cursor: 'ew-resize',
            position: 'absolute'
        });
        function drag(e) {
            e.preventDefault();
            gui.width += pmouseX - e.clientX;
            gui.onResize();
            pmouseX = e.clientX;
            return false;
        }
        function dragStop() {
            dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
            dom.unbind(window, 'mousemove', drag);
            dom.unbind(window, 'mouseup', dragStop);
        }
        function dragStart(e) {
            e.preventDefault();
            pmouseX = e.clientX;
            dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
            dom.bind(window, 'mousemove', drag);
            dom.bind(window, 'mouseup', dragStop);
            return false;
        }
        dom.bind(gui.__resize_handle, 'mousedown', dragStart);
        dom.bind(gui.__closeButton, 'mousedown', dragStart);
        gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);
    }
    function setWidth(gui, w) {
        gui.domElement.style.width = w + 'px';
        if (gui.__save_row && gui.autoPlace) {
            gui.__save_row.style.width = w + 'px';
        }
        if (gui.__closeButton) {
            gui.__closeButton.style.width = w + 'px';
        }
    }
    function getCurrentPreset(gui, useInitialValues) {
        const toReturn = {};
        common.each(gui.__rememberedObjects, function (val, index) {
            const savedValues = {};
            const controllerMap = gui.__rememberedObjectIndecesToControllers[index];
            common.each(controllerMap, function (controller, property) {
                savedValues[property] = useInitialValues ? controller.initialValue : controller.getValue();
            });
            toReturn[index] = savedValues;
        });
        return toReturn;
    }
    function setPresetSelectIndex(gui) {
        for (let index = 0; index < gui.__preset_select.length; index++) {
            if (gui.__preset_select[index].value === gui.preset) {
                gui.__preset_select.selectedIndex = index;
            }
        }
    }
    function updateDisplays(controllerArray) {
        if (controllerArray.length !== 0) {
            requestAnimationFrame.call(window, function () {
                updateDisplays(controllerArray);
            });
        }
        common.each(controllerArray, function (c) {
            c.updateDisplay();
        });
    }
    return GUI;
});
define('skylark-datgui/main',[
    "skylark-langx-ns",
    './color/Color',
    './color/math',
    './color/interpret',
    './controllers/Controller',
    './controllers/BooleanController',
    './controllers/OptionController',
    './controllers/StringController',
    './controllers/NumberController',
    './controllers/NumberControllerBox',
    './controllers/NumberControllerSlider',
    './controllers/FunctionController',
    './controllers/ColorController',
    './dom/dom',
    './gui/GUI'
], function (skylark,Color, math, interpret, Controller, BooleanController, OptionController, StringController, NumberController, NumberControllerBox, NumberControllerSlider, FunctionController, ColorController, domImport, GUIImport) {
    'use strict';
    const color = {
        Color: Color,
        math: math,
        interpret: interpret
    };
    const controllers = {
        Controller: Controller,
        BooleanController: BooleanController,
        OptionController: OptionController,
        StringController: StringController,
        NumberController: NumberController,
        NumberControllerBox: NumberControllerBox,
        NumberControllerSlider: NumberControllerSlider,
        FunctionController: FunctionController,
        ColorController: ColorController
    };
    const dom = { dom: domImport };
    const gui = { GUI: GUIImport };
    const GUI = GUIImport;
    return skylark.attach("intg.datgui",{
        color,
        controllers,
        dom,
        gui,
        GUI
    });
});
define('skylark-datgui', ['skylark-datgui/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-datgui.js.map
