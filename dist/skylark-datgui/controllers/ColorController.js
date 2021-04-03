/**
 * skylark-datgui - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-datgui/
 * @license MIT
 */
define(["./Controller","../dom/dom"],function(t,i){"use strict";return class extends t{constructor(t,n){super(t,n);const e=this;function u(){e.setValue(e.__input.value)}this.__input=document.createElement("input"),this.__input.setAttribute("type","color"),i.bind(this.__input,"keyup",u),i.bind(this.__input,"change",u),i.bind(this.__input,"blur",function(){e.__onFinishChange&&e.__onFinishChange.call(e,e.getValue())}),i.bind(this.__input,"keydown",function(t){13===t.keyCode&&this.blur()}),this.updateDisplay(),this.domElement.appendChild(this.__input)}updateDisplay(){return i.isActive(this.__input)||(this.__input.value=this.getValue()),super.updateDisplay()}}});
//# sourceMappingURL=../sourcemaps/controllers/ColorController.js.map
