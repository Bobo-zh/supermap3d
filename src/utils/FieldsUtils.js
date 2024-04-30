// import request from '@/plugin/axios'
import request from 'axios'
import * as common from './common'

class FieldsUtils {
  constructor (map) {
    this.map = map
    this.fieldConfig = {}
    this.domainConfig = {}
  }

  async initLocal () {
    if (Object.keys(this.fieldConfig).length === 0) {
      await this.readFieldsFromLocal()
    }
    if (Object.keys(this.domainConfig).length === 0) {
      await this.readDomainsFromLocal()
    }
    return this
  }

  getFieldsByLayerId (layerId) {
    if (this.fieldConfig[layerId]) {
      return this.fieldConfig[layerId]
    }

    // todo:从接口获取
    let fields = []
    this.fieldConfig[layerId] = fields
    return fields
  }

  getDomainById (domainId) {
    if (this.domainConfig[domainId]) {
      return this.fieldConfig[domainId]
    }
    // todo:从接口获取
    let domain = []
    this.domainConfig[domainId] = fields
    return domain
  }

  async readFieldsFromLocal () {
    let configs = await request.get('/map/fieldsConfig.json')
    // debugger
    let records = JSON.parse(JSON.stringify(configs.data['RECORDS']).toLowerCase())// todo:全部转成小写，pg数据库中字段全是小写
    records.forEach(item => {
      let tableName = item['tablename']
      if (this.fieldConfig[tableName]) {
        this.fieldConfig[tableName].push(item)
      } else {
        this.fieldConfig[tableName] = [item]
      }
    })
  }

  async readDomainsFromLocal () {
    let configs = await request.get('/map/domainConfig.json')
    let records = JSON.parse(JSON.stringify(configs.data['RECORDS']).toLowerCase())// todo:全部转成小写，pg数据库中字段全是小写
    records.forEach(item => {
      let dicType = item['dictype']
      if (this.domainConfig[dicType]) {
        this.domainConfig[dicType].push(item)
      } else {
        this.domainConfig[dicType] = [item]
      }
    })
  }

  getTableFieldsFromConfig (tableName) {
    let defaultConfig = {
      'prop': '',
      'label': '',
      'sortable': true,
      'min-width': 40,
      'align': 'center'
    }
    let fieldsCfg = this.fieldConfig[tableName] || []
    return fieldsCfg.map(x => {
      return { ...defaultConfig, prop: x.fieldname, label: x.fieldalias || x.fieldname }
    })
  }

  getTableFieldsFormFeature (featuresAttr) {
    let defaultConfig = {
      'prop': '',
      'label': '',
      'sortable': true,
      'min-width': 40,
      'align': 'center'
    }
    let fields = []
    Object.keys(featuresAttr).forEach(x => {
      if (['bbox', 'geometry'].indexOf(x) < 0) {
        fields.push({ ...defaultConfig, prop: x, label: x })
      }
    })
    return fields
  }

  getTableField (featuresAttr, layerName) {
    let tableFields = this.getTableFieldsFromConfig(layerName)
    if (tableFields.length === 0) {
      tableFields = this.getTableFieldsFormFeature(featuresAttr)
    }
    return tableFields
  }

  getDomain (domainName) {
    return this.domainConfig[domainName] || null
  }

  getDomainValue (domainName, code) {
    let value = code
    let domain = this.getDomain(domainName) || []
    let domainItem = common.searchArrayWithCode(domain, 'diccode', code, true)
    value = domainItem && domainItem['diccontent']
    return value
  }

  formatFeatures (layerName, features) {
    let fieldInfos = this.fieldConfig[layerName] || null
    let tableFields = this.getTableField(features[0].getProperties(), layerName)
    if (fieldInfos) {
      features.forEach(feature => {
        let attr = feature.getProperties()
        let newProps = {}
        newProps.itemId = feature.getId()
        newProps.fieldInfos = fieldInfos
        newProps.oldAttributes = attr
        fieldInfos.forEach(info => {
          if (info.dictype) {
            newProps[info.fieldname] = this.getDomainValue(info.dictype, attr[info.fieldname])
          } else {
            newProps[info.fieldname] = attr[info.fieldname]
          }
        })
        feature.setProperties({})
        feature.setProperties(newProps)
      })
    }
    return { features: features, tableFields: tableFields, fieldInfos: fieldInfos }
  }

  formatFeaturesToTable (layerName, features) {
    let formatFeatures = this.formatFeatures(layerName, features)
    let tableConfig = { features: formatFeatures.features, fields: formatFeatures.tableFields, fieldInfos: formatFeatures.fieldInfos }
    tableConfig.data = formatFeatures.features.map(feature => {
      return feature.getProperties()
    })
    return tableConfig
  }

  static getInstance (map) {
    if (!FieldsUtils.instance) {
      FieldsUtils.instance = new FieldsUtils(map)
    }
    return FieldsUtils.instance
  }
}

export default FieldsUtils

// export {FieldsUtils}
