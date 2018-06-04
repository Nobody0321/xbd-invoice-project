import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import VueScroller from 'vue-scroller'

//
import FastClick from 'fastclick';
import {AlertPlugin,ConfirmPlugin,LoadingPlugin,DatetimePlugin} from 'vux';

//
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.min.js';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'font-awesome/css/font-awesome.min.css';

import MintUI from 'mint-ui'
import 'font-awesome/css/font-awesome.css'
import 'mint-ui/lib/style.css'

//
import './assets/styles/common-vux.css';

//
import vmessage_zh_CN from 'vee-validate/dist/locale/zh_CN';
import VeeValidate, { Validator } from 'vee-validate';

//
import Routers from './router-vux';
import store from './store/store-vux';
import CommonLoader from './scripts/common-loader';
import CommonUtility from './scripts/common-utility';
import App from './app-vux.vue';

//
Vue.config.debug = true;

//
Validator.addLocale(vmessage_zh_CN);

const dictionary = {
    zh_CN: {
        messages: {
            min_value: function(e,n)
            {
                return e+"必须大于"+n[0]+".";
            },
        }
    }
};
Validator.updateDictionary(dictionary);

const validate_config = {
    locale: 'zh_CN',
};

//
FastClick.attach(document.body);

//
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VueScroller);
Vue.use(VeeValidate, validate_config);
Vue.use(AlertPlugin);
Vue.use(ConfirmPlugin);
Vue.use(LoadingPlugin);
Vue.use(DatetimePlugin);
Vue.use(MintUI)

// 路由配置
const RouterConfig = {
    // mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);


//是否微信中打开
router.beforeEach(function beforeEachCheckUserAgent(to, from, next){

    //
    let nextto;
    let router = to.matched[to.matched.length - 1];
    // console.log('beforeEachCheckUserAgent', router);

    //
    let debug       = store.getters.debug;
    let isweixin    = CommonUtility.useragent.is_weixin();

    //
    if(!debug && !isweixin && (router.path != '/suspend')) {
        store.commit('error_switch', '请在微信中打开');
        nextto      = { path: '/suspend', };
    }

    //
    nextto ? next(nextto) : next();
});

//微信是否授权
router.beforeEach(function beforeEachCheckWechatAuth(to, from, next){

    //
    let nextto;
    let router = to.matched[to.matched.length - 1];
    // console.log('beforeEachCheckWechatAuth', router);

    //
    let debug          = store.getters.debug;
    let usercode       = store.getters.usercode;
    let usernotauth    = !usercode || usercode =='';

    if(usernotauth && (router.path != '/wechat' && router.path != '/suspend') ) {
        nextto = {
            path: '/wechat',
            query: {
                referer: to.fullPath
            }
        };
    }

    //
    nextto ? next(nextto) : next();
});


//最后
router.beforeEach(function beforeEachLast(to, from, next) {
    CommonLoader.title(to.meta.title);
    next();
});

//最后
router.afterEach(function afterEachLast(route) {

});


// 实例定义
new Vue({
    el: '#app',
    store,
    router: router,
    render: h => h(App)
});