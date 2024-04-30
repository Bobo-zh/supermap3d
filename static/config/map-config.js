let MAPCONFIG = {
  // 资阳、滁州
  341103: {
    position: [-2530549.1330791996, 4730952.945544174, 3450333.6940350677],
    baseHeight: 10,
    dataServiceUrl:
      "http://120.24.61.35:8090/iserver/services/data-chuzhou/rest/data/featureResults.rjson?returnContent=true",
    dataSourceName: "chuz",
    dataSetName: "dantihua",
    scpUrl: {
      url:
        "http://120.24.61.35:8090/iserver/services/3D-chuzhou/rest/realspace/datas/chuzhou/config",
      name: "倾斜摄影",
    },
  },
  // 德清
  330521: {
    position: [-2740074.0927745043, 4761019.112340382, 3243157.3925252547],
    baseHeight: 5,
    dataServiceUrl:
      "http://120.24.61.35:8090/iserver/services/data-deqing/rest/data/featureResults.rjson?returnContent=true",
    dataSourceName: "dq",
    dataSetName: "dantihua",
    scpUrl: {
      url:
        "http://localhost:8090/iserver/services/3D-local3DCache-Data2/rest/realspace/datas/deqing/config",
      name: "五四村",
    },
  },
  // 永丰
  360825: {
    position: [-2430682.86905387, 5118048.221681892, 2929675.3180453805],
    baseHeight: 15,
    dataServiceUrl:
      "http://120.55.163.126:8090/iserver/services/data-YongFengQingXie/rest/data/featureResults.rjson?returnContent=true",
    dataSourceName: "宅基地宗地",
    dataSetName: "zjdzd4326",
    scpUrl: [
      {
        url:
          "http://120.55.163.126:8090/iserver/services/3D-YongFengQingXie/rest/realspace/datas/%E9%87%8D%E5%BB%BA%E6%88%90%E6%9E%9C1/config",
        name: "井心村",
      },
      {
        url:
          "http://120.55.163.126:8090/iserver/services/3D-YongFengQingXie/rest/realspace/datas/%E9%87%8D%E5%BB%BA%E6%88%90%E6%9E%9C2/config",
        name: "上田洲",
      },
      {
        url:
          "http://120.55.163.126:8090/iserver/services/3D-YongFengQingXie/rest/realspace/datas/%E6%B1%AA%E5%9D%91%E6%9D%91%E6%88%90%E6%9E%9C/config",
        name: "汪坑村",
      },
      {
        url:
          "http://120.55.163.126:8090/iserver/services/3D-YongFengQingXie/rest/realspace/datas/%E6%9D%A8%E5%AE%B6%E5%9D%8A3%E6%88%90%E6%9E%9C/config",
        name: "杨家坊",
      },
      {
        url:
          "http://120.55.163.126:8090/iserver/services/3D-YongFengQingXie/rest/realspace/datas/%E7%8E%89%E5%86%85%E5%9D%91%E6%88%90%E6%9E%9C/config",
        name: "玉内坑",
      },
      {
        url:
          "http://120.55.163.126:8090/iserver/services/3D-YongFengQingXie/rest/realspace/datas/%E5%A4%A7%E6%BA%90%E6%88%90%E6%9E%9C/config",
        name: "大源1",
      },
      {
        url:
          "http://120.55.163.126:8090/iserver/services/3D-YongFengQingXie/rest/realspace/datas/%E5%A4%A7%E6%BA%902%E6%88%90%E6%9E%9C/config",
        name: "大源2",
      },
      {
        url:
          "http://120.24.61.35:8090/iserver/services/3D-mongodb-pingdu/rest/realspace/datas/yaotian/config",
        name: "瑶田村",
      },
      {
        url:
          "http://120.24.61.35:8090/iserver/services/3D-mongodb-pingdu/rest/realspace/datas/wutuan/config",
        name: "五团村",
      },
    ],
  },
  // 平度
  370283: {
    position: [-2552952.2936039446, 4430492.080503251, 3813078.398281217],
    baseHeight: 5,
    dataServiceUrl:
      "http://120.24.61.35:8090/iserver/services/data-pingdu/rest/data/featureResults.rjson?returnContent=true",
    dataSourceName: "pd",
    dataSetName: "dantihua",
    scpUrl: {
      url:
        "http://120.24.61.35:8090/iserver/services/3D-pingdu/rest/realspace/datas/pingdu/config",
      name: "平度",
    },
  },
  // 高陵
  610117: {
    position: [-1727263.0001576503, 4968746.804137225, 3607656.9070062987],
    baseHeight: 40,
    dataServiceUrl:
      "http://120.24.61.35:8090/iserver/services/data-gaoling/rest/data/featureResults.rjson?returnContent=true",
    dataSourceName: "gaoling",
    dataSetName: "zjdzd_1",
    scpUrl: {
      url:
        "http://120.24.61.35:8090/iserver/services/3D-mongodb-pingdu/rest/realspace/datas/yjltcj/config",
      name: "韩家村",
    },
  },
  // 奇台
  652325: {
    position: [21224.383934158064, 4605133.291538133, 4416740.989474817],
    baseHeight: 80,
    dataServiceUrl:
      "http://120.24.61.35:8090/iserver/services/data-gaoling/rest/data/featureResults.rjson?returnContent=true",
    dataSourceName: "gaoling",
    dataSetName: "zjdzd_1",
    scpUrl: {
      url:
        "http://120.24.61.35:8090/iserver/services/3D-mongodb-pingdu/rest/realspace/datas/qitai/config",
      name: "奇台",
    },
  },
  // 柞水
  611026: {
    position: [ -1725702.2030861487, 5012590.095715737, 3549177.451243546],
    baseHeight: 90,
    dataServiceUrl:
      "http://120.24.61.35:8090/iserver/services/data-gaoling/rest/data/featureResults.rjson?returnContent=true",
    dataSourceName: "gaoling",
    dataSetName: "zjdzd_1",
    scpUrl: {
      url:
        "http://120.24.61.35:8090/iserver/services/3D-mongodb-pingdu/rest/realspace/datas/zhashui/config",
      name: "柞水",
    },
  },
  // 鄠邑
  610118: {
    position: [ -1676855.6043287811, 5002788.124547799, 3584764.200841475],
    baseHeight: 40,
    dataServiceUrl:
      "http://120.24.61.35:8090/iserver/services/data-dantihua/rest/data/featureResults.rjson?returnContent=true",
    dataSourceName: "dantihua",
    dataSetName: "huyi",
    scpUrl: {
      url:
        "http://120.24.61.35:8090/iserver/services/3D-mongodb-pingdu/rest/realspace/datas/huyi/config",
      name: "鄠邑",
    },
  },
};
