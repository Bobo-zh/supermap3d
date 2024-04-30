<template>
    <span  class="iconfont" :class="`fwMap-${name}`" aria-hidden="true"></span >
</template>

<script>
    import './font/iconfont.css'
    export default {
        name: "map-icon",
        props: {
            name: {
                type: String,
                required: false,//是否为必传参数
                default: ''
            }
        }
    }
</script>

<style scoped>

</style>
