import {useFetch, useRuntimeConfig} from "#app"

interface HttpResponseType {
  success: boolean
  result?: any
  msg?: string
}

export const useFetchPost = (url, data) => {
  const runTimeConfig = useRuntimeConfig()
  const json = JSON.stringify(data)
  // console.log('=======useFetchPost.key======', url + json)
  return useFetch(url, {
    baseURL: runTimeConfig.apiBase,
    method: 'POST',
    body: data,
    key: url + json, // 相同的 key 不会再请求
    initialCache: false, // 不会缓存请求，即每次都会请求，即使 key 一样
    transform(res){
      // 相当于响应拦截
      // console.log('===========tt=====', res)
      return res
    }
  })
}

export const useFetchGet = (url, data) => {
  const runTimeConfig = useRuntimeConfig()
  const json = JSON.stringify(data)
  // console.log('=======useFetchPost.key======', url + json)
  return useFetch(url, {
    baseURL: runTimeConfig.apiBase,
    method: 'GET',
    params: data,
    key: url + json,
    initialCache: false
  })
}
