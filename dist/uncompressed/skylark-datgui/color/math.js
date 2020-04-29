define([
    "skylark-data-color"
], function (colors) {
    'use strict';
    let tmpComponent;
    const ColorMath = {
        hsv_to_rgb: colors.hsvToRgb,
        rgb_to_hsv: colors.rgbToHsv,
        rgb_to_hex: colors.rgbToHex,
        
        component_from_hex: function (hex, componentIndex) {
            return hex >> componentIndex * 8 & 255;
        },
        hex_with_component: function (hex, componentIndex, value) {
            return value << (tmpComponent = componentIndex * 8) | hex & ~(255 << tmpComponent);
        }
    };
    return ColorMath;
});