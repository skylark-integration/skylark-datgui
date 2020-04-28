/**
 * skylark-datgui - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-datgui/
 * @license MIT
 */
define(["skylark-langx-ns","./color/Color","./color/math","./color/interpret","./controllers/Controller","./controllers/BooleanController","./controllers/OptionController","./controllers/StringController","./controllers/NumberController","./controllers/NumberControllerBox","./controllers/NumberControllerSlider","./controllers/FunctionController","./controllers/ColorController","./dom/dom","./gui/GUI"],function(o,r,l,t,n,e,C,c,i,s,u,m,a,d,g){"use strict";const b={Color:r,math:l,interpret:t},N={Controller:n,BooleanController:e,OptionController:C,StringController:c,NumberController:i,NumberControllerBox:s,NumberControllerSlider:u,FunctionController:m,ColorController:a},p={dom:d},B={GUI:g},S=g;return o.attach("intg.datgui",{color:b,controllers:N,dom:p,gui:B,GUI:S})});
//# sourceMappingURL=sourcemaps/main.js.map
