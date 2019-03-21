/**
 * 根据返回json创建错误
 * @param {*} res
 */
const errResponse = (res) => {
  const err = new Error((res && res.errMsg) || '');
  err.res = res;
  return err;
};

export const rpcSuccess = (res) => {
  if (res && res.success) {
    return Promise.resolve(res);
  }
  return Promise.reject(errResponse(res));
};

export const rpcFail = res => Promise.reject(errResponse(res));

const Headers = {
  // 'content-type': 'application/json'
};
/**
 *
 * @param {url}
 * @param {data} 请求参数
 * @param {method} 请求方式
 */
export const rpc = ({
  url,
  data = {},
  headers = {},
  method = 'GET', // GET, POST, PUT, DELETE, etc.
  resolve = rpcSuccess,
  reject = rpcFail,
  _fetch = null,
  ...rest
}) => {
  const isGet = /^get$/i.test(method);
  let rpcUrl = url;
  if (isGet) {
    const pairs = [];
    Object.keys(data).forEach((k) => {
      pairs.push(`${k}=${encodeURIComponent(data[k])}`);
    });
    rpcUrl = pairs.length ? `${url}?${pairs.join('&')}` : url;
  }
  const fetch = _fetch || (window && window.fetch);
  return fetch(rpcUrl, {
    body: isGet ? null : JSON.stringify(data), // must match 'Content-Type' header
    headers: {
      ...Headers,
      ...headers,
    },
    method,
    ...rest,
  }).then(res => res.json(), reject).then(resolve, reject);
};
