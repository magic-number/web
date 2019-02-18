/**
 * 从给定字符串中解析url参数，默认解析location.search
 */
export const parseQueryString = (search = location && location.search) => {
  if (typeof(search) !== typeof('')) throw new Error('param must be a string')
  if (search.length < 3) return {}
  const query = search.substring(search.indexOf('?')+1)
  const reg = /([^=&#]+)=([^&#]*)/ig
  let match = null
  const result = {}
  while (match = reg.exec(query)) {
    result[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
  }
  return result
}

export const placeholder = (val, length = 2, placeholder = '0') => {
  const str = `${val}`
  if (str.length === length) {
    return str
  }
  if (str.length > length) {
    throw new Error(`${val} is more than ${length}`)
  }
  const holder = new Array(length - str.length).fill(placeholder)
  return `${holder.join('')}${val}`
}

/**
 * 格式化时间戳
 * @param {*} timestamp 
 * @param {*} format 
 */
export const dateFormat = (timestamp, format = 'yyyy年MM月dd日 HH:mm') => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return (
    format.replace('yyyy', year)
      .replace('MM', placeholder(month, 2))
      .replace('dd', placeholder(day, 2))
      .replace('HH', placeholder(hour, 2))
      .replace('mm', placeholder(minute, 2))
      .replace('ss', placeholder(second, 2))
  )
}

/**
 * 时间输出精度
 */
export const AccuracyMap = {
  1: 'yyyy年',
  2: 'yyyy年MM月',
  3: 'yyyy年MM月dd日',
  4: 'yyyy年MM月dd日HH时',
  5: 'yyyy年MM月dd日 HH:mm',
  6: 'yyyy年MM月dd日 HH:mm:ss'
}

export const timeStringify = (timestamp, accuracy = 6) => {
  if (AccuracyMap[accuracy]) {
    return dateFormat(timestamp, AccuracyMap[accuracy])
  }
  throw new Error(`${accuracy}不是合法的时间精度`)
}

export const clone = (obj) => JSON.parse(JSON.stringify(obj))
