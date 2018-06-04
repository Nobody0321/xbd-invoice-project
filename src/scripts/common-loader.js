/**
 * Created by Luther on 17/4/20.
 */

//
let common_loader = {

};
common_loader.title = function (title) {
    title = title ? title : '财税云发票';
    window.document.title = title;


    let ua = navigator.userAgent;
    if (/\bMicroMessenger\/([\d\.]+)/.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
        var i = document.createElement('iframe');
        i.src = '/favicon.ico';
        i.style.display = 'none';
        i.onload = function () {
            setTimeout(function () {
                i.remove();
            }, 9);
        };
        document.body.appendChild(i);
    }
};
common_loader.alert = function(content) {
    window.alert(content);
};
common_loader.scrolltop = function() {
    window.scrollTo(0, 0);
};

export default common_loader;
