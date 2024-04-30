/* eslint-disable */
export default function Measure(viewer) {
  debugger
  this.viewer = viewer
  this.viewer.camera=viewer.getCamera().cam_;
  this.viewer.canvas=viewer.canvas_;
  this.viewer.scene=viewer.scene_;
  this.terrainProvider = viewer.terrainProvider;
  this.handler = new Cesium.ScreenSpaceEventHandler(viewer.getCesiumScene().canvas)
  this.dataSource = new Cesium.CustomDataSource('measureData')
  viewer.getDataSources().add(this.dataSource)
}

Measure.prototype = {
  measureLength,
  measureArea,
  removeEntities,
  stopMeasure
}

function stopMeasure() {
  this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
}
function removeEntities() {
  this.dataSource.entities.removeAll()
}

/**
 *
 * @param {Object} viewer new Cesium.Viewer
 * @param {boolean} terrain 是否贴地形
 */
function measureLength(terrain = false) {
  debugger
  const viewer = this.viewer
  const terrainProvider = this.terrainProvider;
  const handler = this.handler
  const dataSource = this.dataSource
  const scene = viewer.getCesiumScene()
  const geodesic = new Cesium.EllipsoidGeodesic()
  // const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
  let activePoints = []
  let floatingPoint, activeShape
  let floatDistance = 0
  let measureDistance = 0
  handler.setInputAction(event => {
    const ray = viewer.camera.getPickRay(event.position)
    //得到三维笛卡尔坐标earthPosition
    // const earthPosition = viewer.scene.globe.pick(ray, scene)
    const earthPosition = scene.globe.pick(ray, scene)
    if (activePoints.length === 0) {
      floatingPoint = createMeasurePoint(earthPosition)
      floatingPoint.label = {
        text: new Cesium.CallbackProperty(time => {
          const distance = floatDistance = getLatestLength(activePoints)
          if (distance + measureDistance > 1000){
            return `${ ((distance + measureDistance) / 1000).toFixed(2) }km`
          }else{
            return `${ (distance + measureDistance).toFixed(2) }m`
          }
        }, false),
        showBackground: true,
        backgroundColor: new Cesium.Color(0, 0, 0, 0.5),
        //new Cesium.Cartesian2:表示一个二维笛卡尔坐标系，也就是直角坐标系（屏幕坐标系）
        backgroundPadding: new Cesium.Cartesian2(7, 5),
        font: '16px sans-serif'
      }
      createLabel(earthPosition, '起点')
      activePoints.push(earthPosition)
      const dynamicPositions = new Cesium.CallbackProperty(() => {
        return activePoints
      }, false)
      activeShape = drawMeasureShape(dynamicPositions)
    }
    if (activePoints.length > 1) {
      measureDistance += floatDistance
      if (measureDistance > 1000){
        createLabel(earthPosition, `${ (measureDistance/1000 ).toFixed(2) }km`)
      }else{
        createLabel(earthPosition, `${ measureDistance.toFixed(2) }m`)
      }
    }
    activePoints.push(earthPosition)
    createMeasurePoint(earthPosition)
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

  handler.setInputAction(event => {
    if (Cesium.defined(floatingPoint)) {
      const ray = viewer.camera.getPickRay(event.endPosition)
      const newPosition = viewer.scene.globe.pick(ray, viewer.scene)
      floatingPoint.position.setValue(newPosition)
      activePoints.pop()
      activePoints.push(newPosition)
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

  handler.setInputAction(() => {
    terminateShape()
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

  function createMeasurePoint(worldPosition) {
    return dataSource.entities.add({
      position: worldPosition,
      point: {
        color: Cesium.Color.WHITE,
        pixelSize: 8,
        outlineColor: Cesium.Color.RED,
        outlineWidth: 3,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        scaleByDistance: new Cesium.NearFarScalar(0, 0, 1, 1)
      }
    })
  }

  function getLatestLength(activePoints) {
    const length = activePoints.length
    const endPoint = activePoints[length - 1]
    const startPoint = activePoints[length - 2]
    //new Cesium.cartographic(longitude, latitude, height):A position defined by longitude, latitude, and height.
    const startCartographic = Cesium.Cartographic.fromCartesian(startPoint)
    const endCartographic = Cesium.Cartographic.fromCartesian(endPoint)
    geodesic.setEndPoints(startCartographic, endCartographic);
    var templength = Math.abs(geodesic.surfaceDistance);
    if (terrain) {
      //var res = Math.sqrt(Math.pow(templength, 2) + Math.pow(endCartographic.height - startCartographic.height, 2));
      templength = Cesium.Cartesian3.distance(startPoint,endPoint);
    }
    return templength;
  }

  function createLabel(worldPosition, text) {
    return dataSource.entities.add({
      position: worldPosition,
      label: {
        text:text,
        showBackground: true,
        backgroundColor: new Cesium.Color(0, 0, 0, 0.7),
        backgroundPadding: new Cesium.Cartesian2(7, 5),
        font: '16px sans-serif',
        fillColor: Cesium.Color.YELLOW,
        outlineColor: Cesium.Color.BLACK,
        pixelOffset: new Cesium.Cartesian2(-15, -15)
      },
      // billboard:{
      //   image:imagelogo,
      //   scale:0.7,
      //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      // }
    })
  }

  function terminateShape() {
    activePoints.pop()
    drawMeasureShape(activePoints)
    dataSource.entities.remove(floatingPoint)
    dataSource.entities.remove(activeShape)
    floatingPoint = undefined
    activeShape = undefined
    activePoints = []
    measureDistance = 0
  }

  function drawMeasureShape(positionData, callbakck) {
    return dataSource.entities.add({
      polyline: {
        positions: positionData,
        clampToGround: terrain,
        width: 3
      }
    })
  }
  // return dataSource
}

function measureArea(terrain = false) {
  const AllEnities = []
  const dataSource = this.dataSource
  let isDraw = false
  const polygonPath = []
  let polygon = null
  const handler = this.handler
  const viewer = this.viewer
  handler.setInputAction(movement => {
    let position1
    let cartographic
    const ray = viewer.scene.camera.getPickRay(movement.endPosition)
    if (ray) {
      position1 = viewer.scene.globe.pick(ray, viewer.scene)
    }
    if (position1) {
      cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1)
    }
    if (cartographic) {
      const height = viewer.scene.globe.getHeight(cartographic)
      const point = Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, height)
      if (isDraw) {
        if (polygonPath.length < 2) {
          return
        }
        if (!Cesium.defined(polygon)) {
          polygonPath.push(point)
          polygon = new CreatePolygon(polygonPath, Cesium)
          AllEnities.push(polygon)
        } else {
          polygon.path.pop()
          polygon.path.push(point)
          AllEnities.push(polygon)
        }
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

  handler.setInputAction(movement => {
    isDraw = true
    let position1
    let cartographic
    const ray = viewer.scene.camera.getPickRay(movement.position)
    if (ray) {
      position1 = viewer.scene.globe.pick(ray, viewer.scene)
    }
    if (position1) {
      cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1)
    }
    if (cartographic) {
      const height = viewer.scene.globe.getHeight(cartographic)
      const point = Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, height)
      if (isDraw) {
        polygonPath.push(position1)
        const temp = dataSource.entities.add({
          position: point,
          point: {
            show: true,
            color: Cesium.Color.SKYBLUE,
            pixelSize: 3,
            outlineColor: Cesium.Color.YELLOW,
            outlineWidth: 1
          }
        })
        AllEnities.push(temp)
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

  handler.setInputAction(() => {
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    if (polygonPath.length >= 2) {
      let label = String(terrain?PlanarPolygonAreaMeters(polygon.path):SphericalPolygonAreaMeters(polygon.path));

      label = label.substr(0, label.indexOf('.', 0))
      let text
      if (label.length < 6) {
        text = `${ label }平方米`
      } else {
        label = String(label / 1000000)
        label = label.substr(0, label.indexOf('.', 0) + 3)
        text = `${ label }平方公里`
      }
      const lastpoint = dataSource.entities.add({
        name: '多边形面积',
        position: polygon.path[polygon.path.length - 1],
        point: {
          pixelSize: 5,
          color: Cesium.Color.RED,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        label: {
          text,
          showBackground: true,
          backgroundPadding: new Cesium.Cartesian2(7, 5),
          backgroundColor: new Cesium.Color(0, 0, 0, 0.7),
          font: '16px sans-serif',
          fillColor: Cesium.Color.YELLOW,
          pixelOffset: new Cesium.Cartesian2(20, -40)
        }
      })

      AllEnities.push(lastpoint)
    }
    viewer.trackdEntity = undefined
    isDraw = false
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

  const CreatePolygon = (function () {
    function _(positions, cesium) {
      if (!Cesium.defined(positions)) {
        throw new Cesium.DeveloperError('positions is required!');
      }
      if (positions.length < 3) {
        throw new Cesium.DeveloperError('positions 的长度必须大于等于3');
      }

      this.options = {
        polygon: {
          show: true,
          hierarchy: undefined,
          outline: true,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,
          material: Cesium.Color.YELLOW.withAlpha(0.5)
        }
      };
      this.path = positions;
      this.hierarchy = { positions };
      this._init();
    }

    _.prototype._init = function () {
      const _self = this;
      const _update = function () {
        return _self.hierarchy;
      };
      //实时更新polygon.hierarchy
      this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
      const oo = dataSource.entities.add(this.options);
      AllEnities.push(oo);
    };

    return _;
  })();

  //微元法求面积
  const countAreaInCartesian3 = function (ps) {
    console.log(ps, 'ps')
    let s = 0;
    for (let i = 0; i < ps.length-2; i++) {
      const p1 = ps[i];
      let p2 = ps[(i+1)%(ps.length-2)];

      s += p1.x * p2.y - p2.x * p1.y;
    }
    return Math.abs(s / 2);
  }
  const earthRadiusMeters = 6371000.0;
  const radiansPerDegree = Math.PI / 180.0;
  const degreesPerRadian = 180.0 / Math.PI;
  const metersPerDegree = 2.0 * Math.PI * earthRadiusMeters / 360.0;
  /**曲面多边形面积计算 */
  function SphericalPolygonAreaMeters(points) {
    let changePoints=[];
    for(let m=0;m<points.length-2;m++){
      let cartographic = Cesium.Cartographic.fromCartesian(points[m]);
      let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
      let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
      let heightString = cartographic.height;
      changePoints.push({ lon: longitudeString, lat: latitudeString ,hei:heightString});
    }
    let totalAngle = 0;
    for (var i = 0; i < changePoints.length; i++) {
        var j = (i + 1) % changePoints.length;
        var k = (i + 2) % changePoints.length;
        totalAngle += Angle(changePoints[i], changePoints[j], changePoints[k]);
    }
    var planarTotalAngle = (changePoints.length - 2) * 180.0;
    var sphericalExcess = totalAngle - planarTotalAngle;
    if (sphericalExcess > 420.0) {
        totalAngle = changePoints.length * 360.0 - totalAngle;
        sphericalExcess = totalAngle - planarTotalAngle;
    } else if (sphericalExcess > 300.0 && sphericalExcess < 420.0) {
        sphericalExcess = Math.abs(360.0 - sphericalExcess);
    }
    return sphericalExcess * radiansPerDegree * earthRadiusMeters * earthRadiusMeters;
  }
   /*角度*/
   function Angle (p1, p2, p3) {
    var bearing21 = Bearing(p2, p1);
    var bearing23 = Bearing(p2, p3);
    var angle = bearing21 - bearing23;
    if (angle < 0) {
        angle += 360;
    }
    return angle;
  }
  /*方向*/
  function Bearing (from, to) {
    var lat1 = from.lat * radiansPerDegree;
    var lon1 = from.lon * radiansPerDegree;
    var lat2 = to.lat * radiansPerDegree;
    var lon2 = to.lon * radiansPerDegree;
    var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
    if (angle < 0) {
        angle += Math.PI * 2.0;
    }
    angle = angle * degreesPerRadian;
    return angle;
  }
  /*平面多边形面积*/
  function PlanarPolygonAreaMeters(pointsArray) {
    let points=[];
    for(let m=0;m<pointsArray.length-2;m++){
      let cartographic = Cesium.Cartographic.fromCartesian(pointsArray[m]);
      let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
      let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
      points.push([longitudeString, latitudeString ]);
    }
    let a = 0;
    for (let i = 0; i < points.length; ++i) {
      let j = (i + 1) % points.length;
      var xi = points[i][0] * metersPerDegree * Math.cos(points[i][1] * radiansPerDegree);
      var yi = points[i][1] * metersPerDegree;
      var xj = points[j][0] * metersPerDegree * Math.cos(points[j][1] * radiansPerDegree);
      var yj = points[j][1] * metersPerDegree;
      a += xi * yj - xj * yi;
    }
    return Math.abs(a / 2);
  }
  //地形面积近似测量
  function getArea(points) {
    let res = 0;
    let changePoints=[];
    for(let m=0;m<points.length-2;m++){
      let cartesian1 = new Cesium.Cartesian3(points[m].x , points[m].y, points[m].z);
      let cart = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian1);
      let cartographic = Cesium.Cartographic.fromCartesian(points[m]);
      let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
      let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);

      let heightString = cartographic.height;
      //changePoints.push({ lon: longitudeString, lat: latitudeString ,hei:heightString});
      changePoints.push(cartographic);
    }
    //拆分三角曲面
    for (let i = 0; i < changePoints.length-2; i++) {
      let j = (i + 1) % changePoints.length;
      let k = (i + 2) % changePoints.length;
      // let dis_temp1 = compdistance(changePoints[j], changePoints[0]);
      // let dis_temp2 = compdistance(changePoints[k], changePoints[0]);
      // let dis_temp3 = compdistance(changePoints[j], changePoints[k]);
      // let pp = (dis_temp1+dis_temp2+dis_temp3)/2;
      // res += Math.sqrt(pp*(pp-dis_temp1)*(pp-dis_temp2)*(pp-dis_temp3));
      res += getTriangleArea(changePoints[0],changePoints[j],changePoints[k]);

    }
    return Math.abs(res.toFixed(4));
  }

  function compdistance(point1cartographic,point2cartographic){
    // let point1cartographic = Cesium.Cartographic.fromCartesian(point1);
    // let point2cartographic = Cesium.Cartographic.fromCartesian(point2);
    /**根据经纬度计算出距离**/
    let geodesic = new Cesium.EllipsoidGeodesic();
    geodesic.setEndPoints(point1cartographic, point2cartographic);
    let s = geodesic.surfaceDistance;
    //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
    //返回两点之间的距离
    let height1 = viewer.scene.globe.getHeight(point1cartographic);
    let height2 = viewer.scene.globe.getHeight(point2cartographic);
    s = Math.sqrt(Math.pow(s, 2) + Math.pow(height2 - height1, 2));
    return s;
  }

  function getTriangleArea(pointA, pointB, pointC){
    let dis_temp1 = compdistance(pointA,pointB);
    let dis_temp2 = compdistance(pointB,pointC);
    let dis_temp3 = compdistance(pointC,pointA);
    let pp = (dis_temp1+dis_temp2+dis_temp3)/2;
    var sumArea = Math.sqrt(pp*(pp-dis_temp1)*(pp-dis_temp2)*(pp-dis_temp3));
    if (sumArea<1000000) {
      return Math.abs(sumArea);
    }else{
      let midAB_x = (Cesium.Math.toDegrees(pointA.longitude)+Cesium.Math.toDegrees(pointB.longitude))/2;
      let midAB_y = (Cesium.Math.toDegrees(pointA.latitude)+Cesium.Math.toDegrees(pointB.latitude))/2;
      let midBC_x = (Cesium.Math.toDegrees(pointB.longitude)+Cesium.Math.toDegrees(pointC.longitude))/2;
      let midBC_y = (Cesium.Math.toDegrees(pointB.latitude)+Cesium.Math.toDegrees(pointC.latitude))/2;
      let midCA_x = (Cesium.Math.toDegrees(pointA.longitude)+Cesium.Math.toDegrees(pointC.longitude))/2;
      let midCA_y = (Cesium.Math.toDegrees(pointA.latitude)+Cesium.Math.toDegrees(pointC.latitude))/2;
      let midAB = Cesium.Cartographic.fromDegrees(midAB_x,midAB_y);
      let midBC = Cesium.Cartographic.fromDegrees(midBC_x,midBC_y);
      let midCA = Cesium.Cartographic.fromDegrees(midCA_x,midCA_y);

      sumArea = getTriangleArea(midAB,midBC,midCA);
      sumArea += getTriangleArea(pointA,midAB,midCA);
      sumArea += getTriangleArea(midAB,pointB,midBC);
      sumArea += getTriangleArea(midBC,pointC,midCA);
      return Math.abs(sumArea);
    }
  }
}
