import {
  defaultBaseUrl
} from "./config.js";
import axios from 'axios'

import {
  notification
} from 'ant-design-vue'

// 服务器报错提示款, 可以根据框架修改此函数, msg为抛出信息
function message(msg) {
  notification.open({
    message: "服务器请求异常",
    description: "提示:" + msg
  })
}
export default async ({
  // 请求地址
  url = "",
  // 参数
  data = {},
  // "GET" "POST" ...
  method = "GET",
  timeout = 99999,
  withCredentials = false,
  maxContentLength = 10000,
  responseType = "json",
  validateStatus = (status) => {
    return status >= 200 && status < 9999; // 默认的
  },
  onUploadProgress = () => {},
  onDownloadProgress = () => {},
  cancelToken,
  params,
  auth,
  baseUrl,
  headers = {},
  onSuccess = function (res) {},
  onFail = function (res) {},
  onFinally = function (res) {},
  onGlobalSuccess = function (res) {},
  onGlobalFail = function (res) {
    message(res.message || res.msg)
  },
  // 成功条件计算方法, config: {code, res}
  computeSuccess = function (res) {
    if (res.status > 299) return false
    return 1 === res.data.code
  }
}) => {
  let _baseUrl = baseUrl || defaultBaseUrl
  // 如果有redirectUrl, 则覆盖url
  url = _baseUrl + url;
  // 此处规定get请求的参数使用时放在data中，如同post请求
  if (method == "GET") {
    let dataStr = "";
    // 将data参数用?&拼接
    Object.keys(data).forEach(key => {
      dataStr += key + "=" + data[key] + "&";
    });

    if (dataStr !== "") {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf("&"));
      url = url + "?" + dataStr;
    }
  }
  // config
  let requestConfig = {
    // `url` 是用于请求的服务器 URL
    url,
    // `method` 是创建请求时使用的方法
    method: method, // 默认是 get
    // `headers` 是即将被发送的自定义请求头
    headers,
    // `params` 是即将与请求一起发送的 URL 参数
    // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
    params,
    // `paramsSerializer` 是一个负责 `params` 序列化的函数
    // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
    paramsSerializer: function (params) {
      return Qs.stringify(params, {
        arrayFormat: 'brackets'
      })
    },
    // `validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 rejecte
    validateStatus,
    // `data` 是作为请求主体被发送的数据
    // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
    // 在没有设置 `transformRequest` 时，必须是以下类型之一：
    // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
    // - 浏览器专属：FormData, File, Blob
    // - Node 专属： Stream
    data,
    // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
    // 如果请求话费了超过 `timeout` 的时间，请求将被中断
    timeout,
    // `withCredentials` 表示跨域请求时是否需要使用凭证
    withCredentials, // 默认的
    // `auth` 表示应该使用 HTTP 基础验证，并提供凭据
    // 这将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization`头
    auth,
    // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    responseType, // 默认的
    // `onUploadProgress` 允许为上传处理进度事件
    onUploadProgress,
    // `onDownloadProgress` 允许为下载处理进度事件
    onDownloadProgress,
    // `maxContentLength` 定义允许的响应内容的最大尺寸
    maxContentLength,
    // `cancelToken` 指定用于取消请求的 cancel token
    // （查看后面的 Cancellation 这节了解更多）
    cancelToken,
  }
  // 发送请求
  await axios(requestConfig).then(res => {
    // 允许实例自行计算成功条件
    const isSuccess = computeSuccess(res)
    const result = res.data
    // 成功码默认为1, 根据后台修改
    if (isSuccess) {
      onGlobalSuccess(result)
      onSuccess(result)
    } else {
      onGlobalFail(result)
      onFail(result)
    }
    onFinally(res)
  })

};