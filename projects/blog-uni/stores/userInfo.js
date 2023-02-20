import {
	defineStore
} from 'pinia'
import Http, {
	urls
} from '@/http'

export const useMyInfoStore = defineStore('myInfo', {
	state: () => {
		return {
			myInfo: null,
			unreadTotal: 0,
			unreadCollect: 0,
			unreadComment: 0,
			unreadLike: 0,
		};
	},
	actions: {
		async getMyInfo() {
			const token = uni.getStorageSync('token')
			if(!token) return
			
			this.getNotificationCount()
			try {
				const {
					success,
					result,
					msg
				} = await Http.get(urls.myInfo)
				if (success) {
					this.myInfo = result
					return Promise.resolve(true)
				}
				return Promise.reject()
			} catch (e) {
				return Promise.reject()
			}
		},
		async clearMyInfo(){
			this.myInfo = null
			this.unreadTotal = 0
			this.unreadCollect = 0
			this.unreadComment = 0
			this.unreadLike = 0
		},
		async getNotificationCount(){
			try {
				const {
					success,
					result,
					msg
				} = await Http.post(urls.notification_count)
				if (success) {
					this.unreadTotal = result.unreadTotal
					this.unreadLike = result.unreadLike
					this.unreadComment = result.unreadComment
					this.unreadCollect = result.unreadCollect
					
					const pages = getCurrentPages()
					const currentPage = pages[pages.length - 1]
					const isTabarPage = ['/index', '/search', '/new-post', '/notification', '/me'].some(i => currentPage.route.includes(i))
					if(!isTabarPage) return
					
					if(this.unreadTotal > 0){
						uni.setTabBarBadge({
						  index: 3,
						  text: this.unreadTotal + ''
						})
					}else{
						uni.removeTabBarBadge({
							index: 3
						})
					}
				}
			} catch (e) {
			
			}
		}
	},
});
