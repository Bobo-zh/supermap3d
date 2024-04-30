var BaseLayerModels;
import Resource from "../common/js/language"
export default BaseLayerModels = [

    {
        url : '@/../static/images/baseLayer/baseImage.png',
        name : Resource.localImage,
        thumbnail : '@/../static/images/baseLayer/image.jpg',
        title : 'Image',
        type : 'IMAGE',
        imgsrc:'@/../static/css/cross.png',
        chooseType:false,
        isMultipleChoose:false,
        index:0
    },
    {
        url : '//dev.virtualearth.net',
        name : Resource.bingMaps,
        thumbnail : '@/../static/images/baseLayer/BingMap.jpg',
        title : 'BingMap',
        type : 'BINGMAP',
        imgsrc:'@/../static/css/cross.png',
        key:"Av63hPkCmH18oGGn5Qg3QhLBJvknZ97xbhyw3utDLRtFv7anHjXNOUQbyWBL5fK5",
        chooseType:false,
        isMultipleChoose:false,
        index :1
    },
    {
        url : 'https://[subdomain].tianditu.gov.cn/img_w/wmts',
        name : Resource.tianditu,
        thumbnail : '@/../static/images/baseLayer/tianditu.jpg',
        token:'63daddeb93bedd7502558f4170212453',
        title : '天地图',
        type : 'TIANDITU',
        imgsrc:'@/../static/css/cross.png',
        chooseType:true,
        isMultipleChoose:false,
        index:2
    },
    {
        url : 'https://a.tile.openstreetmap.org/',
        name : Resource.OpenStreetMap,
        thumbnail : '@/../static/images/baseLayer/OSM.jpg',
        title : 'Open Street Map',
        type : 'OSM',
        imgsrc:'@/../static/css/cross.png',
        chooseType:false,
        isMultipleChoose:false,
        index:3
    },
    {
        name : Resource.gridImagery,
        thumbnail : '@/../static/images/baseLayer/grad.jpg',
        title : 'Grid Image Map',
        type : 'GRIDIMAGERY',
        imgsrc:'@/../static/css/cross.png',
        chooseType:false,
        isMultipleChoose:false,
        index:4
    }
];
