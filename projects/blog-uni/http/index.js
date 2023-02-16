import { baseUrl } from '@/config'
export * as urls from './urls'

class Http {
  post(url, params) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${baseUrl}${url}`,
        method: 'POST',
        data: params,
        success: function (d) {
          const res = d.data
            resolve(res)
        },
        fail(e) {
          reject(e)
        }
      })
    })
  }
  get(url, params) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${baseUrl}${url}`,
        data: params,
        success: function (d) {
          const res = d.data
          resolve(res)
        },
        fail(e) {
          reject(e)
        }
      })
    })
  }
}

export default new Http()
