/**
 * skylark-datgui - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-datgui/
 * @license MIT
 */
define(function(){"use strict";return class{constructor(t,i){this.initialValue=t[i],this.domElement=document.createElement("div"),this.object=t,this.property=i,this.__onChange=void 0,this.__onFinishChange=void 0}onChange(t){return this.__onChange=t,this}onFinishChange(t){return this.__onFinishChange=t,this}setValue(t){return this.object[this.property]=t,this.__onChange&&this.__onChange.call(this,t),this.updateDisplay(),this}getValue(){return this.object[this.property]}updateDisplay(){return this}isModified(){return this.initialValue!==this.getValue()}}});
//# sourceMappingURL=../sourcemaps/controllers/Controller.js.map
