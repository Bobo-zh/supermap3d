/**
 * @fileOverview 天地图WMTS服务API
 * @author <a href=”https://blog.csdn.net/nudtcadet”>老胡</a>
 * @version 1.0
 */
import { getWidth, getTopLeft } from 'ol/extent';
import WMTS from 'ol/tilegrid/WMTS';
import { WMTS as WMTSSource } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { get as getProjection, getTransform } from 'ol/proj';
import { applyTransform } from 'ol/extent';
import XYZ from "ol/source/XYZ";

const tk = process.env.VUE_APP_TDT_TK


/**
 * option={layer:"cva",proj:"EPSG:4490",matrixSet:"c",key:""}
 */



/**
 * @description 获得一个OpenLayers框架下的ol/layer/Tile类型天地图图层
 * @param {options} Object 初始化参数
 * @param {options.layer} String 与官方名称相同的图层类型:'矢量底图': 'vec','矢量注记': 'cva','影像注记': 'cia', '影像底图': 'img','全球境界': 'ibo','地形注记': 'cta','地形晕渲': 'ter'
 * @param {options.matrixSet} String 矩阵集："c"  "w"
 * @param {options.key} String 开发者秘钥
 */

export function getTianditu(options) {
    options.key=options.key||tk

    // let layers = {
    //     '全球境界': 'ibo',
    //     '地形注记': 'cta',
    //     '地形晕渲': 'ter',
    //     '影像注记': 'cia',
    //     '影像底图': 'img',
    //     '矢量注记': 'cva',
    //     '矢量底图': 'vec'
    // }
    let projs = {
        'c': 'EPSG:4490',
        'w': 'EPSG:900913'
    }
    // let matrixSets = {
    //     '经纬度投影': 'c',
    //     '球面墨卡托投影': 'w'
    // }
    let projection = getProjection(projs[options.matrixSet]);
    let projectionExtent = projection.getExtent();
    let origin = projectionExtent ? getTopLeft(projectionExtent) : [-180, 90];
    let fromLonLat = getTransform('EPSG:4326', projection);
    let width = projectionExtent ? getWidth(projectionExtent) : getWidth(applyTransform([-180.0, -90.0, 180.0, 90.0], fromLonLat));
    let resolutions = [];
    let matrixIds = [];
    for (let z = 1; z < 19; z++) {
        resolutions[z] = width / (256 * Math.pow(2, z));
        matrixIds[z] = z;
    };
    let wmtsTileGrid = new WMTS({
        origin: origin,
        resolutions: resolutions,
        matrixIds: matrixIds
    });
    let wmtsSource = new WMTSSource({
        url: "http://t{0-7}.tianditu.gov.cn/" + options.layer + "_" + options.matrixSet + "/wmts?tk=" + options.key,
        layer: options.layer,
        version: '1.0.0',
        matrixSet: options.matrixSet,
        format: 'tiles',
        projection: projection,
        requestEncoding: 'KVP',
        style: 'default',
        tileGrid: wmtsTileGrid
    });
    let wmtsLayer = new TileLayer({
        source: wmtsSource,
        title: options.title
    });
    return wmtsLayer
}

export function getTiandituWithXYZ(options){
    let defaultOptions={
        layer:'img',
        matrixSet:'w',
        key:tk
    }
    Object.assign(defaultOptions,options)
    let url=`http://t{0-7}.tianditu.com/DataServer?T=${defaultOptions.layer}_${defaultOptions.matrixSet}&x={x}&y={y}&l={z}&tk=${defaultOptions.key}`
    return new TileLayer({
        title: "卫星图",
        source: new XYZ({
            url: url
        })
    })
}
