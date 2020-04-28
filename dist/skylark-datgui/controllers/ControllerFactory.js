/**
 * skylark-datgui - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-datgui/
 * @license MIT
 */
define(["./OptionController","./NumberControllerBox","./NumberControllerSlider","./StringController","./FunctionController","./BooleanController","../utils/common"],function(n,e,r,o,i,t,l){"use strict";return function(u,s){const m=u[s];return l.isArray(arguments[2])||l.isObject(arguments[2])?new n(u,s,arguments[2]):l.isNumber(m)?l.isNumber(arguments[2])&&l.isNumber(arguments[3])?l.isNumber(arguments[4])?new r(u,s,arguments[2],arguments[3],arguments[4]):new r(u,s,arguments[2],arguments[3]):l.isNumber(arguments[4])?new e(u,s,{min:arguments[2],max:arguments[3],step:arguments[4]}):new e(u,s,{min:arguments[2],max:arguments[3]}):l.isString(m)?new o(u,s):l.isFunction(m)?new i(u,s,""):l.isBoolean(m)?new t(u,s):null}});
//# sourceMappingURL=../sourcemaps/controllers/ControllerFactory.js.map
