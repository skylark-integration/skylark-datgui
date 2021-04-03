/**
 * skylark-datgui - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-datgui/
 * @license MIT
 */
define(["./NumberController","../dom/dom"],function(n,t){"use strict";function e(n,t,e,i,o){return i+(n-t)/(e-t)*(o-i)}return class extends n{constructor(n,i,o,u,d){super(n,i,{min:o,max:u,step:d});const s=this;function _(n){n.preventDefault();const t=s.__background.getBoundingClientRect();return s.setValue(e(n.clientX,t.left,t.right,s.__min,s.__max)),!1}function c(){t.unbind(window,"mousemove",_),t.unbind(window,"mouseup",c),s.__onFinishChange&&s.__onFinishChange.call(s,s.getValue())}function a(n){const t=n.touches[0].clientX,i=s.__background.getBoundingClientRect();s.setValue(e(t,i.left,i.right,s.__min,s.__max))}function r(){t.unbind(window,"touchmove",a),t.unbind(window,"touchend",r),s.__onFinishChange&&s.__onFinishChange.call(s,s.getValue())}this.__background=document.createElement("div"),this.__foreground=document.createElement("div"),t.bind(this.__background,"mousedown",function(n){document.activeElement.blur(),t.bind(window,"mousemove",_),t.bind(window,"mouseup",c),_(n)}),t.bind(this.__background,"touchstart",function(n){1===n.touches.length&&(t.bind(window,"touchmove",a),t.bind(window,"touchend",r),a(n))}),t.addClass(this.__background,"slider"),t.addClass(this.__foreground,"slider-fg"),this.updateDisplay(),this.__background.appendChild(this.__foreground),this.domElement.appendChild(this.__background)}updateDisplay(){const n=(this.getValue()-this.__min)/(this.__max-this.__min);return this.__foreground.style.width=100*n+"%",super.updateDisplay()}}});
//# sourceMappingURL=../sourcemaps/controllers/NumberControllerSlider.js.map
