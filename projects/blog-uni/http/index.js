import {
	baseUrl
} from '@/config'
export * as urls from './urls'

class Http {
	post(url, params) {
		const token = uni.getStorageSync('token')
		let Authorization = ""
		if (token) Authorization = 'Bearer ' + token
		return new Promise((resolve, reject) => {
			uni.request({
				url: `${baseUrl}${url}`,
				method: 'POST',
				header: {
					Authorization
				},
				data: params,
				success: function(d) {
					const res = d.data
					const { code, msg, success } = res
					if(code == 111 || code == 999){
						uni.showToast({
							title: msg || '登录信息已过期'
						})
						uni.setStorageSync('token', '')
						return reject(msg)
					}
					resolve(res)
				},
				fail(e) {
					reject(e)
				}
			})
		})
	}
	get(url, params) {
		const token = uni.getStorageSync('token')
		let Authorization = ""
		if (token) Authorization = 'Bearer ' + token
		return new Promise((resolve, reject) => {
			uni.request({
				url: `${baseUrl}${url}`,
				header: {
					Authorization
				},
				data: params,
				success: function(d) {
					const res = d.data
					const { code, msg, success } = res
					if(code == 111 || code == 999){
						uni.showToast({
							title: msg || '登录信息已过期'
						})
						uni.setStorageSync('token', '')
						return reject(msg)
					}
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
