<template>
	<view class="container">
		<PostList></PostList>
	</view>
</template>

<script>
	import scrollMixin from '@/mixins/scrollMixin.js'
	import PostList from '@/components/post/post-list.vue'

	export default {
		components: {
			PostList
		},
		mixins: [scrollMixin],
		data() {
			return {}
		},
		created() {},
		methods: {}
	}
</script>

<style>
	.container {}
</style>
