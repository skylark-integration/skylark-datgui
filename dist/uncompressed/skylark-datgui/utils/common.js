define([
    "skylark-langx-types",
    "skylark-langx-arrays",
    "skylark-langx-objects",
    "skylark-langx-funcs"
],function (types,arrays,objects,funcs) {
    'use strict';
    const ARR_EACH = Array.prototype.forEach;
    const ARR_SLICE = Array.prototype.slice;
    const Common = {
        BREAK: {},

        extend: objects.extend,

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

        defer: funcs.defer,

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

        toArray: arrays.toArray || arrays.makeArray,

        isUndefined: types.isUndefined,
        isNull: types.isNull,
        isNaN: types.isNaN,
        isArray: types.isArray,

        isObject: types.isPlainObject,
        isNumber: types.isNumber,
        isString: types.isString,
        isBoolean: types.isBoolean,
        isFunction: types.isFunction
    };

    return Common;
});