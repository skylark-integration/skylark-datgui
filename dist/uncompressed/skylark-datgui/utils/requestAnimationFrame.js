define(function () {
    'use strict';
    function requestAnimationFrame(callback) {
        setTimeout(callback, 1000 / 60);
    }
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame;
});