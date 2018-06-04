const page_404  = { template: '<div><h2>页面未找到</h2></div>' }

const routers = [
    {
        path: '/',
        redirect: '/tab1'
    },

    {
        path: '/suspend',
        meta: { title: '提示信息' },
        component: (resolve) => require(['./components/page_vux/sys_suspend.vue'], resolve),
    },
    {
        path: '/wechat',
        meta: { title: '微信登录' },
        component: (resolve) => require(['./components/page_vux/sys_wechat.vue'], resolve),
    },

    {
        path: '/apply_user',
        meta: { title: '用户申请页面'},
        component: (resolve) => require(['./components/page_vux/home_apply_user.vue'], resolve),
    },
    {
        path: '/apply_company',
        meta: { title: '公司申请页面'},
        component: (resolve) => require(['./components/page_vux/home_apply_company.vue'], resolve),
    },
    {
        path: '/apply_user_status',
        meta: { title: '查询用户申请状态页面'},
        component: (resolve) => require(['./components/page_vux/home_cancel_user.vue'], resolve),
    },
    {
        path: '/apply_company_status',
        meta: { title: '查询公司申请状态页面'},
        component: (resolve) => require(['./components/page_vux/home_cancel_company.vue'], resolve),
    },

    {
        path: '/tab1',
        meta: { title: '我的发票' },
        component: (resolve) => require(['./components/page_vux/tab1.vue'], resolve),
        children: [
            {
                path: '',
                component: (resolve) => require(['./components/page_vux/tab1_home.vue'], resolve),
            },
        ]
    },
    {
        path: '/tab1/invoice_input',
        meta: { title: '输入发票信息' },
        component: (resolve) => require(['./components/page_vux/tab1_invoice_input.vue'], resolve),
    },
    {
        path: '/tab1/invoice_info/:invoiceid',
        meta: { title: '发票详情' },
        component: (resolve) => require(['./components/page_vux/tab1_invoice_info.vue'], resolve),
    },

    {
        path: '/tab2',
        meta: { title: '我的公司' },
        component: (resolve) => require(['./components/page_vux/tab2.vue'], resolve),
        children: [
            {
                path: '/',
                component: (resolve) => require(['./components/page_vux/tab2_home.vue'], resolve),
            },
        ]
    },
    {
        path: '/tab2/my_company',
        meta: { title: '公司基本信息' },
        component: (resolve) => require(['./components/page_vux/tab2_my_company.vue'], resolve),
    },
    {
        path: '/tab2/my_applyinvoice_list',
        meta: { title: '我的报销' },
        component: (resolve) => require(['./components/page_vux/tab2_my_applyinvoice_list.vue'], resolve),
    },
    {
        path: '/tab2/my_applyinvoice_info/:invoiceid',
        meta: { title: '报销详情' },
        component: (resolve) => require(['./components/page_vux/tab2_my_applyinvoice_info.vue'], resolve),
    },
    {
        path: '/tab2/my_applyinvoice_select',
        meta: { title: '选择发票' },
        component: (resolve) => require(['./components/page_vux/tab2_my_applyinvoice_select.vue'], resolve),
    },

    {
        path: '*',
        meta: { title: '错误页面' },
        component: page_404
    },

];
export default routers;
