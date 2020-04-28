/**
 * skylark-datgui - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-datgui/
 * @license MIT
 */
define(["./Controller","../dom/dom"],function(t,n){"use strict";return class extends t{constructor(t,e,i){super(t,e);const s=this;this.__button=document.createElement("div"),this.__button.innerHTML=void 0===i?"Fire":i,n.bind(this.__button,"click",function(t){return t.preventDefault(),s.fire(),!1}),n.addClass(this.__button,"button"),this.domElement.appendChild(this.__button)}fire(){this.__onChange&&this.__onChange.call(this),this.getValue().call(this.object),this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue())}}});
//# sourceMappingURL=../sourcemaps/controllers/FunctionController.js.map
