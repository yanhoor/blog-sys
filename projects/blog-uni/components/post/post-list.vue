<template>
	<view class="post-list">
		<YAppendListWrapper :pageUrl="pageUrl" :url="url" v-model="pageList" :searchParams="searchParams" @fetch-end="$emit('fetch-end', $event)">
			<PostItem v-for="post in pageList" :post="post" :key="post.id" @action-click="handlePostAction(post)"></PostItem>
			<SkeletonPostList #skeleton v-if="showSkeleton"></SkeletonPostList>
		</YAppendListWrapper>
		<PostActions v-model="showAction" :post="operationItem" @delete="handlePostDelete"></PostActions>
	</view>
</template>

<script>
	import PostItem from './post-item.vue'
	import YAppendListWrapper from '@/components/y-append-list-wrapper.vue'
	import SkeletonPostList from '@/components/skeleton/skeleton-post-list.vue'
	import PostActions from '@/components/post/post-actions.vue'
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
			PostActions,
		},
		data() {
			return {
				urls,
				pageList: [],
				showAction: false,
				operationItem: null
			}
		},
		created() {
			// console.log('++++++created+++++++')
		},
		methods: {
			handlePostAction(post){
				this.operationItem = post
				this.showAction = true
			},
			handlePostDelete(){
				const idx = this.pageList.indexOf(this.operationItem)
				this.pageList.splice(idx, 1)
			}
		}
	}
</script>

<style>

</style>
