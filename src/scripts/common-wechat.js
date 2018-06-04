/**
 * Created by Luther on 17/4/20.
 */

import wx from 'weixin-js-sdk';
// import "http://res.wx.qq.com/open/js/jweixin-1.0.0.js";
// import '../../static/common/weixin-jssdk/jweixin-1.0.0';

import httpresource from './common-resource-vux'

//
const DEBUG = process.env.NODE_ENV !== 'production';
// const DEBUG = true;

//
let common_wechat = {

    jsapi: {

        init: function (_appid) {
            // alert('share: ' + _appid);
            console.log('jsapi appid=', _appid);

            var data = {'wechat_appid':_appid};

            var promise = httpresource.wjsapi_signer({}, data);
            promise.then(
                (res)=> {
                    // res.results.jsapi_ticket;
                    // alert(JSON.stringify(res));

                    wx.config({
                        debug: DEBUG,
                        appId: res.results.appid,
                        timestamp: res.results.timestamp,
                        nonceStr: res.results.nonceStr,
                        signature: res.results.signature,
                        jsApiList: [
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'onMenuShareQZone',
                            'chooseImage',
                            'previewImage',
                            'uploadImage',
                            'downloadImage',
                            'scanQRCode'
                        ]
                    });

                    console.log('success in init jsapi!');
                    console.log('[SUCCESS]' + JSON.stringify(res, null, 4));

                }).catch((res)=> {
                    // alert('init error : ' + JSON.stringify(res));
                    console.log('error in init jsapi!');
                    console.log('[ERROR]' + JSON.stringify(res, null, 4));
                });
        },

        share: function(_title, _desc, _weburl, _imgurl) {
            // alert('share: ' + _title + _desc + _weburl + _imgurl);
            console.log('share', _title, _desc, _weburl, _imgurl);

            var shareData = {
                title: _title, // 分享标题
                desc: _desc, // 分享描述
                link: _weburl, // 分享链接
                imgUrl: _imgurl, // 分享图标
            };

            wx.ready(function () {
                console.info('wechat ready');
                // alert('wechat ready');

                wx.onMenuShareAppMessage(shareData);
                wx.onMenuShareTimeline(shareData);
                wx.onMenuShareQQ(shareData);
                wx.onMenuShareWeibo(shareData);
                wx.onMenuShareQZone(shareData);
            });
            wx.error(function (res) {
                console.error('wechat error', res);
                alert(JSON.stringify(res));
            });

        },

        scanQRCode(){
            let promise = new Promise(function (resolve, reject) {
                wx.scanQRCode({
                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                    success: function (res) {
                        resolve(res.resultStr)
                        //var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    }
                });
            });
            return promise;
        },
    },

};

export default common_wechat;

