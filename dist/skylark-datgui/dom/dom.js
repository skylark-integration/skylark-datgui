/**
 * skylark-datgui - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-datgui/
 * @license MIT
 */
define(["../utils/common"],function(e){"use strict";const t={};e.each({HTMLEvents:["change"],MouseEvents:["click","mousemove","mousedown","mouseup","mouseover"],KeyboardEvents:["keydown"]},function(n,s){e.each(n,function(e){t[e]=s})});const n=/(\d+(\.\d+)?)px/;function s(t){if("0"===t||e.isUndefined(t))return 0;const s=t.match(n);return e.isNull(s)?0:parseFloat(s[1])}const o={makeSelectable:function(e,t){void 0!==e&&void 0!==e.style&&(e.onselectstart=t?function(){return!1}:function(){},e.style.MozUserSelect=t?"auto":"none",e.style.KhtmlUserSelect=t?"auto":"none",e.unselectable=t?"on":"off")},makeFullscreen:function(t,n,s){let o=s,i=n;e.isUndefined(i)&&(i=!0),e.isUndefined(o)&&(o=!0),t.style.position="absolute",i&&(t.style.left=0,t.style.right=0),o&&(t.style.top=0,t.style.bottom=0)},fakeEvent:function(n,s,o,i){const c=o||{},a=t[s];if(!a)throw new Error("Event type "+s+" not supported.");const l=document.createEvent(a);switch(a){case"MouseEvents":{const e=c.x||c.clientX||0,t=c.y||c.clientY||0;l.initMouseEvent(s,c.bubbles||!1,c.cancelable||!0,window,c.clickCount||1,0,0,e,t,!1,!1,!1,!1,0,null);break}case"KeyboardEvents":{const t=l.initKeyboardEvent||l.initKeyEvent;e.defaults(c,{cancelable:!0,ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1,keyCode:void 0,charCode:void 0}),t(s,c.bubbles||!1,c.cancelable,window,c.ctrlKey,c.altKey,c.shiftKey,c.metaKey,c.keyCode,c.charCode);break}default:l.initEvent(s,c.bubbles||!1,c.cancelable||!0)}e.defaults(l,i),n.dispatchEvent(l)},bind:function(e,t,n,s){const i=s||!1;return e.addEventListener?e.addEventListener(t,n,i):e.attachEvent&&e.attachEvent("on"+t,n),o},unbind:function(e,t,n,s){const i=s||!1;return e.removeEventListener?e.removeEventListener(t,n,i):e.detachEvent&&e.detachEvent("on"+t,n),o},addClass:function(e,t){if(void 0===e.className)e.className=t;else if(e.className!==t){const n=e.className.split(/ +/);-1===n.indexOf(t)&&(n.push(t),e.className=n.join(" ").replace(/^\s+/,"").replace(/\s+$/,""))}return o},removeClass:function(e,t){if(t)if(e.className===t)e.removeAttribute("class");else{const n=e.className.split(/ +/),s=n.indexOf(t);-1!==s&&(n.splice(s,1),e.className=n.join(" "))}else e.className=void 0;return o},hasClass:function(e,t){return new RegExp("(?:^|\\s+)"+t+"(?:\\s+|$)").test(e.className)||!1},getWidth:function(e){const t=getComputedStyle(e);return s(t["border-left-width"])+s(t["border-right-width"])+s(t["padding-left"])+s(t["padding-right"])+s(t.width)},getHeight:function(e){const t=getComputedStyle(e);return s(t["border-top-width"])+s(t["border-bottom-width"])+s(t["padding-top"])+s(t["padding-bottom"])+s(t.height)},getOffset:function(e){let t=e;const n={left:0,top:0};if(t.offsetParent)do{n.left+=t.offsetLeft,n.top+=t.offsetTop,t=t.offsetParent}while(t);return n},isActive:function(e){return e===document.activeElement&&(e.type||e.href)}};return o});
//# sourceMappingURL=../sourcemaps/dom/dom.js.map
