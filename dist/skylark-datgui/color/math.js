/**
 * skylark-datgui - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-datgui/
 * @license MIT
 */
define(["skylark-data-color"],function(o){"use strict";let t;return{hsv_to_rgb:o.hsvToRgb,rgb_to_hsv:o.rgbToHsv,rgb_to_hex:o.rgbToHex,component_from_hex:function(o,t){return o>>8*t&255},hex_with_component:function(o,r,n){return n<<(t=8*r)|o&~(255<<t)}}});
//# sourceMappingURL=../sourcemaps/color/math.js.map
