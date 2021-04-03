define(function () {
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