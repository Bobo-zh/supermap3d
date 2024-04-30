<template>
    <div>
        <div class="measureToolItem" :class="type==='length'?'active':''" @click="changeMeasureType('length')">
            <map-img name="measure-line" style="width: 44px"></map-img>
            <div>
                <div class="toolTitle">距离测量</div>
                <div class="toolSubTitle">测量地块长度</div>
            </div>
        </div>
        <div class="measureToolItem" :class="type==='area'?'active':''" @click="changeMeasureType('area')">
            <map-img name="measure-polygon" style="width: 44px"></map-img>
            <div>
                <div class="toolTitle">距离面积</div>
                <div class="toolSubTitle">测量地块面积</div>
            </div>
        </div>
        <div style="text-align: center;padding: 10px;background-color: #2C81FF" @click="clear">清除</div>
    </div>
</template>

<script>
    import BaseWidgetMixin from "./BaseWidgetMixin";
    import cesiumMeasure from "@/utils/cesiumMeasure";
    import {olMeasure} from "../../utils/olMeasure";


    let measureTool = null;
    let olMeasureTool=null;
    export default {
        name: "Measure",
        data: function () {
            return {
                type: "",
            }
        },
        mixins: [BaseWidgetMixin],
        methods: {
            initMeasure: function () {
                measureTool = new cesiumMeasure(window.map3d);
                olMeasureTool=new olMeasure(window.map2d)
            },
            changeMeasureType: function (type) {
                if(!measureTool){
                    this.initMeasure()
                }
                this.type = type;
                switch (type) {
                    case "length":
                        measureTool.measureLength(false);
                        olMeasureTool.measureLength()
                        break;
                    case "area":
                        debugger
                        measureTool.measureArea(false)
                        olMeasureTool.measureArea()
                        break;
                    default:
                        break
                }
            },
            clear:function () {
                measureTool.removeEntities();
                olMeasureTool.removeFeatures();

            }
        },
        created() {
            this.initMeasure();
        },
        beforeDestroy() {
        }
    }
</script>

<style scoped>
    .measureToolItem {
        margin-bottom: 15px;
        height: 80px;
        background: #FFFFFF;
        border: 1px solid #E8E8E8;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        cursor: pointer;
    }

    .measureToolItem .toolTitle {
        font-family: PingFangSC-Semibold, sans-serif;
        font-size: 14px;
        color: #333333;
        letter-spacing: 0;
        font-weight: 600;
    }

    .measureToolItem .toolSubTitle {
        font-family: PingFangSC-Regular, sans-serif;
        font-size: 12px;
        color: #888888;
        letter-spacing: 0;
        font-weight: 400;
    }

    .measureToolItem:hover, .measureToolItem.active {
        background: rgba(44, 129, 255, 0.10);
        border: 1px solid #2C81FF;
    }

    .measureToolItem:last-child {
        margin-bottom: 0;
    }
</style>
