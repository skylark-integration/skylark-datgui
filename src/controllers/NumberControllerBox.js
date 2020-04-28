define([
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