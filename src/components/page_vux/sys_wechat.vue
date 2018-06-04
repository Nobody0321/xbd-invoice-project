<template>

    <!--<div class="panel panel-default sys-wechat" style="margin: 20px;">
        <div class="panel-body">
            {{message}}
        </div>
    </div>-->

    <div class="loading" v-if="rendered">
        <img src="../../../static/images/image-loading.png" />
    </div>

</template>

<script>

    import httpresource from '../../scripts/common-resource-vux';
    import httpredirect from '../../scripts/common-redirect-vux';
    import utility from '../../scripts/common-utility';
    import wechat from '../../scripts/common-wechat';

    //缓存信息定义
    const key_user_info     = 'wechat_login_user_info';
    const key_failure_time  = 'wechat_login_failure_times';

    //跳转页面定义
    const suspend_page      = '/suspend';

    const apply_init_page   = '/apply_user';
    const apply_4user_page  = '/apply_user_status';
    const apply_4school_page= '/apply_company_status';


    export default {
        data () {
            return {
                message: '正在登陆中',
                rendered: false,
            }
        },
        mounted: function() {
            console.log('mounted');
            var vm = this;

            let referer  = vm.$route.query.referer;
            console.log('referer', referer);

            //参数
            var debug      = vm.store_debug;
            var usercode   = vm.store_usercode;
            var apptype    = vm.store_apptype;
            console.log('mounted', debug, usercode, apptype);

            //apptype 0-未知，1-幼师宝典，2-微信
            var isxbdapp = utility.useragent.is_xbdapp();
            var isweixin = utility.useragent.is_weixin();
            var isandroid = utility.useragent.is_android();
            var isiphone = utility.useragent.is_iphone();
            console.log('ua', isweixin, isandroid, isiphone);

            if(isxbdapp) {
                apptype = 1;
            }
            else if(isweixin) {
                apptype = 2;
            }
            vm.$store.commit('user_apptype_switch', apptype);

            //
            if(debug) {
                vm._http_exec_wuser_locate('', apptype, referer);
            }
            else {
                //location
                var lself = window.location; //vm.$$(window).location;
                var lhref = lself.href;

                //weixin
                var key = 'code=';
                let codestart = lhref.indexOf(key);
                if(isweixin && (!usercode || usercode=='')) {
                    if(codestart<=-1) {
                        console.log('redirect_wechat', referer);
                        httpredirect.redirect_wechat(referer);
                    }
                    else {
                        vm.rendered = true;
                        let start =  codestart + key.length;
                        let end = lhref.indexOf('&', codestart);
                        console.info('position', start, end);
                        let code = lhref.substring(start, end);
                        vm._http_exec_wuser_locate(code, apptype, referer);
                    }
                }
            }

        },
        created: function() {
            console.log('created');
        },
        components: {

        },
        directives: {

        },
        computed: {
            store_debug: function () {
                var vm = this;
                return vm.$store.getters.debug;
            },
            store_user: function () {
                var vm = this;
                return vm.$store.getters.user;
            },
            store_usercode: function () {
                var vm = this;
                return vm.$store.getters.usercode;
            },
            store_apptype: function () {
                var vm = this;
                return vm.$store.getters.apptype;
            },
        },
        watch: {

        },
        methods: {
            _http_exec_wuser_locate: function(code, apptype, referer) {
                console.log('_http_exec_wuser_locate', code, apptype, referer);

                var vm = this;

                //
                var debug  = vm.store_debug;
                var data = { 'code' : code };
                var promise = httpresource.wuser_locate(data);
                promise
                    .then((res)=> {
                        //
                        var user = {
                            usercode    : res.openid,
                            username    : res.nickname,
                            userlogo    : res.headimgurl,
                            openid      : res.openid,
                            unionid     : res.unionid,

                            schoolid    : res.myschoolid,

                            token       : res.djkey,
                            status      : res.auditstatus,

                            iszswadmin  : res.iszswadmin,
                            isassadmin  : res.isassadmin,

                            appid       : res.appid,
                            schoolname  : res.myschoolname,

                            //
                            country     : res.country,
                            province    : res.province,
                            city        : res.city,
                            sex         : res.sex,
                            nickname    : res.nickname,
                            headimgurl  : res.headimgurl
                        };

                        console.log(user);

                        vm.$store.commit('user_switch', user);
                        vm.$store.commit('user_usercode_switch', user.usercode);
                        vm.$store.commit('user_schoolid_switch', user.schoolid);
                        vm.$store.commit('user_schoolname_switch', user.schoolname);
                        vm.$store.commit('token_switch', user.token);

                        //
                        if(window.localStorage) {
                            window.localStorage.setItem(key_user_info, JSON.stringify(user));
                            window.localStorage.setItem(key_failure_time, 0);
                        }

                        //显示查询信息
//                        vm.message = JSON.stringify(user);

                        //根据服务端状态处理
                        let ustatus = user.status;

                        if(ustatus==1) { //OK

                            if(referer && referer!=''
                                && user.token && user.token!='')  //令牌OK
                            {
                                //
                                console.log('token', user.token);
                                if(user.token && user.token!='') {
                                    httpresource.setAccessToken(user.token);

                                    httpresource.setInterceptorCallback(
                                        function () {
                                            vm.$vux.loading.show({
                                                text: '加载中...'
                                            });
                                        },
                                        function () {
                                            vm.$vux.loading.hide()
                                        },
                                        function () {
                                            httpredirect.redirect_wechat(referer);
                                        }
                                    );
                                }

                                //默认分享属性
                                if(user.appid && user.appid!='') {
                                    let title = '财税云发票';
                                    let weburl = httpredirect.content_url();
                                    let imgurl = weburl + 'static/images/logo-zsw-300.png';

                                    wechat.jsapi.init(user.appid);

                                    //wechat.jsapi.share(title, title, weburl, imgurl);

                                    console.log('wechat.jsapi.init ok');
                                }

                                //
                                vm.$router.push(referer);
                            }
                            else {
                                console.error('接口返回信息:', 'token', user.token, 'schoolid', user.schoolid);
                                vm.$store.commit('error_switch', '非法请求');
                                vm.$router.push(suspend_page);
                            }

                        }
                        else {
                            console.error('接口返回信息:', 'status', ustatus);
                            vm.$store.commit('error_switch', '服务器打盹,请稍后再试');
                            vm.$router.push(suspend_page);
                        }
                    })
                    .catch((res)=> {
                        console.error(res);
                        console.log('_http_exec_wuser_locate - redirect_wechat');

                        if(debug) {
                            var user = {
                                usercode : '1001',
                                username : '用户',
                                userlogo : '',
                                openid : '1001',
                                unionid : '11',
                                schoolid : 1,
                                token : '40000',
                                status : 1,
                                iszswadmin : true,
                                appid : 'wxbab5c75454557bd8',
                                schoolname : '测试公司',
                            };

                            vm.$store.commit('user_switch', user);
                            vm.$store.commit('user_usercode_switch', user.usercode);
                            vm.$store.commit('user_schoolid_switch', user.schoolid);
                            vm.$store.commit('user_schoolname_switch', user.schoolname);
                            vm.$store.commit('token_switch', user.token);
                        }
                        else {
                            //
                            if(window.localStorage) {
                                let times = window.localStorage.getItem(key_failure_time);
                                let n_times = Number(times);
                                window.localStorage.setItem(key_failure_time, n_times+1);

                                if(n_times < 3) {
                                    httpredirect.redirect_wechat(referer);
                                }
                            }
                        }
                    });
            },
        },
    }
</script>

<style scoped lang="less">

    .loading
    {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
    }

    .loading img
    {
        position: relative;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
    }

</style>
