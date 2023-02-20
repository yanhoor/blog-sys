import {
	baseUrl
} from '@/config'
export * as urls from './urls'

class Http {
	post(url, params, formData = false) {
		const token = uni.getStorageSync('token')
		let Authorization = ""
		if (token) Authorization = 'Bearer ' + token
		if(formData){
			const fd = new FormData()
			Object.keys(params).forEach(k => {
				fd.append(k, params[k])
			})
			params = fd
		}
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
							icon:'error',
							title: msg || '登录信息已过期'
						})
						uni.setStorageSync('token', '')
						return reject(msg)
					}
					resolve(res)
				},
				fail(e) {
					console.log('++++++request post fail++++++++', e)
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
							icon:'error',
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
