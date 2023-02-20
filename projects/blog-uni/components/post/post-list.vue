<template>
	<view class="post-list">
		<YAppendListWrapper :pageUrl="pageUrl" :url="url" v-model="pageList" :searchParams="searchParams" @fetch-end="$emit('fetch-end', $event)">
			<PostItem v-for="post in pageList" :post="post" :key="post.id"></PostItem>
			<SkeletonPostList #skeleton v-if="showSkeleton"></SkeletonPostList>
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
			pageUrl: String,
			searchParams: Object,
			showSkeleton: {
				type: Boolean,
				default: true
			},
			url: {
				type: String,
				default: urls.blog_list
			}
		},
		emits: ['fetch-end'],
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
			console.log('++++++created+++++++')
		},
		methods: {}
	}
</script>

<style>

</style>
