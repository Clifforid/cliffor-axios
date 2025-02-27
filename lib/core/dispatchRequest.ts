import type { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '@/types'
import { createError, ErrorCodes } from './AxiosError'

export function dispatchRequest(config: AxiosRequestConfig): Promise<any> {
  return xhr(config)
}
//封装XMLHttpRequest
function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    //解析config
    const { url, method = 'GET', data, headers = {} } = config
    //新建 XMLHttpRequest 对象
    const request = new XMLHttpRequest()
    /**
     * 建立一个 HTTP 请求，open() 方法包含 5 个参数，说明如下：
     * method：HTTP 请求方法，必须参数，值包括 POST、GET 和 HEAD，大小写不敏感。
     * url：请求的 URL 字符串，必须参数，大部分浏览器仅支持同源请求。
     * async：指定请求是否为异步方式，默认为 true。如果为 false，当状态改变时会立即调用 onreadystatechange 属性指定的回调函数。
     * username：可选参数，如果服务器需要验证，该参数指定用户名，如果未指定，当服务器需要验证时，会弹出验证窗口。
     * password：可选参数，验证信息中的密码部分，如果用户名为空，则该值将被忽略。
     */
    request.open(method.toUpperCase(), url!, true)
    /**
     * 在 JavaScript 中，使用 readyState 属性可以实时跟踪异步响应状态。当该属性值发生变化时，会触发 readystatechange 事件，调用绑定的回调函数。
     * 0	未初始化。表示对象已经建立，但是尚未初始化，尚未调用 open() 方法
     * 1	初始化。表示对象已经建立，尚未调用 send() 方法
     * 2	发送数据。表示 send() 方法已经调用，但是当前的状态及 HTTP 头未知
     * 3	数据传送中。已经接收部分数据，因为响应及 HTTP 头不安全，这时通过 responseBody 和 responseText 获取部分数据会出现错误
     * 4	完成。数据接收完毕，此时可以通过 responseBody 和 responseText 获取完整的响应数据
     * 如果 readyState 属性值为 4，则说明响应完毕，那么就可以安全的读取响应的数据。
     * 考虑到各种特殊情况，更安全的方法是同时监测 HTTP 状态码，只有当 HTTP 状态码为 200 时，才说明 HTTP 响应顺利完成。
     * @returns
     */
    request.onreadystatechange = function () {
      if (request.readyState !== 4) return
      if (request.status === 0) return
      const response: AxiosResponse = {
        data: request.response,
        status: request.status,
        statusText: request.statusText,
        headers: headers ?? {},
        config,
        request
      }
      settle(resolve, reject, response)
    }
    /**
     * 使用 abort() 方法可以中止正在进行的请求。用法如下：
     * xhr.onreadystatechange = function () {};  //清理事件响应函数
     * xhr.abort();  //中止请求
     * 在调用 abort() 方法前，应先清除 onreadystatechange 事件处理函数，因为 IE 和 Mozilla 在请求中止后也会激活这个事件处理函数。
     * 如果给 onreadystatechange 属性设置为 null，则 IE 会发生异常，所以为它设置一个空函数。
     */
    request.onerror = function () {
      reject(createError('Network Error', config, null, request))
    }
    /**
     * 发送请求
     * 参数 data 表示将通过该请求发送的数据，如果不传递信息，可以设置为 null 或者省略。
     * 发送请求后，可以使用 XMLHttpRequest 对象的 responseBody、responseStream、responseText 或 responseXML 等待接收响应数据。
     */
    request.send(data as any)
  })
}
//状态码判断
function settle(
  resolve: (value: AxiosResponse) => void,
  reject: (reason: any) => void,
  response: AxiosResponse
): void {
  const validateStatus = response.config.validateStatus
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response)
  } else {
    reject(
      createError(
        `Request failed with status code ${response.status}`,
        response.config,
        [ErrorCodes.ERR_BAD_REQUEST.value, ErrorCodes.ERR_BAD_RESPONSE.value][
          Math.floor(response.status / 100) - 4
        ],
        response.request,
        response
      )
    )
  }
}
