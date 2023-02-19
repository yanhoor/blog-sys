<template>
	<view class="list-container">
		<view class="item" v-for="i in 20" :key="i">
			<SkeletonBase round size="52"></SkeletonBase>
			<view class="item-mid">
				<SkeletonBase width="100%"></SkeletonBase>
				<SkeletonBase width="100%"></SkeletonBase>
				<SkeletonBase width="60%"></SkeletonBase>
			</view>
		</view>
	</view>
</template>

<script>
	import SkeletonBase from '@/components/skeleton/skeleton-base.vue'

	export default {
		name: 'skeleton-comment-list',
		components: {
			SkeletonBase
		},
		data() {
			return {

			}
		}
	}
</script>

<style lang="scss" scoped>
	.list-container {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		padding-bottom: 20rpx;
	}

	.item {
		display: flex;
		align-items: center;
		gap: 20rpx;

		.item-mid {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 8rpx;
		}
	}
</style>
