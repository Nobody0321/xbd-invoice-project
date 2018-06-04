<template>
    <div>
        <div class="invoice-list-wrapper">

            <div v-if="http_exec_invoice_over">
                <dropDown :dropDownData="dropDownData" :selectCallback="selectCallback"></dropDown>
            </div>

            <scroller style="padding-top: 44px;"
                  :on-refresh="_on_uprefresh_latest"
                  :on-infinite="_on_infinite_latest"
                  ref="my_scroller">

                <div style="height: 1px;"></div>

                <div v-if="http_exec_invoice_over">
                    <!--<dropDown :dropDownData="dropDownData" :selectCallback="selectCallback"></dropDown>-->

                    <div v-if="invoicelist && invoicelist.length > 0">
                        <ul class="page-infinite-list">
                            <li v-for="(invoiceitem, index) in invoicelist" class="page-infinite-listitem">
                                <InvoiceItem :clickInvoiceItemProxy="clickInvoiceItemProxy" :invoice="invoiceitem"></InvoiceItem>
                            </li>
                        </ul>
                    </div>

                    <div class="task-nodata text-center" v-else>
                        <img src="../../../static/images/image-fish-holder.png"/>
                        <p>您还没有发票信息，<br>请点击下方的“➕”号，<br>扫描或者输入发票信息！</p>
                    </div>
                </div>

            </scroller>

            <!--<div v-infinite-scroll="_on_infinite_latest"-->
                 <!--infinite-scroll-disabled="notmore" infinite-scroll-distance="10">-->

                <!--<div v-if="http_exec_invoice_over">-->
                    <!--<dropDown :dropDownData="dropDownData" :selectCallback="selectCallback"></dropDown>-->

                    <!--<div v-if="invoicelist && invoicelist.length > 0">-->
                        <!--<ul class="page-infinite-list">-->
                            <!--<li v-for="(invoiceitem, index) in invoicelist" class="page-infinite-listitem">-->
                                <!--<InvoiceItem :clickInvoiceItemProxy="clickInvoiceItemProxy" :invoice="invoiceitem"></InvoiceItem>-->
                            <!--</li>-->
                        <!--</ul>-->
                    <!--</div>-->

                    <!--<div class="task-nodata text-center" v-else>-->
                        <!--<img src="../../../static/images/image-fish-holder.png"/>-->
                        <!--<p>您还没有发票信息，<br>请点击下方的“➕”号，<br>扫描或者输入发票信息！</p>-->
                    <!--</div>-->
                <!--</div>-->

            <!--</div>-->

            <actionsheet v-model="showmenusheet" :menus="menus" @on-click-menu="clickMenu" show-cancel></actionsheet>

            <toast v-model="toastStatus" width="20em" type="text" :time="2000" :position="toastPosition" is-show-mask>
                {{ toastmessage }}
            </toast>

        </div>

        <wtabbar @homerefresh="_http_exec_invoice_refresh" active="tab1"></wtabbar>
    </div>
</template>

<script>
    import { Group, Cell, Popup, Toast, Actionsheet, XButton, TransferDomDirective as TransferDom, XDialog } from 'vux';

    import httpresource from '../../scripts/common-resource-vux';
    import commonformater from '../../scripts/common-formater';
    import infiniteScroll from 'vue-infinite-scroll'
    import InvoiceItem from './tab1_invoice_item'
    import dropDown from '../../scripts/dropDown';
    import wtabbar from '../view_vux/w_tabbar';

    export default {
        //Part 1: props, data and computed;
        name: 'MyInoviceList',
        data: function () {
            return {
                http_exec_invoice_over: false,

                toastmessage: '',
                toastPosition: 'middle',
                toastStatus: false,

                items: [],

                invoicelist: [],

                count: 0,
                offset: 0,
                limit: 10,
                notmore: false,
                loading: false,
                hasloaded: false,

                invoice_time : '',
                invoice_type : 10000,

                prevclickinvoiceid: -1,

                showmenusheet: false,
                menus: {
                    menu1: '删除',
                },
                dropDownData: [

                ],
                duplicate_msg:[],//用于接收输入界面判定的重复发票的信息
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
            Actionsheet,
            XDialog,
            InvoiceItem,
            dropDown,
            wtabbar,
        },

        //Part 2: lifecycle methods
        created: function () {
            console.log('my invoice created');

            let vm = this;
            vm.initDropDownData();
        },
        mounted: function () {
            console.log('my invoice mounted');

            //let vm = this;
            //vm._http_exec_invoice_refresh(null);
        },
        computed: {
            store_debug: function () {
                var vm = this;
                return vm.$store.getters.debug;
            },

        },

        //Part 3: watch and methods;
        methods: {
            getParams () {//用于获取输入界面判定的重复发票的信息
            // 取到路由带过来的参数 
            let routerParams = this.$route.params;
            // 将数据放在当前组件的数据内
            this.duplicate_msg = routerParams;
            },
            
            _format_date: function (sdate) {
                return commonformater.formatDate.format(new Date(sdate), 'yyyy-MM-dd');
            },

            initDropDownData: function (sdate) {
                var vm = this;

                vm.dropDownData = [];

                var children = [];
                var childrenitem = {};

                childrenitem.name = '全部日期';
                childrenitem.value = '';
                childrenitem.column = 1;
                children.push(childrenitem);

                var d = new Date();

                childrenitem = {};
                childrenitem.name = d.getFullYear() + "年" + (d.getMonth()+1) + '月';
                childrenitem.value = d.getFullYear() + "-" + (d.getMonth()+1);
                childrenitem.column = 1;
                children.push(childrenitem);

                for(var i = 0; i < 11; i++) {
                    d.setMonth(d.getMonth() - 1);
                    var m = d.getMonth() + 1;
                    m = m < 10 ? "0" + m : m;

                    childrenitem = {};
                    childrenitem.name = d.getFullYear() + "年" + m + '月';
                    childrenitem.value = d.getFullYear() + "-" + m;
                    childrenitem.column = 1;
                    children.push(childrenitem);
                }

                vm.dropDownData.push({name: '全部日期', children:children});

                vm.dropDownData.push(
                    {
                        name: '全部类型',
                        children: [
                            { name: '全部类型' , value: 10000 , column: 2},
                            { name: '验证成功未报销' , value: 1, column: 2},
                            { name: '验证成功已报销' , value: 3, column: 2},
                            { name: '未验证' , value: 0, column: 2},
                            { name: '验证失败' , value: -1, column: 2},
                        ]
                    });

                console.log(vm.dropDownData);
            },

            selectCallback(msg) {
                console.log('on selectCallback');
                if (msg) {
                    console.log(msg);
                    let clickitem = msg[0];

                    console.log(clickitem);

                    if (clickitem) {
                        let vm = this;

                        if (1 == clickitem.column){
                            vm.invoice_time = clickitem.value;
                        }
                        else if (2 == clickitem.column){
                            vm.invoice_type = clickitem.value;
                        }

                        vm._http_exec_invoice_refresh(null);
                    }
                }
            },

            clickInvoiceItemProxy(clickflag, invoice){
                console.log('clickInvoiceItemProxy clickflag=' + clickflag);
                console.log(invoice);

                let vm = this;

                vm.prevclickinvoiceid = invoice.id;

                if ((invoice.hyzt > 0) && (invoice.hyjl)) {
                    //在这里跳转
                    vm.$router.push('/tab1/invoice_info/' + this.prevclickinvoiceid + '?type=1');

                    vm.prevclickinvoiceid = -1;
                }
                else {
                    vm.showmenusheet = true;
                }
            },

            clickMenu: function(key) {
                console.log('menu--onclick key=' + key);

                let vm = this;

                switch (key){
                    case "menu1":

                        vm.$vux.confirm.show({
                            title: '删除发票',
                            content: '删除发票后，您将无法恢复该发票，确定要删除吗？',
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
                                vm._http_exec_delete_invoice();
                            }
                        })

                        break;
                }
            },

            _on_uprefresh_latest: function (done) {
                console.log('_on_uprefresh_latest');

                let vm = this;

                vm._http_exec_invoice_refresh(done);
            },

            _on_infinite_latest: function (done) {
                console.log('_on_infinite_latest');

                var vm = this;

                if (vm.notmore) {
                    done(true);
                    return;
                }

                vm._http_exec_invoice_list(vm.offset, vm.limit, done);
            },

            _http_exec_invoice_refresh: function (done) {
                let vm = this;

                //初始化
                vm.notmore = false;
                vm.loading = false;
                vm.offset = 0;
                vm.limit = 10;

                vm._http_exec_invoice_list(vm.offset, vm.limit, done);
            },

            _http_exec_invoice_list: function (offset, limit, done) {

                console.log('---http exec invoice list---offset=' + offset + '---limit=' + limit);

                let vm = this;

                var params = {'kjfp':1, 'offset': offset, 'limit': limit};

                if(vm.invoice_time && vm.invoice_time.length > 0){
                    params.month = vm.invoice_time;
                }

                if(10000 != vm.invoice_type){
                    params.invoicetype = vm.invoice_type;
                }

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
                                        je: tempinvoice.je,
                                        jshj: tempinvoice.jshj,
                                        bz_cffp: tempinvoice.bz_cffp,
                                        bz_jbxm: tempinvoice.bz_jbxm,
                                        bz_sfyc: tempinvoice.bz_sfyc,
                                        bz_gfyc: tempinvoice.bz_gfyc,
                                        kprq: tempinvoice.kprq,
                                        bx: tempinvoice.bx,
                                        hwxx: tempinvoice.hwxx,
                                        selectenable: false,
                                    });
                                }
                            }
                        }

                        if (vm.offset <= 0) {
                            vm.invoicelist = [];
                            vm.invoicelist = tempinvoicelist;
                        }
                        else {
                            vm.invoicelist = vm.invoicelist.concat(tempinvoicelist);
                        }

                        vm.offset = vm.invoicelist.length;
                        vm.count = res.count;
                        vm.notmore = vm.offset >= vm.count;

                        vm.http_exec_invoice_over = true;

                        if (done) {
                            done();
                        }
                    })
                    .catch((res) => {
                        console.log('[ERROR]' + JSON.stringify(res, null, 4));

                        vm.loading = false;
                        vm.http_exec_invoice_over = true;

                        if (done) {
                            done();
                        }
                    });
            },

            _http_exec_delete_invoice: function () {
                console.log('_http_exec_delete_invoice');

                let vm = this;

                var params =
                    {
                        'invoiceid' : vm.prevclickinvoiceid,
                    };

                console.log(params);

                var promise = httpresource.invoice_delete({}, params);
                promise.then(
                    (res)=>{
                        console.log('[SUCCESS]' + JSON.stringify(res, null, 4));

                        vm.toastmessage = '删除发票成功';
                        vm.toastStatus = true;

                        var t;
                        clearTimeout(t)
                        t = setTimeout(function (){
                            vm._http_exec_invoice_refresh();
                        }, 1000);
                    }
                ).catch((res)=>{
                    console.log('[ERROR]' + JSON.stringify(res, null, 4));

                    vm.toastmessage = '删除发票失败，'+res.message;
                    vm.toastStatus = true;
                });

            },
        },
    }
</script>

<style scoped lang="less">
    .invoice-list-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        bottom: 53px;
        background-color: #f5f5f5;
    }

    .page-infinite-list{
        padding-left:0;
        -webkit-padding-start: 0;
        margin: 0 0 53px 0;
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
        height: 70px;
        /*line-height: 40px;*/
    }

    .invoice-list-wrapper .fish_icon {
        padding-right: 15px;
    }

    .invoice-list-wrapper .circle-circle {
        width: 14px;
        height: 14px;
        background: #fff;
        border-radius: 14px;
        -moz-border-radius: 14px;
        -webkit-border-radius: 14px;
    }

    .invoice-list-wrapper .fish_name {
        /*padding-top: 10px;*/
        p {
            font-size: 17px;
            color: #333333;
        }
    }

    .invoice-list-wrapper .fish_time {
        padding-top: 4px;
        /*padding-bottom: 10px;*/
        p {
            font-size: 14px;
            color: #666666;
        }
    }

    .invoice-list-wrapper .will-container {
        width: 80px;
        height: 25px;
        /*border: 0px solid #C3CED9;*/
        border-radius: 15px;
        line-height: 25px;
        padding: 0;
        p {
            text-align: center;
            font-size: 10px;
            color: white;
        }
    }

    .invoice-list-wrapper .fish_slide {
        background: #f5f5f5;
        overflow: hidden;
        max-height: 0;
        transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
    }

    .invoice-list-wrapper .fish_animate {
        background: #f5f5f5;
        max-height: 9999px;
        transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
        transition-delay: 0s;
    }

</style>
