<template>
	<text class="reply-user text-ellipsis" :style="style" @click="handleToUserPage">
		{{ content }}
	</text>
</template>

<script>
	import {
		mapState,
		mapActions,
	} from 'pinia'
	import {
		useMyInfoStore
	} from '@/stores/userInfo.js'
	
	export default {
		name: 'user-name',
		props: {
			user: Object,
			text: String,
			fontSize: String
		},
		data() {
			return {

			}
		},
		computed: {
			...mapState(useMyInfoStore, ['myInfo']),
			content(){
				return this.text || this.user.name
			},
			style(){
				const result = {}
				if(this.fontSize) result.fontSize = Object.is(Number(this.fontSize), NaN) ? this.fontSize : this.fontSize + 'px'
				return result
			}
		},
		methods: {
			handleToUserPage() {
				if (this.myInfo.id === this.user.id) return

				const pages = getCurrentPages()
				const currentPage = pages[pages.length - 1]

				// console.log('------32323------------', currentPage.$vm.$data.userId)
				if (currentPage.$vm.$data.userId === this.user.id) return

				uni.navigateTo({
					url: '/pages/user/user?id=' + this.user.id
				});
			}
		},
	}
</script>

<style lang="scss" scoped>
	.reply-user {
		color: $uni-primary;
		font-weight: 600;
	}
</style>
