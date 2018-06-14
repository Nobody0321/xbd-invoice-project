<template>
    <div>
        <tabbar class="xbd-bottom-tabbar">
            <tabbar-item selected link="/tab1" v-if="active=='tab1'">
                <img slot="icon" src="../../../static/images/btn_pressed01.png">
                <span slot="label">我的发票</span>
            </tabbar-item>
            <tabbar-item link="/tab1" v-else>
                <img slot="icon" src="../../../static/images/btn_normal01.png">
                <span slot="label">我的发票</span>
            </tabbar-item>

            <tabbar-item>
                <!--<img style="height:100%;width:62px;" slot="icon" @click="_on_menu_click"/>-->
            </tabbar-item>

            <tabbar-item selected link="/tab2" v-if="active=='tab2'">
                <img slot="icon" src="../../../static/images/btn_pressed02.png">
                <span slot="label">公司</span>
            </tabbar-item>
            <tabbar-item link="/tab2" v-else>
                <img slot="icon" src="../../../static/images/btn_normal02.png">
                <span slot="label">公司</span>
            </tabbar-item>

        </tabbar>

        <img src="../../../static/images/icon-add.png" class="bottom-middle" @click="_on_menu_click"/>

        <actionsheet v-model="showmenusheet" :menus="menus" @on-click-menu="clickMenu" show-cancel></actionsheet>

        <toast v-model="toastStatus" width="20em" type="text" :time="3000" :position="toastPosition" is-show-mask>
            {{ toastmessage }}
        </toast>

    </div>
</template>

<script>

    import { Tabbar, TabbarItem, Actionsheet, Toast } from 'vux';
    import httpresource from '../../scripts/common-resource-vux';
    import commonformater from '../../scripts/common-formater';
    import wechat from '../../scripts/common-wechat';
    import invoices from '../../scripts/invoices';

    export default {
        name : 'w_tabbar',
        props : {
            active: {
                type: String,
                default: 'tab1'
            },
        },
        data () {
            return {
                showmenusheet: false,

                toastmessage: '',
                toastPosition: 'middle',
                toastStatus: false,

                fpdm: '',
                fphm: '',
                kprq: '',
                je_or_jym: '',
                menus: {
                    menu1: '扫码查验',
                    menu2: '手动查验',
                },
            }
        },
        components: {
            Tabbar,
            TabbarItem,
            Actionsheet,
            Toast,
        },

        created: function() {
            console.log('w_tabbar created');
        },
        mounted: function() {
            console.log('w_tabbar mounted');
        },
        computed: {
            store_debug: function () {
                var vm = this;
                return vm.$store.getters.debug;//通过vuex
            },

            get_time:function(){//添加发票记录添加当前时间，可以用数据库内部记录时间代替
                var date = new Date();  
                
                var year = date.getFullYear();  
                var month = date.getMonth()+1;  
                var day = date.getDate();  
                var hour = date.getHours();  
                var minute = date.getMinutes();  
                var second = date.getSeconds();  
                
                var presentTime = year+'年'+month+'月'+day+'日 '+hour+':'+minute+':'+second;  
                alert(presentTime)  

                return presentTime;
            },

        },
        methods: {
            _on_menu_click: function () {
                console.log('_on_menu_click');

                let vm = this;
                vm.showmenusheet = true;
            },

            clickMenu: function(key) {
                console.log('menu--onclick key=' + key);

                let vm = this;

                switch (key){
                    case "menu1":
                        vm.onScanQRCode();
                        break;
                    case "menu2":
                        vm.$router.push('/tab1/invoice_input');
                        break;
                }
            },

            onScanQRCode:function(){//调用微信扫一扫，获取二维码数据，方便下一步处理
                console.log('onScanQRCode');

                let vm = this;

                //debug mode
                if (vm.store_debug) {//调试模式使用预设值
                    let ret = '01,51,011001600111,32212718,39.62,20170227,80277307171217590604,F386'

                    let infos = ret.split(',');

                    vm._scan_invoice(ret, infos);
                }
                else {
                    let p = wechat.jsapi.scanQRCode();

                    p.then((ret)=>{
                        //01,10,fpdm,fphm,je_me,kprq,jym,0456
                        //01,51,011001600111,32212718,39.62,20170227,80277307171217590604,F386
                        //01,10,011001705111,65597439,213.00,20170814,51925190212441436757
                        //01,10,042001600311,10310846,94.34,20170829,05281273971117197916,0456,
                        //{"errMsg":"scanQRCode:ok","resultStr":"scan resultStr is here"}

                        let infos = ret.split(',');
                        
                        vm._scan_invoice(ret, infos);
                    });
                }
            },

            _scan_invoice: function (ret, infos) {//对扫码获得的数据进行处理
                console.log('onScanQRCode infos=');
                console.log(infos);

                let vm = this;

                if (infos.length < 7)//数据与预期不匹配
                {
                    vm.toastmessage = '二维码数据错误' + ret;
                    vm.toastStatus = true;
                }
                else{
                    vm.toastmessage = '数据处理中' + ret;
                    vm.toastStatus = true;

                    vm.fpdm = infos[2];
                    vm.fphm = infos[3];
                    vm.kprq = commonformater.formatDate.dateFormat(infos[5]);

                    var fpdmflag = invoices.isInputJYM(vm.fpdm);
                    vm.je_or_jym = fpdmflag ? infos[6] : infos[4];
                    
                    vm._http_exec_check_invoice();//提交数据
                }
            },

            
            _http_exec_check_invoice: function () {
                console.log('_http_exec_check_invoice');

                let vm = this;

                var body =
                    {
                        fpdm: vm.fpdm,
                        fphm: vm.fphm,
                        kprq: vm.kprq,
                        jym_or_kjje: vm.je_or_jym,
                    };

                console.log('_http_exec_check_invoice：body=');
                console.log(body);

                var promise = httpresource.invoice_add({}, {}, body);
                promise.then( //如果是重复发票，后端会报错，接下来执行catch里的代码
                    (res)=>{
                        console.log('[SUCCESS]' + JSON.stringify(res, null, 4));
                        vm.toastmessage = '上传发票数据成功，请稍后等待发票云验证';
                        vm.toastStatus = true;

                        var t;
                        clearTimeout(t)
                        t = setTimeout(function (){
                            vm.$router.push('/tab1');
                        }, 1000);
                    }
                ).catch((res)=>{
                    console.log('[ERROR]' + JSON.stringify(res, null, 4));

                    //对获取的res进行分析，判断错误类型是不是重复发票
                    var tempres = res['detail'];
                    console.log('tempres');

                    //res = {'message': '本人已经有此发票了，如需更新请删除旧发票！','detail':{'发票代码':fpdm, '发票号码':fphm,'发票id':inv.id}}
                    var isDuplicate = (res['message'].indexOf('本人已经有此发票了') != -1);//判断是不是重复发票错误
                    if(isDuplicate)
                    {//若是重复发票错误，执行以下操作

                        //1、获取重复的发票的信息
                        var info = new Array();
                        info = {
                            'fpdm':tempres['发票代码'],
                            'fphm':tempres['发票号码'],
                            'id':tempres['发票id'],
                        };
                        console.log("info:" + info);

                        //2、根据发票信息跳转
                        vm.goto_existinginvoice(info);
                    }
                    vm.toastmessage = '新增发票失败  '+res['message'];
                    vm.toastStatus = true;
                });

            },
        
            goto_existinginvoice:function(info){//根据发票id，跳转到我的发票页面
                let vm  = this;
                vm.toastmessage = '重复发票：' + info.fpdm;
                vm.toastStatus = true;
                console.log(info);
                var t;
                clearTimeout(t)
                t = setTimeout(function (){
                    vm.$router.push({
                        path : '/tab1/invoice_info/' + info.id + '?type=1',
                        // params: { 
                        //         isduplicate: true, 
                        //         duplicatefpdm: info.fpdm,
                        //         duplicatefphm: info.fphm,
                        //         duplicateid: info.id,
                        //     }
                        });
                }, 1000);
            },

        }
    }
</script>

<style scoped>
    .bottom-middle
    {
        z-index: 1000;
        position: fixed;
        bottom: 27px;
        left: calc(100% - 58px);
        width: 62px;
        height: 62px;
    }
</style>
