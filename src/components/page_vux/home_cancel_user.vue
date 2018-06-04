<template>
    <div class="group">

        <div class="image_div_group">
            <div class="image_div">
                <img class="image" src="../../../static/images/logo-zsw-300.png" alt="zsw avatar"/>
            </div>
        </div>

        <p class="hint_text"  v-html="hintMessage1"></p>
        <p class="hint_text hint_text1"   v-html="hintMessage2"></p>
        <p class="hint_text hint_text2"   v-html="hintMessage3"></p>

        <button type="button" class="btn btn-xbd-normal buttonstyle"  @click="withDrawApply">{{applyCancel}}</button>

        <toast v-model="toastStatus" width="20em" type="text" :time="2000" position="middle" is-show-mask> {{ toastMessage }}</toast>

    </div>
</template>

<style scoped lang="less">
    .group{
        width: 96%;
        margin: 0 auto
    }
    .buttonstyle{
        margin-top: 30px;
    }

    .hint_text{
        line-height: 200%;
        color: #666666;
        font-size: 16px
    }

    .hint_text1{
        margin-top: 10px
    }

    .hint_text2{
        margin-top: 20px
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

<script>

    import httpresource from '../../scripts/common-resource-vux';

    import { Toast, XButton } from 'vux';
    export default {
        data: function(){
            return {
                applyCancel : '取消申请',
                user : {},
                contactName  : null,
                contactPhone : null,
                xbdContactName: null,
                xbdContactpHone: null,
                toastMessage:null,
                toastStatus : false,
            }
        },
        components: {
            XButton,
            Toast,
        },

        created: function(){
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', function () {
                history.pushState(null, null, document.URL);
            });
        },
        mounted: function() {
            let vm = this;
            vm.user = vm.store_user;
            vm.getApprovalStatus();
        },
        methods : {
            showToast: function(messgae){
                let vm = this;
                vm.toastMessage = messgae;
                vm.toastStatus = true;
            },

            getApprovalStatus: function(){
                console.log('[getApprovalStatus]');
                let vm = this;

                let params = { unionid : vm.user.unionid}

                var promise = httpresource.approval_user_status(params);
                promise.then((res)=>{
                        console.log('[SUCCESS]' + JSON.stringify(res, null, 4));
                        vm.contactName  = res.contactname;
                        vm.contactPhone = res.contactphone;
                        vm.xbdContactName = res.xbdcontactname;
                        vm.xbdContactpHone = res.xbdcontactphone;
                     }
                ).catch((res)=>{
                        console.log('[ERROR]' + JSON.stringify(res, null, 4));
                        let msg = (res.detail && res.detail != '') ? res.detail : res;
                        vm.showToast(msg);
                        vm.$router.push('/apply_user');
                })
            },

            withDrawApply: function(){
                console.log('[withDrawApply]');
                let vm = this;

                vm.$vux.confirm.show({
                    title: '取消申请',
                    content: '审批还未通过，取消申请后，您需要重新申请，确定取消吗？',
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

                        var promise = httpresource.withdraw_apply_invoice({},{},{'unionid': vm.user.unionid });

                        promise.then((res)=>{
                            console.log('[SUCCESS]' + JSON.stringify(res, null, 4));
                            vm.showToast('取消申请成功');
                            vm.$router.push('/apply_user');
                        }).catch((res)=>{
                            console.log('[ERROR]' + JSON.stringify(res, null, 4));
                            let msg = (res.detail && res.detail != '') ? res.detail : res;
                            vm.showToast(msg);
                        })
                    }
                })
            }

        },
        computed : {
            store_user: function () {
                var vm = this;
                return vm.$store.getters.user;
            },
            hintMessage1 : function(){
                var vm = this;
                return  '您已经申请了使用财税云发票，您预留资料为：<br/>' +
                    '<strong>姓名： ' +  vm.contactName  + '<br/>' +
                    '电话： ' + vm.contactPhone  + '</strong><br/>' +
                    '我们的工作人员稍后会和您联系。';
            },

            hintMessage2 : function(){
                var vm = this;
                return '您也可以拨打我们的服务电话：<br/><a :href="vm.xbdContactpHone" style="color: #666666"><strong>'+ vm.xbdContactpHone +'</strong></a>';
            },

            hintMessage3 : function(){
                return '您也可以点击下面的按钮取消申请.';
            },
        }
    }
</script>
