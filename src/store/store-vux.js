/**
 * Created by Luther on 17/4/20.
 */

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

//
const DEBUG = process.env.NODE_ENV !== 'production';

// 状态机
// 定义状态
const state = {

    //访问次数
    visit_count: 1,

    // 调试环境/正式环境(微信环境/APP环境)
    app_debug: DEBUG,

    // 错误信息
    app_error: '',

    // 访问令牌 (使用LocalStorage缓存)
    app_token: '',

    // 用户
    user: {},
    //用户编码
    user_usercode: '', //'1003',
    //应用类型
    user_apptype: 0,

    // 学校 ??????
    school: {},
    //学校编码
    user_schoolid: 0,
    //学校名称
    user_schoolname: '',

    //重复发票的信息{'fpdm':123,'fphm':12}
    duplicateInfo:{},

};

// 修改状态
const mutations = {

    //访问计数增加
    visit_increment (state) {
        state.visit_count++;
    },
    visit_increment (state, n) {
        state.visit_count += n;
    },

    //
    error_switch (state, error) {
        state.app_error = error;
    },

    //
    token_switch (state, token) {
        state.app_token = token;
    },

    //
    user_switch (state, user) {
        state.user = user;
    },
    user_usercode_switch (state, usercode) {
        state.user_usercode = usercode;
    },
    user_apptype_switch (state, apptype) {
        state.user_apptype = apptype;
    },
    school_switch (state, school) {
        state.school = school;
    },
    user_schoolid_switch (state, schoolid) {
        state.user_schoolid = schoolid;
    },
    user_schoolname_switch (state, schoolname) {
        state.user_schoolname = schoolname;
    },
    
};

//
const actions = {

};

//获取状态的方法
const getters = {

    //
    debug: state => {
        return state.app_debug;
    },
    error: state => {
        return state.app_error;
    },
    token: state => {
        return state.app_token;
    },

    //
    user: state => {
        return state.user;
    },
    usercode: state => {
        return state.user_usercode;
    },
    apptype: state => {
        return state.user_apptype;
    },
    school: state => {
        return state.school;
    },
    schoolid: state => {
        return state.user_schoolid
    },
    schoolname: state => {
        return state.user_schoolname;
    },

    duplicateInfo: state=>{
        return duplicateInfo
    }

};

// 创建 store 实例
const store = new Vuex.Store({
    state,
    actions,
    getters,
    mutations,
    modules: { },
    strict: DEBUG,
    plugins: []
});

export default store;