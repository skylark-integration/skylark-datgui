/**
 * skylark-datgui - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-datgui/
 * @license MIT
 */
define(["./Controller","../utils/common"],function(t,i){"use strict";function s(t){const i=t.toString();return i.indexOf(".")>-1?i.length-i.indexOf(".")-1:0}return class extends t{constructor(t,_,e){super(t,_);const h=e||{};this.__min=h.min,this.__max=h.max,this.__step=h.step,i.isUndefined(this.__step)?0===this.initialValue?this.__impliedStep=1:this.__impliedStep=Math.pow(10,Math.floor(Math.log(Math.abs(this.initialValue))/Math.LN10))/10:this.__impliedStep=this.__step,this.__precision=s(this.__impliedStep)}setValue(t){let i=t;return void 0!==this.__min&&i<this.__min?i=this.__min:void 0!==this.__max&&i>this.__max&&(i=this.__max),void 0!==this.__step&&i%this.__step!=0&&(i=Math.round(i/this.__step)*this.__step),super.setValue(i)}min(t){return this.__min=t,this}max(t){return this.__max=t,this}step(t){return this.__step=t,this.__impliedStep=t,this.__precision=s(t),this}}});
//# sourceMappingURL=../sourcemaps/controllers/NumberController.js.map
