import request from './index'

/**
 * 抹平list和非list差异
 * @param data
 * @param api
 * @return {*}
 */
function preExtend(data, api) {
  let deeper = data
  if (api.dataField !== null) {
    deeper = _.get(data, api.dataField)
  }
  if (deeper) {
    if (!(deeper instanceof Array)) {
      api.extend([deeper])
    } else {
      api.extend(deeper)
    }
  }
  return data
}

// function takeOne(data) {
//   if (!(data instanceof Array)) {
//     return data
//   } else {
//     return data[0]
//   }
// }

export default class API {
  constructor(url) {
    this.url = url
    // promise
    this.response = null
    // 实际缓存的数据
    this.cache = null
    this.complexResponse = null
    this.autoExtract = true // 是否自动提取DATA
    this.dataField = 'DATA' // 兼容当前项目
    // 缓存时间控制
    this.expirationTime = 5 * 60 * 1000 // 五分钟
    this.cacheTime = null
  }

  /**
   * 全量获取
   * 优先返回缓存结果
   * @param args
   * @return {*}
   */
  get(...args) {
    if (args.length /* 只缓存全量数据 */) {
      return request(this.url, ...args)
        .then(data => this.determineReturn(preExtend(data, this)))
    } else {
      if (this.response === null) {
        // 构建缓存
        this.response = request(this.url)
          .then(data => {
            this.cache = this.determineReturn(preExtend(data, this))// 实际缓存
            return this.cache
          })
        // 记录时间
        this.cacheTime = Date.now()
      }
      const now = Date.now()
      if (now - this.cacheTime > this.expirationTime) {
        return this.clear().get()
      }
      return this.response
    }
  }

  /**
   * 获取单个
   * @param args
   * @return {Promise}
   */
  getOne(...args) {
    return request(this.url + '/single', ...args).then(
      data => this.determineReturn(preExtend(data, this))
    )
  }

  /**
   * delete
   * @param index
   * @param args
   * @return {Promise}
   */
  delete(index, ...args) {
    return request(this.url + '/delete', ...args).then(data => {
      if (this.cache && typeof index === 'number') {
        this.cache.splice(index, 1)
      }
      this.clear()
      return this.determineReturn(data)
    })
  }

  /**
   * update
   * @param which
   * @param args
   * @return {Promise}
   */
  update(which, ...args) {
    return request(this.url + '/update', ...args).then(data => {
      _.assign(which, data) // 合并修改
      this.clear()
      return this.determineReturn(preExtend(data, this))
    })
  }

  /**
   * create
   * @param args
   * @return {Promise}
   */
  create(...args) {
    return request(this.url + '/create', ...args)
      .then(data => {
        const extended = preExtend(data, this)
        if (this.cache) {
          // this.cache.unshift(takeOne(extended))
        }
        // this.complexResponse = null
        this.clear()
        return this.determineReturn(extended)
      })
  }

  clear() {
    if (this.isClone) {
      return Object.getPrototypeOf(this).clear()
    }
    this.response = null
    this.cache = null
    this.complexResponse = null
    return this
  }

  /**
   * 清空缓存，重新获取
   * @return {*}
   */
  forceGet() {
    return this.clear().get()
  }

  /**
   * 获取复杂数据
   */
  getComplex(...args) {
    if (args.length) {
      return this.get(...args).then(this.complex)
    }
    if (this.complexResponse === null) {
      this.complexResponse = this.get().then(this.complex)
    }
    return this.complexResponse
  }

  /**
   * 自定义扩展数据
   *
   * @param data
   * @return {*}
   */
  extend(data) {
    return data
  }

  /**
   * 自定义混合数据
   * @param data
   * @return {*}
   */
  complex(data) {
    return data
  }

  mock(method, data) {
    this[method] = () => {
      return Promise.resolve(data)
        .then(data => this.determineReturn(preExtend(data, this)))
    }
    return this
  }

  clearMock(method) {
    delete this[method]
  }

  /**
   * 是否自动提取数据
   * 提取字段由dataField决定
   * @param should
   * @return {API}
   */
  extract(should) {
    this.autoExtract = should
    return this
  }

  determineReturn(data) {
    if (this.autoExtract) {
      return data[this.dataField]
    }
    return data
  }

  clone() {
    return _.assign(Object.create(this), {
      isClone: true
    })
  }

  set(option) {
    return _.assign(this, option)
  }
}
