<template>
	<view class="result-empty">
		<uni-icons custom-prefix="iconfont" type="y-emptybox" size="150" color="#18a058"></uni-icons>
		<view class="msg">
			{{ msg }}
		</view>
		<button type="primary" size="mini" @click="$emit('refresh')">{{ btnText }}</button>
	</view>
</template>

<script>
	export default {
		name: 'result-empty',
		props: {
			msg: {
				type: String,
				default: '暂无内容'
			},
			btnText: {
				type: String,
				default: '点击刷新'
			},
		},
		emits: ['refresh'],
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
.result-empty{
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 40rpx;
	.msg{
		font-size: 16px;
		color: $uni-base-color;
	}
}
</style>
