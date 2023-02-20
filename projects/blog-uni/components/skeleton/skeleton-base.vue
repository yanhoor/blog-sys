<template>
	<view class="skeleton-base" :class="{'round': round}" :style="style"></view>
</template>

<script>
	export default {
		name: 'skeleton-base',
		props: {
			width: String,
			height: String,
			size: String,
			round: Boolean
		},
		computed: {
			style(){
				const result = {}
				if(this.size){
					result.height = result.width = Object.is(Number(this.size), NaN) ? this.size : this.size + 'px'
				}
				if(this.width) result.width = Object.is(Number(this.width), NaN) ? this.width : this.width + 'px'
				if(this.height) result.height = Object.is(Number(this.height), NaN) ? this.height : this.height + 'px'
				return result
			}
		},
	}
</script>

<style lang="scss" scoped>
	@keyframes skeleton-loading {
		0% {
			background-position: 100% 50%
		}

		100% {
			background-position: 0 50%
		}
	}

	.skeleton-base {
		width: 100%;
		height: 20rpx;
		border-radius: 10rpx;
		background: linear-gradient(90deg, #dadada 25%, #e6e8eb 37%, #dadada 63%);
		background-size: 400% 100%;
		animation: skeleton-loading 1.4s ease infinite;
		&.round{
			border-radius: 50%;
			width: 100rpx;
			height: 100rpx;
		}
	}
</style>
