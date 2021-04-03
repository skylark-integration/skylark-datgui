/**
 * skylark-datgui - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-datgui/
 * @license MIT
 */
define(["./Controller","../dom/dom","../utils/common"],function(e,t,s){"use strict";return class extends e{constructor(e,i,n){super(e,i);let c=n;const l=this;if(this.__select=document.createElement("select"),s.isArray(c)){const e={};s.each(c,function(t){e[t]=t}),c=e}s.each(c,function(e,t){const s=document.createElement("option");s.innerHTML=t,s.setAttribute("value",e),l.__select.appendChild(s)}),this.updateDisplay(),t.bind(this.__select,"change",function(){const e=this.options[this.selectedIndex].value;l.setValue(e)}),this.domElement.appendChild(this.__select)}setValue(e){const t=super.setValue(e);return this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue()),t}updateDisplay(){return t.isActive(this.__select)?this:(this.__select.value=this.getValue(),super.updateDisplay())}}});
//# sourceMappingURL=../sourcemaps/controllers/OptionController.js.map
