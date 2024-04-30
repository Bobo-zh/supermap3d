export default {
    methods: {
        //组件对应的menu项点击时候触发的事件
        menuClick: function (name) {

        }
    },
    mounted() {
        this.menuClick(this.$options.name)
    },
    created() {
        this.$bus.$on( `${this.$options.name}-menuClick`, (name)=>{
            this.menuClick();
        })
    },
    beforeDestroy(){
        this.$bus.$off( `${this.$options.name}-menuClick`)
    }

}
