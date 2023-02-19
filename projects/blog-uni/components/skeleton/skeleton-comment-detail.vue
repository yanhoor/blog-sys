<template>
	<view>
		<view class="post-top">
			<SkeletonBase round size="48" />
			<view class="post-user">
				<SkeletonBase width="130"></SkeletonBase>
				<SkeletonBase width="180"></SkeletonBase>
			</view>
		</view>
		<view class="content">
			<SkeletonBase></SkeletonBase>
			<SkeletonBase></SkeletonBase>
			<SkeletonBase></SkeletonBase>
			<SkeletonBase width="80%"></SkeletonBase>
		</view>
		<view class="reply-container">
			<view class="comment-container" v-for="i in 20" :key="i">
				<SkeletonBase></SkeletonBase>
				<SkeletonBase width="80%"></SkeletonBase>
			</view>
		</view>
	</view>
</template>

<script>
	import SkeletonBase from '@/components/skeleton/skeleton-base.vue'

	export default {
		name: 'skeleton-comment-detail',
		components: {
			SkeletonBase
		},
		data() {
			return {

			}
		},
		created() {

		}
	}
</script>

<style lang="scss" scoped>
	.reply-container {
		margin-top: 30rpx;
	}

	.comment-container {
		display: flex;
		flex-direction: column;
		gap: 20rpx;

		&+.comment-container {
			margin-top: 40rpx;
		}
	}

	.post-top {
		display: flex;
		align-items: center;
		gap: 20rpx;

		.post-user {
			display: flex;
			flex-direction: column;
			gap: 10rpx;
		}
	}

	.content {
		margin-top: 20rpx;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}
</style>
