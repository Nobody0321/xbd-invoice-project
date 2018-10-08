<template>
    <div class="applyinvoice-list-wrapper">

        <div class="xbd-panel marginless">
            <div class="xbd-panel-content">
                <router-link to="/tab2">公司</router-link>
                &gt;
                我的报销
            </div>
        </div>

        <div v-infinite-scroll="_on_infinite_latest"
             infinite-scroll-disabled="notmore" infinite-scroll-distance="10">

            <div v-if="http_exec_applyinvoice_over">
                <div v-if="applyinvoiceist && applyinvoiceist.length > 0">
                    <group :gutter="5" class="group_style">
                        <template v-for="(invoiceitem, index) in applyinvoiceist" >
                            <cell :border-intent="false" @click.native=onClickApplyInvoiceCell(index)>
                                <div slot="title" class="fish_name">
                                    <p>报销日期：{{getInvoiceTimeString(invoiceitem)}}</p>
                                </div>

                                <div slot="inline-desc" class="fish_time">
                                    <p>{{invoiceitem.invoices_num}}张发票  {{invoiceitem.invoices_je}}元</p>
                                </div>

                                <div slot="value"  class="will-container" :style="getApprovalStatusStyle(invoiceitem.approval_status)">
                                    <p>{{getApprovalStatusString(invoiceitem.approval_status)}}</p>
                                </div>
                            </cell>

                        </template>
                    </group>
                </div>

                <div class="task-nodata text-center" v-else>
                    <img src="../../../static/images/image-fish-holder.png" />
                    <p>您还没有报销记录，<br>请点击下方的“新增报销”开始报销！</p>
                </div>
            </div>

        </div>

        <div class="speed-apply-invoice">
            <p class="apply-no-invoice" v-if="apply_disable">无可报销发票</p>
            <p class="apply-no-invoice" v-else>有可报销的发票噢</p>
            <button type="button" class="btn btn-xbd-normal btn-xbd-small apply-btn" :disabled="apply_disable" @click="onApplyInvoices">新增报销</button>
        </div>

        <toast v-model="toastStatus" width="20em" type="text" :time="2000" :position="toastPosition" is-show-mask> {{ toastmessage }} </toast>
    </div>
</template>

<script>
    import { Group, Cell, Popup, Toast, Search, Flexbox, FlexboxItem,  ColorPicker, Flow, FlowState, FlowLine, XButton, TransferDomDirective as TransferDom, XDialog } from 'vux';
    import httpresource from '../../scripts/common-resource-vux';
    import commonformater from '../../scripts/common-formater';
    import infiniteScroll from 'vue-infinite-scroll'

    export default {
        //Part 1: props, data and computed;
        name: 'YuTangAIList',
        data: function () {
            return {
                http_exec_applyinvoice_over: false,

                apply_disable: true,

                toastmessage : '' ,
                toastPosition : 'middle',
                toastStatus : false ,

                applyinvoiceist:[],

                count: 0,
                offset: 0,
                limit: 8,
                notmore: false,
                loading: false,
                hasloaded: false,

            }
        },
        directives: {
            TransferDom,
            infiniteScroll,
        },
        components: {
            Group,
            Cell,
            Popup,
            XButton,
            Toast,
            Flexbox,
            FlexboxItem,
            ColorPicker,
            Flow,
            FlowState,
            FlowLine,
            XDialog,
        },

        //Part 2: lifecycle methods
        created: function() {
            console.log('my expenses created');

            let vm = this;

            vm._http_exec_invoice_list(0, 10);
        },
        mounted: function() {
            console.log('my expenses mounted');
            let vm = this;

            vm._http_exec_expenses_refresh();
        },
        computed: {
            store_debug: function () {
                var vm = this;
                return vm.$store.getters.debug;
            },
        },

        //Part 3: watch and methods;
        methods: {
            _format_date: function(sdate) {
                return commonformater.formatDate.format(new Date(sdate),'yyyy-MM-dd');
            },

            getInvoiceTimeString(invoiceitem){
                if(invoiceitem){
                    let vm = this;
                    return vm._format_date(invoiceitem.createtime);
                }
            },

            getApprovalStatusStyle : function(status){
                switch (status)
                {
                    case -2 :
                        return 'background: #ff6666';
                    case -1 :
                        return 'background: #99cc33';
                    case 0 :
                        return 'background: #dddddd';
                    case 1 :
                        return 'background: #ffcc00';
                    case 2 :
                        return 'background: #3399ff';
                    case 3 :
                        return 'background: #33cccc';
                    default :
                        return 'background: #dddddd';
                }
            },

            getApprovalStatusString(status){
                switch (status){
                    case -2:
                        return "已撤回";
                        break;
                    case -1:
                        return "未通过";
                        break;
                    case 0:
                        return "审核中";
                        break;
                    case 1:
                        return "已报销";
                        break;
                    case 2:
                        return "未通过";
                        break;
                    case 3:
                        return "已撤回";
                        break;
                }
            },

            onClickApplyInvoiceCell (index) {

                console.log('on click applyinvoice cell' + index);

                let vm = this;

                if(index>=0 && index<vm.applyinvoiceist.length){
                    var applyinvoicedata = vm.applyinvoiceist[index];

                    let invoiceid = applyinvoicedata.id;

                    if(invoiceid > 0) {
                        vm.$router.push('/tab2/my_applyinvoice_info/' + invoiceid);
                    }
                }
            },

            onApplyInvoices () {
                let vm = this;

                if(false == vm.apply_disable) {
                    vm.$router.push('/tab2/my_applyinvoice_select');
                }
                else {
                    vm.toastmessage = '请先新增发票';
                    vm.toastStatus = true;
                }
            },

            _on_infinite_latest: function () {
                console.log('_on_infinite_latest');

                var vm = this;

                if(vm.loading) return;
                vm.loading = true;

                vm._http_exec_expenses_list(vm.offset, vm.limit);
            },

            _http_exec_expenses_refresh: function () {
                let vm = this;

                //初始化
                vm.notmore = false;
                vm.loading = false;
                vm.offset = 0;

                vm._on_infinite_latest();
            },

            _http_exec_expenses_list: function(offset, limit) {

                console.log('---http exec expenses list---offset='+ offset + '---limit='+ limit);

                let vm = this;

                var params = {'offset' : offset, 'limit' : limit};

                console.log(params);

                var promise = httpresource.applyinvoice_list(params);
                promise
                    .then((res)=> {
                        console.log(res);

                        vm.hasloaded = true;
                        vm.loading = false;

                        var tempinvoiceList = [];

                        if(res && res.count>0) {
                            for(var i = 0; i< res.results.length; i++) {
                                let tempapplyinvoice = res.results[i];
                                if(tempapplyinvoice){
                                    tempinvoiceList.push({
                                        id: tempapplyinvoice.id,
                                        sysusername: tempapplyinvoice.sysusername,
                                        createtime: tempapplyinvoice.createtime,
                                        invoices_num: tempapplyinvoice.invoices_num,
                                        invoices_je: tempapplyinvoice.invoices_je,
                                        approval_status: tempapplyinvoice.approval_status,
                                    });
                                }
                            }
                        }

                        if(vm.offset<=0) {
                            vm.applyinvoiceist = tempinvoiceList;
                        }
                        else {
                            vm.applyinvoiceist = vm.applyinvoiceist.concat(tempinvoiceList);
                        }

                        vm.offset = vm.applyinvoiceist.length;
                        vm.count = res.count;
                        vm.notmore = vm.offset>=vm.count;

                        vm.http_exec_applyinvoice_over = true;
                    })
                    .catch((res)=> {
                        console.log('[ERROR]' + JSON.stringify(res, null, 4));

                        vm.loading = false;
                        vm.http_exec_applyinvoice_over = true;
                    });
            },

            _http_exec_invoice_list: function (offset, limit) {

                console.log('---http exec invoice list---offset=' + offset + '---limit=' + limit);

                let vm = this;

                var params = {'invoicetype':1, 'kjfp':1, 'offset': offset, 'limit': limit};

                console.log(params);

                var promise = httpresource.invoice_list(params);

                promise
                    .then((res) => {
                        console.log(res);

                        if (res && res.count > 0) {
                            vm.apply_disable = false;
                        }
                    })
                    .catch((res) => {
                        console.log('[ERROR]' + JSON.stringify(res, null, 4));
                    });
            },
        },
    }
</script>

<style scoped lang="less">
    .applyinvoice-list-wrapper{
        width: 100%;
        background-color: #f5f5f5;
    }

    .applyinvoice-list-wrapper .group_style{
        margin-bottom: 60px;
    }

    .applyinvoice-list-wrapper .weui-cell
    {
        /*padding-top: 8px;
        padding-bottom: 8px;*/
        height: 70px;
        /*line-height: 40px;*/
    }

    .applyinvoice-list-wrapper .fish_icon{
        padding-right: 15px;
    }

    .applyinvoice-list-wrapper .fish_name{
        /*padding-top: 10px;*/
        p{
            font-size: 17px;
            color:#333333;
        }
    }

    .applyinvoice-list-wrapper .fish_time{
        padding-top: 4px;
        /*padding-bottom: 10px;*/
        p{
            font-size: 14px;
            color:#666666;
        }
    }

    .applyinvoice-list-wrapper .will-container
    {
        width: 80px;
        height: 25px;
        /*border: 0px solid #C3CED9;*/
        border-radius: 15px;
        line-height: 25px;
        padding: 0;
        p{
            text-align:center;
            font-size: 10px;
            color:white;
        }
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
        bottom: 5px;
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
