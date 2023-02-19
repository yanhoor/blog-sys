<template>
	<view>
		<uni-card margin="5" v-for="i in 20" :key="i">
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
		</uni-card>
	</view>
</template>

<script>
	import SkeletonBase from '@/components/skeleton/skeleton-base.vue'

	export default {
		name: 'skeleton-post-list',
		components: {
			SkeletonBase
		},
		data() {
			return {

			};
		},
		created() {
			
		}
	}
</script>

<style lang="scss" scoped>
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
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		margin-top: 20rpx;
	}
</style>
