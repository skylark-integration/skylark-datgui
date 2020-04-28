define([
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