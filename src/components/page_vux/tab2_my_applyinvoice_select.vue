<template>
    <div class="invoice-list-wrapper">

        <div class="xbd-panel marginless">
            <div class="xbd-panel-content">
                <router-link to="/tab2">公司</router-link>
                &gt;
                <router-link to="/tab2/my_applyinvoice_list">我的报销</router-link>
                &gt;
                新增报销
            </div>
        </div>

        <div v-infinite-scroll="_on_infinite_latest"
             infinite-scroll-disabled="notmore" infinite-scroll-distance="10">

            <div v-if="http_exec_invoice_over">
                <div v-if="invoicelist && invoicelist.length > 0">

                    <div class="fish-content-wrapper">
                        <p>报销单</p>
                    </div>

                    <group :gutter="0" title="报销用途">
                        <x-input placeholder="请填写报销用途，如差旅费" v-model="apply_porpose" required></x-input>
                    </group>

                    <group :gutter="0" title="备注">
                        <x-input placeholder="请填写备注信息" v-model="apply_remark"></x-input>
                        <!--<x-textarea :max="200" placeholder="请填写备注信息"-->
                                    <!--v-model="apply_remark"-->
                                    <!--:show-counter="true" :height="100" :rows="4" :cols="30">-->
                        <!--</x-textarea>-->
                    </group>

                    <div class="fish-content-seprate">
                    </div>

                    <ul class="page-infinite-list">
                        <li v-for="(invoiceitem, index) in invoicelist" class="page-infinite-listitem">
                            <InvoiceItem :clickInvoiceItemProxy="clickInvoiceItemProxy" :invoice="invoiceitem"></InvoiceItem>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="speed-apply-invoice">
            <p class="apply-no-invoice">选择了{{apply_invoice_num}}张发票<br>共{{apply_invoice_je}}元</p>
            <button type="button" class="btn btn-xbd-normal btn-xbd-small apply-btn" :disabled="apply_disable" @click="onApplyInvoices">提交报销</button>
        </div>

        <toast v-model="toastStatus" width="20em" type="text" :time="2000" :position="toastPosition" is-show-mask>
            {{ toastmessage }}
        </toast>
    </div>
</template>

<script>
    import { Group, Cell, XInput, XTextarea, Popup, Toast, Actionsheet, XButton, TransferDomDirective as TransferDom, XDialog } from 'vux';

    import httpresource from '../../scripts/common-resource-vux';
    import commonformater from '../../scripts/common-formater';
    import infiniteScroll from 'vue-infinite-scroll'
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

                apply_disable: true,

                apply_porpose: '',
                apply_remark: '',
                apply_invoice_num: 0,
                apply_invoice_je: '0',

                invoicelist: [],

                count: 0,
                offset: 0,
                limit: 8,
                notmore: false,
                loading: false,
                hasloaded: false,

                prevclickinvoiceid: -1,
            }
        },
        directives: {
            TransferDom,
            infiniteScroll,
        },
        components: {
            Group,
            Cell,
            XInput,
            XTextarea,
            Popup,
            XButton,
            Toast,
            Actionsheet,
            XDialog,
            InvoiceItem,
        },

        //Part 2: lifecycle methods
        created: function () {
            console.log('my applyinvoice select created');

        },
        mounted: function () {
            console.log('my applyinvoice select mounted');
            let vm = this;

            vm._http_exec_applyinvoice_refresh();
        },
        computed: {
            store_debug: function () {
                var vm = this;
                return vm.$store.getters.debug;
            },
        },

        //Part 3: watch and methods;
        watch: {
            apply_porpose: function (val) {
                this.isDisableApplyButton();
            },
            apply_invoice_num: function (val) {
                this.isDisableApplyButton();
            },
            apply_invoice_je: function (val) {
                this.isDisableApplyButton();
            },
        },

        methods: {
            _format_date: function (sdate) {
                return commonformater.formatDate.format(new Date(sdate), 'yyyy-MM-dd');
            },

            clickInvoiceItemProxy(clickflag, invoice){
                console.log('clickInvoiceItemProxy clickflag=' + clickflag);
                console.log(invoice);

                let vm = this;

                if (clickflag == true){
                    vm.prevclickinvoiceid = invoice.id;

                    if ((invoice.hyzt > 0) && (invoice.hyjl)) {
                        vm.$router.push('/tab1/invoice_info/' + vm.prevclickinvoiceid);
                        vm.prevclickinvoiceid = -1;
                    }
                    else {
                        vm.showmenusheet = true;
                    }
                }
                else {
                    invoice.selectflag = !invoice.selectflag;

                    var jine = 0;

                    if (true == invoice.selectflag) {
                        vm.apply_invoice_num += 1;

                        jine = parseFloat(vm.apply_invoice_je);
                        jine += invoice.jshj;

                        vm.apply_invoice_je = Number(jine).toFixed(2);
                    }
                    else {
                        if (vm.apply_invoice_num >= 1) {
                            vm.apply_invoice_num -= 1;

                            jine = parseFloat(vm.apply_invoice_je);
                            jine -= invoice.jshj;

                            vm.apply_invoice_je = Number(jine).toFixed(2);
                        }
                    }
                }
            },

            isDisableApplyButton: function () {
                let vm = this;

                vm.apply_disable = !((vm.apply_invoice_num > 0) &&
                    (vm.apply_invoice_num > 0) &&
                    (vm.apply_porpose) &&
                    (vm.apply_porpose.length > 0));

            },

            onApplyInvoices () {
                let vm = this;
                
                if(false == vm.apply_disable) {
                    vm._http_exec_post_applyinvoice();
                }
                else {
                    vm.toastmessage = '请先新增发票';
                    vm.toastStatus = true;
                }
            },

            _on_infinite_latest: function () {
                console.log('_on_infinite_latest');

                var vm = this;

                if (vm.loading) return;
                vm.loading = true;

                vm._http_exec_applyinvoice_list(vm.offset, vm.limit);
            },

            _http_exec_applyinvoice_refresh: function () {
                let vm = this;

                //初始化
                vm.notmore = false;
                vm.loading = false;
                vm.offset = 0;
                vm.limit = 8;

                vm._on_infinite_latest();
            },

            _http_exec_applyinvoice_list: function (offset, limit) {

                console.log('---http exec invoice list---offset=' + offset + '---limit=' + limit);

                let vm = this;

                // # -1 验证失败或假票 0 未验证 1 真票未报销 2 真票已报销未审批通过 3 真票已审批通过[1包含2的发票]
                var params = {'invoicetype':1, 'kjfp':1, 'offset': offset, 'limit': limit};

                console.log(params);

                var promise = httpresource.invoice_list(params);

                promise
                    .then((res) => {
                        console.log(res);

                        vm.hasloaded = true;
                        vm.loading = false;

                        var tempinvoicelist = [];

                        if (res && res.count > 0) {
                            for (var i = 0; i < res.results.length; i++) {
                                let tempinvoice = res.results[i];
                                if (tempinvoice) {
                                    tempinvoicelist.push({
                                        id: tempinvoice.id,
                                        hyzt: tempinvoice.hyzt,
                                        hyjl: tempinvoice.hyjl,
                                        fpdm: tempinvoice.fpdm,
                                        fphm: tempinvoice.fphm,
                                        je: parseFloat(tempinvoice.je),
                                        jshj: parseFloat(tempinvoice.jshj),
                                        bz_cffp: tempinvoice.bz_cffp,
                                        bz_jbxm: tempinvoice.bz_jbxm,
                                        bz_sfyc: tempinvoice.bz_sfyc,
                                        bz_gfyc: tempinvoice.bz_gfyc,
                                        kprq: tempinvoice.kprq,
                                        bx: tempinvoice.bx,
                                        hwxx: tempinvoice.hwxx,
                                        selectenable: true,
                                        selectflag: false,
                                    });
                                }
                            }
                        }

                        if (vm.offset <= 0) {
                            vm.invoicelist = tempinvoicelist;
                        }
                        else {
                            vm.invoicelist = vm.invoicelist.concat(tempinvoicelist);
                        }

                        console.log(vm.invoicelist);

                        vm.offset = vm.invoicelist.length;
                        vm.count = res.count;
                        vm.notmore = vm.offset >= vm.count;

                        vm.http_exec_invoice_over = true;
                    })
                    .catch((res) => {
                        console.log('[ERROR]' + JSON.stringify(res, null, 4));

                        vm.loading = false;
                        vm.http_exec_invoice_over = true;
                    });
            },

            _http_exec_post_applyinvoice: function () {
                console.log('_http_exec_post_applyinvoice');

                var vm = this;

                console.log(vm.invoicelist);

                var tempinvoicesstr = '';
                var tempstr = '';

                for (var i = 0; i < vm.invoicelist.length; i++) {
                    let tempinvoice = vm.invoicelist[i];
                    if (tempinvoice && tempinvoice.id > 0 && true == tempinvoice.selectflag) {
                        tempstr = '';
                        tempstr = tempinvoice.id+'';
                        if (tempinvoicesstr.length > 0) {
                            tempinvoicesstr = tempinvoicesstr + ',' + tempstr;
                        }
                        else {
                            tempinvoicesstr = tempstr;
                        }
                    }
                }

                var body =
                    {
                        invoicestr: tempinvoicesstr,
                        porpose: vm.apply_porpose,
                        remark: vm.apply_remark
                    };

                console.log('_http_exec_reset_applyinvoice：body=');
                console.log(body);

                var promise = httpresource.applyinvoice_add({}, {}, body);
                promise.then(
                    (res)=>{
                        console.log('[SUCCESS]' + JSON.stringify(res, null, 4));

                        vm.toastmessage = '新增报销成功';
                        vm.toastStatus = true;

                        var t;
                        clearTimeout(t)
                        t = setTimeout(function (){
                            vm.$router.push('/tab2/my_applyinvoice_list');
                        }, 1000);
                    }
                ).catch((res)=>{
                    console.log('[ERROR]' + JSON.stringify(res, null, 4));

                    vm.toastmessage = '新增报销失败'+JSON.stringify(res, null, 4);
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

    .invoice-list-wrapper .fish-content-wrapper
    {
        padding: 0 0 1px 0;
        /*background: white;*/
    }

    .invoice-list-wrapper .fish-content-wrapper p
    {
        padding-left: 15px;
        padding-bottom: 5px;
        margin: 0;
        font-size: 22px;
        color: #232627;
        text-align: center;
    }

    .invoice-list-wrapper .fish-content-seprate
    {
        width: 100%;
        height: 10px;
    }

    /*.invoice-list-wrapper.weui-cells*/
    /*{*/
        /*margin-top: 0;*/
    /*}*/


    /*.invoice-list-wrapper .weui-cells label*/
    /*{*/
        /*font-weight: normal;*/
        /*margin-top: 4px;*/
        /*font-size: 18px;*/
    /*}*/

    .page-infinite-list{
        padding-left:0;
        -webkit-padding-start: 0;
        margin: 0 0 60px 0;
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

    .invoice-list-wrapper .group_style {
        margin-bottom: 53px;
    }

    .invoice-list-wrapper .weui-cell {
        /*padding-top: 8px;
        padding-bottom: 8px;*/
        /*height: 70px;*/
        /*line-height: 40px;*/
    }

    .speed-apply-invoice
    {
        background: lightgrey;
        position: fixed;
        width: 100%;
        height: 60px;
        bottom: 0px;
    }

    .speed-apply-invoice .apply-no-invoice
    {
        position: fixed;
        /*text-align: center;*/
        bottom: -3px;
        left:15px;
        font-size: 17px;
    }

    .speed-apply-invoice .apply-btn
    {
        position: fixed;
        bottom: 8px;
        right: 15px;
    }

</style>
