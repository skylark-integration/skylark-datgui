define([
    "skylark-domx-noder",
    "skylark-domx-styler",
    "skylark-domx-geom",
    "skylark-domx-eventer",
    '../utils/common'
], function (noder,styler,geom,eventer,common) {
    'use strict';
    const EVENT_MAP = {
        HTMLEvents: ['change'],
        MouseEvents: [
            'click',
            'mousemove',
            'mousedown',
            'mouseup',
            'mouseover'
        ],
        KeyboardEvents: ['keydown']
    };
    const EVENT_MAP_INV = {};
    common.each(EVENT_MAP, function (v, k) {
        common.each(v, function (e) {
            EVENT_MAP_INV[e] = k;
        });
    });
    const CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;
    function cssValueToPixels(val) {
        if (val === '0' || common.isUndefined(val)) {
            return 0;
        }
        const match = val.match(CSS_VALUE_PIXELS);
        if (!common.isNull(match)) {
            return parseFloat(match[1]);
        }
        return 0;
    }
    const dom = {
        makeSelectable: noder.selectable,

        makeFullscreen: geom.fullCover,

        fakeEvent: function (elem, eventType, pars, aux) {
            const params = pars || {};
            const className = EVENT_MAP_INV[eventType];
            if (!className) {
                throw new Error('Event type ' + eventType + ' not supported.');
            }
            const evt = document.createEvent(className);
            switch (className) {
            case 'MouseEvents': {
                    const clientX = params.x || params.clientX || 0;
                    const clientY = params.y || params.clientY || 0;
                    evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0, 0, clientX, clientY, false, false, false, false, 0, null);
                    break;
                }
            case 'KeyboardEvents': {
                    const init = evt.initKeyboardEvent || evt.initKeyEvent;
                    common.defaults(params, {
                        cancelable: true,
                        ctrlKey: false,
                        altKey: false,
                        shiftKey: false,
                        metaKey: false,
                        keyCode: undefined,
                        charCode: undefined
                    });
                    init(eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode);
                    break;
                }
            default: {
                    evt.initEvent(eventType, params.bubbles || false, params.cancelable || true);
                    break;
                }
            }
            common.defaults(evt, aux);
            elem.dispatchEvent(evt);
        },

        bind: eventer.on,
        unbind: eventer.off,

        addClass: styler.addClass,

        removeClass: styler.removeClass,

        hasClass: styler.hasClass,

        getWidth: geom.width,

        getHeight: geom.height,

        getOffset: geom.pagePosition,

        isActive: noder.isActive
    };
    return dom;
});