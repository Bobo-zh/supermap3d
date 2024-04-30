import { getTianditu } from './TDTManager'
import { ImageWMS, Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer, Image as ImageLayer } from 'ol/layer'
import { GeoJSON, WFS } from 'ol/format'
import { Circle as CircleStyle, Fill, Stroke, Style, Text as TextStyle } from 'ol/style'
import * as common from './common'
import { bbox } from 'ol/loadingstrategy'
const olFilter = require('ol/format/filter') // 注意 这里的某块只在eval 中用到 所以必须以require方式加载
class LayerManager {
  constructor (map) {
    this.map = map
    this.statisticLayer = null
    this.statisticLayerConfig = {}
    this.userDistrictInfo = '360622'
  }

  /**
     * 根据图层配置信息在地图上加载图层。
     * @param layerConfig
     */
  addLayers (layerConfig) {
    const that = this
    layerConfig.forEach(x => {
      const layer = that.createLayer(x)
      that.map.addLayer(layer)
      // if (userInfo.getUserXzqdm() == '370703' && x.id == 'XJXZQ') {
      //   const layer = new ImageLayer({
      //     source: new ImageWMS({
      //       url: 'http://119.23.186.51:8060/geoserver/htq/wms',
      //       params: {
      //         FORMAT: 'image/png',
      //         VERSION: '1.1.1',
      //         LAYERS: 'htq:dongchang',
      //         tilesOrigin: 13258747.817089602 + ',' + 4422254.716810336
      //       },
      //       projection: 'EPSG:3857'
      //     }),
      //     maxZoom: 21,
      //     minZoom: 9
      //   })
      //   that.map.addLayer(layer)
      // }
    })
  }

  /**
     *  * 获取图层
     * @param config {Object} 图层的配置信息{url:"",type:"",visible:"",id:"",name:"",token:"",}
     * @returns {Object} 返回图层实体
     */
  createLayer (config) {
    let layer = null
    const keyProperties = ['url', 'type', 'icon', 'token', 'layerName']
    switch (config.type) {
      case 'vec_c':
      case 'vec_w':
      case 'cva_c':
      case 'cva_w':
      case 'img_c':
      case 'img_w':
      case 'cia_c':
      case 'cia_w':
      case 'ter_c':
      case 'ter_w':
      case 'cta_c':
      case 'cta_w':
        layer = getTianditu({
          layer: config.type.substr(0, 3),
          matrixSet: config.type.substr(4, 1),
          key: config.token,
          originConfig: config
        })
        break
      case 'wfs':
        layer = this.createWFSLayer(config)
        break
      case 'wms':
        layer = this.createWMSLayer(config)
        break
      case 'tms':
        layer = this.createMVTLayer(config)
        break
      case 'cluster':
        layer = this.createStaticLayer(config)
        break
      default:
        break
    }
    for (const key in config) {
      if (keyProperties.indexOf(key) < 0) { layer.set(key, config[key]) }
    }
    return layer
  }

  // wfs基本加载，没有属性过滤
  createWFSLayer_old (config) {
    const layer = new VectorLayer({
      source: new VectorSource({
        url: config.url + '?typeName=' + config.layerName + '&service=WFS&version=1.0.0&request=GetFeature&outputFormat=application/json',
        format: new GeoJSON()
      }),
      originConfig: config
      // visible:config.visible
    })
    return layer
  }

  // 采用load 方式记载wfs数据 这样可以添加属性过滤，控制数据加载的时候权限。
  createWFSLayer (config) {
    if (config.filterConfig) {
      const filter = this.getFilter(config.filterConfig, [this.userDistrictInfo])
      config.cqlFilters = filter.cqlFilters
      config.openLayerFilters = filter.openLayerFilters
    }
    const wfsSource = new VectorSource({
      loader: function (extent, resolution, projection) {
        var proj = projection.getCode()
        const options = {
          featureNS: config.featureNS, // 命名空间 URI
          featurePrefix: config.featurePrefix, // 工作区名称
          featureTypes: [config.subLayers[0].layerName], // 查询图层
          outputFormat: 'application/json',
          filter: config.openLayerFilters && config.openLayerFilters[0] || null,
          bbox: extent,
          srsName: proj,
          geometryName: config.subLayers[0].geometryName || 'the_geom'
        }
        const query = new WFS().writeGetFeature(options)
        fetch(config.url, { // geoserver wfs地址如localhost:8080/geoserver/wfs，我是8081
          method: 'POST',
          body: new XMLSerializer().serializeToString(query)
        }).then(function (response) {
          return response.json()
        }).then(function (json) {
          var a = new GeoJSON().readFeatures(json)
          wfsSource.addFeatures(new GeoJSON().readFeatures(json))
        }).catch(
          function (err) {
            wfsSource.removeLoadedExtent(extent)
          }
        )
      },
      format: new GeoJSON(),
      strategy: bbox
    })
    const layer = new VectorLayer({
      source: wfsSource,
      originConfig: config
    })
    return layer
  }

  createWMSLayer (config) {
    const layers = config.subLayers.map(x => {
      return x.layerName
    })
    const layerOption = {
      LAYERS: layers.join(','),
      FORMAT: 'image/png',
      // 'TILED': true,//true表示是一个个小图片合成一张图 否则 直接返回一个大图
      VERSION: config.version || '1.1.1'
    }

    if (config.filterConfig) {
      const filter = this.getFilter(config.filterConfig, [this.userDistrictInfo])
      config.cqlFilters = filter.cqlFilters
      config.openLayerFilters = filter.openLayerFilters
      if (config.cqlFilters.length > 0) {
        layerOption.cql_filter = config.cqlFilters.join(';')
      }
    }
    const layer = new ImageLayer({
      source: new ImageWMS({
        url: config.url,
        params: layerOption,
        projection: 'EPSG:4490'
      }),
      originConfig: config
    })
    return layer
  }

  getFilter (filterConfig, argus) {
    const cqlFilters = []
    const openLayerFilters = []
    filterConfig.forEach(x => {
      cqlFilters.push(common.stringFormat(x.cql_template, argus))
      const filterStr = common.stringFormat(x.ol_template, argus)
      openLayerFilters.push(eval(filterStr))
    })
    return { cqlFilters, openLayerFilters }
  }

  // 创建统计图层，添加样式
  createStaticLayer (config) {
    this.statisticLayer = new VectorLayer({
      source: new VectorSource(),
      originConfig: config,
      style: function (feature, resolution) {
        const props = feature.getProperties()
        const styles = []; let addOffset = 0
        styles.push(new Style({
          image: new CircleStyle({
            radius: 50,
            fill: new Fill({
              color: '#ffcc33'
            })
          })
        }))

        styles.push(new Style({
          text: new TextStyle({
            textAlign: 'center',
            textBaseLine: 'middle',
            font: '20px serif',
            text: props.xzqmc.substr(0, 4),
            fill: new Fill({ color: '#0882c2' }),
            stroke: new Stroke({ color: 'rgba(255,255,255,0)' }),
            offsetX: 0,
            offsetY: -20,
            rotation: 0
          })
        }))
        if (props.xzqmc.length > 4) {
          addOffset = 15
          styles.push(new Style({
            text: new TextStyle({
              textAlign: 'center',
              textBaseLine: 'middle',
              font: '20px serif',
              text: props.xzqmc.substr(4),
              fill: new Fill({ color: '#0882c2' }),
              stroke: new Stroke({ color: 'rgba(255,255,255,0)' }),
              offsetX: 0,
              offsetY: 1,
              rotation: 0
            })
          }))
        }
        styles.push(new Style({
          text: new TextStyle({
            textAlign: 'center',
            textBaseLine: 'middle',
            font: '15px serif',
            text: (props.houseCount || 0) + '户',
            fill: new Fill({ color: '#000' }),
            stroke: new Stroke({ color: 'rgba(255,255,255,0)' }),
            offsetX: 0,
            offsetY: 5 + addOffset,
            rotation: 0
          })

        }))
        styles.push(new Style({
          text: new TextStyle({
            textAlign: 'center',
            textBaseLine: 'middle',
            font: '15px serif',
            text: (props.landCount || 0) + '块',
            fill: new Fill({ color: '#000' }),
            stroke: new Stroke({ color: 'rgba(255,255,255,0)' }),
            offsetX: 0,
            offsetY: 20 + addOffset,
            rotation: 0
          })

        }))
        return styles
      }
    })
    return this.statisticLayer
  }

  static getInstance (map) {
    if (!LayerManager.instance) {
      LayerManager.instance = new LayerManager(map)
    }
    return LayerManager.instance
  }
}

export default LayerManager
