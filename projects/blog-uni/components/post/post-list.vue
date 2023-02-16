<template>
	<view>
		<YAppendListWrapper #default="{pageItem: post}" :url="urls.blog_list">
			<PostItem :post="post"></PostItem>
		</YAppendListWrapper>
	</view>
</template>

<script>
	import PostItem from './post-item.vue'
	import YAppendListWrapper from '@/components/y-append-list-wrapper.vue'
	import Http, { urls } from '@/http'

	export default {
		name: "post-list",
		components: {
			YAppendListWrapper,
			PostItem,
		},
		data() {
			return {
				urls
			}
		},
		created() {
		},
		methods: {
		}
	}
</script>

<style>

</style>
