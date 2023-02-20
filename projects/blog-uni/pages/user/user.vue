<template>
	<view>
		<UserMain ref="userMainRef" :userId="userId" v-if="userId"></UserMain>
		<view class="user-page-empty" v-else></view>
	</view>
</template>

<script>
	import UserMain from './components/user-main.vue'

	export default {
		components: {
			UserMain,
		},
		data() {
			return {
				userId: ''
			}
		},
		onLoad(params) {
			this.userId = Number(params.id)
		},
		onPullDownRefresh() {
			this.$refs.userMainRef.initPage()
		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
