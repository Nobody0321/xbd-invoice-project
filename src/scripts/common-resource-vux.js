/**
 * Created by Luther on 17/4/20.
 */

//
import { _http_define, _http_caller } from './common-httpcaller';

//
import '../mockjs/emulator-vux';

//
const PROXY = process.env.NODE_ENV == 'production';
// const PROXY = true;
const DEBUG = true;

//测试环境的接口
const http_defines_mock = {

    //-------------------------------------------------------------------------

    //微信查询用户信息接口
    wuser_locate        : new _http_define('GET','/zsw/wx_userinfo',false),

    //申请相关-------------------------------------------------------------------------

    //申请
    apply_invoice       : new _http_define('POST', '/local_zsw/local_zswapply/', false),
    //公司申请加入
    apply_company       : new _http_define('POST', '/local_zsw/local_zswschoolapply/', false),
    //获取公司列表
    company_list        : new _http_define('GET','/local_zsw/local_myschool/local_simple/', false),
    //获取部门列表  
    department_list     : new _http_define('GET','/local_zsw/local_department/local_simple/', false),

    //获取审批状态
    approval_user_status       : new _http_define('GET','/l_zsw/l_zswapply/l_applyinfo',false),
    //获取审批状态
    approval_company_status    : new _http_define('GET','/l_zsw/l_zswschoolapply/l_applyinfo',false),
    //取消申请 加入财税云发票
    withdraw_apply_invoice     : new _http_define('POST','/l_zsw/l_zswapply/l_cancelapply/',false),
    //取消申请 加入公司
    withdraw_apply_company     : new _http_define('POST','/l_zsw/l_zswschoolapply/l_cancelapply/',false),

    //公司相关-------------------------------------------------------------------------

    //查询公司详情
    company_locate       : new _http_define('GET','/local_zsw/local_company/',false),
    //退出公司
    company_quit         : new _http_define('PUT', '/local_zsw/quit_company/', false),

    //发票相关-------------------------------------------------------------------------

    //发票列表
    invoice_list        : new _http_define('GET','/local_zsw/local_invoice/invoice/',false),
    //查询发票详情
    invoice_locate      : new _http_define('GET','/local_zsw/local_invoice/{invoiceid}',false),
    //添加发票以供核验
    invoice_add         : new _http_define('POST','/local_zsw/local_invoice/invoice/',false),
    //删除发票
    invoice_delete      : new _http_define('DELETE','/local_zsw/local_invoice/{invoiceid}/',false),
    //查验发票
    invoice_check       : new _http_define('POST','/local_zsw/local_invoice/invoice/{invoiceid}/checkinvoice/',false),
    //修改发票备注
    invoice_fpms_edit   : new _http_define('PUT','/local_zsw/local_invoice/{invoiceid}/', false),//(methodname, endpoint, needtoken)    
    
    //报销相关-------------------------------------------------------------------------

    //报销列表
    applyinvoice_list        : new _http_define('GET','/local_zsw/local_invoice/applyinvoice/',false),
    //查询报销详情
    applyinvoice_locate      : new _http_define('GET','/local_zsw/local_applyinvoice/{applyinvoiceid}',false),
    //添加报销
    applyinvoice_add         : new _http_define('POST','/local_zsw/local_applyinvoice/applyinvoice/',false),
    //删除报销
    applyinvoice_delete      : new _http_define('DELETE','/local_zsw/local_applyinvoice/{applyinvoiceid}/',false),
    //更新报销
    applyinvoice_update      : new _http_define('PUT','/local_zsw/local_applyinvoice/{applyinvoiceid}/',false),
    //-------------------------------------------------------------------------

};
//生产环境
const http_defines_build = {

    //-------------------------------------------------------------------------

    //微信查询用户信息接口
    wuser_locate        : new _http_define('GET','/wechatserver/api/wechat_login_getuserinfo/',false),

    wjsapi_signer       : new _http_define('GET','/wechatserver/api/jsapiticketsign/{wechat_appid}/',false),

    //申请相关-------------------------------------------------------------------------

    //申请
    apply_invoice       : new _http_define('POST', '/wechatserver/api/applyinfo/', true),
    //公司申请加入
    apply_company       : new _http_define('POST', '/wechatserver/api/schoolapplyinfo/', true),
    //获取公司列表
    company_list        : new _http_define('GET','/wechatserver/api/config/simple/', true),
    //获取部门列表  
    department_list     : new _http_define('GET','/wechatserver/api/department/simple/', true),

    //获取审批状态
    approval_user_status       : new _http_define('GET','/wechatserver/api/applyinfo/',true),
    //获取审批状态
    approval_company_status    : new _http_define('GET','/wechatserver/api/schoolapplyinfo/',true),
    //取消申请 加入财税云发票
    withdraw_apply_invoice     : new _http_define('POST','/wechatserver/api/cancelapply/',true),
    //取消申请 加入公司
    withdraw_apply_company     : new _http_define('POST','/wechatserver/api/schoolapplyinfo/cancelapply/',true),

    //公司相关-------------------------------------------------------------------------

    //查询公司详情
    company_locate       : new _http_define('GET','/wechatserver/api/config/',true),
    //退出公司
    company_quit         : new _http_define('PUT', '/wechatserver/api/sysuser/quitcompany/', true),

    //发票相关-------------------------------------------------------------------------

    //发票列表
    invoice_list        : new _http_define('GET','/invoice/invoice/', true),
    //查询发票详情
    invoice_locate      : new _http_define('GET','/invoice/invoice/{invoiceid}/', true),
    //添加发票
    invoice_add         : new _http_define('POST','/invoice/invoice/',true),
    //删除发票
    invoice_delete      : new _http_define('DELETE','/invoice/invoice/{invoiceid}/', true),
    //查验发票
    invoice_check       : new _http_define('POST','/invoice/invoice/{invoiceid}/checkinvoice/', true),
    //修改发票备注
    invoice_fpms_edit   : new _http_define('PUT','/invoice/invoice/{invoiceid}/', true),//(methodname, endpoint, needtoken)
    //报销相关-------------------------------------------------------------------------

    //报销列表
    applyinvoice_list        : new _http_define('GET','/invoice/applyinvoice/', true),
    //查询报销详情
    applyinvoice_locate      : new _http_define('GET','/invoice/applyinvoice/{applyinvoiceid}/', true),
    //添加报销
    applyinvoice_add         : new _http_define('POST','/invoice/applyinvoice/', true),
    //删除报销
    applyinvoice_delete      : new _http_define('DELETE','/invoice/applyinvoice/{applyinvoiceid}/', true),
    //更新报销
    applyinvoice_update      : new _http_define('PUT','/invoice/applyinvoice/{applyinvoiceid}/', true),

    //-------------------------------------------------------------------------

    //文件相关
    file_header         : new _http_define('GET','/api/file/redirecturl',false),

    //-------------------------------------------------------------------------


};


var urlbase = '';
// var urlbase = 'http://localhost:8010';
// var urlbase = 'http://ysbd-dev.xbdedu.cn';
// var urlbase = 'https://api.douban.com/v2';
let http_callers = new _http_caller(PROXY?http_defines_build:http_defines_mock, urlbase, true, false, DEBUG);

export default http_callers