<template>
    <div class="mainContainer">
        <div class="menuContainer">
            <div class="menuHeader" v-show="isExpand">
                <el-tooltip v-for="(item,i) in widgetsConfig" :key="i" class="item" effect="dark" :content="item.title"
                            placement="right" popper-class="menuTip">
                    <div :class="currentWidget.name===item.name?'menuIcon active':'menuIcon'"
                         @click="switchWidget(item)">
                        <MapIcon :name="item.iconName"></MapIcon>
                    </div>
                </el-tooltip>
            </div>
            <div class="menuContent" v-show="showWidgetPanel">
                <div class="contentTitle">
                    <div @click="closeWidgetPanel" style="cursor: pointer">
                        <map-icon name="back"></map-icon>
                    </div>
                    <div style="font-weight: 600;margin-left: 20px;">{{currentWidget.title}}</div>
                </div>
                <div class="contentBody">
                    <component ref="activeWidget" v-bind:is="currentWidget.component"></component>
                </div>
            </div>
            <img v-show="!showWidgetPanel&&isExpand" @click="isExpand=!isExpand"
                 :src="require('@/assets/images/collaspe.png')" class="expandBtn">
            <img v-show="!showWidgetPanel&&!isExpand" @click="isExpand=!isExpand"
                 :src="require('@/assets/images/expand.png')" class="expandBtn">
        </div>
        <div class="contentContainer">
            <div style="width: 100%;height: 100%;overflow: hidden;position: relative">
                <div ref="map2d" id="map2d" class="mapContainer" :style="map2dStyle"></div>
                <div ref="map3d" class="mapContainer" :style="map3dStyle" style="background-color: red"></div>
                <div style="position: absolute;right: 0;top:0;padding: 20px;background-color: rgba(0,0,0,0.5)">
                    <el-button @click="changeViewType(0)">切换2d</el-button>
                    <el-button @click="changeViewType(1)">切换3d</el-button>
                    <el-button @click="changeViewType(2)">切换2d&3d</el-button>
                </div>
            </div>
        </div>
        <div class="searchPanel">
            <el-input style="height: 100%; width:100%" placeholder="请输入姓名、宅基地代码、身份证号等" v-model="searchInput">
                <template slot="append">搜索</template>
            </el-input>
        </div>
    </div>

</template>

<script>
    import 'ol/ol.css'
    import olView from 'ol/View.js';
    import {transform} from 'ol/proj.js';
    import {defaults as olControlDefaults} from 'ol/control.js';
    import olMap from 'ol/Map.js';
    import * as Cesium from 'cesium/Cesium';
    import {getTiandituWithXYZ} from '@/utils/TDTManager';

    window.Cesium = Cesium; // expose Cesium to the OL-Cesium library
    require('cesium/Widgets/widgets.css');
    import OLCesium from 'olcs/OLCesium.js';
    import TileLayer from 'ol/layer/Tile.js';
    import XYZ from 'ol/source/XYZ.js';

    // import MapIcon from "../components/MapIcon/MapIcon";


    export default {

        name: "MapView",
        components: {},
        data: function () {
            return {
                viewType: 2,//0-2d 1-3d 2 2d&3d

                widgetsConfig: [
                    {
                        name: "home",
                        title: "首页",
                        sortId: 0,
                        iconName: "home",
                        hasExpand: false
                    },
                    {
                        name: "Measure",
                        title: "测量",
                        sortId: 1,
                        iconName: "measure",
                        hasExpand: true
                    },
                    {
                        name: "LayerList",
                        title: "图层管理",
                        sortId: 2,
                        iconName: "layer",
                        hasExpand: true
                    },
                    {
                        name: "Swipe",
                        title: "分屏",
                        sortId: 3,
                        iconName: "swiper",
                        hasExpand: false
                    },
                    {
                        name: "Print",
                        title: "打印",
                        sortId: 4,
                        iconName: "print",
                        hasExpand: true
                    }
                ],
                currentWidget: {name:"",component:null},
                showWidgetPanel:false,
                searchInput: null,
                isExpand: true
            }
        },
        computed: {
            map2dStyle: function () {
                let style = ""
                switch (this.viewType) {
                    case 0:
                        style = "top:0;bottom:0;left:0;width:100%";
                        break;
                    case 1:
                        style = "top:0;bottom:0;left:-100%;width:100%";
                        break;
                    case 2:
                        style = "top:0;bottom:0;left:0;width:50%";
                        break;
                    default:
                        style = "top:0;bottom:0;left:0;width:100%";
                }
                return style
            },
            map3dStyle: function () {
                let style = ""
                switch (this.viewType) {
                    case 0:
                        style = "top:0;bottom:0;left:100%;width:100%";
                        break;
                    case 1:
                        style = "top:0;bottom:0;left:0;width:100%";
                        break;
                    case 2:
                        style = "top:0;bottom:0;left:50%;width:50%";
                        break;
                    default:
                        style = "top:0;bottom:0;left:100%;width:100%";
                }
                return style
            },

        },
        methods: {

            initMap() {
                let imageLayer = getTiandituWithXYZ({layer: "img"});
                window.map2d = new olMap({
                    layers: [],

                    controls: olControlDefaults({
                        attributionOptions: {
                            collapsible: false
                        },
                        zoom: false,
                    }),
                    target: this.$refs.map2d,
                    // target: 'map2d',
                    view: new olView({
                        center: transform([118.11021705146143, 32.26502270765599], 'EPSG:4326', 'EPSG:3857'),
                        zoom: 15
                    })
                });
                window.map3d = new OLCesium({
                    map: window.map2d,
                    target: this.$refs.map3d
                });
                window.map3d.setEnabled(this.viewType !== 0);
                this.addLayer();
            },
            changeViewType(type) {
                window.map3d.setEnabled(type !== 0);
                this.viewType = type;
                this.resizeMap();

            },
            addLayer: function () {
                let imageLayer = getTiandituWithXYZ({layer: "img"});
                let imagePOILayer = getTiandituWithXYZ({layer: "cia"});
                window.map2d.addLayer(imageLayer)
                window.map2d.addLayer(imagePOILayer)
                let scene = window.map3d.getCesiumScene();
                scene.sun = new Cesium.Sun();
                scene.globe.enableLighting = false;
                scene.globe.depthTestAgainstTerrain = true;
                window.map3d.enableAutoRenderLoop();
                let tileset = new Cesium.Cesium3DTileset({url: "http://120.24.61.35:8301/gis/3dtiles/chuzhou1/tileset.json"});
                // 异步加载模型
                tileset.readyPromise.then((tileset) =>{
                    scene.primitives.add(tileset);
                    //飞入模型位置
                    // viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0, -0.5, 0));
                    }).otherwise(function(error){
                        console.log(error);});

            },
            jump:function () {
                this.$router.push({path:"layer"})
            },
            initWidget: function () {
                this.widgetsConfig.forEach(item => {
                    let com = require(`@/views/ContainerWidget/${item.name}`).default;
                    item.component = com;
                })
            },
            switchWidget: function (widget) {
                this.showWidgetPanel = widget.hasExpand
                this.currentWidget = widget
                this.$bus.$emit(`${widget.name}-menuClick`, widget.name)
                this.resizeMap();
            },
            resizeMap: function () {
                setTimeout(() => {
                    window.map2d && window.map2d.updateSize()
                }, 100)
            },
            closeWidgetPanel: function () {
                this.showWidgetPanel = false
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.initMap();
            })
        },
        created() {
            this.initWidget()
        },
        watch: {
            isExpand: function () {
                this.resizeMap();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .mainContainer {
        display: flex;
        justify-content: flex-start;
        height: 100%;
    }

    .menuContainer {
        height: 100%;
        display: flex;
        position: relative;

    }

    .menuHeader {
        width: 72px;
        height: 100%;
        background-color: $color-primary;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        z-index: 10;
        box-shadow: 2px 0px 6px 0px rgba(0, 0, 0, 0.1);
        position: relative;
    }

    .menuIcon {
        font-size: 24px;
        height: 48px;
        width: 48px;
        line-height: 48px;
        border-radius: 8px;
        text-align: center;
        margin-top: 10px;
        box-sizing: border-box;

    }

    .menuIcon:hover, .menuIcon.active {
        background: $color-selected-bg;
        color: $color-selected;
    }

    .menuContent {
        width: 240px;
        height: 100%;
        background-color: #ffffff;
        padding: 0 20px;
    }

    .contentBody {
        padding: 20px 0;
    }

    .contentTitle {
        height: 46px;
        font-family: PingFangSC-Regular sans-serif;
        font-size: 16px;
        letter-spacing: 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .contentContainer {
        flex: 1;
        height: 100%;
    }

    .mapContainer {
        position: absolute;
        /*background-color: #42b983;*/
        /*border-top: 1px solid red;*/
        /*border-bottom: 1px solid red;*/
    }
    .searchPanel {
        position: absolute;
        z-index: 9999;
        top: 20px;
        left: 404px;
        width: 460px;
        height: 44px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        letter-spacing: 0;
        font-weight: 400;
        ::v-deep .el-input {
            .el-input__inner {
                height: 100%;
            }
            .el-input-group__append {
                background: #2C81FF;
                color: white;
                border-color: #2C81FF;
                font-size: 14px;
                font-weight: 600;
                }
        }
    }

    .expandBtn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: -21px;
        width: 20px;
        z-index: 10;
        cursor: pointer;
    }

</style>
