<template>

    <div class="tab1">

        <div class="pull-center hidden">我的发票</div>

        <router-view></router-view>

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
            console.log('tab1 created');
        },

        mounted: function() {
            console.log('tab1 mounted');
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
