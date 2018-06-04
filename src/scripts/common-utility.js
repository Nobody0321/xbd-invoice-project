/**
 * Created by Luther on 17/4/20.
 */

import lodash from 'lodash'

//
let common_utility = {

    useragent: {
        is_weixin: function () {
            var ua = navigator.userAgent.toLowerCase();
            // console.log('ua', ua);
            // alert(ua);
            return (ua.match(/MicroMessenger/i)=="micromessenger");
        },
        is_mqq: function () {
            var ua = navigator.userAgent.toLowerCase();
            // console.log('ua', ua);
            return (ua.match(/MQQBrowser/i)=="mqqbrowser");
        },
        is_qq: function () {
            var ua = navigator.userAgent.toLowerCase();
            // console.log('ua', ua);
            return (ua.match(/QQ/i)=="qq");
        },
        is_android: function () {
            var ua = navigator.userAgent;
            // console.log('ua', ua);
            return ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1;
        },
        is_iphone: function () {
            var ua = navigator.userAgent;
            // console.log('ua', ua);
            return ua.indexOf('iPhone') > -1;
        },
        is_ipad: function () {
            var ua = navigator.userAgent;
            // console.log('ua', ua);
            return ua.indexOf('iPad') > -1;
        },
        get_android_version: function () {
            var ua = navigator.userAgent;
            // console.log('ua', ua);
            var match = ua.match(/Android\s([0-9\.]*)/);
            return match ? match[1] : false;
        },
        is_xbdapp: function () {
            var ua = navigator.userAgent.toLowerCase();
            // console.log('ua', ua);
            return (ua.match(/XbdPskb/i)=="xbdpskb");
        },
    },

    document: {
        checkbox_limit: function (name, limitnum) {
            if(limitnum <= 0) return;

            var choicearr = document.getElementsByName(name);

            var curnum=0;
            for(var i=0;i<choicearr.length;i++) {
                if(choicearr[i].checked) {
                    curnum=curnum+1;
                }
            }

            if(curnum==limitnum) {
                for(var x=0;x<choicearr.length;x++)
                    if(!choicearr[x].checked)
                        choicearr[x].disabled='disabled';
            }
            else {
                for(var y=0;y<choicearr.length;y++)
                    choicearr[y].removeAttribute('disabled');
            }
        },

        textarea_limit: function (inputid, countid, limitnum) {
            if(limitnum <= 0) return;

            var inputer = document.getElementById(inputid);
            var counter = document.getElementById(countid);

            var inputlen = inputer.value.length;

            if(inputlen>limitnum) {
                inputer.value = inputer.value.substr(0, limitnum-1);
            }
            else {
                counter.innerText = inputlen;
            }
        },

    },

    array: {

        remove: function (arr, val) {
            for(var i=0; i<arr.length; i++) {
                if(arr[i] == val) {
                    arr.splice(i, 1);
                    break;
                }
            }
        },

    },

    string: {

        isEmpty: function (str) {
            return (str==null || str=='');
        },
        notEmpty: function (str) {
            return (str!=null && str!='');
        },

        startWith: function (str, sub) {
            if(sub==null||sub==''||str==null||str==''||str.length<sub.length)
                return false;
            return (str.substr(0,sub.length)==sub);
        },

        endWith: function (str, sub) {
            if(sub==null||sub==""||str==null||str==''||str.length<sub.length)
                return false;
            return (str.substring(str.length-sub.length)==sub);
        },

        replaceAll: function (str, fromstr, tostr) {
            // if(str.indexOf(fromstr)!=-1) {
                return str.replace(new RegExp(fromstr,"gm"), tostr);
            // }
        },

        subStr: function (str, len) {
            if(!str || str.length <= len)
                return str;

            if(len <= 3)
                return str.substring(0, len);

            return str.substring(0, len-3) + '...';
        },

    },

    checkParam: {
        isNotEmptyString: function(value) {
            if (lodash.isString(value) && (value.length > 0)) {
                return true;
            }
            return false;
        },
        isPositiveInteger: function(value) {
            if (lodash.isInteger(value) && (value > 0)) {
                return true;
            }
            return false;
        },
        isNotEmptyArray: function(value) {
            if (lodash.isArray(value) && (value.length > 0)) {
                return true;
            }
            return false;
        },
        isBooleanTrue: function(value) {
            if (lodash.isBoolean(value) && (value === true)) {
                return true;
            }
            return false;
        },
        isBooleanFalse: function(value) {
            if (lodash.isBoolean(value) && (value === false)) {
                return true;
            }
            return false;
        },
    },


};

export default common_utility;
