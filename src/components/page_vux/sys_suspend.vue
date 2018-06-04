<template>

    <div class="panel panel-default sys-suspend" style="margin: 20px;">
        <div class="panel-heading">提示信息</div>
        <div class="panel-body">
            {{store_error}}
        </div>
    </div>

</template>

<script>

    export default {
        data () {
            return {
                message: 'Hello Vue!',
            }
        },
        mounted: function() {
            console.log('mounted');
        },
        created: function() {
            console.log('created');
        },
        components: {

        },
        directives: {

        },
        computed: {
            store_error: function () {
                var vm = this;
                return vm.$store.getters.error;
            },
        },
        watch: {

        },
        methods: {

        },
    }
</script>

<style scoped lang="less">

</style>
