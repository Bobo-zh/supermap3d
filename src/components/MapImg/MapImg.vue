<template>
    <img  :src="require(`@/assets/images/${name}.png`)">
</template>

<script>
    export default {
        name: "MapImg",
        props:{
            name:""
        }
    }
</script>

<style scoped>

</style>
