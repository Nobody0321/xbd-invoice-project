/**
 * Created by Luther on 17/4/20.
 */

import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource);

export class _http_define {

    constructor(methodname, endpoint, needtoken) {
        this.methodname = methodname;
        this.endpoint   = endpoint;
        this.needtoken  = needtoken;
    }

}

// https://github.com/pagekit/vue-resource/blob/develop/docs/config.md
// https://github.com/pagekit/vue-resource/blob/develop/docs/http.md
/*

Request:

 Options

 Parameter	Type	Description
 url	string	URL to which the request is sent
 body	Object, FormData, string	Data to be sent as the request body
 headers	Object	Headers object to be sent as HTTP request headers
 params	Object	Parameters object to be sent as URL parameters
 method	string	HTTP method (e.g. GET, POST, ...)
 responseType	string	Type of the response body (e.g. text, blob, json, ...)
 timeout	number	Request timeout in milliseconds (0 means no timeout)
 before	function(request)	Callback function to modify the request options before it is sent
 progress	function(event)	Callback function to handle the ProgressEvent of uploads
 credentials	boolean	Indicates whether or not cross-site Access-Control requests should be made using credentials
 emulateHTTP	boolean	Send PUT, PATCH and DELETE requests with a HTTP POST and set the X-HTTP-Method-Override header
 emulateJSON	boolean	Send request body as application/x-www-form-urlencoded content type

Response:

 Property	Type	Description
 url	string	Response URL origin
 body	Object, Blob, string	Response body
 headers	Header	Response Headers object
 ok	boolean	HTTP status code between 200 and 299
 status	number	HTTP status code of the response
 statusText	string	HTTP status text of the response
 Method	Type	Description
 text()	Promise	Resolves the body as string
 json()	Promise	Resolves the body as parsed JSON object
 blob()	Promise	Resolves the body as Blob object

 */

export class _http_caller {//没有注释，猜不出来

    constructor(defines, urlbase, emulatejson, emulatehttp, debug, verb) {
        this.defines    = defines;
        this.urlbase    = urlbase;
        this.ejson      = emulatejson;
        this.ehttp      = emulatehttp;
        this.debug      = debug; //详细展示数据请求及响应
        this.verb       = verb; //错误时返回完整错误

        this.accesstoken    = '';
        this.$http          = Vue.http;

        for (let define in this.defines) {
            Object.defineProperty(this, define, {
                value: function
                    (query_param, endpoint_param, body_param) {
                    return this.__make_promise(define, query_param, endpoint_param, body_param)
                }
            })
        }
    }

    setAccessToken(accesstoken) {
        this.accesstoken = accesstoken
    }

    isAccessTokenValid() {
        return (this.accesstoken && this.accesstoken.length > 5)
    }

    setInterceptorCallback(executebefore, executeafter, tokenempire) {
        let _this = this;

        _this.$http.interceptors.push((request, next) => {
            // 发送请求之前, 操作
            executebefore();

            // 收到响应之后, 进行统一的错误处理
            next((response) => {

                executeafter();

                // 检查错误码, 如果认证失败就重定向到登录页面
                if (response.status === 401) {
                    console.log("token empired", response);
                    tokenempire();
                }
            });
        });
    }

    /*
     define: 函数名称
     query_param: 查询参数,输入{z:'str1',y:'str2}, url拼接为 ?z=str1&y=str2
     endpoint_param: 资源链接,输入{articleid:2334},/article/{articleid}/中的内容会被替换
     body_param: Object, FormData, string, post json
     callback: 调用成功的回调函数，第一个参数为返回数据json对象，第二个参数为http状态
     */
    __make_promise(define, query_param, endpoint_param, body_param) {
        let header_token = this.isAccessTokenValid() && this.defines[define].needtoken ? { Authorization: "Token " + this.accesstoken } : {};
        let options = { headers: header_token, emulateJSON: this.ejson, emulateHTTP: this.ehttp };
        let full_url = this.urlbase + this.defines[define].endpoint + '?t=' + Date.parse(new Date().toDateString())+ Math.random();
        // if(this.debug) console.log(this,'__make_promise',define,'options:',options,query_param,endpoint_param,body_param);

        if (endpoint_param) {
            for (var p in endpoint_param)
                full_url = full_url.replace('{' + p + '}', endpoint_param[p]);
        }

        if (query_param) {
            for (var p in query_param)
                full_url += '&' + p + '=' + query_param[p];
        }

        let _this = this;
        if (this.defines[define].methodname == 'POST') {
            return new Promise(function (resolve, reject) {
                _this.$http.post(full_url, body_param, options).then((res) => {// success callback
                    if(_this.debug) console.log('http-caller-post:', res.status, define, full_url, query_param, body_param, res);
                    resolve(res.data, res.status);
                }, (res) => {// error callback
                    console.log('http-caller-post:', res.status, define, full_url, query_param);
                    if(_this.verb && _this.verb == true) {
                        reject(res);
                    }
                    else {
                        reject(res.data, res.status);
                    }
                });
            });
        }
        else if (this.defines[define].methodname == 'PUT') {
            return new Promise(function (resolve, reject) {
                _this.$http.put(full_url, body_param, options)
                    .then((res) => {// success callback
                        if(_this.debug) console.log('http-caller-put:', res.status, define, full_url, query_param, body_param, res);
                        resolve(res.data, res.status);
                    }, (res) => {// error callback
                        console.log('http-caller-put:', res.status, define, full_url, query_param);
                        if(_this.verb && _this.verb == true) {
                            reject(res);
                        }
                        else {
                            reject(res.data, res.status);
                        }
                    });
            });
        }
        else if (this.defines[define].methodname == 'PATCH') {
            return new Promise(function (resolve, reject) {
                _this.$http.patch(full_url, body_param, options)
                    .then((res) => {// success callback
                        if(_this.debug) console.log('http-caller-patch:', res.status, define, full_url, query_param, body_param, res);
                        resolve(res.data, res.status);
                    }, (res) => {// error callback
                        console.log('http-caller-patch:', res.status, define, full_url, query_param);
                        if(_this.verb && _this.verb == true) {
                            reject(res);
                        }
                        else {
                            reject(res.data, res.status);
                        }
                    });
            });
        }
        else if (this.defines[define].methodname == 'JSONP') {
            return new Promise(function (resolve, reject) {
                _this.$http.jsonp(full_url, options)
                    .then((res) => {// success callback
                        if(_this.debug) console.log('http-caller-jsonp:', res.status, define, full_url, query_param, body_param, res);
                        resolve(res.data, res.status);
                    }, (res) => {// error callback
                        console.log('http-caller-jsonp:', res.status, define, full_url, query_param);
                        if(_this.verb && _this.verb == true) {
                            reject(res);
                        }
                        else {
                            reject(res.data, res.status);
                        }
                    });
            });
        }
        else if (this.defines[define].methodname == 'GET') {
            return new Promise(function (resolve, reject) {
                _this.$http.get(full_url, options)
                    .then((res) => {// success callback
                        if(_this.debug) console.log('http-caller-get:', res.status, define, full_url, query_param, res);
                        resolve(res.data, res.status);
                    }, (res) => {// error callback
                        console.log('http-caller-get:', res.status, define, full_url, query_param);
                        if(_this.verb && _this.verb == true) {
                            reject(res);
                        }
                        else {
                            reject(res.data, res.status);
                        }
                    });
            });
        }
        else if (this.defines[define].methodname == 'DELETE') {
            return new Promise(function (resolve, reject) {
                _this.$http.delete(full_url, options)
                    .then((res) => {// success callback
                        if(_this.debug) console.log('http-caller-delete:', res.status, define, full_url, query_param, res);
                        resolve(res.data, res.status);
                    }, (res) => {// error callback
                        console.log('http-caller-delete:', res.status, define, full_url, query_param);
                        if(_this.verb && _this.verb == true) {
                            reject(res);
                        }
                        else {
                            reject(res.data, res.status);
                        }
                    });
            });
        }
        else if (this.defines[define].methodname == 'HEAD') {
            return new Promise(function (resolve, reject) {
                _this.$http.head(full_url, options)
                    .then((res) => {// success callback
                        if(_this.debug) console.log('http-caller-head:', res.status, define, full_url, query_param, res);
                        resolve(res.headers, res.status);
                    }, (res) => {// error callback
                        console.log('http-caller-head:', res.status, define, full_url, query_param);
                        if(_this.verb && _this.verb == true) {
                            reject(res);
                        }
                        else {
                            reject(res.data, res.status);
                        }
                    });
            });
        }
    }

}
