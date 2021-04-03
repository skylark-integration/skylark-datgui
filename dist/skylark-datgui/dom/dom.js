/**
 * skylark-datgui - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-datgui/
 * @license MIT
 */
define(["skylark-domx-noder","skylark-domx-styler","skylark-domx-geom","skylark-domx-eventer","../utils/common"],function(e,t,n,s,o){"use strict";const a={};o.each({HTMLEvents:["change"],MouseEvents:["click","mousemove","mousedown","mouseup","mouseover"],KeyboardEvents:["keydown"]},function(e,t){o.each(e,function(e){a[e]=t})});return{makeSelectable:e.selectable,makeFullscreen:n.fullCover,fakeEvent:function(e,t,n,s){const l=n||{},c=a[t];if(!c)throw new Error("Event type "+t+" not supported.");const i=document.createEvent(c);switch(c){case"MouseEvents":{const e=l.x||l.clientX||0,n=l.y||l.clientY||0;i.initMouseEvent(t,l.bubbles||!1,l.cancelable||!0,window,l.clickCount||1,0,0,e,n,!1,!1,!1,!1,0,null);break}case"KeyboardEvents":{const e=i.initKeyboardEvent||i.initKeyEvent;o.defaults(l,{cancelable:!0,ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1,keyCode:void 0,charCode:void 0}),e(t,l.bubbles||!1,l.cancelable,window,l.ctrlKey,l.altKey,l.shiftKey,l.metaKey,l.keyCode,l.charCode);break}default:i.initEvent(t,l.bubbles||!1,l.cancelable||!0)}o.defaults(i,s),e.dispatchEvent(i)},bind:s.on,unbind:s.off,addClass:t.addClass,removeClass:t.removeClass,hasClass:t.hasClass,getWidth:n.width,getHeight:n.height,getOffset:n.pagePosition,isActive:e.isActive}});
//# sourceMappingURL=../sourcemaps/dom/dom.js.map
