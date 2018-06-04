/**
 * Created by Luther on 17/4/20.
 */

//
let common_redirect = {

    contentpath : '/yfpmobile/',

    redirect_debug : function () {
        var lself = window.location; //vm.$$(window).location;
        var lhref = lself.href;
        var lorigin = lself.origin;
        var lpathname = lself.pathname;
        console.info('redirect_debug', lhref, lorigin, lpathname);

        // href "http://10.0.0.24:8010/?code=1234&state=5#!//index/1/1/"
        // hash "#!//index/1/1/"
        // host  "10.0.0.24:8010"
        // hostname "10.0.0.24"
        // origin "http://10.0.0.24:8010"
        // pathname "/"
        // port "8010"
        // protocol "http:"
        // search "?code=1234&state=5"
        //

        // /wechatserver/api/wechat_login_config/?config=6&redirect_uri=
        // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbab5c75454557bd8
    },

    redirect_wechat : function (referer) {
        let lorigin = window.location.origin;
        let redirect = lorigin+this.contentpath+'#/wechat';
        if(referer) redirect = redirect + '?referer='+referer;
        let lgoto = lorigin + '/wechatserver/api/wechat_login_config/?servicetype=1&redirect_uri='+encodeURIComponent(redirect);
        console.info('goto', lgoto);
        window.location.href = lgoto;
    },

    base_url : function () {
        var lself = window.location;
        var lorigin = lself.origin;
        return lorigin;
    },
    content_url : function () {
        var lself = window.location;
        var lorigin = lself.origin;
        return lorigin+this.contentpath;
    },

};

export default common_redirect;
