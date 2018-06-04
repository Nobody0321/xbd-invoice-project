<template>
    <div class="invoice-list-wrapper">

        <div class="xbd-panel marginless">
            <div class="xbd-panel-content">
                <router-link to="/tab2">公司</router-link>
                &gt;
                <router-link to="/tab2/my_applyinvoice_list">我的报销</router-link>
                &gt;
                报销详情
            </div>
        </div>

        <div v-if="http_exec_invoice_over">
            <div v-if="applyinvoiceitem">

                <div class="fish-content-wrapper">
                    <div class="fish-content-seprate">
                    </div>

                    <ul class="ul-detail">
                        <li>
                            <div class="div-detail">
                                报销人:   {{applyinvoiceitem.sysusername}}
                            </div>
                        </li>
                        <li>
                            <div class="div-detail">
                                报销日期:   {{_format_date(applyinvoiceitem.createtime)}}
                            </div>
                        </li>
                        <li>
                            <div class="div-detail">
                                {{applyinvoiceitem.invoices_num}}张发票 共{{applyinvoiceitem.invoices_je}}元
                            </div>
                        </li>
                        <li>
                            <div class="div-detail">
                                报销用途:   {{applyinvoiceitem.porpose}}
                            </div>
                        </li>
                        <li>
                            <div class="div-detail" v-if="applyinvoiceitem.remark && applyinvoiceitem.remark.length > 0">
                                报销备注:   {{applyinvoiceitem.remark}}
                            </div>
                        </li>
                        <li v-if="applyinvoiceitem.approval_opinion && applyinvoiceitem.approval_opinion.length > 0">
                            <div class="div-detail">
                                审批回复:   {{applyinvoiceitem.approval_opinion}}
                            </div>
                        </li>
                    </ul>

                    <button type="button" class="btn btn-xbd-normal btn-xbd-small apply-btn"
                            v-if="applyinvoiceitem.approval_status==0"
                            @click="onResetApplyInvoice">撤回申请</button>
                </div>

                <div v-if="applyinvoiceitem.invoices && applyinvoiceitem.invoices.length > 0">
                    <ul class="page-infinite-list">
                        <li v-for="(invoiceitem, index) in applyinvoiceitem.invoices" class="page-infinite-listitem">
                            <InvoiceItem :clickInvoiceItemProxy="clickInvoiceItemProxy" :invoice="invoiceitem"></InvoiceItem>
                        </li>
                    </ul>
                </div>

                <!--<div class="save-data" v-if="applyinvoiceitem.approval_status!=1">-->
                    <!--<button type="button" class="btn btn-xbd-normal" :disabled="update_disable" @click="onUpdateApplyInvoice">更新</button>-->
                <!--</div>-->

            </div>
        </div>

        <toast v-model="toastStatus" width="20em" type="text" :time="2000" :position="toastPosition" is-show-mask>
            {{ toastmessage }}
        </toast>
    </div>
</template>

<script>
    import { Group, Cell, Popup, Toast, Actionsheet, XButton, TransferDomDirective as TransferDom, XDialog } from 'vux';

    import httpresource from '../../scripts/common-resource-vux';
    import commonformater from '../../scripts/common-formater';
    import InvoiceItem from './tab1_invoice_item'

    export default {
        //Part 1: props, data and computed;
        name: 'MyInoviceList',
        data: function () {
            return {
                http_exec_invoice_over: false,

                toastmessage: '',
                toastPosition: 'middle',
                toastStatus: false,

                invoiceid: 0,
                applyinvoiceitem: {
                    id: 0,
                    sysusername: "",
                    invoices: [],
                    invoices_num: 0,
                    invoices_je: 0,
                    porpose: "",
                    approval_status: 0,
                    approval_time: "",
                    approval_opinion: "",
                    remark: "",
                    createtime: "",
                    updatetime: "",
                    sysuser: 0,
                    config: 0,
                },
                update_disable: true,
                prevclickinvoiceid: -1,

            }
        },
        components: {
            Group,
            Cell,
            Popup,
            XButton,
            Toast,
            Actionsheet,
            XDialog,
            InvoiceItem,
        },

        //Part 2: lifecycle methods
        created: function () {
            console.log('my applyinvoice info created');
            let vm = this;

            vm.invoiceid = parseInt(vm.$route.params.invoiceid);

            vm._http_exec_applyinvoice_locate(vm.invoiceid);
        },
        mounted: function () {
            console.log('my applyinvoice info mounted');

        },
        computed: {
            store_debug: function () {
                var vm = this;
                return vm.$store.getters.debug;
            },
        },

        //Part 3: watch and methods;
        methods: {
            _format_date: function (sdate) {
                return commonformater.formatDate.format(new Date(sdate), 'yyyy-MM-dd');
            },

            getInvoiceTimeString(invoiceitem){
                if(invoiceitem){
                    let vm = this;
                    return vm._format_date(invoiceitem.createtime);
                }
            },

            clickInvoiceItemProxy(clickflag, invoice){

                console.log('clickInvoiceItemProxy clickflag=' + clickflag);
                console.log(invoice);

                let vm = this;

                if (clickflag == true){
                    vm.prevclickinvoiceid = invoice.id;

                    if ((invoice.hyzt > 0) && (invoice.hyjl)) {
                        vm.$router.push('/tab1/invoice_info/' + vm.prevclickinvoiceid + '?type=2');
                        vm.prevclickinvoiceid = -1;
                    }
                    else {
                        vm.showmenusheet = true;
                    }
                }
                else {
                    invoice.selectflag = !invoice.selectflag;
                    console.log('clickInvoiceItemProxy selectflag=' + invoice.selectflag);
                }
            },

            onResetApplyInvoice: function () {
                let vm = this;

                vm.$vux.confirm.show({
                    title: '撤回申请',
                    content: '撤回申请，您将无法报销此发票，确认要撤回吗?',
                    onShow () {
                        console.log('plugin show')
                    },
                    onHide () {
                        console.log('plugin hide')
                    },
                    onCancel () {
                        console.log('plugin cancel')
                    },
                    onConfirm () {
                        console.log('plugin confirm')
                        vm._http_exec_reset_applyinvoice();
                    }
                })
            },

            onUpdateApplyInvoice: function () {
                let vm = this;

                vm._http_exec_update_applyinvoice();
            },

            onBackToMyApplyInvoiceList: function () {
                let vm = this;

                vm.$router.push('/tab2/my_applyinvoice_list');
            },

            _http_exec_applyinvoice_locate: function(invoiceid) {
                console.log('_http_exec_applyinvoice_locate', invoiceid);

                var vm = this;

                var data = {'applyinvoiceid' : invoiceid};

                var promise = httpresource.applyinvoice_locate({},data);
                promise
                    .then((res)=> {
                        console.log(res);

                        if(res) {

                            var debug  = vm.store_debug;

                            if(debug) {
                                //for test
                                vm.invoiceid = res.id;
                            }

                            if (vm.invoiceid == res.id) {
                                vm.applyinvoiceitem = {};

                                vm.applyinvoiceitem.createtime = res.createtime;
                                vm.applyinvoiceitem.invoices_num = res.invoices_num;
                                vm.applyinvoiceitem.invoices_je = res.invoices_je;
                                vm.applyinvoiceitem.approval_status = res.approval_status;
                                vm.applyinvoiceitem.sysusername = res.sysusername;
                                vm.applyinvoiceitem.porpose = res.porpose;
                                vm.applyinvoiceitem.remark = res.remark;
                                vm.applyinvoiceitem.approval_opinion = res.approval_opinion;

//                                let tempselectenable = true;
//                                if (1 == vm.applyinvoiceitem.approval_status) {
//                                    tempselectenable = false;
//                                }

                                if (res.invoices && res.invoices.length > 0) {
                                    vm.applyinvoiceitem.invoices = [];

                                    for (var i = 0; i < res.invoices.length; i++) {
                                        let tempinvoice = res.invoices[i];
                                        if (tempinvoice) {
                                            vm.applyinvoiceitem.invoices.push({
                                                id: tempinvoice.id,
                                                hyzt: tempinvoice.hyzt,
                                                hyjl: tempinvoice.hyjl,
                                                fpdm: tempinvoice.fpdm,
                                                fphm: tempinvoice.fphm,
                                                je: tempinvoice.je,
                                                jshj: tempinvoice.jshj,
                                                bz_cffp: tempinvoice.bz_cffp,
                                                bz_jbxm: tempinvoice.bz_jbxm,
                                                bz_sfyc: tempinvoice.bz_sfyc,
                                                bz_gfyc: tempinvoice.bz_gfyc,
                                                kprq: tempinvoice.kprq,
                                                bx: tempinvoice.bx,
                                                selectenable: false,
                                            });
                                        }
                                    }
                                }

                                console.log(vm.applyinvoiceitem);
                            }

                        }

                        vm.http_exec_invoice_over = true;
                    })
                    .catch((res) => {
                        console.log('[ERROR]' + JSON.stringify(res, null, 4));

                        vm.http_exec_invoice_over = true;
                    });
            },

            _http_exec_reset_applyinvoice: function () {
                var vm = this;
                var body =
                    {
                        approval_opinion: "撤回申请",
                        approval_status: -2,
                    };

                console.log('_http_exec_reset_applyinvoice：body='+ body);

                var promise = httpresource.applyinvoice_update({}, {'applyinvoiceid':vm.invoiceid}, body);
                promise.then(
                    (res)=>{
                        console.log('[SUCCESS]' + JSON.stringify(res, null, 4));

                        vm.toastmessage = '撤回申请成功';
                        vm.toastStatus = true;

                        var t;
                        clearTimeout(t)
                        t = setTimeout(function (){
                            vm.onBackToMyApplyInvoiceList();
                        }, 1000);
                    }
                ).catch((res)=>{
                    console.log('[ERROR]' + JSON.stringify(res, null, 4));

                    vm.toastmessage = '撤回申请失败'+JSON.stringify(res, null, 4);
                    vm.toastStatus = true;
                });
            },

            _http_exec_update_applyinvoice: function () {
                var vm = this;

                var body =
                    {
                        approval_opinion: "撤回申请",
                        approval_status: -2,
                    };

                console.log('_http_exec_reset_applyinvoice：body='+ body);

                var promise = httpresource.applyinvoice_update({}, {'applyinvoiceid':vm.invoiceid}, body);
                promise.then(
                    (res)=>{
                        console.log('[SUCCESS]' + JSON.stringify(res, null, 4));

                        vm.toastmessage = '撤回申请成功';
                        vm.toastStatus = true;

                        var t;
                        clearTimeout(t)
                        t = setTimeout(function (){
                            vm.onBackToMyApplyInvoiceList();
                        }, 1000);
                    }
                ).catch((res)=>{
                    console.log('[ERROR]' + JSON.stringify(res, null, 4));

                    vm.toastmessage = '撤回申请失败'+JSON.stringify(res, null, 4);
                    vm.toastStatus = true;
                });
            },
        },
    }
</script>

<style scoped lang="less">
    .invoice-list-wrapper {
        width: 100%;
        background-color: #f5f5f5;
    }

    .page-infinite-list{
        padding-left:0;
        -webkit-padding-start: 0;
        margin: 0;
    }

    .page-infinite-listitem {
        /* height: 50px; */
        /* line-height: 50px; */
        /* border-bottom: solid 1px #eee; */
        width: 100%;
        text-align: center;
        list-style: none;
    }

    .page-infinite-loading{
        text-align: center;
        height: 50px;
        line-height: 50px;
        display:inline-block;
    }
    .page-infinite-loading > div {
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
    }

    .invoice-list-wrapper .fish-content-seprate
    {
        width: 100%;
        height: 10px;
    }

    .invoice-list-wrapper .fish-content-wrapper
    {
        margin: 5px 0 0 0;
        background: white;
    }

    .invoice-list-wrapper .fish-content-wrapper p
    {
        padding-left: 15px;
        padding-bottom: 18px;
        margin: 0;
        font-size: 18px;
        color: #000000;
    }

    .invoice-list-wrapper .fish-content-wrapper .ul-detail
    {
        list-style: none;
        padding: 0;
        margin: 5px 15px 0 0;
        li{
            margin-bottom: 15px;
            .div-detail{
                position: relative;
                padding-left: 10px;
                color: #000000;
                font-size: 18px;
            }
        }
    }

    .invoice-list-wrapper .apply-btn
    {
        position: absolute;
        top: 60px;
        right: 15px;
    }

    .invoice-list-wrapper .save-data{
        padding: 10px 5px;
    }

</style>
