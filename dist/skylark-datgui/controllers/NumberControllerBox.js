/**
 * skylark-datgui - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-datgui/
 * @license MIT
 */
define(["./NumberController","../dom/dom","../utils/common"],function(t,n,i){"use strict";return class extends t{constructor(t,e,u){super(t,e,u),this.__truncationSuspended=!1;const s=this;let o;function d(){s.__onFinishChange&&s.__onFinishChange.call(s,s.getValue())}function _(t){const n=o-t.clientY;s.setValue(s.getValue()+n*s.__impliedStep),o=t.clientY}function p(){n.unbind(window,"mousemove",_),n.unbind(window,"mouseup",p),d()}this.__input=document.createElement("input"),this.__input.setAttribute("type","text"),n.bind(this.__input,"change",function(){const t=parseFloat(s.__input.value);i.isNaN(t)||s.setValue(t)}),n.bind(this.__input,"blur",function(){d()}),n.bind(this.__input,"mousedown",function(t){n.bind(window,"mousemove",_),n.bind(window,"mouseup",p),o=t.clientY}),n.bind(this.__input,"keydown",function(t){13===t.keyCode&&(s.__truncationSuspended=!0,this.blur(),s.__truncationSuspended=!1,d())}),this.updateDisplay(),this.domElement.appendChild(this.__input)}updateDisplay(){return this.__input.value=this.__truncationSuspended?this.getValue():function(t,n){const i=Math.pow(10,n);return Math.round(t*i)/i}(this.getValue(),this.__precision),super.updateDisplay()}}});
//# sourceMappingURL=../sourcemaps/controllers/NumberControllerBox.js.map
