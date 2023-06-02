import axios, { AxiosRequestConfig } from 'axios'
import MyConfig from '@/config'

const DEFAULT_CONFIG: AxiosRequestConfig = {
  baseURL: import.meta.env.PROD
    ? '/api'
    : import.meta.env.VITE_API_BASE + '/api',
  timeout: 45000,
  withCredentials: true,
  method: 'post',
  headers: {
    authorization: ''
  }
}

interface HttpResponseType {
  success: boolean
  result?: any
  msg?: string
}

class Http {
  api = axios.create(DEFAULT_CONFIG)

  constructor() {
    // 请求拦截配置
    this.api.interceptors.request.use(
      (config) => {
        // console.log(`请求拦截配置-->`, config);
        const sit = localStorage.getItem(MyConfig.TOKEN)
        if (config.headers && sit)
          config.headers['authorization'] = 'Bearer ' + sit // jwt校验
        return config // 需要返回
      },
      (error) => {
        console.log(`请求拦截出错--> `, error)
        return Promise.reject(error)
      }
    )

    // 响应拦截配置
    this.api.interceptors.response.use(
      (response) => {
        // console.table(`响应拦截-->`, response);
        // if(response.data.code == 999 && router.currentRoute.value.path != '/login'){
        //   ElMessage.error({
        //     message: response.data.msg
        //   })
        //   router.push({
        //     path: '/login',
        //     query: {
        //       from: router.currentRoute.value.fullPath
        //     }
        //   })
        //   return Promise.reject(false);
        // }
        return response
      },
      (error) => {
        console.log(`响应拦截出错-->`, error)
        // 未登录
        // if(error.response.status === 401){
        //   ElMessage.error({
        //     message: '用户未登录'
        //   })
        //   router.push({
        //     path: '/login',
        //     query: {
        //       from: router.currentRoute.value.fullPath
        //     }
        //   })
        // }
        return Promise.reject(error)
      }
    )
  }

  get(url: string, data?: any): Promise<HttpResponseType> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.api.get(url, { params: data })
        return resolve(res.data)
      } catch (e) {
        return reject(e)
      }
    })
  }

  post(url: string, data?: any, formData = false): Promise<HttpResponseType> {
    return new Promise(async (resolve, reject) => {
      try {
        if (formData) {
          const fd = new FormData()
          Object.keys(data).forEach((k) => {
            fd.append(k, data[k])
          })
          data = fd
          const res = await this.api.post(url, data, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          return resolve(res.data)
        } else {
          const res = await this.api.post(url, data)
          return resolve(res.data)
        }
      } catch (e) {
        return reject(e)
      }
    })
  }
}

export default new Http()
export * from './urls'
