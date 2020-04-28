define([
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