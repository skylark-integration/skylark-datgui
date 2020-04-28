/**
 * skylark-datgui - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-datgui/
 * @license MIT
 */
define(["./Controller","../dom/dom"],function(e,t){"use strict";return class extends e{constructor(e,s){super(e,s);const h=this;this.__prev=this.getValue(),this.__checkbox=document.createElement("input"),this.__checkbox.setAttribute("type","checkbox"),t.bind(this.__checkbox,"change",function(){h.setValue(!h.__prev)},!1),this.domElement.appendChild(this.__checkbox),this.updateDisplay()}setValue(e){const t=super.setValue(e);return this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue()),this.__prev=this.getValue(),t}updateDisplay(){return!0===this.getValue()?(this.__checkbox.setAttribute("checked","checked"),this.__checkbox.checked=!0,this.__prev=!0):(this.__checkbox.checked=!1,this.__prev=!1),super.updateDisplay()}}});
//# sourceMappingURL=../sourcemaps/controllers/BooleanController.js.map
