/**
 * Created by groundlee on 2016/12/18.
 */
import Vue from 'vue'
import VueResource from 'vue-resource'
import commonDialog from './common_dialog.js'
Vue.use(VueResource)

/**
 *
 * 1:声明api：
 *  const wechat_apis = {
            getDicts: {method: 'GET', url: '/dicts/', token: false},
            getMyArticleList: {method: 'GET', url:  '/article/', token: false},
            ......

   2：创建实例：
        const wechatApi = new ApiBase(wechat_apis,null)

   3：函数名直接调用：
        promise = wechatApi.getDicts()
        promise.then(
                (ret, status) => {
                    console.log(ret,status)
                });
 */
export class ApiBase {

    constructor(apis,apiurl) {
        this.apiurl = '/wechatserver/api';
        //this.apiurl = 'http://www.youshibaodian.com/wechatserver/api'
        if (apiurl)
            this.apiurl = apiurl;
        this.$http = Vue.http;
        this.apis = apis;
        this.accesstoken = '';
        for (let api in this.apis) {
            //console.info(api)
            Object.defineProperty(this, api, {
                value: function
                    (url_param, url_resource_param, data_param) {
                    return this.__callApiPro(api, url_param, url_resource_param, data_param)
                }
            })
        }
    }

    setAccessToken(acctssToken){
        //commonDialog.alert(' set accesstoken:['+this.accesstoken+']')
        this.accesstoken = acctssToken
    }

    isAccessTokenOK(){
        //commonDialog.alert(this.accesstoken + ':' + (this.accesstoken && this.accesstoken.length > 5))
        return (this.accesstoken && this.accesstoken.length > 5)
    }

    /*
     api:函数名称
     url_param: 输入 {z:'str1',y:'str2} ,url 拼接为 ?z=str1&y=str2
     url_resource_param: 资源链接,输入{articleid:2334},/wechatserver/article/{articleid}/中的内容会被替换
     data_param: post json
     callback:调用成功的回调函数，第一个参数为返回数据json对象，第二个参数为http状态
     */

    __callApiPro(api, url_param, url_resource_param, data_param) {
        let _this = this
        let token = this.accesstoken && this.apis[api]['token'] ? {headers: {Authorization: "Token " + this.accesstoken}} : {};
        let url = this.apiurl + this.apis[api]['url'] + '?t=' + Math.random();
        //console.log(this,'__callApiPro',api,'token:',token,url_param,url_resource_param,data_param)
        if (url_param) {
            for (var p in url_param)
                url += '&' + p + '=' + url_param[p];
        }
        if (url_resource_param) {
            for (var p in url_resource_param)
                url = url.replace('{' + p + '}', url_resource_param[p]);
        }

        if (this.apis[api]['method'] == 'POST') {
            return new Promise(function (resolve, reject) {
                _this.$http.post(url, data_param, token).then((res) => {// success callback
                    console.log('call api:', api, url, url_param, res);
                    resolve(res.data, res.status);
                }, (res) => {// error callback
                    console.log('call api:', api, url, url_param);
                    reject(res.data, res.status);
                });
            });
        }
        else if (this.apis[api]['method'] == 'PUT') {
            return new Promise(function (resolve, reject) {
                _this.$http.put(url, data_param, token).then((res) => {// success callback
                    console.log('call api:', api, url, url_param, res);
                    resolve(res.data, res.status);
                }, (res) => {// error callback
                    console.log('call api:', api, url, url_param);
                    reject(res.data, res.status);
                });
            });
        }
        else if (this.apis[api]['method'] == 'GET') {
            return new Promise(function (resolve, reject) {
                _this.$http.get(url, token).then((res) => {// success callback
                    console.log('call api:', api, url, url_param, res);
                    resolve(res.data, res.status);
                }, (res) => {// error callback
                    console.log('call api:', api, url, url_param);
                    reject(res.data, res.status);
                });
            });
        }
        else if (this.apis[api]['method'] == 'DELETE') {
            return new Promise(function (resolve, reject) {
                _this.$http.delete(url, token).then((res) => {// success callback
                    console.log('call api:', api, url, url_param, res);
                    resolve(res.data, res.status);
                }, (res) => {// error callback
                    console.log('call api:', api, url, url_param);
                    reject(res.data, res.status);
                });
            });
        }
    }

}

