/**
 * skylark-datgui - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-datgui/
 * @license MIT
 */
define(["skylark-langx-ns","./controllers/Controller","./controllers/BooleanController","./controllers/OptionController","./controllers/StringController","./controllers/NumberController","./controllers/NumberControllerBox","./controllers/NumberControllerSlider","./controllers/FunctionController","./controllers/ColorController","./dom/dom","./gui/GUI"],function(o,r,l,n,t,e,C,c,i,s,u,m){"use strict";const d={Controller:r,BooleanController:l,OptionController:n,StringController:t,NumberController:e,NumberControllerBox:C,NumberControllerSlider:c,FunctionController:i,ColorController:s},a={dom:u},g={GUI:m},b=m;return o.attach("intg.datgui",{controllers:d,dom:a,gui:g,GUI:b})});
//# sourceMappingURL=sourcemaps/main.js.map
