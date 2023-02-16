<template>
	<view>
		<YAppendListWrapper :pageUrl="pageUrl" :url="urls.blog_list" v-model="pageList">
			<PostItem v-for="post in pageList" :post="post" :key="post.id"></PostItem>
		</YAppendListWrapper>
	</view>
</template>

<script>
	import PostItem from './post-item.vue'
	import YAppendListWrapper from '@/components/y-append-list-wrapper.vue'
	import Http, {
		urls
	} from '@/http'

	export default {
		name: "post-list",
		components: {
			YAppendListWrapper,
			PostItem,
		},
		data() {
			return {
				urls,
				pageUrl: '',
				pageList: []
			}
		},
		created() {
			const currentPage = getCurrentPages()[0]
			this.pageUrl = currentPage.route
		},
		methods: {}
	}
</script>

<style>

</style>
