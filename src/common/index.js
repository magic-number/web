let host = 'http://30.55.171.89:1211'

/**
 * 生成请求url
 * @param {*} path 
 */
const Rpath = (path) => `${host}/${path}`

/**
 * 设置默认host
 * @param {*} h 
 */
const setHost = h => host = h

export {
  Rpath,
  setHost
}