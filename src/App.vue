<template>
    <router-view></router-view>
</template>

<script>

    export default {
        name: 'app',
    }
</script>

<style lang="scss">
    @import "~@/assets/public-class.scss";
    #app {
        font-family: PingFangSC-Regular,sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    html, body {
        height: 100%;
        padding: 0;
        margin: 0;
    }

    * {
        font-family: PingFangSC-Regular,sans-serif;
        margin: 0;
        padding: 0;
    }
</style>
