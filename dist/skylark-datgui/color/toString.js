/**
 * skylark-datgui - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-datgui/
 * @license MIT
 */
define(function(){"use strict";return function(t,n){const r=t.__state.conversionName.toString(),o=Math.round(t.r),e=Math.round(t.g),_=Math.round(t.b),R=t.a,a=Math.round(t.h),i=t.s.toFixed(1),u=t.v.toFixed(1);if(n||"THREE_CHAR_HEX"===r||"SIX_CHAR_HEX"===r){let n=t.hex.toString(16);for(;n.length<6;)n="0"+n;return"#"+n}return"CSS_RGB"===r?"rgb("+o+","+e+","+_+")":"CSS_RGBA"===r?"rgba("+o+","+e+","+_+","+R+")":"HEX"===r?"0x"+t.hex.toString(16):"RGB_ARRAY"===r?"["+o+","+e+","+_+"]":"RGBA_ARRAY"===r?"["+o+","+e+","+_+","+R+"]":"RGB_OBJ"===r?"{r:"+o+",g:"+e+",b:"+_+"}":"RGBA_OBJ"===r?"{r:"+o+",g:"+e+",b:"+_+",a:"+R+"}":"HSV_OBJ"===r?"{h:"+a+",s:"+i+",v:"+u+"}":"HSVA_OBJ"===r?"{h:"+a+",s:"+i+",v:"+u+",a:"+R+"}":"unknown format"}});
//# sourceMappingURL=../sourcemaps/color/toString.js.map
