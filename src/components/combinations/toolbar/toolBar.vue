<template>
    <div v-if="ToolBarShow" style="position: absolute;top: 65px;left: 12px;bottom: 28px;display: flex;width: 390px">
        <div class="toolBar">
            <div
                    class="sm-btn sm-tool-btn"
                    :class='[!show?"":"sm-toggle-btn-only",isLayerManager?"":"titleBarColor"]'
                    title="图层管理"
                    @click="choose(0)"
                    style="border-top-left-radius:4px;border-bottom-left-radius:4px;"
                    :style="LayerManagerActive"
                    @mouseover="enter(0)"
                    @mouseout="out(0)"
            >
                <span class="iconfont icontuceng"></span>
            </div>
            <div :class='[isAddLayerActive?"":"titleBarColor",]'
                 class="sm-btn sm-tool-btn"
                 :title=Resource.addLayer
                 @click="choose(1)"
                 :style="AddLayerActive"
                 @mouseover="enter(1)"
                 @mouseout="out(1)"
            >
                <span class="iconfont iconjiazaituceng"></span>
            </div>
            <div :class='[isBaseLayerActive?"":"titleBarColor"]'
                 class="sm-btn sm-tool-btn"
                 :title=Resource.setBaseLayer
                 @click="choose(2)"
                 :style="BaseLayerActive"
                 @mouseover="enter(2)"
                 @mouseout="out(2)"
            >
                <span class="iconfont iconditushezhi"></span>
            </div>
            <div :class='[isSceneOptionActive?"":"titleBarColor"]'
                 class="sm-btn sm-tool-btn"
                 :title=Resource.sceneOptions
                 @click="choose(3)"
                 :style="SceneOptionActive"
                 @mouseover="enter(3)"
                 @mouseout="out(3)"
            >
                <span class="iconfont iconchangjingshezhi"></span>
            </div>
            <div :class='[isClipActive?"":"titleBarColor"]'
                 class="sm-btn sm-tool-btn"
                 :title=Resource.clip
                 @click="choose(4)"
                 :style="ClipActive"
                 @mouseover="enter(4)"
                 @mouseout="out(4)"
            >
                <span class="iconfont iconcaijian1"></span>
            </div>
            <div :class='[isTerrainActive?"":"titleBarColor"]'
                 class="sm-btn sm-tool-btn"
                 :title=Resource.terrain
                 @click="choose(5)"
                 :style="TerrainActive"
                 @mouseover="enter(5)"
                 @mouseout="out(5)"
            >
                <span class="iconfont icondixing"></span>
            </div>
            <div :class='[isAnalysisActive?"":"titleBarColor"]'
                 class="sm-btn sm-tool-btn"
                 :title=Resource.analysis
                 @click="choose(6)"
                 :style="AnalysisActive"
                 @mouseover="enter(6)"
                 @mouseout="out(6)"
            >
                <span class="iconfont iconsanweifenxi"></span>
            </div>
            <div :class='[isMeasureActive?"":"titleBarColor"]'
                 class="sm-btn sm-tool-btn" :title=Resource.measure
                 @click="choose(7)"
                 :style="MeasureActive"
                 @mouseover="enter(7)"
                 @mouseout="out(7)"
            >
                <span class="iconfont iconliangsuan"></span>
            </div>
            <div :class='[isOnlineEditActive?"":"titleBarColor"]'
                 class="sm-btn sm-tool-btn"
                 :title=Resource.onlineEditing
                 @click="choose(8)"
                 :style="onlineEditActive"
                 @mouseover="enter(8)"
                 @mouseout="out(8)"
            >
                <span class="iconfont iconzaixianbianji"></span>
            </div>
            <!--      <ul v-if="show">-->
            <!--     -->
            <!--      </ul>-->
            <!--      <div-->
            <!--        class="sm-tool-btn"-->
            <!--        style="border-top-right-radius:4px;border-bottom-right-radius:4px;"-->
            <!--        @click="toggleVisibility"-->
            <!--        :class="{'sm-tool-btn-only': !show}"-->
            <!--      >-->
            <!--        <span-->
            <!--          class="iconfont"-->
            <!--          :class="show ? 'iconiEarth-R8-xiugai_shouqi':'iconiEarth-R8-xiugai_zhankai'"-->
            <!--        ></span>-->
        </div>

        <div style="flex: 1">
            <layer-manage></layer-manage>
            <add-layers></add-layers>
            <add-base-layer></add-base-layer>

            <scene-atttribute></scene-atttribute>
            <terrain-analysis></terrain-analysis>
            <clip-analysis></clip-analysis>
            <sm3d-measure></sm3d-measure>
            <sm3d-analysis></sm3d-analysis>
            <online-edit></online-edit>
            <!-- <city-plan></city-plan> -->
            <!-- 图层属性 -->
            <layer-attribute></layer-attribute>
            <!-- 特效 -->
            <air-lines-trail-lines></air-lines-trail-lines>
            <scan-effect></scan-effect>
            <wind-particle></wind-particle>
            <rain-and-snow></rain-and-snow>
        </div>
        <!-- 调用子组件-->

    </div>
</template>

<script>
    export default {
        name: "ToolBar",
        props: {},
        data() {
            return {
                sharedState: store.state,
                toolBarColor: store.state.toolBaseColor,
                show: true,
                LayerManagerActive: "",
                AddLayerActive: "",
                BaseLayerActive: "",
                SceneOptionActive: "",
                ClipActive: "",
                TerrainActive: "",
                AnalysisActive: "",
                MeasureActive: "",
                onlineEditActive: "",
                isLayerManager: true,
                isAddLayerActive: true,
                isBaseLayerActive: true,
                isSceneOptionActive: true,
                isClipActive: true,
                isTerrainActive: true,
                isAnalysisActive: true,
                isMeasureActive: true,
                isOnlineEditActive: true
            };
        },
        computed: {
            /**
             * @return {boolean}
             */
            ToolBarShow: function () {
                return this.sharedState.ToolBarShow;
            }
        },

        methods: {
            toggleVisibility() {
                //控制组件界面显隐
                this.show = !this.show;
            },
            choose(i) {
                // 验证是否为点击事件，是则继续执行click事件，否则不执行
                store.setToolBarAction(i);
            },

            enter(i) {
                this.active = "color:#2ec5ad;background-color:rgba(71,71,71,0.75)";
                switch (i) {
                    case 0:
                        this.LayerManagerActive = this.active;
                        break;
                    case 1:
                        this.AddLayerActive = this.active;
                        break;
                    case 2:
                        this.BaseLayerActive = this.active;
                        break;
                    case 3:
                        this.SceneOptionActive = this.active;
                        break;
                    case 4:
                        this.ClipActive = this.active;
                        break;
                    case 5:
                        this.TerrainActive = this.active;
                        break;
                    case 6:
                        this.AnalysisActive = this.active;
                        break;
                    case 7:
                        this.MeasureActive = this.active;
                        break;
                    case 8:
                        this.onlineEditActive = this.active;
                        break;
                    default:
                        break;
                }
            },
            out(i) {
                this.active = "";
                switch (i) {
                    case 0:
                        this.LayerManagerActive = this.active;
                        break;
                    case 1:
                        this.AddLayerActive = this.active;
                        break;
                    case 2:
                        this.BaseLayerActive = this.active;
                        break;
                    case 3:
                        this.SceneOptionActive = this.active;
                        break;
                    case 4:
                        this.ClipActive = this.active;
                        break;
                    case 5:
                        this.TerrainActive = this.active;
                        break;
                    case 6:
                        this.AnalysisActive = this.active;
                        break;
                    case 7:
                        this.MeasureActive = this.active;
                        break;
                    case 8:
                        this.onlineEditActive = this.active;
                        break;
                    default:
                        break;
                }
            }
        },
        mounted() {
            setInterval(() => {
                this.isLayerManager = !store.state.toolBar[0];
                this.isAddLayerActive = !store.state.toolBar[1];
                this.isBaseLayerActive = !store.state.toolBar[2];
                this.isSceneOptionActive = !store.state.toolBar[3];
                this.isClipActive = !store.state.toolBar[4];
                this.isTerrainActive = !store.state.toolBar[5];
                this.isAnalysisActive = !store.state.toolBar[6];
                this.isMeasureActive = !store.state.toolBar[7];
                this.isOnlineEditActive = !store.state.toolBar[8];
            }, 10);
        }
    };
</script>

<style lang="scss" scoped>
    @import "toolBar";

</style>

