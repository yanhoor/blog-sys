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
		// 在 y-append-list-wrapper 仅用于监听，type：all --- 所有页面刷新，页面path数组 --- 该页面刷新，无参数 --- 当前所在页面刷新
		setPullDownRefresh(pages){
			console.log('+++++setPullDownRefresh+++++', pages)
		}
	},
});
