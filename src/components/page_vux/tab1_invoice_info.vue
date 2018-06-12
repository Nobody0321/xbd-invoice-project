<template>
    <div class="page-cell invoiceinfo">

        <div class="xbd-panel marginless" v-if="invoicetype == 1">
            <div class="xbd-panel-content">
                <router-link to="/tab1">我的发票</router-link>
                &gt;
                发票详情
            </div>
        </div>

        <div class="xbd-panel marginless" v-else>
            <div class="xbd-panel-content">
                <router-link to="/tab2">公司</router-link>
                &gt;
                <router-link to="/tab2/my_applyinvoice_list">我的报销</router-link>
                &gt;
                发票详情
            </div>
        </div>

        <div v-if="http_exec_invoice_over">
            <mt-cell :title="invoice.invoice_location +' ' + invoice.invoice_name" class="my_title"
                     style="background-color:#eee;    text-align: center;">
                <mt-badge v-if="invoice.invalid_mark" type="primary" size="small" color="#f44336" style="padding:0px 4px">已作废
                </mt-badge>
            </mt-cell>

            <mt-cell title="发票代码" :value="invoice.invoice_code"></mt-cell>
            <mt-cell title="发票号码" :value="invoice.invoice_number"></mt-cell>
            <mt-cell title="开票日期" :value="invoice.invoice_date"></mt-cell>
            <mt-cell title="采集时间" :value="invoice.create_time"></mt-cell>
            <mt-cell title="金额" v-if="invoice.money>0 || invoice.money<0" :value="invoice.money + '元'"></mt-cell>
            <mt-cell title="税额" v-if="invoice.tax>0 || invoice.tax<0" :value="invoice.tax + '元'"></mt-cell>
            <mt-cell title="价税合计" v-if="invoice.total_tax>0 || invoice.total_tax<0" :value="invoice.total_tax+ '元'"></mt-cell>

            <mt-cell title="销方名称" v-if="invoice.seller_name" :value="invoice.seller_name"></mt-cell>
            <mt-cell title="销方识别号" v-if="invoice.seller_taxpayer_number" :value="invoice.seller_taxpayer_number"></mt-cell>
            <mt-cell title="销方地址电话" v-if="invoice.seller_address_phone" :value="invoice.seller_address_phone"></mt-cell>
            <mt-cell title="销方银行账号" v-if="invoice.seller_bank_number" :value="invoice.seller_bank_number"></mt-cell>
            <mt-cell title="销方开户银行" v-if="invoice.seller_bank_account" :value="invoice.seller_bank_account"></mt-cell>

            <mt-cell title="购方名称" v-if="invoice.buyer_name" :value="invoice.buyer_name"></mt-cell>
            <mt-cell title="购方识别号" v-if="invoice.buyer_taxpayer_number" :value="invoice.buyer_taxpayer_number"></mt-cell>
            <mt-cell title="购方身份证号码" v-if="invoice.buyer_idcard_number" :value="invoice.buyer_idcard_number"></mt-cell>
            <mt-cell title="购方地址电话" v-if="invoice.buyer_address_phone" :value="invoice.buyer_address_phone"></mt-cell>
            <mt-cell title="购方银行账号" v-if="invoice.buyer_bank_number" :value="invoice.buyer_bank_number"></mt-cell>

            <mt-cell title="校验码" v-if="invoice.check_code" :value="invoice.check_code"></mt-cell>
            <mt-cell title="备注" v-if="invoice.remark" :value="invoice.remark"></mt-cell>
       
            <mt-field label="描述" v-model="invoice.fpms"></mt-field>
            <mt-button text-align="center" @click.native="on_edit_fpms">修改描述</mt-button>
            <mt-cell title="机器编号" v-if="invoice.identification_number" :value="invoice.identification_number"></mt-cell>
            <mt-cell title="车辆类型" v-if="invoice.vehicle_type" :value="invoice.vehicle_type"></mt-cell>
            <mt-cell title="厂牌型号" v-if="invoice.factory_plate_model" :value="invoice.factory_plate_model"></mt-cell>
            <mt-cell title="产地" v-if="invoice.car_producer" :value="invoice.car_producer"></mt-cell>
            <mt-cell title="合格证号" v-if="invoice.certificate_number" :value="invoice.certificate_number"></mt-cell>
            <mt-cell title="商检单号" v-if="invoice.inspection_number" :value="invoice.inspection_number"></mt-cell>
            <mt-cell title="发动机号码" v-if="invoice.engine_number" :value="invoice.engine_number"></mt-cell>
            <mt-cell title="车架号码" v-if="invoice.frame_number" :value="invoice.frame_number"></mt-cell>
            <mt-cell title="进口证明书号" v-if="invoice.import_certificate" :value="invoice.import_certificate"></mt-cell>

            <mt-cell title="税务机构" v-if="invoice.tax_agencies" :value="invoice.tax_agencies"></mt-cell>
            <mt-cell title="税务机构代码" v-if="invoice.tax_agencies_code" :value="invoice.tax_agencies_code"></mt-cell>
            <mt-cell title="完税凭证号码" v-if="invoice.duty_paid_proof_number" :value="invoice.duty_paid_proof_number"></mt-cell>
            <mt-cell title="吨位" v-if="invoice.tonnage" :value="invoice.tonnage"></mt-cell>
            <mt-cell title="限乘人数" v-if="invoice.restricted_passengers" :value="invoice.restricted_passengers"></mt-cell>
            <mt-cell title="收货员" v-if="invoice.cargo_collector" :value="invoice.cargo_collector"></mt-cell>

            <div v-for="hwxx in invoice.hwxx">
                <!-- 'mc' ,'gg','dw','num','dj','je','sl','se' -->
                <mt-cell :title="hwxx.mc" class="my_title" style="background-color:#eee;    text-align: center;"></mt-cell>
                <!-- <mt-cell title="名称"  v-if="hwxx.mc" :value="hwxx.mc" ></mt-cell> -->
                <mt-cell title="规格" v-if="hwxx.gg" :value="hwxx.gg"></mt-cell>
                <mt-cell title="单位" v-if="hwxx.dw" :value="hwxx.dw"></mt-cell>
                <mt-cell title="单价" v-if="hwxx.dj>0 || hwxx.dj<0" :value="hwxx.dj+ '元'"></mt-cell>
                <mt-cell title="数量" v-if="hwxx.num>0 || hwxx.num<0" :value="hwxx.num"></mt-cell>
                <mt-cell title="金额" v-if="hwxx.je>0 || hwxx.je<0" :value="hwxx.je+ '元'"></mt-cell>
                <mt-cell title="税率" v-if="hwxx.sl>0 || hwxx.sl<0" :value="hwxx.sl+ '%'"></mt-cell>
                <mt-cell title="税额" v-if="hwxx.se>0 || hwxx.se<0" :value="hwxx.se+ '元'"></mt-cell>
            </div>

            <!-- <mt-cell v-for="(value,key) in invoice" :title="key" :value="value" :key="key"></mt-cell> -->
        </div>

        <div style="margin: 15px;">
            <x-button type="warn" @click.native="onDeleteInvoice">删除</x-button>
            <!--<button type="button" class="btn weui-btn_warn" @click="onDeleteInvoice">删除</button>-->
        </div>

        <toast v-model="toastStatus" width="20em" type="text" :time="2000" :position="toastPosition" is-show-mask>
            {{ toastmessage }}
        </toast>

    </div>
</template>

<script>
    import { Toast, XButton, XInput} from 'vux'
    import httpresource from '../../scripts/common-resource-vux';

    export default {
        name: 'invoiceinfo',
        data () {
            return {
                http_exec_invoice_over: false,

                toastmessage: '',
                toastPosition: 'middle',
                toastStatus: false,

                invoiceid: 0,
                invoicetype: 1,

                invoice: {
                    id: 0,
                    invoice_number: '',
                    invoice_code: '',
                    invoice_date: '',
                    check_result: false,
                    check_status: 0,
                    error_code: '',
                    error_info: '',
                    invoice_type: '',
                    invoice_name: '',
                    invoice_location: '',
                    create_time:'',
                    check_times: 0,
                    invalid_mark: false,
                    money: 0,
                    total_tax: 0,
                    tax: 0,
                    tax_rate: 0,
                    repeat_invoice: false,
                    forbidden_item: false,
                    seller_abnormal: false,
                    buyer_abnormal: false,

                    check_time: null,                           //查验时间
                    buyer_name: "",                             //购方名称
                    buyer_taxpayer_number: "",                    //购方纳税人识别号
                    buyer_idcard_number: "",                        //购方身份证号码
                    buyer_address_phone: "",                        //购方地址电话
                    buyer_bank_number: "",                          //购方银行账号

                    seller_name: "",                             //销方名称
                    seller_taxpayer_number: "",                    //销方纳税人识别号
                    seller_address_phone: "",                   //销方地址电话
                    seller_bank_number: "",                   //销方银行账号
                    seller_bank_account: "",                   //销方开户银行

                    check_code: "",                      //校验码
                    remark: "",                             //备注
                    fpms:"",                                //描述
                    identification_number: "",                     //机器编号

                    vehicle_type: "",                     //车辆类型
                    factory_plate_model: "",                     //厂牌型号
                    car_producer: "",                       //产地
                    certificate_number: "",                     //合格证号
                    inspection_number: "",                     //商检单号
                    engine_number: "",                    //发动机号码
                    frame_number: "",                     //车辆识别代号/车架号码
                    import_certificate: "",                   //进口证明书号

                    tax_agencies: "",                     //税务机构
                    tax_agencies_code: "",                  //税务机构代码
                    duty_paid_proof_number: "",                   //完税凭证号码

                    tonnage: "",                       //吨位
                    restricted_passengers: "",                     //限乘人数
                    cargo_collector: "",                      //收货员
                    cargo_information: [],                      //货物信息
                },
            }
        },
        components: {
            XButton,
            Toast,
        },

        //Part 2: lifecycle methods
        created:function(){
            let vm = this;
            vm.invoiceid = vm.$route.params.invoiceid;

            vm.invoicetype = vm.$route.query.type;
        },
        mounted(){
            let vm = this;

            vm._http_exec_invoice_locate(vm.invoiceid);
        },
        computed: {
            store_debug: function () {
                var vm = this;
                return vm.$store.getters.debug;
            },
        },

        //Part 3: watch and methods;
        methods: {
            on_edit_fpms:function(){
                
                let vm = this;

                vm._http_exec_edit_invoice_fpms();
            },
        
            onDeleteInvoice(){
                console.log('on delete invoice');
                let vm = this;

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
            },
            
            _http_exec_edit_invoice_fpms: function(invoiceid){
                let vm = this;
                
                console.log('_http_exec_edit_invoice_fpms:', vm.invoice.fpms);

                var params = {
                            fpms:vm.invoice.fpms,
                            }
                
                var promise = httpresource.invoice_fpms_edit( params,{'invoiceid' : vm.invoiceid,});
                promise.then(
                    (res)=>{
                        console.log('[SUCCESS]' + JSON.stringify(res, null, 4));
                        vm.toastmessage = '修改描述成功';
                        vm.toastStatus = true;

                    }).catch((res)=>{
                    console.log('[ERROR]' + JSON.stringify(res, null, 4));

                    vm.toastmessage = '修改描述失败';
                    vm.toastStatus = true;
                });
            },

            _http_exec_invoice_locate: function(invoiceid) {
                console.log('_http_exec_invoice_locate', invoiceid);

                var vm = this;

                var data = {'invoiceid' : invoiceid};

                var promise = httpresource.invoice_locate({},data);
                promise.then((res)=> {
                        console.log(res);


                        if(res) {

                            var debug  = vm.store_debug;

                            if(debug) {
                                //for test
                                vm.invoiceid = res.id;
                            }

                            if (vm.invoiceid == res.id) {
                                vm.invoice = {};
                                //与后端数据一一对应
                                vm.invoice.id = res.id;
                                vm.invoice.invoice_number = res.fphm;
                                vm.invoice.invoice_code = res.fpdm;
                                vm.invoice.invoice_date = res.kprq;
                                vm.invoice.check_result = res.hyjl;
                                vm.invoice.check_status = res.hyzt;
                                vm.invoice.error_code = res.errorcode;
                                vm.invoice.error_info = res.errorinfo;
                                vm.invoice.invoice_type = res.fplx;
                                vm.invoice.invoice_name = res.fpmc;
                                vm.invoice.invoice_location = res.fpszd;
                                vm.invoice.check_times = res.hy_times;
                                vm.invoice.invalid_mark = res.zfbz;
                                vm.invoice.money = res.je;
                                vm.invoice.total_tax = res.jshj;
                                vm.invoice.tax = res.se;
                                vm.invoice.tax_rate = res.sl;
                                vm.invoice.repeat_invoice = res.bz_cffp;
                                vm.invoice.forbidden_item = res.bz_jbxm;
                                vm.invoice.saller_abnormal = res.bz_sfyc;
                                vm.invoice.buyer_abnormal = res.bz_gfyc;
                                vm.invoice.check_time = res.cysj,                               //查验时间
                                vm.invoice.create_time = res.createtime,

                                vm.invoice.buyer_name = res.gfmc,                               //购方名称
                                vm.invoice.buyer_taxpayer_number = res.gfsbh,                   //购方纳税人识别号
                                vm.invoice.buyer_idcard_number = res.gfsfzhm,                   //购方身份证号码
                                vm.invoice.buyer_address_phone = res.gfdzdh,                    //购方地址电话
                                vm.invoice.buyer_bank_number = res.gfyhzh,                      //购方银行账号

                                vm.invoice.seller_name = res.xfmc,                              //销方名称
                                vm.invoice.seller_taxpayer_number = res.xfsbh,                  //销方纳税人识别号
                                vm.invoice.seller_address_phone = res.xfdzdh,                   //销方地址电话
                                vm.invoice.seller_bank_number = res.xfyhzh,                     //销方银行账号
                                vm.invoice.seller_bank_account = res.xfkhyh,                    //销方开户银行

                                vm.invoice.check_code = res.jym,                                //校验码
                                vm.invoice.fpms = res.fpms,                                     //发票描述
                                vm.invoice.remark = res.bz,                                     //备注
                                vm.invoice.identification_number = res.jqbh,                    //机器编号

                                vm.invoice.vehicle_type = res.cllx,                             //车辆类型
                                vm.invoice.factory_plate_model = res.cpxh,                      //厂牌型号
                                vm.invoice.car_producer = res.cd,                               //产地
                                vm.invoice.certificate_number = res.hgzs,                       //合格证号
                                vm.invoice.inspection_number = res.sjdh,                        //商检单号
                                vm.invoice.engine_number = res.fdjhm,                           //发动机号码
                                vm.invoice.frame_number = res.cjhm,                             //车辆识别代号/车架号码
                                vm.invoice.import_certificate = res.jkzmsh,                     //进口证明书号

                                vm.invoice.tax_agencies = res.swjg,                             //税务机构
                                vm.invoice.tax_agencies_code = res.swjg_dm,                     //税务机构代码
                                vm.invoice.duty_paid_proof_number = res.wspzhm,                 //完税凭证号码

                                vm.invoice.tonnage = res.dw,                                    //吨位
                                vm.invoice.restricted_passengers = res.xcrs,                    //限乘人数
                                vm.invoice.cargo_collector = res.shy,                           //收货员

                                vm.invoice.hwxx = res.hwxx,                                     //货物信息

                                console.log(vm.invoice);
                            }
                        }

                        vm.http_exec_invoice_over = true;
                    })
                    .catch((res)=> {
                        console.log('[ERROR]' + JSON.stringify(res, null, 4));
                        vm.http_exec_invoice_over = true;
                    })
            },

            _http_exec_delete_invoice: function () {
                console.log('_http_exec_delete_invoice');

                let vm = this;

                var params =
                    {
                        'invoiceid' : vm.invoiceid,
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
                            vm.$router.push('/tab1');
                        }, 1000);
                    }
                ).catch((res)=>{
                    console.log('[ERROR]' + JSON.stringify(res, null, 4));

                    vm.toastmessage = '删除发票失败，'+res.message;
                    vm.toastStatus = true;
                });

            },
        }
}
</script>

<style>
    .invoiceinfo .mint-cell-title {
        flex-basis: 30%;
    }
    
    .invoiceinfo .mint-cell-value {
        flex-basis: 65%;
    }

    .my_title .mint-cell-title {
        flex-basis: 100%;
    }

    .my_title .mint-cell-value {
        flex-basis: 0%;
    }

</style>
