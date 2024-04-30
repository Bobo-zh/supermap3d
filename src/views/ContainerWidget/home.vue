<template>
</template>

<script>
    import BaseWidgetMixin from "./BaseWidgetMixin";
    export default {
        name: "home",
        data: function () {
            return {
                extent: [12650799.549116489, 3520382.3090485753, 13169386.375662614, 4046265.270600221]
            }
        },
        mixins:[BaseWidgetMixin],
        methods: {
            menuClick: function () {
                let ext=window.map2d.getView().calculateExtent();
                console.log(ext)
                window.map2d&&window.map2d.getView().fit(this.extent,{duration:1000})
            }
        },
    }
</script>

<style scoped>

</style>
