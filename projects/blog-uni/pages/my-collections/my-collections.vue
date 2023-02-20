<template>
	<view>
		<PostList :pageUrl="pageUrl" :url="urls.user_markBlogList" :searchParams="{ type: 2 }"></PostList>
	</view>
</template>

<script>
	import PostList from '@/components/post/post-list.vue'
	import scrollMixin from '@/mixins/scrollMixin.js'
	import {
		useScrollStatusStore
	} from '@/stores/scrollStatus.js'
	import Http, {
		urls
	} from '@/http'

	export default {
		mixins: [scrollMixin],
		components: {
			PostList
		},
		data() {
			return {
				pageUrl: '/pages/my-collections',
				urls
			}
		},
		onLoad(params) {
			uni.startPullDownRefresh()
		},
		onPullDownRefresh() {
			const s = useScrollStatusStore()
			s.setPullDownRefresh(this.pageUrl)
		},
	}
</script>

<style lang="scss">

</style>
