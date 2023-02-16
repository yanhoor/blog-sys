import { defineStore } from 'pinia'

export const useScrollStatusStore = defineStore('scrollStatus', {
	state: () => {
		return { scrollTop: 0 };
	},
	// 也可以这样定义
	// state: () => ({ count: 0 })
	actions: {
		setScrollTop(t) {
			this.scrollTop = t
		},
		// 仅用于监听
		setReachBottom(){
			console.log('+++++setReachBottom+++++')
		},
		// 仅用于监听
		setPullDownRefresh(){
			console.log('+++++setPullDownRefresh+++++')
		}
	},
});
