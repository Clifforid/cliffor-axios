import { Axios as IAxios, AxiosRequestConfig } from '@/types'
import { dispatchRequest } from './dispatchRequest'

/**
 * Axios实例
 */
export default class Axios implements IAxios {
  defaults: AxiosRequestConfig

  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
  }
  //门面模式
  //调用request和dispatchRequest解耦
  request(url: string | AxiosRequestConfig, config: AxiosRequestConfig = {}): Promise<any> {
    if (typeof url === 'string') {
      config.url = url
    } else {
      config = url
    }
    return dispatchRequest({
      ...this.defaults,
      ...config
    })
  }
}
