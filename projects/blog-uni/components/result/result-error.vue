<template>
	<view class="result-error">
		<uni-icons custom-prefix="iconfont" type="y-Error-Cloud" size="150" color="#e43d33"></uni-icons>
		<button type="primary" size="mini" @click="$emit('refresh')">{{ btnText }}</button>
	</view>
</template>

<script>
	export default {
		name: 'result-error',
		props: {
			btnText: {
				type: String,
				default: '加载错误，点击重试'
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
	.result-error {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;

		.icon {
			width: 180px;
		}
	}
</style>
