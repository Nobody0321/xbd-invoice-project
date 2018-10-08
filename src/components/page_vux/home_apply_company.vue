<template id="home_apply_company" xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div>

        <div class="xbd-panel marginless">
            <div class="xbd-panel-content">
                <router-link to="/tab2">公司</router-link>
                &gt;
                加入公司
            </div>
        </div>

        <div class="img_div">
            <img src="../../../static/images/image_banner.png" class="img_style" />
        </div>

        <div class="school_group">

            <group :gouter="0" label-width="6em"  label-margin-right="1em" label-align="right" class="input_group">
                <x-input class ='hide'></x-input>
                <!-- xaddress夹在xinput中间，字体就会自动对齐... -->
                <x-address title="所在地 <font color='#ff0000'>*</font>" v-model="address" raw-value value-text-align="left" placeholder="请选择所在地"
                           class="address" :list="addressList" border-intent="false" hide-district ></x-address>

                <x-input title="公司 <font color='#ff0000'>*</font>" type="text"  placeholder="请输入公司名称" v-model="schoolname"  v-on:input="onCompanynameInput"
                         placeholder-align="left" text-align="left" class="input"  border-intent="false"  ></x-input>
               
                <div v-if="showCompanyResult" class="popu_selector" >

                                <div :gutter="0" class="popu_border">
                                    <div class="choose_popu_item">
                                        <p slot="title" class="choose_single_ellipsis"><b>* 请选择公司</b></p>
                                    </div>
                                    <div class="popu_item" v-for="result in companyresults" :key="result.id" @click="chooseCompanyName(result.name, result.id)">
                                        <p slot="title" class="single_ellipsis">{{ result.name }}</p>
                                    </div>
                                </div>
                </div>
                
                <x-input v-if="hasDepartment" title="部门" type="text"  placeholder="请输入部门名称" v-model="departmentname"  v-on:input="onDepartmentnameInput"
                         placeholder-align="left" text-align="left" class="input"  border-intent="false"></x-input>
                
                <div v-if="showDepartmentResult" class="popu_selector" >

                                <div :gutter="0" class="popu_border">
                                    <div class="choose_popu_item">
                                        <p slot="title" class="choose_single_ellipsis"><b>* 请选择部门</b></p>
                                    </div>
                                    <div class="popu_item" v-for="result in departmentresults" :key="result.name" @click="chooseDepartmentName(result.name, result.id)">
                                        <p slot="title" class="single_ellipsis">{{ result.name }}</p>
                                    </div>
                                </div>
                </div>

                <x-input type="text" title="联系人 <font color='#ff0000'>*</font>" placeholder="请输入联系人姓名" v-model="contactname" :max="20"
                         class="input"  required></x-input>

                <x-input type="tel" title="联系电话 <font color='#ff0000'>*</font>" placeholder="请输入联系人电话" v-model="contactphone"
                         class="input" :max="15" required></x-input>

            </group>

            

            <div class="button_margintop">
                <button type="button" class="btn btn-xbd-normal"  @click="apply_company">{{apply}}</button>
            </div>

            <div class="school_apply_div">
                <p class="school_apply_txt school_apply_next_text" >
                    如果您的公司已经在使用财税云发票，请填写相关信息申请加入公司。
                </p>

                <p class="school_apply_txt" >
                    如果您的公司还没有使用财税云发票管理系统服务，<a @click="companyApply"><u>请点击这里申请</u></a>。
                </p>
            </div>

        </div>

        <toast v-model="toastStatus" width="20em" type="text" :time="2000" position="middle" is-show-mask> {{ toastmessage }} </toast>
    </div>

</template>

<script>
    import { Toast,Group,Cell,XAddress,XInput, Value2nameFilter as value2name } from 'vux';

    import httpresource from '../../scripts/common-resource-vux';
    import ChinaAddressData from '../../../static/datas/china_address.json'

    export default {
        //Part 1: props, data and computed;
        data : function (){
            return {
                apply :'加 入',
                addressList : ChinaAddressData,
                address : [],
                contactname  : '',
                contactphone : '',
                schoolname : '',
                hasDepartment:false,//标志位，用于判断一个公司有没有部门
                departmentname:'',
                chooseSchoolId : 0,
                chooseDepartmentId:null,
                toastmessage_success : '申请成功，请联系您的公司管理员审核！',
                toastmessage : '' ,
                toastStatus : false ,
                showCompanyResult: false,
                showDepartmentResult:false,
                companyresults:[],
                departmentresults:[],
                companychoosed: '',                
                departmentchoosed: '',
            }
        },
        components: {
            Toast,
            Group,
            Cell,
            XAddress,
            XInput,
        },

        //Part 2: lifecycle methods
        created: function(){
        },
        mounted: function(){
            console.log('mounted');
            var vux_box = document.getElementsByClassName("vux-cell-box")[0];
            vux_box.style.width = "100%";
            vux_box.setAttribute("class", "");

            var weui_cell = document.getElementsByClassName("weui-cell")[0];
            weui_cell.style.padding = "0px";

            var cell_hd = document.getElementsByClassName("weui-label");

            for(var i = 0; i < cell_hd.length; i++) {
                if('所在地' == cell_hd[i].innerText) {
                    cell_hd[i].style.cssText="display: block;width: 6em; text-align: right; margin-right: 1em; " +
                        "margin-bottom: 0px;margin-left: -15px;font-weight: 100; color : #333333;";
                }
                else {
                    cell_hd[i].style.cssText="display: block;width: 6em; text-align: right; margin-right: 1em; " +
                        "margin-bottom: 0px;font-weight: 100; color : #333333;";
                }
            }

            document.getElementsByClassName("weui-cells")[0].className="vux-no-group-title change"
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
        },

        //Part 3: watch and methods;
        methods:{
            showToast : function(messgae){
                let vm = this;
                vm.toastmessage = messgae;
                vm.toastStatus = true;
            },

            companyApply: function(){
                this.$router.push('/apply_user');
            },

            chooseCompanyName : function(schoolname, schoolid){
                console.log('chooseCompanyName');

                let vm = this;
                vm.companychoosed = schoolname;
                vm.schoolname = schoolname;
                vm.chooseSchoolId = schoolid;

                vm.showCompanyResult = false;//收起候选框
                vm.CompamyHasDepartment();
            },

            chooseDepartmentName : function(departmentname,departmentid){
                console.log('chooseDepartmentName');

                let vm = this;
                vm.departmentchoosed = departmentname;
                vm.departmentname = departmentname;
                vm.chooseDepartmentId = departmentid;

                vm.showDepartmentResult = false;
            },

            onCompanynameInput : function(){//在输入公司名的时候同步进行候选检索
                let vm = this;
                console.log('[onInput -- schoolname]:' + vm.schoolname);

                if(vm.schoolname == '' || vm.schoolname == vm.companychoosed) {
                    vm.companychoosed = '';
                    vm.companyresults = [];
                    vm.showCompanyResult = false;
                }
                else{
                    vm.chooseSchoolId = 0;
                    vm.getCompanyNames(vm.schoolname);
                }

            },

            onDepartmentnameInput : function(){
                let vm = this;
                console.log('[onInput -- departmentname]:' + vm.departmentname);

                if(vm.departmentname == '' || vm.departmentname == vm.departmentchoosed) {
                    vm.departmentchoosed = '';
                    vm.departmentresults = [];
                    vm.showDepartmentResult = false;
                }//如果检测到无效输入，不进行查询
                else{
                    // vm.chooseDepartmentId = 0;
                    vm.getDepartmentNames(vm.departmentname);
                }

            },

            getCompanyNames : function(keyword) {//根据地址以及输入字段查询公司名
                let vm = this;

                var params = {
                    qname : keyword,//输入的部分公司名
                }

                if(vm.address.length > 1) {//如果选择的地址有效，根据地址以及输入的部分公司名查询
                    var addressText = value2name(vm.address, ChinaAddressData).split(' ');

                    if(addressText.length > 1) {
                        params = {
                            qname : keyword,
                            province : addressText[0],
                            city : addressText[1],
                            // district :addressText[2],
                        }
                    }
                }

                httpresource.company_list(params).then(//对查询结果进行处理
                    (res) =>{
                        console.log('[SUCCESS]' + JSON.stringify(res, null, 4));

                        vm.companyresults = [];
                        vm.companyresults = res.items;

                        if(vm.companyresults && vm.companyresults.length > 0 ){//如果存在候选值，则显示候选框
                            vm.showCompanyResult = true;
                        } else{
                            vm.showCompanyResult = false;
                        }
                })
                .catch((res) =>{
                        console.log('[ERROR]' + JSON.stringify(res, null, 4));
                        let msg = (res.detail && res.detail != '') ? res.detail : res;
                        vm.showToast(msg);
                })
            },

            CompamyHasDepartment : function(){//根据公司id，查询该公司是否有部门
                console.log("---------CompamyHasDepartment--------")
                let params = {};
                let vm = this;
                params = {
                            companyid: vm.chooseSchoolId,
                            qname:''//后台接口要求有qname字段
                        }
                httpresource.department_list(params).then(
                    (res) =>{
                        console.log('[SUCCESS]' + JSON.stringify(res, null, 4));
                        if(res.items.length > 0){
                            vm.hasDepartment = true;
                        }
                    })
                .catch((res) =>{
                        console.log('[ERROR]' + JSON.stringify(res, null, 4));    
                    })
            },

            getDepartmentNames : function(keyword) {//根据输入的公司名 和 正在输入的部分部门名 查询该公司部门
                let vm = this;
                 
                let params = {};
                if(vm.schoolname.length > 0) {//如果输入的公司名有效，根据输入的公司名查询

                    if(keyword.length > 0) {
                        params = {
                                qname : keyword,
                                companyid: vm.chooseSchoolId,
                            }
                    }
                }

                httpresource.department_list(params).then(
                    (res) =>{
                        console.log('[SUCCESS]' + JSON.stringify(res, null, 4));
                        vm.departmentresults = [];
                        vm.departmentresults = res.items;

                        if(vm.departmentresults && vm.departmentresults.length > 0 ){
                            vm.showDepartmentResult = true;//有候选值就显示候选框
                        } else{
                            vm.showDepartmentResult = false;
                        }
                })
                .catch((res) =>{
                        console.log('[ERROR]' + JSON.stringify(res, null, 4));
                        let msg = (res.detail && res.detail != '') ? res.detail : res;
                        vm.showToast(msg);
                })
            },

            apply_company : function() {//信息填写完毕后，审核并提交到后台
                let vm = this;

                if(vm.contactname == null || vm.contactname == '')
                {
                    vm.showToast('请完整填写信息!');
                    return;
                }

                if(vm.contactphone == null || vm.contactphone == '')
                {
                    vm.showToast('请完整填写信息！');
                    return;
                }

                if(!vm.schoolname || vm.schoolname == ''){
                    vm.showToast('请完整填写信息！');
                    return;
                }

                if(vm.chooseSchoolId == 0)
                {
                    vm.showToast('查无此公司，请与公司管理员确认名称！');
                    return;
                }

                if( vm.chooseDepartmentId == 0)
                {
                    vm.chooseDepartmentId = null
                }

                let params = {
                    openid: vm.store_user.openid,
                    unionid: vm.store_user.unionid,
                    config: vm.chooseSchoolId,
                    contactname : vm.contactname,
                    contactphone : vm.contactphone,
                    department : vm.chooseDepartmentId,
                }
                console.log("输入成功，开始提交");
                console.log(params);

                httpresource.apply_company({},{}, params).then(
                    (res) =>{
                        console.log('[SUCCESS]' + JSON.stringify(res, null, 4));
                        vm.showToast(vm.toastmessage_success);

                        // res.status  审核状态: 1.等待审核  2.审核通过  3. 审核未通过  4.用户已取消
                        // user.status 授权状态: 0.未申请  1.已通过  2.申请加入易幼微等待审核 3.申请加入学校等待审核
                        if(res && res.status) {
                            //修改 status;
                            let ouser = vm.store_user;

                            let myStatus = 0;
                            switch (res.status) {
                                case 1:
                                    myStatus = 3;
                                    break;

                                case 2:
                                    myStatus = 1;
                                    break;

                                default:
                                    myStatus = 0;
                                    break;
                            }

                            var user = {
                                usercode    : ouser.usercode,
                                username    : ouser.username,
                                userlogo    : ouser.userlogo,
                                openid      : ouser.openid,
                                unionid     : ouser.unionid,
                                schoolid    : res.myschool,
                                token       : ouser.token,
                                status      : myStatus,
                                iszswadmin  : ouser.iszswadmin,
                                isassadmin  : ouser.isassadmin,
                                appid       : ouser.appid,
                                schoolname  : res.schoolname,
                                department  : res.department,
                                //
                                country     : ouser.country,
                                province    : ouser.province,
                                city        : ouser.city,
                                sex         : ouser.sex,
                                nickname    : ouser.nickname,
                                headimgurl  : ouser.headimgurl
                            };

                            vm.$store.commit('user_switch', user);
                            vm.$store.commit('user_schoolid_switch', user.schoolid);
                            vm.$store.commit('user_schoolname_switch', user.schoolname);

                            var t;
                            clearTimeout(t)

                            if (myStatus == 3) {
                                t = setTimeout(function (){
                                    vm.$router.push('/apply_company_status');
                                }, 1000);
                            } else {

                                t = setTimeout(function (){
                                    vm.$router.push('/tab2');
                                }, 1000);
                            }
                        }
                    }).catch((res) =>{
                        console.log('[ERROR]' + JSON.stringify(res, null, 4));
                        let msg = (res.detail && res.detail != '') ? res.detail : res;
                        vm.showToast(msg);
                })

            }
        },

    }

</script>

<style scoped lang="less">
    .school_group{
        width: 96%;
        margin: 0 auto;
    }

    .input_group{
        margin-top: 30px;
    }

    .popu_selector{
        width: 96%;
        margin: 0 auto;
        margin-top: 2px;
        position:absolute ;
        z-index: 100
    }

    .popu_border{
        border: 1px solid #CCC;
    }

    .popu_item{
        width: 100%;
        height: 50px;
        background-color: white;
        border-bottom: 1px solid #CCC;
    }

    .choose_popu_item{
        width: 100%;
        height: 30px;
        background-color: #EEE;
        border-bottom: 1px solid #CCC;
    }

    .choose_single_ellipsis{
        margin-left: 20px;
        margin-right: 20px;

        line-height: 30px;
        vertical-align: middle;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
    }

    .single_ellipsis{
        margin-left: 20px;
        margin-right: 20px;

        line-height: 50px;
        vertical-align: middle;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
    }

    .address{
        width: 100%;
        height: 55px;
        display: -webkit-flex;
        /*display: flex;*/
        -webkit-align-items: center;
        /*align-items: center;*/
        /*-webkit-justify-content: center;*/
        /*justify-content: center;*/
        border-bottom: 1px solid #CCC;
    }

    .input{
        height: 55px;
        padding: 0;
        border-bottom: 1px solid #CCC;
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
        width: 100%;               // 宽高为容器的宽高
        height: 100%;
        top: 0;
        left: 0
    }

    .button_margintop{
        margin-top: 30px;
    }

    .school_group .vux-popup-picker-select .vux-popup-picker-value{
        color : #333333;
    }

    .school_group .vux-popup-picker-select .vux-cell-placeholder {
        color : #333333;
    }

    .school_group .vux-popup-picker-select .vux-cell-value {
        color : #333333;
    }

    .hide{
        height: 0;
    }

</style>
