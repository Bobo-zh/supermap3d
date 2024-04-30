<template>
  <div id="cesiumContainer" ref="viewer">
    <!-- 部件选择择组件 -->
    <tool-bar></tool-bar>
    <!--    工具组件-->
    <compass></compass>
    <china-epidemic-map></china-epidemic-map>
    <world-epidemic-map></world-epidemic-map>
    <init-echarts></init-echarts>
  </div>
</template>

<script>
import BaseSpecialEffectModels from '../../data/BaseSpecialEffectsData.js'
import InitEcharts from '../combinations/initecharts/initEcharts'
import BaseLayerModels from '../../data/BaseLayerData.js'
import BaseTerrainModels from '../../data/BaseTerrainData.js'
import mapOptions from './mapOptions'
export default {
  name: 'sm-viewer',
  components: { InitEcharts },
  props: {
    combination: {
      //组合接口
      type: Boolean
    },
    sceneUrl: {
      //场景接口
      type: String
    },
    s3mScps: {
      //s3m图层接口
      type: Array
    },
    collapsed: {
      //是否折叠
      type: Boolean
    }
  },
  data() {
    return {
      sharedState: store.state,
      BaseSpecialEffectModels: BaseSpecialEffectModels,
      mapConfig: null
    }
  },
  computed: {
    isInitViewer: function () {
      return this.sharedState.isInitViewer
    }
  },
  methods: {
    init() {
      //初始化viewer
      if (window.viewer) {
        return
      }
      let viewer
      let isPCBroswer = (window.isPCBroswer =
        Cesium.FeatureDetection.isPCBroswer())
      let skyBoxRight = this.BaseSpecialEffectModels[1].skyBoxRight
      let skyBoxLeft = this.BaseSpecialEffectModels[1].skyBoxLeft
      let skyBoxFront = this.BaseSpecialEffectModels[1].skyBoxFront
      let skyBoxBack = this.BaseSpecialEffectModels[1].skyBoxBack
      let skyBoxUp = this.BaseSpecialEffectModels[1].skyBoxUp
      let skyBoxDown = this.BaseSpecialEffectModels[1].skyBoxDown
      if (isPCBroswer) {
        viewer = new Cesium.Viewer('cesiumContainer', {
          selectionIndicator: false,
          timeline: true,
          baseLayerPicker: false,
          infoBox: false,
          geocoder: false,
          navigation: false
        })
        viewer.scene.moon.show = false
        viewer.cesiumWidget.creditContainer.style.display = 'none'
        document.getElementsByClassName(
          'cesium-viewer-timelineContainer'
        )[0].style.visibility = 'hidden' //隐藏时间线控件
        viewer.scene.globe.enableLighting = false
        let wxSkyBox = new Cesium.SkyBox({
          sources: {
            positiveX: skyBoxRight,
            negativeX: skyBoxLeft,
            positiveY: skyBoxFront,
            negativeY: skyBoxBack,
            positiveZ: skyBoxUp,
            negativeZ: skyBoxDown
          }
        })
        let initialSkyBox = function () {
          if (viewer.scene.frameState.passes.render) {
            wxSkyBox.update(viewer.scene.frameState, true)
            viewer.scene.postRender.removeEventListener(initialSkyBox)
          }
        }
        viewer.scene.postRender.addEventListener(initialSkyBox)
        this.BaseSpecialEffectModels[1].currentSky = wxSkyBox
        this.BaseSpecialEffectModels[1].defaultSky = viewer.scene.skyBox
      } else {
        viewer = new Cesium.Viewer('cesiumContainer', {
          selectionIndicator: false,
          infoBox: false,
          skyBox: false,
          navigation: false
        })
        let scene = viewer.scene
        if (Cesium.defined(scene.sun)) {
          scene.globe.enableLighting = false
        }
        if (Cesium.defined(scene.moon)) {
          scene.moon.show = false
        }
        document.documentElement.style.height = window.innerHeight + 'px'
        document.addEventListener(
          'touchmove',
          function (e) {
            e.preventDefault()
          },
          false
        )
        store.setCompass(false) //关闭罗盘等
      }
      let _code = this.getUrlKey('code')
      if (_code && _code.length >= 6) {
        _code = _code.substr(0, 6)
        this.mapConfig = MAPCONFIG[_code]
      } else this.mapConfig = MAPCONFIG['341103']
      window.viewer = viewer
      window.scene = viewer.scene
      let widget = viewer.cesiumWidget
      // iEarth进行初始化设置
      // viewer.scene.globe.depthTestAgainstTerrain = true;
      viewer.scene.globe.baseColor = Cesium.Color.BLACK // 没有影像图层时地球的底色
      if (viewer.geocoder) {
        // 请开发者自行到supermap online官网（http://www.supermapol.com/）申请key
        viewer.geocoder.viewModel.geoKey = 'fvV2osxwuZWlY0wJb8FEb2i5'
        document.querySelector('.cesium-geocoder-input').placeholder =
          Resource.searchPlaceHolder
      }
      this.addLayer()
      viewer.camera.flyTo({
        destination: new Cesium.Cartesian3(...this.mapConfig.position),
        duration: 0,
        complete: () => {
          viewer.camera.flyTo({
            destination: new Cesium.Cartesian3(...this.mapConfig.position),
            duration: 1,
            complete: () => {
              common.initHandler('Polygon') //初始化全局常用的画面的drawhandler
              store.setToolBarShow(true) //显示工具栏
              this.addDantihua()
            }
          })
          setTimeout(() => {
            document.getElementById('loadingbar').remove() //移除加载动画
          }, 1000)
        }
      })
      store.setisInitViewer(true) //初始化viewer标志
    },
    // 通过点击查询用于表示单体化的面要素，添加到场景中高亮显示。mode=1 空间查询 2 sql查询
    queryByPoint(queryPoint, mode) {
      var dataServiceUrl = this.mapConfig.dataServiceUrl // 数据服务URL
      var dataSourceName = this.mapConfig.dataSourceName // 数据源名称
      var dataSetName = this.mapConfig.dataSetName // 数据集名称
      var queryObj = null
      if (mode == 1)
        queryObj = {
          getFeatureMode: 'SPATIAL',
          spatialQueryMode: 'INTERSECT',
          datasetNames: [dataSourceName + ':' + dataSetName],
          geometry: {
            id: 0,
            parts: [1],
            points: [queryPoint],
            type: 'POINT'
          }
        }
      else if (mode == 2)
        queryObj = {
          getFeatureMode: 'SQL',
          datasetNames: [dataSourceName + ':' + dataSetName],
          queryParameter: {
            attributeFilter: queryPoint
          }
        }

      let queryObjJSON = JSON.stringify(queryObj) // 转化为JSON字符串作为查询参数

      //先发送POST请求
      window.axios
        .post(dataServiceUrl, queryObjJSON)
        .then((result) => {
          var resultObj = result.data
          if (resultObj.featureCount > 0) {
            this.addClapFeature(resultObj.features[0], mode)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },

    // 将数据服务查询到的要素添加到场景中高亮显示，表示选中效果。
    addClapFeature(feature, mode) {
      console.log(feature)
      let zdInfos = { zd: {}, qlr: {}, fw: [], syq: {}, cbd: [],shyqrList: [] }
      this.getAttrData(
        feature.fieldValues[feature.fieldNames.indexOf('ZJDDM')],
        feature.fieldValues[feature.fieldNames.indexOf('SUYQRDM')],
        zdInfos
      )
      var lonLatArr = this.getLonLatArray(feature.geometry.points)
      viewer.entities.add({
        id: 'identify-area',
        name: '单体化标识面',
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray(lonLatArr),
          material: new Cesium.Color(1.0, 0.0, 0.0, 0.3)
        },
        classificationType: Cesium.ClassificationType.S3M_TILE // 贴在S3M模型表面
      })

      if (mode == 2) {
        var _entity = viewer.entities.getById('identify-area')
        viewer.flyTo(_entity, {
          duration: 1.5,
          offset: new Cesium.HeadingPitchRange(0, -45, 200)
        })
      }
    },

    // 得到[经度,纬度,经度,纬度...]形式的数组，用于构造面。
    getLonLatArray(points) {
      var point3D = []
      points.forEach(function (point) {
        point3D.push(point.x)
        point3D.push(point.y)
      })
      return point3D
    },
    addDantihua() {
      let scpArr = []
      if (Array.isArray(this.mapConfig.scpUrl)) {
        scpArr = [...this.mapConfig.scpUrl]
      } else {
        scpArr.push(this.mapConfig.scpUrl)
      }
      var promise = viewer.scene.addS3MTilesLayerByScp(scpArr[0].url, {
        name: scpArr[0].name
      })

      promise.then((layer) => {
        viewer.scene.camera.setView({
          // 先定位，开始渲染定位区域的倾斜
          destination: new Cesium.Cartesian3(...this.mapConfig.position),
          orientation: {
            heading: 0.06673934677180249,
            pitch: -0.49273715480421654,
            roll: 6.283185307179586
          }
        })
        //模型抬高10米避免地形遮盖
        layer.style3D.bottomAltitude = this.mapConfig.baseHeight || 5
        mapOptions.createlatlng()
        window.addEventListener(
          'message',
          (evt) => {
            this.recvUIMessage(evt.data.method, evt.data.params || '')
          },
          false
        )
        this.SendUIMessage('3dMapLoaded', '三维加载完毕')
        var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
        handler.setInputAction((e) => {
          // 首先移除之前添加标识实体
          viewer.entities.removeById('identify-area')
          // 获取点击位置笛卡尔坐标
          var position = scene.pickPosition(e.position)
          // 从笛卡尔坐标获取经纬度
          var cartographic = Cesium.Cartographic.fromCartesian(position)
          var longitude = Cesium.Math.toDegrees(cartographic.longitude)
          var latitude = Cesium.Math.toDegrees(cartographic.latitude)

          var queryPoint = {
            // 查询点对象
            x: longitude,
            y: latitude
          }

          this.queryByPoint(queryPoint, 1)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
      })

      if (scpArr.length > 1) {
        scpArr.forEach((element, index) => {
          if (index > 0) {
            let promise = viewer.scene.addS3MTilesLayerByScp(element.url, {
              name: element.name
            })
            promise.then((layer) => {
              //模型抬高10米避免地形遮盖
              layer.style3D.bottomAltitude = this.mapConfig.baseHeight || 5
            })
          }
        })
      }
    },
    isSupermapOL() {
      if (Window.isSuperMapOL === 'true') {
        document.getElementById('infoManageLogin').style.display = 'block'
      }
    },
    translateData: function (feature) {
      let coord = []
      function getChild(data, outRes) {
        if (data[0] instanceof Array) {
          data.forEach((child) => {
            getChild(child, outRes)
          })
        } else {
          outRes.push(...data)
        }
      }
      getChild(feature.geometry.coordinates, coord)
      return coord
    },
    addLayer: function () {
      let viewer = window.viewer
      let imageryProvider
      let initImageLayer = BaseLayerModels.find((item) => {
        return item.chooseType
      })

      if (initImageLayer) {
        let imageryLayerCollection = viewer.scene.globe._imageryLayerCollection
        switch (initImageLayer.type) {
          case 'BINGMAP':
            imageryProvider = new Cesium.BingMapsImageryProvider({
              url: initImageLayer.url,
              key: initImageLayer.key
            })
            break
          case 'TIANDITU':
            imageryProvider = new Cesium.TiandituImageryProvider({
              url: initImageLayer.url,
              token: initImageLayer.token
            })
            break
          case 'IMAGE':
            imageryProvider = new Cesium.SingleTileImageryProvider({
              url: initImageLayer.url
            })
            break
          case 'OSM':
            imageryProvider = new Cesium.createOpenStreetMapImageryProvider({
              url: initImageLayer.url
            })
            break
          case 'GRIDIMAGERY':
            imageryProvider = imageryProvider
            break
          default:
            break
        }

        let layer = imageryLayerCollection.get(0)
        if (layer) {
          imageryLayerCollection.remove(layer)
          imageryLayerCollection.addImageryProvider(imageryProvider, 0)
        }
      }

      let initTerrainLayer = BaseTerrainModels.find((item) => {
        return item.chooseType
      })
      if (initTerrainLayer) {
        viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider({
          ellipsoid: viewer.scene.globe.ellipsoid
        })
        switch (initTerrainLayer.type) {
          case 'StkTerrain':
            viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
              url: initTerrainLayer.url,
              isSct: true
            })
            window.terrainProvider = viewer.terrainProvider
            break
          case 'tianDiTuTerrain':
            let t_Provider = new Cesium.TiandituTerrainProvider({
              token: initTerrainLayer.token
            })
            viewer.terrainProvider = t_Provider
            window.terrainProvider = viewer.terrainProvider
            break
          case 'supermapOnlineTerrain':
            viewer.terrainProvider = new Cesium.SCTTerrainProvider({
              urls: [initTerrainLayer.url]
            })
            window.terrainProvider = viewer.terrainProvider
            break
          default:
            break
        }
      }
    },
    async searchByCode(data) {
      viewer.entities.removeById('identify-area')
      if (data.code.length > 10) {
        let sqlStr = "ZJDDM = '" + data.code + "'"
        this.queryByPoint(sqlStr, 2)
      } else {
        let syqrData = await mapOptions.api.post('/api/shyqr/list', {
          qlrmc$RHK: data.code
        })
        if (syqrData.data.length > 0) {
          let sqlStr = "ZJDDM = '" + syqrData.data[0].zjddm + "'"
          this.queryByPoint(sqlStr, 2)
        }
      }
    },
    recvUIMessage(name, data) {
      if (name) {
        console.log(
          `接收到客户端发来的消息-----> ${name} ----> ${
            typeof data === 'object' ? JSON.stringify(data) : data
          }`
        )
      }
      if (name === '三维查询') {
        this.searchByCode(data)
      }
    },
    SendUIMessage(name, data) {
      window.parent.postMessage(
        {
          method: name,
          params: data
        },
        '*'
      )
    },
    async getAttrData(zjddm, suyqrdm, zdInfos) {
      
      let syqrData = await mapOptions.api.post('/api/shyqr/list', {
        zjddm$RHK: zjddm
      })

      if(syqrData.result) syqrData.data = syqrData.result
      
      if (syqrData.data.length > 0)
        zdInfos.qlr = mapOptions.transDicData(
          mapOptions.MAP_DICT.qlr,
          syqrData.data[0]
        )

        zdInfos.shyqrList.push(zdInfos.qlr)
      
      let zdData = await mapOptions.api.post('/api/zjdzd/list', {
        zjddm$RHK: zjddm
      })
      if(zdData.result) zdData.data = zdData.result
      if (zdData.data.length > 0)
        zdInfos.zd = mapOptions.transDicData(
          mapOptions.MAP_DICT.zd,
          zdData.data[0]
        )
      let suyqrData = await mapOptions.api.post('/api/suyqr/list', {
        suyqrdm$RHK: suyqrdm
      })
      if(suyqrData.result) suyqrData.data = suyqrData.result
      if (suyqrData.data.length > 0)
        zdInfos.syq = mapOptions.transDicData(
          mapOptions.MAP_DICT.suqr,
          suyqrData.data[0]
        )
      let zrzData = await mapOptions.api.post('/api/zrz/list', {
        zjddm$RHK: zjddm
      })
      if(zrzData.result) zrzData.data = zrzData.result
      if (zrzData.data.length > 0) {
        zrzData.data.forEach((element) => {
          zdInfos.fw.push(
            mapOptions.transDicData(mapOptions.MAP_DICT.fw, element)
          )
        })
      }
      this.SendUIMessage('mapInfos', {
        type: 1,
        data: zdInfos,
        mode: 3
      })
    },
    getUrlKey(name) {
      return (
        decodeURIComponent(
          (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(
            location.href
          ) || ['', ''])[1].replace(/\+/g, '%20')
        ) || null
      )
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style lang="scss"  scoped>
@import 'smViewer';
</style>
<style lang="scss">
.latlng-show1 {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: block;
  background: rgba(0, 0, 0, 0.3);
  padding: 0 10px;
  .item1 {
    &:not(:last-child) {
      margin-right: 5px;
    }
  }
}
</style>
