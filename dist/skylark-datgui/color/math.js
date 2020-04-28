/**
 * skylark-datgui - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-datgui/
 * @license MIT
 */
define(function(){"use strict";let t;return{hsv_to_rgb:function(t,n,o){const e=Math.floor(t/60)%6,h=t/60-Math.floor(t/60),r=o*(1-n),i=o*(1-h*n),_=o*(1-(1-h)*n),c=[[o,_,r],[i,o,r],[r,o,_],[r,i,o],[_,r,o],[o,r,i]][e];return{r:255*c[0],g:255*c[1],b:255*c[2]}},rgb_to_hsv:function(t,n,o){const e=Math.min(t,n,o),h=Math.max(t,n,o),r=h-e;let i,_;return 0===h?{h:NaN,s:0,v:0}:(i=t===h?(n-o)/r:n===h?2+(o-t)/r:4+(t-n)/r,(i/=6)<0&&(i+=1),{h:360*i,s:_=r/h,v:h/255})},rgb_to_hex:function(t,n,o){let e=this.hex_with_component(0,2,t);return e=this.hex_with_component(e,1,n),e=this.hex_with_component(e,0,o)},component_from_hex:function(t,n){return t>>8*n&255},hex_with_component:function(n,o,e){return e<<(t=8*o)|n&~(255<<t)}}});
//# sourceMappingURL=../sourcemaps/color/math.js.map
