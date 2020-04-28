define([
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