/**
 * Created by Luther on 17/4/20.
 */

import Mock from 'mockjs';

//---------------------------------------------------------------
// 公共
//---------------------------------------------------------------

//wuser_locate
var wuser_locate = {
    'openid|1-200'  : 1,
    'unionid|1-200' : 1,
    'nickname'      : '@CNAME',
    'headimgurl'    : '@IMAGE',
    'myschoolid'    : 1,
    'djkey'         : 'dslfjr4r-fjdsjlsjlffdsfsf',
    'auditstatus'   : 1,
    'iszswadmin'    : true,
};
Mock.mock(/\/zsw\/wx_userinfo/, 'get', wuser_locate);

//---------------------------------------------------------------
// 申请相关
//---------------------------------------------------------------

var apply_invoice = {
    "id": 7,
    "contactname": "hello",
    "contactphone": "123",
    "unionid": "22222",
    "openid": "11111",
    "province": "湖北",
    "city": "武汉",
    "nickname": "world",
    "headimgurl": "string",
    "audittime": null,
    "status": 1,
    "remark": "",
    "createtime": "2017-06-19T16:37:12.648660",
    "config": null
};
Mock.mock(/\/local_zsw\/local_zswapply/, apply_invoice);

var apply_company = {
    "status": 1,
    "result" : "成功"
}
Mock.mock(/\/local_zsw\/local_zswschoolapply/, apply_company);

var company_list = {
    "items":[
        {"name": "公司名称111",  "id":1 ,'province':'北京市','city':'市辖区',},
        {"name":"武汉小板凳", "id":2, 'province':'湖北省','city':'武汉',},
        {"name":"北京小小小小小小小小小小小小小小小小小小板凳",    "id":3, 'province':'北京市','city':'市辖区',},
        {"name":"上海小板凳", "id":4, 'province':'上海市','city':'市辖区',},
        {"name":"深圳小板凳", "id":5, 'province':'广东省','city':'深圳',},
        {"name":"广州小板凳", "id":6, 'province':'广东省','city':'广州市',}
    ]
}
Mock.mock(/\/local_zsw\/local_myschool\/local_simple/, company_list);

var department_list = {
    "items":[
        {"name": "部门1",  },
        {"name":"武汉小板凳",},
        {"name":"北京小小小小小小小小小小小小小小小小小小板凳", },
        {"name":"上海小板凳", "id":4, },
        {"name":"深圳小板凳", "id":5, },
        {"name":"广州小板凳", "id":6, }
    ]
}
Mock.mock(/\/local_zsw\/local_department/, department_list);


var approval_user_status ={
    "id": 1,
    "myschoolid":1,
    "myschoolname": "小方桌教育有限公司",
    "contactname": "陈真真",
    "contactphone": "49375784344",
    "unionid": "o0hZNuGWGBwm8HB2RsJ3lSGDDlgw",
    "openid": 1223123,
    "xbdcontactname":"小板凳联系人",
    "xbdcontactphone":"12345678910"
}
Mock.mock(/\/l_zsw\/l_zswapply\/l_applyinfo/, approval_user_status);

var approval_company_status ={
    'count': 1,
    'results': [
        {
            "id": 1,
            "myschoolid":1,
            "myschoolname":"小方桌教育有限公司",
            "contactname": "陈真真",
            "contactphone": "49375784344",
            "status": 2,
            "unionid": "o0hZNuGWGBwm8HB2RsJ3lSGDDlgw",
            "openid": "o0hZNuGWGBwm8HB2RsJ3lSGDDlgw",
        },
    ],
}
Mock.mock(/\/l_zsw\/l_zswschoolapply\/l_applyinfo/, approval_company_status);

var withdraw_apply_invoice ={
    "result" : "用户取消申请成功"
}
Mock.mock(/\/l_zsw\/l_zswapply\/l_cancelapply/, withdraw_apply_invoice);

var withdraw_apply_company ={
    "result" : "公司取消申请成功"
}
Mock.mock(/\/l_zsw\/l_zswschoolapply\/l_cancelapply/, withdraw_apply_company);

//---------------------------------------------------------------
// 公司相关
//---------------------------------------------------------------

//company_locate
var company_locate = {
    'count': 1,
    'results': [
        {
            "status": "1",                  //状态：0停用，1启用
            "company_phone": "1111111111",  //公司电话
            "yhzh": "银行账号111",           //银行账号
            "name": "1111",                 //名称
            "checkcount": "100",            //可开发票数
            "start_time": "2017-01-01 00:00:00", //服务起始时间
            "agency": "代理公司111",              //代理公司
            "checkedcount": "1",                 //已开发票数
            "school_name": "公司名称111",         //公司名称
            "agent": "代理人111",                 //代理人
            "nsrsbh": "91110105MA00A3A38N",      //税号
            "connect_user": "联系人111",          //联系人
            "end_time": "2017-12-01 00:00:00",   //服务截至时间
            "groups": [1,2],                     //权限组
            "address": "地址111",                 //公司地址
            "khyh": "开户银行111",                //开户银行
            "users": [1,2],                       //公司用户
            "qrcodeurl": "/wechatserver/api/qrcode/?data=https%3A//ysbd-dev.xbdedu.cn/yywmobile/ques/%23/index/30",
        },
    ],
};
Mock.mock(/\/local_zsw\/local_company/, 'get', company_locate);

//company_quit
var company_quit ={
    "result" : "退出成功"
};
Mock.mock(/\/local_zsw\/quit_company/, 'put', company_quit);

//---------------------------------------------------------------
// 发票相关
//---------------------------------------------------------------

//invoice_list
var invoice_list = {
    'count': 20,
    'results|5': [
        {
            'id|+1': 1,
            "hyzt|0-1": 1,
            "hyjl|0-1": 1,
            "fpdm": "1313333333",
            "fphm": "12313131",
            "je|+182": 239.62,
            "jshj|+182": 10000.62,
            "bz_cffp|0-1": 1,
            "bz_jbxm|0-1": 1,
            "bz_sfyc|0-1": 1,
            "bz_gfyc|0-1": 1,
            "kprq": "2016-07-01",
            "cysj": "2016-07-01",
            "sysusername|1-2":"ab",
            "bx|1-2": true,
            "zfbz|1": true, 
            "hwxx": [
                {
                    "id": 1,
                    "mc": "住宿服务",
                    "gg": "",
                    "dw": "",
                    "num": "1.00",
                    "dj": "9.71",
                    "je": "9.71",
                    "sl": "3.00",
                    "se": "0.29"
                },
                {
                    "id": 2,
                    "mc": "住宿服务",
                    "gg": "",
                    "dw": "",
                    "num": "1.00",
                    "dj": "9.71",
                    "je": "9.71",
                    "sl": "3.00",
                    "se": "0.29"
                }
            ]
        },
    ],
};
Mock.mock(/\/local_zsw\/local_invoice\/invoice/, 'get', invoice_list);

//invoice_locate
var invoice_locate = {
    "id": 1,
    "fphm": "57991517",       //发票号码
    "fpdm": "042001700111",   //发票代码
    "kprq": "2017-10-30",     //开票日期
    "hyjl": false,            //核验结论
    "hyzt": 0,                //核验状态,是否完成 (-2,'获取验证码错误'),(-1,'验证发票错误'),(0,'还没有核验'),(1,'核验完成')
    "errorcode": "",          //错误码
    "errorinfo": "",          //错误信息
    "fplx": "",               //发票类型
    "fpmc": "增值税普通发票",   //发票名称
    "fpms|1-3":'发票描述',     //发票描述
    "fpszd": "河南",           //发票所在地
    "hy_times": 0,            //失败次数
    "zfbz": true,             //作废标志
    "je": "100.00",           //金额(不含税)
    "jshj": "10000.00",       //价税合计
    "se": "1.98",             //税额
    "sl": "0.01",             //税率

    "bz_cffp": true,         //重复发票
    "bz_jbxm": true,         //禁报项目
    "bz_sfyc": true,         //销方异常
    "bz_gfyc": true,         //购方异常

    "cysj": "2017-10-30",             //查验时间
    "createtime":"2018-10-10",   //采集日期

    "gfmc": "",                     //购方名称
    "gfsbh": "",                    //购方纳税人识别号
    "gfsfzhm": "",                  //购方身份证号码
    "gfdzdh": "",                   //购方地址电话
    "gfyhzh": "",                   //购方银行账号

    "xfmc": "",                     //销方名称
    "xfsbh": "",                    //销方纳税人识别号
    "xfdzdh": "",                   //销方地址电话
    "xfyhzh": "",                   //销方银行账号
    "xfkhyh": "",                   //销方开户银行

    "jym": "",                      //校验码
    "bz": "",                       //备注
    "jqbh": "",                     //机器编号

    "cllx": "",                     //车辆类型
    "cpxh": "",                     //厂牌型号
    "cd": "",                       //产地
    "hgzs": "",                     //合格证号
    "sjdh": "",                     //商检单号
    "fdjhm": "",                    //发动机号码
    "cjhm": "",                     //车辆识别代号/车架号码
    "jkzmsh": "",                   //进口证明书号

    "swjg": "",                     //税务机构
    "swjg_dm": "",                  //税务机构代码
    "wspzhm": "",                   //完税凭证号码

    "dw": "",                       //吨位
    "xcrs": "",                     //限乘人数
    "shy": "",                      //收货员
    "hwxx": [{
        dj: "39.62",
        dw: "",
        gg: "",
        id: 8,
        je: "39.62",
        mc: "餐饮服务",
        num: "1.00",
        se: "2.38",
        sl: "6.00",
    }],                      //货物信息
};
Mock.mock(/\/local_zsw\/local_invoice\/\d{1,100}/, 'get', invoice_locate);

//invoice_add
var invoice_add = {
    name: "",
    sex: 1,
    birthday: "2017-06-17",
    nation: 1,
    hasjoin: 0,
    parentname: "",
    parentphone: "13312345678",
    childnum: 2,
    relation: 1,
    community: "理工睿府",
    address: "理工睿府",
    zsplan:  2,
    recommender: "欧阳锋",
    remark: "这是备注啊",
};
Mock.mock(/\/local_zsw\/local_invoice\/invoice/, 'post', invoice_add);

//invoice_delete
var invoice_delete = {
    invoiceid: 1,
};
Mock.mock(/\/local_zsw\/local_invoice\/\d{1,100}/, 'delete', invoice_delete);

//---------------------------------------------------------------
// 报销相关
//---------------------------------------------------------------

//applyinvoice_list
var applyinvoice_list = {
    'count': 10,
    'results|20': [
        {
            "id": 1,                                   //id
            "sysusername": "test1",                    //报销人
            "invoices": [],                            //发票详情列表
            "invoices_num|0-10": 0,                         //发票张数
            "invoices_je|0-1000": 0,                     //发票总金额
            "porpose": "泡妞",                         //报销用途
            "approval_status|0-3": 0,                 //审批状态
            "approval_time": "1970-01-01T00:00:00",    //审批时间
            "approval_opinion": "",                    //审批意见
            "remark": "砍砍砍",                         //备注
            "createtime": "2017-11-08T17:43:01.178439",//创建时间
            "updatetime": "2017-11-08T17:43:01.178471",//更新时间
            "sysuser": 2,                              //报销人userid
            "config": 1                                //公司id
        },
    ],
};
Mock.mock(/\/local_zsw\/local_invoice\/applyinvoice/, 'get', applyinvoice_list);

//applyinvoice_locate
var applyinvoice_locate = {
    "id": 1,
    "sysusername": "test1",
    "invoices": [
        {
            "id": 1,
            "fphm": "57991517",
            "fpdm": "042001700111",
            "kprq": "2017-10-30",
            "hyjl": true,
            "hyzt": 1,
            "cycs": 0,
            "errorcode": "002",
            "errorinfo": "超过该张发票当日查验次数(请于次日再次查验)!",
            "fplx": "",
            "fpmc": "",
            "fpszd": "",
            "jym_or_kjje": "100",
            "hy_times": 24,
            "zfbz": false,
            "je": "0.00",
            "jshj": "0.00",
            "se": "0.00",
            "sl": "0.00",
            "cysj": null,
            "gfmc": "",
            "gfsbh": "",
            "xfmc": "",
            "xfsbh": "",
            "xfdzdh": "",
            "xfyhzh": "",
            "gfdzdh": "",
            "gfyhzh": "",
            "jym": "",
            "bz": "",
            "jqbh": "",
            "bx": true,
            "bz_cffp": false,
            "bz_jbxm": false,
            "bz_sfyc": false,
            "bz_gfyc": false,
            "gfsfzhm": "",
            "cllx": "",
            "cpxh": "",
            "cd": "",
            "hgzs": "",
            "sjdh": "",
            "fdjhm": "",
            "cjhm": "",
            "jkzmsh": "",
            "xfkhyh": "",
            "swjg": "",
            "swjg_dm": "",
            "wspzhm": "",
            "dw": "",
            "xcrs": "",
            "shy": "",
            "sysusername": "test1",
            "hwxx": []
        },
        {
            "id": 1,
            "fphm": "57991517",
            "fpdm": "042001700111",
            "kprq": "2017-10-30",
            "hyjl": true,
            "hyzt": 1,
            "cycs": 0,
            "errorcode": "002",
            "errorinfo": "超过该张发票当日查验次数(请于次日再次查验)!",
            "fplx": "",
            "fpmc": "",
            "fpszd": "",
            "jym_or_kjje": "100",
            "hy_times": 24,
            "zfbz": false,
            "je": "0.00",
            "jshj": "0.00",
            "se": "0.00",
            "sl": "0.00",
            "cysj": null,
            "gfmc": "",
            "gfsbh": "",
            "xfmc": "",
            "xfsbh": "",
            "xfdzdh": "",
            "xfyhzh": "",
            "gfdzdh": "",
            "gfyhzh": "",
            "jym": "",
            "bz": "",
            "jqbh": "",
            "bx": true,
            "bz_cffp": false,
            "bz_jbxm": false,
            "bz_sfyc": false,
            "bz_gfyc": false,
            "gfsfzhm": "",
            "cllx": "",
            "cpxh": "",
            "cd": "",
            "hgzs": "",
            "sjdh": "",
            "fdjhm": "",
            "cjhm": "",
            "jkzmsh": "",
            "xfkhyh": "",
            "swjg": "",
            "swjg_dm": "",
            "wspzhm": "",
            "dw": "",
            "xcrs": "",
            "shy": "",
            "sysusername": "test1",
            "hwxx": []
        },
        {
            "id": 1,
            "fphm": "57991517",
            "fpdm": "042001700111",
            "kprq": "2017-10-30",
            "hyjl": true,
            "hyzt": 1,
            "cycs": 0,
            "errorcode": "002",
            "errorinfo": "超过该张发票当日查验次数(请于次日再次查验)!",
            "fplx": "",
            "fpmc": "",
            "fpszd": "",
            "jym_or_kjje": "100",
            "hy_times": 24,
            "zfbz": false,
            "je": "0.00",
            "jshj": "0.00",
            "se": "0.00",
            "sl": "0.00",
            "cysj": null,
            "gfmc": "",
            "gfsbh": "",
            "xfmc": "",
            "xfsbh": "",
            "xfdzdh": "",
            "xfyhzh": "",
            "gfdzdh": "",
            "gfyhzh": "",
            "jym": "",
            "bz": "",
            "jqbh": "",
            "bx": true,
            "bz_cffp": false,
            "bz_jbxm": false,
            "bz_sfyc": false,
            "bz_gfyc": false,
            "gfsfzhm": "",
            "cllx": "",
            "cpxh": "",
            "cd": "",
            "hgzs": "",
            "sjdh": "",
            "fdjhm": "",
            "cjhm": "",
            "jkzmsh": "",
            "xfkhyh": "",
            "swjg": "",
            "swjg_dm": "",
            "wspzhm": "",
            "dw": "",
            "xcrs": "",
            "shy": "",
            "sysusername": "test1",
            "hwxx": []
        },
        {
            "id": 1,
            "fphm": "57991517",
            "fpdm": "042001700111",
            "kprq": "2017-10-30",
            "hyjl": true,
            "hyzt": 1,
            "cycs": 0,
            "errorcode": "002",
            "errorinfo": "超过该张发票当日查验次数(请于次日再次查验)!",
            "fplx": "",
            "fpmc": "",
            "fpszd": "",
            "jym_or_kjje": "100",
            "hy_times": 24,
            "zfbz": false,
            "je": "0.00",
            "jshj": "0.00",
            "se": "0.00",
            "sl": "0.00",
            "cysj": null,
            "gfmc": "",
            "gfsbh": "",
            "xfmc": "",
            "xfsbh": "",
            "xfdzdh": "",
            "xfyhzh": "",
            "gfdzdh": "",
            "gfyhzh": "",
            "jym": "",
            "bz": "",
            "jqbh": "",
            "bx": true,
            "bz_cffp": false,
            "bz_jbxm": false,
            "bz_sfyc": false,
            "bz_gfyc": false,
            "gfsfzhm": "",
            "cllx": "",
            "cpxh": "",
            "cd": "",
            "hgzs": "",
            "sjdh": "",
            "fdjhm": "",
            "cjhm": "",
            "jkzmsh": "",
            "xfkhyh": "",
            "swjg": "",
            "swjg_dm": "",
            "wspzhm": "",
            "dw": "",
            "xcrs": "",
            "shy": "",
            "sysusername": "test1",
            "hwxx": []
        },
        {
            "id": 1,
            "fphm": "57991517",
            "fpdm": "042001700111",
            "kprq": "2017-10-30",
            "hyjl": true,
            "hyzt": 1,
            "cycs": 0,
            "errorcode": "002",
            "errorinfo": "超过该张发票当日查验次数(请于次日再次查验)!",
            "fplx": "",
            "fpmc": "",
            "fpszd": "",
            "jym_or_kjje": "100",
            "hy_times": 24,
            "zfbz": false,
            "je": "0.00",
            "jshj": "0.00",
            "se": "0.00",
            "sl": "0.00",
            "cysj": null,
            "gfmc": "",
            "gfsbh": "",
            "xfmc": "",
            "xfsbh": "",
            "xfdzdh": "",
            "xfyhzh": "",
            "gfdzdh": "",
            "gfyhzh": "",
            "jym": "",
            "bz": "",
            "jqbh": "",
            "bx": true,
            "bz_cffp": false,
            "bz_jbxm": false,
            "bz_sfyc": false,
            "bz_gfyc": false,
            "gfsfzhm": "",
            "cllx": "",
            "cpxh": "",
            "cd": "",
            "hgzs": "",
            "sjdh": "",
            "fdjhm": "",
            "cjhm": "",
            "jkzmsh": "",
            "xfkhyh": "",
            "swjg": "",
            "swjg_dm": "",
            "wspzhm": "",
            "dw": "",
            "xcrs": "",
            "shy": "",
            "sysusername": "test1",
            "hwxx": []
        },
        {
            "id": 1,
            "fphm": "57991517",
            "fpdm": "042001700111",
            "kprq": "2017-10-30",
            "hyjl": true,
            "hyzt": 1,
            "cycs": 0,
            "errorcode": "002",
            "errorinfo": "超过该张发票当日查验次数(请于次日再次查验)!",
            "fplx": "",
            "fpmc": "",
            "fpszd": "",
            "jym_or_kjje": "100",
            "hy_times": 24,
            "zfbz": false,
            "je": "0.00",
            "jshj": "0.00",
            "se": "0.00",
            "sl": "0.00",
            "cysj": null,
            "gfmc": "",
            "gfsbh": "",
            "xfmc": "",
            "xfsbh": "",
            "xfdzdh": "",
            "xfyhzh": "",
            "gfdzdh": "",
            "gfyhzh": "",
            "jym": "",
            "bz": "",
            "jqbh": "",
            "bx": true,
            "bz_cffp": false,
            "bz_jbxm": false,
            "bz_sfyc": false,
            "bz_gfyc": false,
            "gfsfzhm": "",
            "cllx": "",
            "cpxh": "",
            "cd": "",
            "hgzs": "",
            "sjdh": "",
            "fdjhm": "",
            "cjhm": "",
            "jkzmsh": "",
            "xfkhyh": "",
            "swjg": "",
            "swjg_dm": "",
            "wspzhm": "",
            "dw": "",
            "xcrs": "",
            "shy": "",
            "sysusername": "test1",
            "hwxx": []
        },
        {
            "id": 1,
            "fphm": "57991517",
            "fpdm": "042001700111",
            "kprq": "2017-10-30",
            "hyjl": true,
            "hyzt": 1,
            "cycs": 0,
            "errorcode": "002",
            "errorinfo": "超过该张发票当日查验次数(请于次日再次查验)!",
            "fplx": "",
            "fpmc": "",
            "fpszd": "",
            "jym_or_kjje": "100",
            "hy_times": 24,
            "zfbz": false,
            "je": "0.00",
            "jshj": "0.00",
            "se": "0.00",
            "sl": "0.00",
            "cysj": null,
            "gfmc": "",
            "gfsbh": "",
            "xfmc": "",
            "xfsbh": "",
            "xfdzdh": "",
            "xfyhzh": "",
            "gfdzdh": "",
            "gfyhzh": "",
            "jym": "",
            "bz": "",
            "jqbh": "",
            "bx": true,
            "bz_cffp": false,
            "bz_jbxm": false,
            "bz_sfyc": false,
            "bz_gfyc": false,
            "gfsfzhm": "",
            "cllx": "",
            "cpxh": "",
            "cd": "",
            "hgzs": "",
            "sjdh": "",
            "fdjhm": "",
            "cjhm": "",
            "jkzmsh": "",
            "xfkhyh": "",
            "swjg": "",
            "swjg_dm": "",
            "wspzhm": "",
            "dw": "",
            "xcrs": "",
            "shy": "",
            "sysusername": "test1",
            "hwxx": []
        }
    ],
    "invoices_num": 3,
    "invoices_je": 222.22,
    "porpose": "泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞",
    "approval_status": 0,
    "approval_time": "2017-11-10T17:10:21",
    "approval_opinion": "过分过分3",
    "remark": "砍砍砍泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞泡妞",
    "createtime": "2017-11-08T17:43:01.178439",
    "updatetime": "2017-11-10T17:10:21.340262",
    "sysuser": 2,
    "config": 1
};
Mock.mock(/\/local_zsw\/local_applyinvoice\/\d{1,100}/, 'get', applyinvoice_locate);

//applyinvoice_add
var applyinvoice_add = {
    applyinvoiceid: 1,
};
Mock.mock(/\/local_zsw\/local_applyinvoice\/applyinvoice/, 'post', applyinvoice_add);

//applyinvoice_delete
var applyinvoice_delete = {
   applyinvoiceid: 1,
};
Mock.mock(/\/local_zsw\/local_applyinvoice\/\d{1,100}/, 'delete', applyinvoice_delete);

//applyinvoice_update
var applyinvoice_update = {
    approval_opinion: "撤回申请",
    approval_status: -2,
};
Mock.mock(/\/local_zsw\/local_applyinvoice\/\d{1,100}/, 'put', applyinvoice_update);

//invoice_fpms_edit
var invoice_fpms_edit = {
    fpms:'已更改',
};
Mock.mock(/\/local_zsw\/local_invoice\/\d{1,100}/, 'put', invoice_fpms_edit);

//---------------------------------------------------------------
//
//---------------------------------------------------------------

// export default mockdata;
