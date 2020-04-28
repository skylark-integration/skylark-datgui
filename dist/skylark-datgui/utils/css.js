/**
 * skylark-datgui - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-datgui/
 * @license MIT
 */
define(function(){"use strict";return{load:function(e,t){const n=t||document,c=n.createElement("link");c.type="text/css",c.rel="stylesheet",c.href=e,n.getElementsByTagName("head")[0].appendChild(c)},inject:function(e,t){const n=t||document,c=document.createElement("style");c.type="text/css",c.innerHTML=e;const s=n.getElementsByTagName("head")[0];try{s.appendChild(c)}catch(e){}}}});
//# sourceMappingURL=../sourcemaps/utils/css.js.map
