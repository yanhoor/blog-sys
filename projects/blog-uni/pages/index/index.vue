<template>
	<view class="container">
		<PostList pageUrl="pages/index"></PostList>
	</view>
</template>

<script>
	import scrollMixin from '@/mixins/scrollMixin.js'
	import PostList from '@/components/post/post-list.vue'
	import {
		useScrollStatusStore
	} from '@/stores/scrollStatus.js'

	export default {
		components: {
			PostList
		},
		mixins: [scrollMixin],
		data() {
			return {}
		},
		created() {
			uni.startPullDownRefresh()
			uni.$on('index_page_refresh', (r) => {
				if (r) {
					uni.startPullDownRefresh({
						fail() {
							console.log('index_page_refresh fail')
						}
					})
				}
			})
		},
		onPullDownRefresh() {
			const s = useScrollStatusStore()
			s.setPullDownRefresh('pages/index')
		},
		methods: {}
	}
</script>

<style>
	.container {}
</style>
