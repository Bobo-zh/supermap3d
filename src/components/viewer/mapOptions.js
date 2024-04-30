import axios from "axios";
const qs = require("qs");

const api = {
  async get(url, data) {
    try {
      let res = await axios.get(url, { params: data });
      res = res.data;
      return new Promise((resolve) => {
        if (res.code == "0" || res.code == "S200") {
          resolve(res);
        } else {
          resolve(res);
        }
      });
    } catch (err) {
      alert("服务器出错");
      console.log(err);
    }
  },
  async post(url, data) {
    try {
      let res = await axios.post(url, qs.stringify(data));
      res = res.data;
      return new Promise((resolve, reject) => {
        if (res.code == "0" || res.code == "S200") {
          resolve(res);
        } else {
          reject(res);
        }
      });
    } catch (err) {
      // return (e.message)
      alert("服务器出错");
      console.log(err);
    }
  },
};

const MAP_DICT = {
  zd: {
    bsm: '标识码',
    ysdm: '要素代码',
    suyqrdm: '所有权人代码',
    zjddm: '宅基地代码',
    zddm: '宗地代码',
    bdcdyh: '不动产单元号',
    zl: '坐落',
    zldwdm: '坐落单位代码',
    zdmj: '宗地面积',
    yt: '用途',
    dj: '等级',
    jg: '价格',
    zdtzm: '宗地特征码',
    qllx: '权利类型',
    qlxz: '权利性质',
    qlsdfs: '权利设定方式',
    rjl: '容积率',
    jzmd: '建筑密度',
    jzxg: '建筑限高',
    zdszd: '宗地四至- 东',
    zdszn: '宗地四至- 南',
    zdszx: '宗地四至- 西',
    zdszb: '宗地四至- 北',
    zdt: '宗地图',
    tfh: '图幅号',
    djh: '地籍号',
    sjly: '数据来源',
    bz: '备注'
  },
  qlr: {
    shyqrdm: '使用权人代码',
    bdcdyh: '不动产单元号',
    zjddm: '宅基地代码',
    nmfwdm: '农民房屋代码',
    sxh: '顺序号',
    shyqrdbxm: '使用权人代表姓名',
    sfczr: '是否持证人',
    shyqrdbzjlx: '证件类型',
    shyqrdbzjhm: '证件号码',
    fzjg: '发证机关',
    hjszss: '户籍所在省市',
    dz: '地址',
    dhL: '电话',
    yb: '邮编',
    qlrlx: '权利人类型',
    qlbl: '权利比例',
    gyfs: '共有方式',
    gyqk: '共有情况'
  },
  fw: {
    bsm: '标识码',
    ysdm: '要素代码',
    zjddm: '宅基地代码',
    zh: '幢号',
    zrzh: '自然幢号',
    jgrq: '竣工日期',
    jzwgd: '建筑物高度',
    zzdmj: '幢占地面积',
    zydmj: '幢用地面积',
    scjzmj: '实测建筑面积',
    zcs: '总层数',
    dscs: '地上层数',
    dxcs: '地下层数',
    dxsd: '地下深度',
    fwjg: '房屋结构',
    sjly: '数据来源',
    bz: '备注'
  },
  suqr : {
    suyqrdm: "所有权人代码",
    suyqrmc: "所有权人名称",
    dbrxm: "代表人姓名",
    dbrlxdh:"代表人电话"
  },
  cbd: {
    bsm: "标识码",
    ysdm: "要素代码",
    dkbm: "地块编码",
    dkmc: "地块名称",
    syqxz: "所有权性质",
    dklb: "地块类别",
    tdlylx: "土地利用类型",
    dldj: "地力等级",
    tdyt: "土地用途",
    sfjbnt: "是否基本农田",
    scmj: "实测面积",
    dz: "地块东至",
    xz: "地块西至",
    nz: "地块南至",
    bz: "地块北至",
    dkbzxx: "地块备注信息",
    zjrxm: "指界人姓名",
    cbfmc: "承包方名称",
    cbfbm: "承包方编码",
    fbfbm: "发包方编码",
    htmj: "合同面积",
    yhtmj: "原合同面积",
    cbjyqqdfs: "承包经营权取得方式",
  },
};

export default {
  MAP_DICT,
  transDicData,
  api,
  createlatlng
};

 function createlatlng() {
  const a = document.createElement("div");
  a.className = "latlng-show1";
  a.id = "latlng-show1";
  //初始状态，鼠标不移动，不显示
  a.style.display = "none";
  let b =
    '<span class="lng item1"><span class="title9">经度：</span><span id="lngVal"></span></span><span class="lat item1"><span class="title9">纬度：</span><span id="latVal"></span></span><span class="alt item1"><span class="title9">视角高度：</span><span id="altVal"></span><span class="unit">km</span></span>';
  a.innerHTML = b;
  window.viewer.container.appendChild(a);
  //具体事件的实现
  var ellipsoid = window.viewer.scene.globe.ellipsoid;
  var handler = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas);
  const self = this;
  handler.setInputAction(function(movement) {
    //捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点
    var cartesian = window.viewer.camera.pickEllipsoid(
      movement.endPosition,
      ellipsoid
    );
    if (cartesian) {
      //将笛卡尔三维坐标转为地图坐标（弧度）
      var cartographic = window.viewer.scene.globe.ellipsoid.cartesianToCartographic(
        cartesian
      );
      //将地图坐标（弧度）转为十进制的度数
      var lat_String = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);
      var log_String = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
      var alti_String = (
        window.viewer.camera.positionCartographic.height / 1000
      ).toFixed(2);

      const x = document.querySelector("#latlng-show1 #lngVal");
      const y = document.querySelector("#latlng-show1 #latVal");
      const z = document.querySelector("#latlng-show1 #altVal");
      x.innerText = log_String;
      y.innerText = lat_String;
      z.innerText = alti_String;
      b = `经度：${x}  纬度：${y}`
      document.querySelector("#latlng-show1").style.display = "block";
    } else {
      document.querySelector("#latlng-show1").style.display = "none";
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
};

/**
 * 数据key翻译
 *
 * @param {*} DIC
 * @param {*} props
 * @returns
 */
function transDicData(DIC, props) {
  var _zd = {};
  for (const key in DIC) {
    if (props.hasOwnProperty(key)) {
      var element = DIC[key];
      var _curValue = props[key];
      var curValue = null;
      if (_curValue == null || _curValue == '' || _curValue == " ") {
        curValue = '';
      } else if (key === "shape_length") {
        curValue = _curValue.toFixed(2) + "米";
      } else if (key === "shape_area") {
        curValue = _curValue.toFixed(2) + "平方米";
      } else if (key === "type") {
        var typeNams = [
          "",
          "村庄道路用地",
          "水域",
          "留白用地",
          "混合式住宅用地",
          "一般农田",
          "国有建设用地",
          "设施农用地",
          "其他农林用地",
          "林地",
          "基本农田",
        ];
        curValue = typeNams[_curValue];
      } else if (key === "sfczr") {
        curValue = _curValue == 1 ? "是" : "否";
      } else if (key === "zjlx" || key === "shyqrdbzjlx") {
        var zjTypes = {
          "01": "身份证",
          "02": "港澳台身份证",
          "03": "护照",
          "04": "户口簿",
          "05": "军官证（士兵证）",
          "06": "组织机构代码",
          "07": "营业执照",
          "08": "其它",
        };
        curValue = zjTypes[_curValue];
      } else if (key === "qlrlx") {
        var zjTypes = {
          "01": "个人",
          "02": "企业",
          "03": "事业单位",
          "04": "国家机关",
          "05": "农村集体经济组织",
          "10": "个人",
          "20": "企业",
          "30": "事业单位",
          "40": "国家机关",
          "50": "农村集体经济组织",
          "99": "其它",
        };
        curValue = zjTypes[_curValue] + "(" + _curValue + ")";
      } else if (key === "gyfs") {
        var zjTypes = {
          "0": "单独所有",
          "1": "共同共有",
          "2": "按份共有",
          "3": "其它共有",
        };
        curValue = zjTypes[_curValue] + "(" + _curValue + ")";
      } else if (key === "gyfs") {
        var zjTypes = {
          "0": "单独所有",
          "1": "共同共有",
          "2": "按份共有",
          "3": "其它共有",
        };
        curValue = zjTypes[_curValue] + "(" + _curValue + ")";
      } else if (key === "zdmj") {
        if (_curValue > 500) curValue = (_curValue / 666.7).toFixed(2) + "亩";
        else curValue = _curValue.toFixed(2) + "平方米";
      } else if (key === "zt") {
        var zjTypes = {
          "0": "无效",
          "1": "有效",
          "2": "待定",
        };
        curValue = zjTypes[_curValue] + "(" + _curValue + ")";
      } else if (key === "zdtzm") {
        var zjTypes = {
          JA: "集体土地所有权宗地",
          JC: "宅基地使用权宗地",
        };
        curValue = zjTypes[_curValue] + "(" + _curValue + ")";
      } else if (key === "qllx1") {
        var zjTypes = {
            "1": "集体土地所有权",
            "2": "国家土地所有权",
            "3": "国有建设用地使用权",
            "4": "国有建设用地使用权/房屋所有权",
            "5": "宅基地使用权",
            "6": "宅基地使用权/房屋所有权",
            "7": "集体建设用地使用权",
            "8": "集体建设用地使用权/房屋所有权",
            "9": "土地承包经营权",
            "10": "土地承包经营权/森林、林木所有权",
            "11": "林地使用权",
            "12": "林地使用权/森林、林木使用权",
            "13": "草原使用权",
            "14": "水域滩涂养殖权",
            "15": "海域使用权",
            "16": "海域使用权/构（建）筑物所有权",
            "17": "无居民海岛使用权",
            "18": "无居民海岛使用权/构（建）筑物所有权",
            "19": "地役权",
            "20": "取水权",
            "21": "探矿权",
            "22": "采矿权",
            "99": "其它权利",
        };
        curValue = zjTypes[_curValue] + "(" + _curValue + ")";
    } else if (key === "qlxz1") {
        var zjTypes = {
            "203": "批准拨用",
            "204": "入股",
            "205": "联营",
            "04": "其他"
        };
        curValue = zjTypes[_curValue] + "(" + _curValue + ")";
    } else if (key === "qlsdfs1") {
        var zjTypes = {
            "1": "地上",
            "2": "地表",
            "3": "地下",
        };
        curValue = zjTypes[_curValue] + "(" + _curValue + ")";
    } else if (key === "dj") {
        var zjTypes = {
          "01": "一类",
          "02": "二类",
          "03": "三类",
          "04": "四类",
          "05": "五类",
          "06": "六类",
          "07": "七类",
          "08": "八类",
          "09": "九类",
          "10": "十类",
        };
        curValue = !zjTypes[_curValue] ? _curValue : (zjTypes[_curValue] + "(" + _curValue + ")");
      } else if (key === "yt") {
        var zjTypes = {
          "0701": "城镇住宅用地",
          "0702": "农村宅基地",
          "072": "农村宅基地",
        };
        curValue = zjTypes[_curValue] + "(" + _curValue + ")";
      } else if (key === "zzdmj") {
        curValue = _curValue.toFixed(2) + "平方米";
      } else if (key === "zydmj") {
        curValue = _curValue.toFixed(2) + "平方米";
      } else if (key === "ycjzmj") {
        curValue = _curValue.toFixed(2) + "平方米";
      } else if (key === "scjzmj") {
        curValue = _curValue.toFixed(2) + "平方米";
      } else if (key === "ghyt") {
        var zjTypes = {
          "10": "住宅",
          "11": "成套住宅",
          "111": "别墅",
          "112": "高档公寓",
          "12": "非成套住宅",
          "13": "集体宿舍",
          "20": "工业、交通、仓储",
        };
        curValue = zjTypes[_curValue] + "(" + _curValue + ")";
      } else if (key === "fwjg") {
        var zjTypes = {
          "01": "钢结构",
          "02": "钢和钢筋混凝土结构",
          "03": "钢筋混凝土结构",
          "04": "混合结构",
          "05": "砖木结构",
          "06": "其它结构",
          "1": "钢结构",
          "2": "钢和钢筋混凝土结构",
          "3": "钢筋混凝土结构",
          "4": "混合结构",
          "5": "砖木结构",
          "6": "其它结构",
        };
        curValue = zjTypes[_curValue] + "(" + _curValue + ")";
      } else if (key === "djlx") {
        var zjTypes = {
          "100": "首次登记",
          "200": "转移登记",
          "300": "变更登记",
          "400": "注销登记",
        };
        curValue = zjTypes[_curValue] + "(" + _curValue + ")";
      } else if (key === "sjly") {
        var zjTypes = {
          "01": "农村集体土地确权登记发证",
          "02": "第三次全国国土调查",
          "03": "村庄规划",
          "04": "农村宅基地使用权确权登记发证",
          "05": "公安户籍",
          "06": "农村承包地确权登记",
          "07": "农村集体产权制度改革",
          "08": "宅基地专项调查",
          "99": "其他",
        };
        curValue = !zjTypes[_curValue] ? '' : (zjTypes[_curValue] + "(" + _curValue + ")");
      } else if (
        [
          "nydmj",
          "gdmj",
          "ldmj",
          "cdmj",
          "qtnydmj",
          "jsydmj",
          "wlydmj",
        ].includes(key)
      ) {
        curValue = (_curValue / 666.7).toFixed(2) + "亩";
      } else if (key === "syqxz") {
        var zjTypes = {
          "10": "国有土地所有权",
          "30": "集体土地所有权",
          "31": "村民小组",
        };
        curValue = zjTypes[_curValue] + "(" + _curValue + ")";
      } else if (key === "dklb") {
        var zjTypes = {
          "10": "承包地块",
          "21": "自留地",
          "22": "机动地",
        };
        curValue = zjTypes[_curValue] + "(" + _curValue + ")";
      } else if (key === "dldj") {
        var zjTypes = {
          "01": "一等地",
          "02": "二等地",
          "05": "五等地",
          "10": "十等地",
        };
        curValue = zjTypes[_curValue] + "(" + _curValue + ")";
      } else if (key === "tdyt") {
        var zjTypes = {
          "1": "种植业",
          "2": "林业",
        };
        curValue = zjTypes[_curValue] + "(" + _curValue + ")";
      } else if (key === "cbjyqqdfs") {
        var zjTypes = {
          "100": "承包",
          "110": "家庭承包",
        };
        curValue = zjTypes[_curValue] + "(" + _curValue + ")";
      } else if (key === "sfjbnt") {
        var zjTypes = {
          "1": "是",
          "2": "否",
        };
        curValue = zjTypes[_curValue] + "(" + _curValue + ")";
      } else if (key === "tdlylx") {
        var zjTypes = {
          "011": "水田",
        };
        curValue = zjTypes[_curValue] + "(" + _curValue + ")";
      } else if (key === "scmj" || key === "yhtmj") {
        curValue = _curValue + "亩";
      } else curValue = _curValue;
      _zd[element] = curValue;
    }
  }
  return _zd;
}
