import {useFetch, useRuntimeConfig} from "#app"
import {createDiscreteApi} from "naive-ui"

interface HttpResponseType {
  success: boolean
  result?: any
  code?: number
  msg?: string
}

export const useFetchPost = (url: string, data: any, formData: boolean = false): Promise<HttpResponseType> => {
  const runTimeConfig = useRuntimeConfig()
  const json = JSON.stringify(data)
  let Authorization = ''
  const token = useCookie('token')
  if(token.value) Authorization = 'Bearer ' + token.value
  if(formData){
    const fd = new FormData()
    Object.keys(data).forEach(k => {
      fd.append(k, data[k])
    })
    // headers['Content-Type'] = 'multipart/form-data'
    data = fd
  }
  // console.log('=======useFetchPost.key======', url + json)
  return $fetch(url, {
    baseURL: runTimeConfig.apiBase,
    headers: {
      'Authorization': Authorization
    },
    method: 'POST',
    body: data,
    // key: url + json, // 相同的 key 不会再请求
    // initialCache: false, // 默认true，false 时不会缓存请求，即每次都会请求，即使 key 一样，false 避免出错后刷新无效
    // transform(res: any){
    //   console.log('===========tt=====', res)
    //   return res
    // },
    async onResponse({ request, response, options }) {
      const { message } = createDiscreteApi(["message"])
      // Log response
      // console.log('[fetch response]', response._data)
      const { code, success, msg } = response._data || {}
      if(code === 111 || code === 999){
        token.value = null
        message.error(msg, {
          duration: 0
        })
      }
    }
  })
}

export const useFetchGet = (url: string, data: any): Promise<HttpResponseType> => {
  const runTimeConfig = useRuntimeConfig()
  const json = JSON.stringify(data)
  let Authorization = ''
  const token = useCookie('token')
  if(token.value) Authorization = 'Bearer ' + token.value
  // console.log('=======useFetchPost.key======', url + json)
  return $fetch(url, {
    baseURL: runTimeConfig.apiBase,
    method: 'GET',
    params: data,
    // key: url + json,
    // initialCache: false,
    headers: {
      'Authorization': Authorization
    },
    async onResponse({ request, response, options }) {
      const { message } = createDiscreteApi(["message"])
      // Log response
      // console.log('[fetch response]', response._data)
      const { code, success, msg } = response._data || {}
      if(code === 111 || code === 999){
        token.value = null
        message.error(msg, {
          duration: 0
        })
      }
    }
  })
}
