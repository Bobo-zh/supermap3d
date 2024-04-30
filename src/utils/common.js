import { WFS } from 'ol/format'
import * as olExtent from 'ol/extent'
import { TileWMS, Vector as VectorSource, VectorTile as VectorTileSource } from 'ol/source'
import { Vector as VectorLayer, Tile as TileLayer, VectorTile as VectorTileLayer } from 'ol/layer'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'

let olFilter = require('ol/format/filter')

// 公共方法
/**
 * 将字符转成数字，如果可以转，返回转换后的值，否则返回null
 * @param str{string,number} 需要转换的字符串
 * @returns {number,null}
 */
export function convertNumber (str) {
  let n = Number(str)
  return !isNaN(n) ? n : null
}
/**
 * 格式化图层列表，主要是用来格式化从接口获取的数据
 * @param list {array}接口请求的图层列表数据
 * @returns {array}格式化后的图层列表数据
 */
export function formatLayerList (list) {
  return list.map(item => {
    let obj = {}
    if (item.id) {
      obj.id = item.id
    }
    if (item.featureNs) {
      obj.featureNs = item.featureNs
    }
    if (item.featurePrefix) {
      obj.featurePrefix = item.featurePrefix
    }
    if (convertNumber(item.maxZoom)) {
      obj.maxZoom = convertNumber(item.maxZoom)
    }
    if (convertNumber(item.minZoom)) {
      obj.minZoom = convertNumber(item.minZoom)
    }
    obj.subLayers = item.subLayers !== '' ? JSON.parse(item.subLayers) : []

    if (item.filterConfig) {
      obj.filterConfig = item.filterConfig !== '' ? JSON.parse(item.filterConfig) : []
    }
    if (item.token) {
      obj.token = item.token
    }
    if (item.type) {
      obj.type = item.type
    }
    if (item.url) {
      obj.url = item.url
    }
    obj.geometryName = item.geometryName || 'the_geom'
    obj.token = item.token || ''
    obj.title = item.title || item.id
    obj.visible = !!item.visible
    obj.isBase = !!item.isBase
    obj.sortId = item.sortId || 0
    return obj
  })
}

/**
 * 形如C#中的stringFormat的方法，用参数替代字符串中的形如 {0} 的字符
 * @param str {string} 需要格式化的字符
 * @param argus {array} 格式化传递的参数
 * @returns {string} 格式化后的字符
 */
export function stringFormat (str, argus) {
  if (!argus || argus.length === 0) {
    return str
  } else {
    for (var i = 0; i < argus.length; i++) { str = str.replace(new RegExp('\\{' + i + '\\}', 'g'), argus[i]) }
    return str
  }
}

/**
 * 给定对象的属性名称，和对应的值，从对象数组选定符合要求的对象。
 * @param objectArray {Array} 对象数组
 * @param propName{string} 属性名
 * @param propValue{string} 属性值
 * @param isOnly{boolean} 是否只返回的一个对象。默认是false
 * @param isFuzzy{boolean} 是否模糊查询。表示在对象数组的特定属性值中模糊搜索给定的属性值。默认值：false
 * @returns {*} 返回属性名称和值对应相等的对象；isOnly=true时候返回 null或object，isOnly=false时返回一个对象数组。
 */
export function searchArrayWithCode (objectArray, propName, propValue, isOnly, isFuzzy) {
  var obj = !isOnly ? [] : null
  for (var i = 0; i < objectArray.length; i++) {
    if (isFuzzy && objectArray[i][propName].indexOf(propValue) > -1) {
      if (isOnly) {
        obj = objectArray[i]
        break
      } else {
        obj.push(objectArray[i])
      }
    }
    if (!isFuzzy && objectArray[i][propName] === propValue) {
      if (isOnly) {
        obj = objectArray[i]
        break
      } else {
        obj.push(objectArray[i])
      }
    }
  }
  return obj
};

/**
 * 依据行政区划代码，判断当前行政区划代码所属的新政等级
 * @param code {string} 行政区划代码，是不是12 均可。
 * @returns {object} 地区等级：结果市 province city county town village 中的一个,如果输入参数不符合规范则范围空字符串
 */
export function getDistrictLevelWithCode (code) {
  let level = { name: 'county', code: 0 }
  if (typeof code === 'string') {
    let simpleCode = code.replace(/(0+)$/g, '')
    let length = simpleCode.length
    if (length < 3) {
      level = { name: 'province', code: 1 }
    } else if (length < 5) {
      level = { name: 'city', code: 2 }
    } else if (length < 7) {
      level = { name: 'county', code: 3 }
    } else if (length < 10) {
      level = { name: 'town', code: 4 }
    } else if (length < 13) {
      level = { name: 'village', code: 5 }
    }
  }
  return level
}
export function getShowLevel (zoom) {
  let level = 0
  if (zoom > 14) {
    level = 5// village zoom>14
  } else if (zoom > 12) {
    level = 4// town 14≥zoom>11
  } else if (zoom > 9) {
    level = 3// county 11≥zoom>9
  } else if (zoom > 6) {
    level = 2// city 9≥zoom>6
  } else if (zoom > 3) {
    level = 1// province 6≥zoom>3
  }
  return level
}

// openLayers  相关的公共方法

export function getFilter (filterConfig, argus) {
  let cqlFilters = []
  let openLayerFilters = []
  filterConfig.forEach(x => {
    cqlFilters.push(this.stringFormat(x.cql_template, argus))
    let filterStr = this.stringFormat(x.ol_template, argus)
    openLayerFilters.push(eval(filterStr))
  })
  return { cqlFilters, openLayerFilters }
}

export function getLayerById (layerId, map) {
  let layers = []
  map.getLayers().forEach(x => {
    if (x.get('originConfig') && x.get('originConfig').id) {
      if (x.get('originConfig').id === layerId) {
        layers.push(x)
      }
    }
  })
  return layers
}

export function getVisibleLayer (map) {
  return map.getLayers().getArray().filter(x => {
    return x.getVisible() && x.values_.hasOwnProperty('originConfig')
  })
}

export function getGeometryCenter (geometry) {
  let center = olExtent.getCenter(geometry.getExtent())
  return center
}

export function createVectorLayer (layerId) {
  let source = new VectorSource()
  vLayer = new VectorLayer({
    source: source,
    id: 'layerId',
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new Stroke({
        color: '#ffcc33',
        width: 2
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: '#ffcc33'
        })
      })
    })
  })
}

export function changeBoundColor (layer, times, lastShow = true) {
  let style = new Style({ stroke: new Stroke({ color: '#1949f5', width: 2 }) })
  let style2 = new Style({ stroke: new Stroke({ color: '#a50021', width: 2 }) })
  let styleList = [style, style2]
  let delayTime = 1000
  times = times > 0 ? times : 1
  for (let i = 0; i < times; i++) {
    setTimeout(function () {
      layer.setStyle(style)
      console.log(layer.getStyle())
    }, delayTime * (i + 1))
    setTimeout(function () {
      layer.setStyle(style2)
      console.log(layer.getStyle())
    }, delayTime * (i + 2))
  }
  if (!lastShow) {
    setTimeout(function () {
      layer.setStyle(null)
      console.log(layer.getStyle())
    }, delayTime * (times * 2 + 1))
  }
}

export function formatWMSUrl (url) {
  let myUrl = new URL(url)
  let namespaceURI = myUrl.origin + myUrl.pathname
  let queryParams = myUrl.search.substring(1).split('&')
  let params = {}
  queryParams.forEach(x => {
    let a = x.split('=')
    params[a[0]] = a[1]
  })

  return {
    namespace: params.typeName.split(':')[0],
    namespaceURI: namespaceURI,
    version: params.version,
    layerName: [params.typeName],
    service: params.service
  }
}
export function getQuery (params, geo) {
  let options = {
    featureNS: params.namespace, // 命名空间 URI
    featurePrefix: params.namespace, // 工作区名称
    featureTypes: params.layerName, // 查询图层，可以是同一个工作区下多个图层，逗号隔开
    outputFormat: 'application/json',
    filter: olFilter.intersects(params.geometryName || 'the_geom', geo, 'EPSG:4490'),
    geometryName: params.geometryName || 'the_geom'
  }
  if (params.startIndex) {
    options.startIndex = params.startIndex
  }
  if (params.count) {
    options.count = params.count
    options.maxFeatures = params.maxFeatures
  }
  return new WFS().writeGetFeature(options)
}

export function getFields (features) {
  let defaultConfig = {
    'prop': '',
    'label': '',
    'sortable': true,
    'min-width': 40,
    'align': 'center'
  }
  let fields = []
  if (features[0].getKeys) {
    features[0].getKeys().forEach(x => {
      if (['bbox', 'geometry'].indexOf(x) < 0) {
        fields.push({ ...defaultConfig, prop: x, label: x })
      }
    })
  } else {
    features[0].keys().forEach(x => {
      if (['bbox', 'geometry'].indexOf(x) < 0) {
        fields.push({ ...defaultConfig, prop: x, label: x })
      }
    })
  }

  return fields
}

export function getFilterQuery (params, geo) {
  let options = {
    featureNS: params.namespace, // 命名空间 URI
    featurePrefix: params.namespace, // 工作区名称
    featureTypes: params.layerName, // 查询图层，可以是同一个工作区下多个图层，逗号隔开
    outputFormat: 'application/json',
    filter: olFilter.intersects('the_geom', geo, 'EPSG:4490'),
    geometryName: 'the_geom'
  }
  if (params.startIndex) {
    options.startIndex = params.startIndex
  }
  if (params.count) {
    options.count = params.count
    options.maxFeatures = params.maxFeatures
  }
  let featureRequest = new WFS().writeGetFeature(options)
  return fetch(params.namespaceURI, {// geoserver wfs地址如localhost:8080/geoserver/wfs，我是8081
    method: 'POST',
    body: new XMLSerializer().serializeToString(featureRequest)
  })
}
