define([
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