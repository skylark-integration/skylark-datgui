define(function () {
    'use strict';
    const css = {
        load: function (url, indoc) {
            const doc = indoc || document;
            const link = doc.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = url;
            doc.getElementsByTagName('head')[0].appendChild(link);
        },
        inject: function (cssContent, indoc) {
            const doc = indoc || document;
            const injected = document.createElement('style');
            injected.type = 'text/css';
            injected.innerHTML = cssContent;
            const head = doc.getElementsByTagName('head')[0];
            try {
                head.appendChild(injected);
            } catch (e) {
            }
        }
    };
    return css;
});