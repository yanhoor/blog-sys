<template>
	<view>
		<UserMain ref="userMainRef" :userId="myInfo.id" v-if="myInfo"></UserMain>
		<view class="my-page-empty" v-else></view>
	</view>
</template>

<script>
	import UserMain from '@/components/user/user-main.vue'
	import {
		mapState,
		mapActions,
	} from 'pinia'
	import {
		useMyInfoStore
	} from '@/stores/userInfo.js'

	export default {
		components: {
			UserMain,
		},
		data() {
			return {
				
			}
		},
		computed: {
			...mapState(useMyInfoStore, ['myInfo'])
		},
		created() {
			// console.log('+++++++++++++', this.myInfo)
			if (!this.myInfo) {
				uni.navigateTo({
					url: '/pages/login/login'
				});
				return
			}
		},
		onShow() {
			// console.log('+++++me show++++++')
			const back = uni.getStorageSync('back_from_login')
			if (back == 1) {
				uni.removeStorageSync('back_from_login')
				uni.switchTab({
					url: '/pages/index/index'
				})
				return
			}
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
