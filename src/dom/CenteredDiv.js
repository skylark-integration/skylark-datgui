define([
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