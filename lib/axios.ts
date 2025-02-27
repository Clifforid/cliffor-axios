import type { AxiosRequestConfig, AxiosInstance } from './types'
import Axios from './core/Axios'
//创建实例
function createInstance(config: AxiosRequestConfig): AxiosInstance {
  const context = new Axios(config)
  return context as AxiosInstance
}
//axios对象
const axios = createInstance({
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  validateStatus(status) {
    return status >= 200 && status < 300
  }
})

export default axios
