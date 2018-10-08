<template>
    <div>
        <div class="xbd-panel marginless">
            <div class="xbd-panel-content">
                <router-link to="/tab2">公司</router-link>
                &gt;
                取消申请
            </div>
        </div>

        <div class="group">

            <div class="image_div_group">
                <div class="image_div">
                    <img class="image" src="../../../static/images/logo-zsw-300.png" alt="zsw avatar"/>
                </div>
            </div>

            <p class="hint_text" v-html="hintMessage"></p>

            <button type="button" class="btn btn-xbd-normal button_style"  @click="withDrawApplySchool">取消申请</button>

            <toast v-model="toastStatus" width="20em" type="text" :time="2000" position="middle" is-show-mask> {{ toastMessage }}</toast>
        </div>

    </div>

</template>

<script>

    import httpresource from '../../scripts/common-resource-vux';

    import { Toast, XButton } from 'vux';
    export default {
        //Part 1: props, data and computed;
        data: function(){
            return{
                toastMessage:null,
                toastStatus : false,
                companyname : '此公司',
                status: 0,
            }
        },
        components: {
            XButton,
            Toast,
        },

        //Part 2: lifecycle methods
        created: function(){
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', function () {
                history.pushState(null, null, document.URL);
            });
        },
        mounted: function() {
            let vm = this;

            vm.getApprovalSchoolStatus();
        },
        computed : {
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
            hintMessage : function(){
                var vm = this;
                return '您已经申请了加入 "' +  vm.companyname  + '" 。<br/>' +
                    '公司管理员还没有审核/设置权限，请联系此公司管理员在：' +
                    '<strong>"后台系统"</strong> 中设置您的权限。<br/><br/>您也可以点击下面的按钮取消申请。';
            }
        },

        //Part 3: watch and methods;
        methods : {
            showToast: function(messgae){
                let vm = this;
                vm.toastMessage = messgae;
                vm.toastStatus = true;
            },

            getApprovalSchoolStatus: function(){
                console.log('[getApprovalSchoolStatus]');

                let vm = this;

                var params = {'offset' : 0, 'limit' : 1};

                var promise = httpresource.approval_company_status(params);
                promise.then((res)=>{
                        console.log('[SUCCESS]' + JSON.stringify(res, null, 4));
                    if (res && res.count > 0) {
                        let tempapplyinfo = res.results[0];
                        if (tempapplyinfo) {
                            vm.status  = tempapplyinfo.status;

                            if (tempapplyinfo.config) {
                                vm.companyname  = tempapplyinfo.config.school_name;
                            }
                        }
                    }

                }).catch((res)=>{
                        console.log('[ERROR]' + JSON.stringify(res, null, 4));
                        let msg = (res.detail && res.detail != '') ? res.detail : res;
                        vm.showToast(msg);
                        vm.$router.push('/tab2');
                    }
                )
            },

            withDrawApplySchool: function(){
                console.log('[withDrawApplySchool]');
                let vm = this;

                vm.$vux.confirm.show({
                    title: '取消申请',
                    content: '公司管理员还没有审核/设置权限，取消申请后，您需要重新申请，确定取消吗？',
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

                        var promise = httpresource.withdraw_apply_company({},{},{'unionid': vm.store_user.unionid });
                        promise.then((res)=>{
                            console.log('[SUCCESS]' + JSON.stringify(res, null, 4));
                            vm.showToast('取消申请成功');
                            vm.$router.push('/apply_company');
                        }).catch((res)=>{
                            console.log('[ERROR]' + JSON.stringify(res, null, 4));
                            let msg = (res.detail && res.detail != '') ? res.detail : res;
                            vm.showToast(msg);
                        })
                    }
                })
            }
        },

    }
</script>

<style scoped lang="less">
    .group{
        width: 96%;
        margin: 0 auto
    }

    .button_style{
        margin-top: 30px;
    }

    .hint_text{
        line-height: 200%;
        color: #666666;
        font-size: 16px
    }

    .image_div_group{
        width: 100%;
        padding-top: 55px;
        padding-bottom: 35px;
    }
    .image_div{
        width: 105px; height: 105px; margin: 0 auto;
    }
    .image{
        width: 100%; height: 100%; border-radius: 15px;
    }
</style>
