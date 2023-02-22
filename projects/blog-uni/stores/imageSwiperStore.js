import {
	defineStore
} from 'pinia'

export const useImageSwiperStore = defineStore('imageSwiper', {
	state: () => {
		return {
			imageList: [],
			initIndex: 0
		}
	},
	// 也可以这样定义
	// state: () => ({ count: 0 })
	actions: {
		setImageList(l) {
			this.imageList = l
		},
		setInitIndex(i) {
			this.initIndex = i
		}
	},
});
