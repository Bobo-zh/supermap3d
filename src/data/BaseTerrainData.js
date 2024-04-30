var BaseTerrainModels;
import Resource from "../common/js/language"
export default BaseTerrainModels = [
  {
    url : 'https://maptiles.supermapol.com/iserver/services/3D-local3DCache-GlobalTIN30M/rest/realspace/datas/Global_TIN_30M',
    name : Resource.supermapOnlineTerrain,
    thumbnail : '@/../static/images/baseLayer/SuperMap.jpg',
    title : 'Terrain',
    imgsrc:'@/../static/css/cross.png',
    type : 'supermapOnlineTerrain',
    chooseType:true,
    index :0
  },
  {
    url : '',
    token:"63daddeb93bedd7502558f4170212453",
    name : Resource.tiandituTerrain,
    thumbnail : '@/../static/images/baseLayer/tdt-1.jpg',
    title : 'Terrain',
    imgsrc:'@/../static/css/cross.png',
    type : 'tianDiTuTerrain',
    chooseType:false,
    index:1
    },
  {
    url : "https://www.supermapol.com/realspace/services/3D-stk_terrain/rest/realspace/datas/info/data/path",
    name : Resource.stkTerrain,
    thumbnail : '@/../static/images/baseLayer/STK.jpg',
    title : 'Terrain',
    imgsrc:'@/../static/css/cross.png',
    type : 'StkTerrain',
    chooseType:false,
    index:2
  },
  {
    url : "http://120.55.163.126:8090/iserver/services/3D-ahdx/rest/realspace/datas/%E5%AE%89%E5%BE%BD%E7%9C%81%E5%9C%B0%E5%BD%A2%E7%BC%93%E5%AD%98",
    name : '地形数据',
    thumbnail : '@/../static/images/baseLayer/STK.jpg',
    title : 'Terrain',
    imgsrc:'@/../static/css/cross.png',
    type : 'StkTerrain',
    chooseType:false,
    index:3
  }
];
