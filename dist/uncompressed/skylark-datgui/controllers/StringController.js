define([
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