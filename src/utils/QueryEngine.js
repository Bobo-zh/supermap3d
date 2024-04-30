
import {WFS} from 'ol/format'
import * as olFilter from 'ol/format/filter'
function getQueryForWFS(filter) {
    //request: 这里为 getfeature
    //typename: 发布的图层名
    //PROPERTYNAME: 需要返回的属性，如果不加则默认全部属性返回，多个属性英文逗号隔开，pg库中geometry 可以用geom 返回
    //CQL_FILTER: 查询条件，可参考官网文档
    //
    // outputformat: 输出格式，支持shp,json,csv等，详情点击官网文档
    // GML2 outputFormat=GML2
    // GML3 outputFormat=GML3
    // Shapefile outputFormat=shape-zip
    // JSON outputFormat=application/json
    // JSONP outputFormat=text/javascript
    // CSV outputFormat=csv


    let PROPERTYNAME="";//查询返回的字段，多个字段用“,”隔开
    let CQL_FILTER="";//查询条件

}
//{url:"",params:{}}
function filterQuery(url,geo) {
    var featureRequest = new WFS().writeGetFeature({
        // srsName: 'EPSG:3857',//坐标系统
        featureNS: 'http://geoserver.org/nw',//命名空间 URI
        featurePrefix: 'nationalwater',//工作区名称
        featureTypes: ['nationalwater:01fir'],//查询图层，可以是同一个工作区下多个图层，逗号隔开
        outputFormat: 'application/json',
        geometryName:"the_geom",
        // filter:olFilter.and(
        //     olFilter.equalTo("RS_CODE1","110109000001"),
        //     olFilter.intersects('the_geom',geometry)
        // )

        filter:olFilter.intersects('the_geom',geo)

    });
    fetch('http://localhost:8081/geoserver/' + 'wfs', {//geoserver wfs地址如localhost:8080/geoserver/wfs，我是8081
        method: 'POST',
        body: new XMLSerializer().serializeToString(featureRequest)
    }).then(function(response) {
        return response.json();
    }).then(function(json) {
        var features = new ol.format.GeoJSON().readFeatures(json);
        vectorSource.addFeatures(features);
        map.getView().fit(vectorSource.getExtent());//缩放到查询出的feature
    });
}
