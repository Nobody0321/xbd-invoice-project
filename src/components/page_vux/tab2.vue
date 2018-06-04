<template>

    <div class="tab2">

        <div class="pull-center hidden">我的公司</div>

        <router-view></router-view>

        <wtabbar active="tab2"></wtabbar>

    </div>

</template>

<script>

    import wtabbar from '../view_vux/w_tabbar';

    export default {
        data () {
            return {
                message: 'Hello Vue!',
            }
        },

        created: function() {
            console.log('tab2 created');
        },
        mounted: function() {
            console.log('tab2 mounted');
        },

        components: {
            wtabbar,
        },
        directives: {

        },
        computed: {

        },
        watch: {

        },
        methods: {

        },
    }
</script>

<style scoped lang="less">

</style>
