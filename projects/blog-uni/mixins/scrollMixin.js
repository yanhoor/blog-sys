import {
	useScrollStatusStore
} from '@/stores/scrollStatus.js'

// 上拉加载/下拉刷新，由页面引入
export default {
	data() {
		return {
			timer: null
		}
	},
	onPageScroll(e) {
		clearTimeout(this.timer)
		this.timer = setTimeout(() => {
			console.log("滚动距离为：" + e.scrollTop);
			const s = useScrollStatusStore()
			s.setScrollTop(e.scrollTop)
		}, 300)
	},
	onReachBottom() {
		const s = useScrollStatusStore()
		s.setReachBottom()
	},
	onPullDownRefresh() {
		// console.log('+++++++ onPullDownRefresh++++++++++')
		// this.$refs.pageListRef?.getList()
		const s = useScrollStatusStore()
		s.setPullDownRefresh()
	},
	methods: {

	}
}
