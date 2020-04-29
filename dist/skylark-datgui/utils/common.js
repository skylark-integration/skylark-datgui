/**
 * skylark-datgui - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-datgui/
 * @license MIT
 */
define(["skylark-langx-types","skylark-langx-arrays","skylark-langx-objects","skylark-langx-funcs"],function(n,t,e,i){"use strict";const r=Array.prototype.forEach,s=Array.prototype.slice;return{BREAK:{},extend:e.extend,defaults:function(n){return this.each(s.call(arguments,1),function(t){(this.isObject(t)?Object.keys(t):[]).forEach(function(e){this.isUndefined(n[e])&&(n[e]=t[e])}.bind(this))},this),n},compose:function(){const n=s.call(arguments);return function(){let t=s.call(arguments);for(let e=n.length-1;e>=0;e--)t=[n[e].apply(this,t)];return t[0]}},each:function(n,t,e){if(n)if(r&&n.forEach&&n.forEach===r)n.forEach(t,e);else if(n.length===n.length+0){let i,r;for(i=0,r=n.length;i<r;i++)if(i in n&&t.call(e,n[i],i)===this.BREAK)return}else for(const i in n)if(t.call(e,n[i],i)===this.BREAK)return},defer:i.defer,debounce:function(n,t,e){let i;return function(){const r=this,s=arguments;const l=e||!i;clearTimeout(i),i=setTimeout(function(){i=null,e||n.apply(r,s)},t),l&&n.apply(r,s)}},toArray:t.toArray||t.makeArray,isUndefined:n.isUndefined,isNull:n.isNull,isNaN:n.isNaN,isArray:n.isArray,isObject:n.isPlainObject,isNumber:n.isNumber,isString:n.isString,isBoolean:n.isBoolean,isFunction:n.isFunction}});
//# sourceMappingURL=../sourcemaps/utils/common.js.map
