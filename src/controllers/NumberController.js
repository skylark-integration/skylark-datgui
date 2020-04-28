define([
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