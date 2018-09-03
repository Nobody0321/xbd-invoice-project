<template>
    <div class="card" :invoice="invoice" @click="clickInvoiceContent" v-if="(!invoice.bx)">
        <div  v-if="invoice.zfbz"  class="card-header">
            <span class="flag_invoice red_bk" >作废</span>
            <span class="fpmc">{{get_swjg_from_fpdm(invoice.fpdm)}}&nbsp;{{get_fplx_from_fpdm(invoice.fpdm)[1]}}</span>

            <div v-if="invoice.selectenable">
                <div v-if="true == invoice.selectflag">
                    <img style="width: 20px;height: 20px" src="../../../static/images/btn-check-on.png">
                </div>
                <div v-else>
                    <img style="width: 20px;height: 20px" src="../../../static/images/btn-check-off.png">
                </div>
            </div>

        </div>
        <div v-else class="card-header">
            <span class="flag_invoice blue_bk" v-if="((invoice.hyzt<=0)&&(invoice.cysj==''))">核验中</span>
            <span class="flag_invoice green_bk" v-if="((invoice.cysj)&&(invoice.hyjl))">真</span>
            <span class="flag_invoice red_bk" v-if="((invoice.cysj)&&(!invoice.hyjl))">失败</span>
            <span class="fpmc">{{get_swjg_from_fpdm(invoice.fpdm)}}&nbsp;{{get_fplx_from_fpdm(invoice.fpdm)[1]}}</span>

            <div v-if="invoice.selectenable">
                <div v-if="true == invoice.selectflag">
                    <img style="width: 20px;height: 20px" src="../../../static/images/btn-check-on.png">
                </div>
                <div v-else>
                    <img style="width: 20px;height: 20px" src="../../../static/images/btn-check-off.png">
                </div>
            </div>

        </div>
        <div class="card-content" >
            <div class="card-content-inner"  >
                <div>
                    <span class="bz_invoice2" style="font-size:14px;">代码</span>
                    <span style="font-size:17px;">{{ invoice.fpdm }}</span>

                    <span class="bz_invoice2" style="font-size:14px;margin-left:20px">号码</span>
                    <span style="font-size:17px;">{{ invoice.fphm }}</span>
                </div>

                <div>
                    <!-- 用查验时间来判断是不是第一次查验，重新查验后hyzt可能会出错 -->
                    <span class="bz_invoice blue_bk"
                          v-if="((invoice.cysj!=null)&&(invoice.hyjl)&&(!invoice.bz_cffp))">无重复票</span>
                    <span class="bz_invoice red_bk"
                          v-if="((invoice.cysj!=null)&&(invoice.hyjl)&&(invoice.bz_cffp))">重复发票</span>

                    <span class="bz_invoice blue_bk"
                          v-if="((invoice.cysj!=null)&&(invoice.hyjl)&&(!invoice.bz_jbxm))">无禁报项</span>
                    <span class="bz_invoice red_bk"
                          v-if="((invoice.cysj!=null)&&(invoice.hyjl)&&(invoice.bz_jbxm))">有禁报项</span>

                    <span class="bz_invoice blue_bk"
                          v-if="((invoice.cysj!=null)&&(invoice.hyjl)&&(!invoice.bz_sfyc))">销方正常</span>
                    <span class="bz_invoice red_bk"
                          v-if="((invoice.cysj!=null)&&(invoice.hyjl)&&(invoice.bz_sfyc))">销方异常</span>

                    <span class="bz_invoice blue_bk"
                          v-if="((invoice.cysj!=null)&&(invoice.hyjl)&&(!invoice.bz_gfyc))">购方正常</span>
                    <span class="bz_invoice red_bk"
                          v-if="((invoice.cysj!=null)&&(invoice.hyjl)&&(invoice.bz_gfyc))">购方异常</span>
                </div>
            </div>
      
           
            <div style="text-align: left;padding-left: 12px;">
                <span style="font-size:13px;">
                    {{invoice.fpms}}
                </span>
            </div>
        </div>

        <div class="card-footer">
            <span>开票日期:{{invoice.kprq}}</span>
            <span style="padding-left: 3px">金额:{{invoice.jshj}}</span>

            <mt-badge type="primary" size="small" color="#25c6fc" style="padding:0px 2px;font-weight:bold;">
                未报销
            </mt-badge>
        </div>
    </div>


    <div class="card" :invoice="invoice" @click="clickInvoiceContent"  style="background-color:#E8E8E8;"  v-else>
        
        <div  v-if="(invoice.zfbz==true)"  class="card-header">
            <span class="flag_invoice green_bk" >作废</span>
            <span class="fpmc">{{get_swjg_from_fpdm(invoice.fpdm)}}&nbsp;{{get_fplx_from_fpdm(invoice.fpdm)[1]}}</span>

            <div v-if="invoice.selectenable">
                <div v-if="true == invoice.selectflag">
                    <img style="width: 20px;height: 20px" src="../../../static/images/btn-check-on.png">
                </div>
                <div v-else>
                    <img style="width: 20px;height: 20px" src="../../../static/images/btn-check-off.png">
                </div>
            </div>

        </div>

        <div v-else class="card-header">
            <span class="flag_invoice blue_bk" v-if="invoice.hyzt<=0">核验中</span>
            <span class="flag_invoice green_bk" v-if="((invoice.hyzt>0)&&(invoice.hyjl))">真</span>
            <span class="flag_invoice red_bk" v-if="((invoice.hyzt>0)&&(!invoice.hyjl))">失败</span>
            <span class="fpmc">{{get_swjg_from_fpdm(invoice.fpdm)}}&nbsp;{{get_fplx_from_fpdm(invoice.fpdm)[1]}}</span>

            <div v-if="invoice.selectenable">
                <div v-if="true == invoice.selectflag">
                    <img style="width: 20px;height: 20px" src="../../../static/images/btn-check-on.png">
                </div>
                <div v-else>
                    <img style="width: 20px;height: 20px" src="../../../static/images/btn-check-off.png">
                </div>
            </div>

        </div>


        <div class="card-content" >
            <div class="card-content-inner"  >
                <div>
                    <span class="bz_invoice2" style="font-size:14px;">代码</span>
                    <span style="font-size:17px;">{{ invoice.fpdm }}</span>

                    <span class="bz_invoice2 " style="font-size:14px;margin-left:20px">号码</span>
                    <span style="font-size:17px;">{{ invoice.fphm }}</span>
                </div>

                <div>
                    <span class="bz_invoice blue_bk"
                          v-if="((invoice.cysj!=null)&&(invoice.hyjl)&&(!invoice.bz_cffp))">无重复票</span>
                    <span class="bz_invoice red_bk"
                          v-if="((invoice.cysj!=null)&&(invoice.hyjl)&&(invoice.bz_cffp))">重复发票</span>

                    <span class="bz_invoice blue_bk"
                          v-if="((invoice.cysj!=null)&&(invoice.hyjl)&&(!invoice.bz_jbxm))">无禁报项</span>
                    <span class="bz_invoice red_bk"
                          v-if="((invoice.cysj!=null)&&(invoice.hyjl)&&(invoice.bz_jbxm))">有禁报项</span>

                    <span class="bz_invoice blue_bk"
                          v-if="((invoice.cysj!=null)&&(invoice.hyjl)&&(!invoice.bz_sfyc))">销方正常</span>
                    <span class="bz_invoice red_bk"
                          v-if="((invoice.cysj!=null)&&(invoice.hyjl)&&(invoice.bz_sfyc))">销方异常</span>

                    <span class="bz_invoice blue_bk"
                          v-if="((invoice.cysj!=null)&&(invoice.hyjl)&&(!invoice.bz_gfyc))">购方正常</span>
                    <span class="bz_invoice red_bk"
                          v-if="((invoice.cysj!=null)&&(invoice.hyjl)&&(invoice.bz_gfyc))">购方异常</span>
                </div>
            </div>
      
           
            <div style="text-align: left;padding-left: 12px;">
                <span style="font-size:13px;">
                    {{invoice.fpms}}
                </span>
            </div>
        </div>

        <div class="card-footer">
            <span>开票日期:{{invoice.kprq}}</span>
            <span style="padding-left: 3px">金额:{{invoice.jshj}}</span>

            <mt-badge type="primary" size="small" color="#E8E8E8" style="padding:0px 2px;font-weight:bold;color:#000000">
                已报销
            </mt-badge>
        </div>
    </div>
    </template>

<script>
    import invoices from '../../scripts/invoices';

    export default {
        name: 'InvoiceItem',
        props: {
            invoice: {},
            clickInvoiceItemProxy: {
                type: Function,
                default() { }
            }
        },
        data () {
            return {}
        },
        methods: {
            get_swjg_from_fpdm: function (fpdm) {
                return invoices.get_swjg_from_fpdm(fpdm);
            },
            get_fplx_from_fpdm: function (fpdm) {
                return invoices.get_fplx_from_fpdm(fpdm);
            },
            //由于界面改动，下面这个函数用不到了
            get_hwxx_from_invoice: function (hwxx) {
                var hwxxstr = '';
                if (hwxx && hwxx.length > 0) {
                    for (var i = 0; i < hwxx.length; i++) {
                        let temphwxx = hwxx[i];

                        if (temphwxx.mc.length > 0) {
                            hwxxstr =  temphwxx.mc;
                            break;
                        }
                        else {
                            hwxxstr = '信息不详';
                        }
                    }

                    if (hwxx.length > 1) {
                        hwxxstr += ' 等'+ hwxx.length +'项';
                    }
                }

                return hwxxstr;
            },

            clickInvoiceHeader(){
                console.log('clickInvoiceHeader');

                let vm = this;
                if (true == vm.invoice.selectenable) {
                    //vm.$emit("clickInvoiceItemProxy", false, vm.invoice);

                    vm.clickInvoiceItemProxy(false, vm.invoice);
                }
            },

            clickInvoiceContent(){
                console.log('clickInvoiceContent');

                let vm = this;
                if (true == vm.invoice.selectenable) {
                    //vm.$emit("clickInvoiceItemProxy", true, vm.invoice);

                    vm.clickInvoiceItemProxy(false, vm.invoice);
                }
                else {
                    vm.clickInvoiceItemProxy(true, vm.invoice);
                }
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

    .blue_bk {
        // background-color: #26a2ff;
        background-color:#25c6fc;
    }

    .green_bk {
        background-color: #4caf50;
    }

    .red_bk {
        // background-color: #f44336;
        background-color:#ff534d;
    }

    .grey_bk {
        background-color: #ccc;
    }

    .flag_invoice {
        font-size: 12px;
        padding: 0 4px 0 2px;
        color: #fff;
        position: absolute;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
    }

    .bz_invoice {
        font-size: 12px;
        padding: 0 4px 0 2px;
        color: #fff;
        border-radius: 12px;
    }

    .bz_invoice2 {
        font-size: 14px;
        padding: 0 4px 0 2px;
        font-weight:bold;
        border-radius: 12px;
    }

    .fpmc {
        padding-left: 50px;
        font-size: 17px;
    }

    .card {
        background: #fff;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
        margin: 10px;
        position: relative;
        border-radius: 8px;
        border-style:outset;
        font-size: 17px;
    }

    .card-header {
        display: block;
    }

    .card-content {
        position: relative;
    }

    .card-content-inner {
        padding: 12px;
        position: relative;
        text-align: left;
        word-break: break-all;
    }

    pre {
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .card-content-inner > p:first-child {
        margin-top: 0;
    }

    .card-content-inner > p:last-child {
        margin-bottom: 0;
    }

    .card-content-inner > .list-block,
    .card-content-inner > .content-block {
        margin: -12px;
    }

    .card-header,
    .card-footer {
        min-height: 36px;
        position: relative;
        padding: 10px 12px;
        box-sizing: border-box;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: justify;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
    }

    .card-header {
        padding-left: 0;
    }

    .card-header[valign="top"],
    .card-footer[valign="top"] {
        -webkit-box-align: start;
        -webkit-align-items: flex-start;
        align-items: flex-start;
    }

    .card-header[valign="bottom"],
    .card-footer[valign="bottom"] {
        -webkit-box-align: end;
        -webkit-align-items: flex-end;
        align-items: flex-end;
    }

    .card-header a.link,
    .card-footer a.link {
        line-height: 36px;
        height: 36px;
        text-decoration: none;
        position: relative;
        margin-top: -5px;
        margin-bottom: -5px;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: start;
        -webkit-justify-content: flex-start;
        justify-content: flex-start;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        -webkit-transition-duration: 300ms;
        transition-duration: 300ms;
    }

    html:not(.watch-active-state) .card-header a.link:active,
    html:not(.watch-active-state) .card-footer a.link:active,
    .card-header a.link.active-state,
    .card-footer a.link.active-state {
        opacity: 0.3;
        -webkit-transition-duration: 0ms;
        transition-duration: 0ms;
    }

    .card-header a.link i + span,
    .card-footer a.link i + span,
    .card-header a.link i + i,
    .card-footer a.link i + i,
    .card-header a.link span + i,
    .card-footer a.link span + i,
    .card-header a.link span + span,
    .card-footer a.link span + span {
        margin-left: 3px;
    }

    .card-header a.link i.icon,
    .card-footer a.link i.icon {
        display: block;
    }

    .card-header a.icon-only,
    .card-footer a.icon-only {
        min-width: 36px;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        margin: 0;
    }

    .card-header {
        border-radius:1px 1px 0 0;
        font-size: 14px;
    }

    .card-header:after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        right: auto;
        top: auto;
        height: 1px;
        width: 100%;
        background-color: #e1e1e1;
        display: block;
        z-index: 15;
        -webkit-transform-origin: 50% 100%;
        transform-origin: 50% 100%;
    }

    .card-header .card-cover {
        width: 100%;
        display: block;
    }

    .card-header.no-border:after {
        display: none;
    }

    .card-header.no-padding {
        padding: 0;
    }

    .card-footer {
        border-radius: 0 0 1px 1px;
        color: #5f646e;
    }

    .card-footer:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: auto;
        right: auto;
        height: 1px;
        width: 100%;
        background-color: #e1e1e1;
        display: block;
        z-index: 15;
        -webkit-transform-origin: 50% 0%;
        transform-origin: 50% 0%;
    }

    .card-header ul{
        margin: 0px;
        padding: 0px;
        li{
            line-height: 0px;
            padding-top: 0;
            padding-bottom: 0px;
            list-style-type:none;
        }
    }

    .card-header .w-form-cells
    {
        margin-top: 0px;
        /*margin-bottom: -20px;*/
    }
    .card-header .w-form-cells:after
    {
        border-bottom: none;
    }

    .card-header .weui-cells
    {
        font-size: 16px;
    }
    .card-header .weui-cells:before
    {
        border-top: none;
    }
    .card-header .weui-cell
    {
        font-size: 16px;
        padding: 0 15px;
    }
    .card-header .weui-cell:before
    {
        border-top: none;
    }
    /*按钮*/
    .card-header .w-radio
    {
        display: none;
    }
    .card-header .w-radio-input
    {
        width: 20px;
        height: 20px;
        background-image: url('../../../static/images/btn-radio-off.png');
        background-size: cover;
        display: inline-block;
        margin-right: 10px;
        /*margin-top: -1px;*/
        line-height: 1px;
    }
    .card-header .w-radio:checked + .w-radio-input:after
    {
        background-image: url('../../../static/images/btn-radio-on.png');
        background-size: cover;
        width: 20px;
        height: 20px;
        content: "";
        display: inline-block;
    }
    .card-header .w-check
    {
        display: none;
    }
    .card-header .w-check-input
    {
        width: 20px;
        height: 20px;
        background-image: url('../../../static/images/btn-check-off.png');
        background-size: cover;
        display: inline-block;
        margin-right: 10px;
        /*margin-top: -1px;*/
        line-height: 1px;
    }
    .card-header .w-check:checked + .w-check-input:after
    {
        background-image: url('../../../static/images/btn-check-on.png');
        background-size: cover;
        width: 20px;
        height: 20px;
        content: "";
        display: inline-block;
    }
</style>
