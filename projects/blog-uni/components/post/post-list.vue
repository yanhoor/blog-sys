<template>
	<view>
		<YAppendListWrapper :pageUrl="pageUrl" :url="urls.blog_list" v-model="pageList">
			<PostItem v-for="post in pageList" :post="post" :key="post.id"></PostItem>
			<SkeletonPostList #skeleton></SkeletonPostList>
		</YAppendListWrapper>
	</view>
</template>

<script>
	import PostItem from './post-item.vue'
	import YAppendListWrapper from '@/components/y-append-list-wrapper.vue'
	import SkeletonPostList from '@/components/skeleton/skeleton-post-list.vue'
	import Http, {
		urls
	} from '@/http'

	export default {
		name: "post-list",
		props: {
			pageUrl: String
		},
		components: {
			YAppendListWrapper,
			SkeletonPostList,
			PostItem,
		},
		data() {
			return {
				urls,
				pageList: []
			}
		},
		created() {
			
		},
		methods: {}
	}
</script>

<style>

</style>
