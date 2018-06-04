<template>
    <div class="addfish-content-wrapper">

        <div class="xbd-panel marginless">
            <div class="xbd-panel-content">
                <router-link to="/tab1">我的发票</router-link>
                &gt;
                新增发票
            </div>
        </div>

        <div class="fish-content-seprate">
        </div>

        <p style="font-size: 17px;text-align: center">请输入发票信息</p>

        <group :gutter="0" label-width="6em" label-margin-right="2em" label-align="right">
            <x-input title="发票代码" placeholder="请输入发票代码" novalidate :icon-type="fpdm_state" v-model="fpdm"></x-input>
            <x-input title="发票号码" placeholder="请输入发票号码" novalidate :icon-type="fphm_state" v-model="fphm"></x-input>
            <x-input title="开票日期" placeholder="请输入开票日期" novalidate :icon-type="kqrq_state" v-model="kprq"
                     @click.native="showPlugin"></x-input>
            <x-input :title="JeOrJymLable" :placeholder="JeOrJymLablePlaceHoder" novalidate :icon-type="je_or_jym_state"
                     v-model="je_or_jym"></x-input>
        </group>

        <div class="save-data">
            <button type="button" class="btn btn-xbd-normal" :disabled="commit_disable" @click="onCommit">提交核验</button>
        </div>

        <toast v-model="toastStatus" width="20em" type="text" :time="2000" :position="toastPosition" is-show-mask> {{ toastmessage }} </toast>

    </div>
</template>

<script>

    import invoices from '../../scripts/invoices';

    import { Group, Cell, XInput, Selector, PopupPicker, Datetime, XNumber, XAddress, XTextarea, XButton, Box, Toast, Actionsheet } from 'vux'
    import httpresource from '../../scripts/common-resource-vux';
    import commonformater from '../../scripts/common-formater';

    export default {
        name: 'invoiceinput',
        data () {
            return {
                imput_time:null,
                toastmessage : '' ,
                toastPosition : 'middle',
                toastStatus : false ,
                fpdm: '',
                fpdm_state: 'error',
                fphm: '',
                fphm_state: 'error',
                kprq: '',
                kqrq_state: 'error',
                je_or_jym: '',
                je_or_jym_state: 'error',
                commit_disable: true,
                JeOrJymLable: '金额(不含税)',
                JeOrJymLablePlaceHoder: '请输入金额(不含税)',
            }
        },
        components: {
            Group,
            Cell,
            XInput,
            Selector,
            PopupPicker,
            XAddress,
            Datetime,
            XNumber,
            XTextarea,
            XButton,
            Box,
            Toast,
            Actionsheet,
        },

        watch: {
            fpdm: function (val) {
                var vm = this;
                if (invoices.isFpdmOK(val))
                    vm.fpdm_state = 'success';
                else
                    vm.fpdm_state = 'error';
                vm.isDisableButton();

                vm.getJeOrJymLable();
            },
            fphm: function (val) {
                var vm = this;
                if (invoices.isFphmOK(val))
                    vm.fphm_state = 'success';
                else
                    vm.fphm_state = 'error';
                vm.isDisableButton();
            },
            kprq: function (val) {
                var vm = this;
                if (invoices.isKprqOK(val))
                    vm.kqrq_state = 'success';
                else
                    vm.kqrq_state = 'error';
                vm.isDisableButton();
            },
            je_or_jym: function (val) {
                var vm = this;
                if (val && val.length > 0)
                    vm.je_or_jym_state = 'success';
                else
                    vm.je_or_jym_state = 'error';
                vm.isDisableButton();
            },
        },
        created:{
            
        },

        computed:{

        },

        mounted:
        {
           
        },

        methods: {
            
            showPlugin () {
                var vm = this;

                vm.$vux.datetime.show({
                    cancelText: '取消',
                    confirmText: '确定',
                    format: 'YYYY-MM-DD',
                    value: '',
                    onConfirm (val) {
                        console.log('plugin confirm', val)
                        vm.kprq = '' + val;
                        vm.kqrq_state = 'success';
                    },
                    onShow () {
                        console.log('plugin show')
                    },
                    onHide () {
                        console.log('plugin hide')
                    }
                })
            },

            isDisableButton: function () {
                var vm = this;

                vm.commit_disable = !((vm.fpdm_state == 'success') &&
                (vm.fphm_state == 'success') &&
                (vm.kqrq_state == 'success') &&
                (vm.je_or_jym_state == 'success'))
            },

            isInputJYM: function () {
                var vm = this;

                return invoices.isInputJYM(vm.fpdm);
            },

            getJeOrJymLable: function () {
                var vm = this;

                vm.JeOrJymLable = vm.isInputJYM() ? '校验码后6位' : '金额(不含税)';
                vm.JeOrJymLablePlaceHoder = vm.isInputJYM() ? '请输入校验码后6位' : '请输入金额(不含税)'
            },

            onCommit: function () {
                console.log('onCommit');

                var vm = this;

                vm._http_exec_check_invoice();
                //先将发票数据传到后台，由后台判断重复
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
                    
                    vm.toastmessage = '新增发票失败，'+res['message'];
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

<style scoped lang="less">

    .addfish-content-wrapper {
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        bottom: 0;
        background: #f5f5f5;
    }

    .addfish-content-wrapper .fish-content-seprate {
        width: 100%;
        height: 10px;
    }

    .addfish-content-wrapper .input-detail {
        padding-top: 5px
    }

    .addfish-content-wrapper .save-data {
        padding: 10px 10px;
    }

    .addfish-content-wrapper.weui-cells {
        margin-top: 0;
    }

    .addfish-content-wrapper .weui-cells label {
        font-weight: normal;
        margin-top: 4px;
        font-size: 18px;
    }

</style>
