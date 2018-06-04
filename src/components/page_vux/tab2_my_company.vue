<template>
    <div>
        <div class="xbd-panel marginless">
            <div class="xbd-panel-content">
                <router-link to="/tab2">公司</router-link>
                &gt;
                我的公司
            </div>
        </div>

        <group :gutter="5" label-width="5em" label-align="left">
            <cell primary="content" title="名称" :value="company.name"></cell>
            <cell title="税号" :value="company.invoicecode"></cell>
            <cell primary="content" title="单位地址" :value="company.address"></cell>
            <cell title="电话号码" :value="company.phone"></cell>
            <cell primary="content" title="开户银行" :value="company.bankname"></cell>
            <cell title="银行账户" :value="company.bankcount"></cell>
        </group>

        <div class="xbd-panel marginless">
            <div class="xbd-panel-content">
                <div class="text-center padding-15" v-if="company.qrcodeurl && company.qrcodeurl!=''">
                    <p class="text-center">开票时候出示</p>

                    <div @click="_on_goto_survey">
                        <img :src="company.qrcodeurl" />
                    </div>
                </div>

                <div class="text-center padding-15-0">
                    <button type="button" class="btn btn-xbd-normal" @click="_on_quit_company">退出公司</button>
                </div>
            </div>
        </div>

        <toast v-model="toastStatus" width="20em" type="text" :time="2000" position="middle" is-show-mask> {{ toastMessage }}</toast>

    </div>

</template>

<script>

    import {Flexbox, FlexboxItem, Divider, Toast, Cell, CellBox, CellFormPreview, Group} from 'vux';

    import httpresource from '../../scripts/common-resource-vux';
    import httpredirect from '../../scripts/common-redirect-vux';
    import utility from '../../scripts/common-utility';
    import wechat from '../../scripts/common-wechat';

    export default {
        data () {
            return {
                toastMessage:null,
                toastStatus : false,

                company: {
                    id: 0,
                    name: '',
                    invoicecode: '',
                    address: '',
                    phone: '',
                    bankname: '',
                    bankcount: '',
                    qrcodeurl: '',
                },
            }
        },
        components: {
            Flexbox,
            FlexboxItem,
            Divider,
            Toast,
            Group,
            Cell,
            CellFormPreview,
            CellBox,
        },

        created: function () {
            console.log('created');
        },
        mounted: function () {
            console.log('mounted');

            let vm = this;

            vm._http_exec_company_locate();
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

        methods: {
            showToast: function(messgae){
                let vm = this;
                vm.toastMessage = messgae;
                vm.toastStatus = true;
            },

            _merge_unionid: function (url) {
                if (!url || url == '') return '';

                let vm = this;

                let uid = vm.store_user.unionid;
                let mergeurl = url + '?uid=' + uid;

                console.log('mergeurl', mergeurl);
                return mergeurl;
            },

            _on_goto_survey: function () {
                let vm = this;

            },

            _on_quit_company: function () {
                let vm = this;

                vm.$vux.confirm.show({
                    title: '退出公司',
                    content: '退出该公司，您将无法使用公司的相关功能，确认要退出吗?',
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
                        vm._http_exec_quit_company();
                    }
                })
            },

            _http_exec_company_locate: function () {
                console.log('_http_exec_company_locate');

                var vm = this;

                var promise = httpresource.company_locate();

                promise
                    .then((res) => {
                        console.log(res);

                        if (res && res.count > 0) {
                            let tempcompany = res.results[0];
                            if (tempcompany) {
                                vm.company = {};

                                vm.company.id = tempcompany.id;
                                vm.company.name = tempcompany.name;
                                vm.company.invoicecode = tempcompany.nsrsbh;
                                vm.company.address = tempcompany.address;
                                vm.company.phone = tempcompany.company_phone;
                                vm.company.bankname = tempcompany.khyh;
                                vm.company.bankcount = tempcompany.yhzh;

                                if (tempcompany.qrcodeurl && tempcompany.qrcodeurl != '') {
                                    vm.company.qrcodeurl = tempcompany.qrcodeurl;
                                }
                            }
                        }
                    })
                    .catch((res) => {

                        console.log('[ERROR]' + JSON.stringify(res, null, 4));
                    });
            },

            _http_exec_quit_company: function () {
                console.log('_http_exec_quit_company');
                let vm = this;

                var promise = httpresource.company_quit();
                promise.then(
                    (res) => {
                        let ouser = vm.store_user;

                        let user = {
                            usercode: ouser.usercode,
                            username: ouser.username,
                            userlogo: ouser.userlogo,
                            openid: ouser.openid,
                            unionid: ouser.unionid,
                            schoolid: 0,
                            token: ouser.token,
                            status: 0,
                            iszswadmin: false,
                            isassadmin: ouser.isassadmin,
                            appid: ouser.appid,
                            schoolname: '',

                            //
                            country: ouser.country,
                            province: ouser.province,
                            city: ouser.city,
                            sex: ouser.sex,
                            nickname: ouser.nickname,
                            headimgurl: ouser.headimgurl
                        };

                        vm.$store.commit('user_switch', user);
                        vm.$store.commit('user_schoolid_switch', user.schoolid);
                        vm.$store.commit('user_schoolname_switch', user.schoolname);

                        vm.showToast('退出成功');

                        var t;
                        clearTimeout(t)
                        t = setTimeout(function (){
                            vm.$router.push('/tab1');
                        }, 1000);
                    }
                ).catch(
                    (res) => {
                        if (vm.store_debug) {
                            var user = {
                                usercode: '1001',
                                username: '用户',
                                userlogo: '',
                                openid: '1001',
                                unionid: '11',
                                schoolid: 0,
                                token: '40000',
                                status: 0,
                                iszswadmin: false,
                                isyywadmin: false,
                                isassadmin: false,
                                appid: 'wxbab5c75454557bd8',
                                schoolname: ''
                            };
                            vm.$store.commit('user_switch', user);
                            vm.$store.commit('user_schoolid_switch', user.schoolid);
                            vm.$store.commit('user_schoolname_switch', user.schoolname);

                        } else {
                            let message = res.detail ? res.detail : JSON.stringify(res);
                            vm.showToast(message);
                        }
                    }
                )

            },
        },
    }
</script>

<style scoped lang="less">

</style>
