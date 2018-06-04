<template>

    <div class="tab2 tab2_home">

        <swiper loop auto
                :aspect-ratio="600/900"
                :list="swiper_list"
                :index="swiper_index"
                @on-index-change="swiper_onIndexChange"
                dots-position="center">
        </swiper>

        <grid cols="2">
            <grid-item label="公司信息" title="公司信息" @click.native="_goto_company_manage" is-link>
                    <img slot="icon" src="../../../static/images/logo-manage-1.png" height="50" style="display:block;margin-right:5px;"/>
            </grid-item>
            <grid-item label ="我的报销" title="我的报销"  @click.native="_goto_expenses_manage" is-link>
                	<img slot="icon" src="../../../static/images/logo-manage-2.png" height="50" style="display:block;margin-right:5px;"/>
		    </grid-item>                    
            <grid-item label= "扫描备份开具的电子发票" title="扫描备份开具的电子发票" @click.native="_goto_qrcode_manage" is-link>
                <img slot="icon" src="../../../static/images/logo-manage-3.png" height="50" style="display:block;margin-right:5px;"/>
            </grid-item>
        </grid>

        <toast v-model="toastStatus" width="20em" type="text" :time="2000" :position="toastPosition" is-show-mask>
            {{ toastmessage }}
        </toast>

    </div>

</template>

<script>

    import { Flexbox, FlexboxItem, Divider, Swiper, SwiperItem, Cell, Group, XButton, Toast, Grid, GridItem } from 'vux';
    import httpresource from '../../scripts/common-resource-vux';
    import commonformater from '../../scripts/common-formater';
    import wechat from '../../scripts/common-wechat';
    import invoices from '../../scripts/invoices';

    const baseList = [{
        url: 'javascript:',
        img: '/yfpmobile/static/images/banner1.png',
        title: '送你一朵fua'
    }, {
        url: 'javascript:',
        img: '/yfpmobile/static/images/banner2.png',
        title: '送你一辆车'
    }, {
        url: 'javascript:',
        img: '/yfpmobile/static/images/banner3.png',
        title: '送你一次旅行',
        fallbackImg: '/yfpmobile/static/images/banner3.png'
    }]

    const urlList = baseList.map((item, index) => ({
        url: '/tab2',
        img: item.img,
        fallbackImg: item.fallbackImg,
//        title: `(可点击)${item.title}`
    }))

    export default {
        //Part 1: props, data and computed;
        data () {
            return {
                toastmessage: '',
                toastPosition: 'middle',
                toastStatus: false,

                companyid: 0,
                status: 0,
                school: {},
                plan_curr: {},
                usercount: 0,
                channelcount: 0,

                swiper_list: urlList,
                swiper_index: 0,

                fpdm: '',
                fphm: '',
                kprq: '',
                je_or_jym: '',
            }
        },
        components: {
            Flexbox,
            FlexboxItem,
            Divider,
            Swiper,
            SwiperItem,
            Cell,
            Group,
            XButton,
            Toast,
	        Grid,
            GridItem	
        },

        //Part 2: lifecycle methods
        created: function() {
            console.log('tab2 home created');

            var vm = this;
            vm.getApprovalSchoolStatus();
        },
        mounted: function() {
            console.log('tab2 home mounted');
        },
        computed: {
            store_debug: function () {
                var vm = this;
                return vm.$store.getters.debug;
            },
            store_user: function () {
                var vm = this;
                return vm.$store.getters.user;
            },
            store_schoolid: function () {
                var vm = this;
                return vm.$store.getters.schoolid;
            },
        },

        //Part 3: watch and methods;
        methods: {

            swiper_onIndexChange (index) {
                this.demo06_index = index
            },

            _goto_company_manage: function () {
                console.log('_goto_company_manage');
                let vm = this;

                if(2 == vm.status) {
                    vm.$router.push('/tab2/my_company');
                }
                else if(1 == vm.status) {
                    vm.$router.push('/apply_company_status');
                }
                else {
                    vm.$router.push('/apply_company');
                }
            },

            _goto_expenses_manage: function () {
                console.log('_goto_expenses_manage');
                let vm = this;

                if(2 == vm.status) {
                    vm.$router.push('/tab2/my_applyinvoice_list');
                }
                else if(1 == vm.status) {
                    vm.$router.push('/apply_company_status');
                }
                else {
                    vm.$router.push('/apply_company');
                }
            },

            _goto_qrcode_manage: function () {
                console.log('_goto_qrcode_manage');

                let vm = this;

                let p = wechat.jsapi.scanQRCode();

                p.then((ret)=>{
                    //01,10,fpdm,fphm,je_me,kprq,jym,0456
                    //01,51,011001600111,32212718,39.62,20170227,80277307171217590604,F386
                    //01,10,011001705111,65597439,213.00,20170814,51925190212441436757
                    //01,10,042001600311,10310846,94.34,20170829,05281273971117197916,0456,
                    //{"errMsg":"scanQRCode:ok","resultStr":"scan resultStr is here"}

                    if (vm.store_debug) {//调试模式使用预设值
                        ret = '01,51,011001600111,32212718,39.62,20170227,80277307171217590604,F386'
                    }

                    let infos = ret.split(',');

                    console.log('onScanQRCode infos =');
                    console.log(infos);

                    if (infos.length < 7)//数据与预期不匹配
                    {
                        vm.toastmessage = '二维码数据错误' + ret;
                        vm.toastStatus = true;
                    }
                    else if (vm.invoice_duplicate_check(infos[2]))
                    {
                        
                    }
                    else{
                        vm.toastmessage = '数据处理中:' + ret;
                        vm.toastStatus = true;

                        vm.fpdm = infos[2];//按位置填充数据
                        vm.fphm = infos[3];
                        vm.kprq = commonformater.formatDate.dateFormat(infos[5]);

                        var fpdmflag = invoices.isInputJYM(vm.fpdm);
                        vm.je_or_jym = fpdmflag ? infos[6] : infos[4];

                        vm._http_exec_check_invoice();
                    }
                });
            },

            getApprovalSchoolStatus: function(){
                console.log('[getApprovalSchoolStatus]');

                let vm = this;

                var params = {'offset' : 0, 'limit' : 1};

                var promise = httpresource.approval_company_status(params);
                promise.then((res)=>{
                    console.log(res);

                    if (res && res.count > 0) {
                        let tempapplyinfo = res.results[0];
                        if (tempapplyinfo) {
                            vm.status  = tempapplyinfo.status;
                        }
                    }

                }).catch((res)=>{
                        console.log('[ERROR]' + JSON.stringify(res, null, 4));
                    }
                )
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
            
        },
    }
</script>

<style scoped lang="less">

    #charts-container
    {
        width: 100%;
        height: 250px;
    }

    #map-container
    {
        width: 100%;
        height: 300px;
    }

    .btn-action
    {
        width: 100%;
        margin: 0;
        padding: 0;
        border: none;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        color: white;
        background-color: #3399ff;
    }

    .quit_school_div{
        width: 70px;
        height: 25px;
        display:flex;
        justify-content:center;
        align-items:center;
        text-align: center;
        top: 15px;
        right: 20px;
        position: absolute;
    }
    .quit_school_txt{
        width: 70px;
        font-size: 14px;
        color: #ff6666;
    }
</style>

