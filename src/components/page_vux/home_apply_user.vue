<template id="home_apply">

    <div>

        <div class="xbd-panel marginless">
            <div class="xbd-panel-content">
                <router-link to="/tab2">公司</router-link>
                &gt;
                <router-link to="/apply_company">加入公司</router-link>
                &gt;
                申请使用
            </div>
        </div>

        <div class="img_div">
            <img src="../../../static/images/image_banner.png" class="img_style" />
        </div>

        <div class="apply_group">
            <group :gouter="0" label-width="5.5em" label-margin-right="2em" label-align="right" class="group_style">
                    <x-input type="text" title="公司名称" placeholder="请输入公司名称" v-model="companyname"
                         class="apply_input" :max="20" required></x-input>
                    <x-input type="tel" title="公司电话" placeholder="XXX-XXXXXXXX或+861234567891" v-model="companyphone"
                             class="apply_input" :max="15" required></x-input>
                    <x-input type="text" title="联系人" placeholder="请输入联系人姓名" v-model="contactname" :max="20"
                              class="apply_input" required></x-input>
                    <x-input type="text" title="开户银行" placeholder="请输入开户银行名称" v-model="bankname"
                         class="apply_input" required></x-input>
                    <x-input type="text" title="银行账号" placeholder="请输入银行账号" v-model="bankingaccount" :max="20"
                              class="apply_input" required></x-input>
                    <x-input type="text" title="代理公司" placeholder="请输入渠道名称" v-model="channel"
                             class="apply_input" :max="15" required></x-input>
                    <x-input type="text" title="代理人" placeholder="请输入代理人名称" v-model="nominee"
                         class="apply_input"></x-input>
                    <x-input type="text" title="纳税人识别号" placeholder="请输入纳税人识别号" v-model="invoicecode"
                         class="apply_input" :max="20" required></x-input>

                    <x-address title="省/市/区" v-model="address" raw-value value-text-align="left" placeholder="请选择所在地"
                           class="address" :list="addressList" border-intent="false"></x-address>

                    <x-input type="text" title="公司地址" placeholder="请输入公司地址" v-model="companyaddress"
                         class="apply_input" required></x-input>
            </group>

            <div class="contact_info">
                <button type="button" class="btn btn-xbd-normal"  @click="userApply">{{apply}}</button>
            </div>

            <div class="school_apply_div">
                <p class="school_apply_txt" >
                    您还没有绑定财税云发票，如果您需要使用财税云发票管理系统，请填入您的电话号码，我们的服务代表将尽快联系您。
                </p>
            </div>

            <div class="margin_bottom_div"></div>

            <toast v-model="toastStatus" width="20em" type="text" :time="2000" position="middle" is-show-mask> {{ toastmessage }}</toast>
        </div>

    </div>

</template>

<script>
    import { Toast, XButton, XInput, Group, Cell, XAddress, Value2nameFilter as value2name } from 'vux';
    
    import ChinaAddressData from '../../../static/datas/china_address.json'
    import httpresource from '../../scripts/common-resource-vux';

    export default {
        //Part 1: props, data and computed;
        data : function (){
            return {
                apply :'申 请 使 用',//？
                user : {},
                companyname : null,
                companyphone : null,
                contactname:null,
                bankname:null,
                bankingaccount:null,
                channel:null,
                nominee:null,
                invoicecode : null,
                address:[],
                province:null,
                city:null,
                district:null,
                companyaddress:null,
                addressList : ChinaAddressData,
                toastmessage : null,
                success_message: '申请成功，我们会有专人和您取得联系，谢谢!',
                toastStatus : false,
            }
        },
        components: {
            Toast,
            XInput,
            Group,
            Cell,
            XAddress,
        },

        //Part 2: lifecycle methods
        created: function(){
        },
        mounted:function(){
            console.log('mounted');
            document.getElementsByClassName("weui-cells")[0].className="vux-no-group-title change";

            var cell_hd = document.getElementsByClassName("weui-label");
            for(var i = 0; i < cell_hd.length; i++) {
                cell_hd[i].style.cssText="display: block;width: 6em; text-align: right; margin-right: 1em;" +
                    " margin-bottom: 0px; font-weight: 100; color : #333333;";
            }
        },
        computed: {
            store_user: function () {
                var vm = this;
                return vm.$store.getters.user;
            },
        },

        //Part 3: watch and methods;
        methods:{
            showToast: function(messgae){
                let vm = this;
                vm.toastmessage = messgae;
                vm.toastStatus = true;
            },
            userApply: function(){
                console.log('userApply');

                let vm = this;
                vm.toastmessage = '';

                if(vm.companyname == null || vm.companyname == '')
                {
                    vm.showToast('请填写公司名称!');
                    return;
                }

                if(vm.companyphone == null || vm.companyphone == '')
                {
                    vm.showToast('请填写公司联系电话！');
                    return;
                }

                var isPhone = /^([0-9]{3,4}[-\s])?[0-9]{7,8}$/;//正确固定电话格式的正则表达式
                var isMob=/^((\+?86)|(\(\+86\)))?(1[0-9]{10})$/;//正确手机号的正则表达式

                if(!isPhone.test(vm.companyphone) && !isMob.test(vm.companyphone)){
                    vm.showToast('请输入正确的联系方式！');
                    return;
                }

                if(vm.contactname == null || vm.contactname == '')
                {
                    vm.showToast('请填写联系人姓名！');
                    return;
                }

                if(vm.bankname == null || vm.bankname == '')
                {
                    vm.showToast('请填写开户行名称！');
                    return;
                }

                if(vm.bankingaccount == null || vm.bankingaccount == '')
                {
                    vm.showToast('请填写银行账号！');
                    return;
                }

                if(vm.channel == null || vm.channel == '')
                {
                    vm.showToast('请填写渠道！');
                    return;
                }

                 if(vm.nominee == null || vm.nominee == '')
                {
                    vm.showToast('请填写代理人姓名！');
                    return;
                }

                 if(vm.invoicecode == null || vm.invoicecode == '')
                {
                    vm.showToast('请填写纳税人识别号！');
                    return;
                }

                 if(vm.companyaddress == null || vm.companyaddress == '')
                {
                    vm.showToast('请填写公司地址！');
                    return;
                }

                if(vm.address.length > 2) {
                    var addressText = value2name(vm.address, ChinaAddressData).split(' ');

                    if(addressText.length > 2) {
                            vm.province = addressText[0];
                            vm.city = addressText[1];
                            vm.district = addressText[2];
                    }
                }

                var params = {
                    openid: vm.store_user.openid,//store_user?
                    unionid: vm.store_user.unionid,
                    schoolname : vm.companyname,
                    company_phone : vm.companyphone,
                    contactname : vm.contactname,
                    khyh : vm.bankname,
                    yhzh : vm.bankingaccount,
                    anency : vm.channel,
                    agent:vm.nominee,
                    nsrsbh: vm.invoicecode,
                    province : vm.province,
                    city : vm.city,
                    district : vm.district,
                    address:vm.companyaddress,
                };

                console.log(params);

                var promise = httpresource.apply_invoice({},{},JSON.stringify(params));
                promise.then(
                    (res)=>{
                        console.log('[SUCCESS]' + JSON.stringify(res, null, 4));
                        vm.showToast(vm.success_message);

                        var t;
                        clearTimeout(t)
                        t = setTimeout(function (){
                            vm.$router.push('/tab2');
                        }, 1000);

                    }
                ).catch((res)=>{
                        console.log('[ERROR]' + JSON.stringify(res, null, 4));
                        let msg = (res.detail && res.detail != '') ? res.detail : res;
                        vm.showToast(msg);
                });
            },
        },
    }

</script>

<style scoped lang="less">
    .apply_group{
        width: 96%;
        margin: 0 auto;
    }

    .group_style{
        margin-top: 30px;
    }

    .address{
        height: 55px;
        border-bottom: 1px solid #CCC;
    }
    .change:before{
        border: 0 !important;
    }
    .apply_input{
        color: #333333;
    }

    .apply_input.weui-cell{
        height: 55px;
        padding: 0;
        border-bottom: 1px solid #CCC;
    }
    .vux-x-input.weui-cell.apply_input.weui-cell:before{
        border: 0;
    }

    .contact_info{
        margin-top: 30px;
        margin-bottom: 35px;
    }

    .school_apply_div{
        width: 100%;
        margin: 0 auto;
    }

    .school_apply_txt{
        line-height: 150%;
        color: #999999;
        font-size : 14px;
    }

    .school_apply_next_text{
        margin-top: 10px;
    }

    .img_div{
        width: 100%;
        padding-bottom: 34%;
        height: 0;
        position: relative;
    }

    .img_style{
        position: absolute;   // 使用绝对定位
    width: 100%;           // 宽高为容器的宽高
    height: 100%;
        top: 0;
        left: 0;
    }

    .margin_bottom_div{
        width: 100%;
        height: 60px
    }
</style>
