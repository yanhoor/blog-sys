<template>
	<view class="user-btn">
		<template v-if="myInfo">
			<button type="default" size="mini" @click="showMenu" v-if="user.isFollowing">
				{{ user.isMutualFollowing ? '互相关注' : '已关注' }}
			</button>
			<button type="primary" size="mini" v-else-if="user.id !== myInfo.id" @click.stop="handleFollow">关注</button>
			<uni-popup ref="menuPopupRef" type="bottom" background-color="#fff">
				<uni-list class="menu-list">
					<uni-list-item title="取消关注" clickable @click.stop="handleUnfollow"></uni-list-item>
					<uni-list-item title="设置分组" clickable @click.stop="handleSetGroup"></uni-list-item>
				</uni-list>
			</uni-popup>
		</template>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions,
	} from 'pinia'
	import {
		useMyInfoStore
	} from '@/stores/userInfo.js'
	import Http, {
		urls
	} from '@/http'

	export default {
		name: 'user-btn',
		props: {
			user: Object
		},
		data() {
			return {
				followLoading: false
			}
		},
		computed: {
			...mapState(useMyInfoStore, ['myInfo'])
		},
		methods: {
			showMenu() {
				this.$refs.menuPopupRef.open()
			},
			handleUnfollow() {
				uni.showModal({
					title: '提示',
					content: '确定取消关注吗',
					success: async (res) => {
						if (res.confirm) {
							try {
								const {
									success,
									result,
									msg
								} = await Http.post(urls.user_follow, {
									id: this.user.id,
									type: 2
								})
								if (success) {
									this.$refs.menuPopupRef.close()
									uni.startPullDownRefresh()
								}
							} catch (e) {}
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			async handleFollow() {
				try {
					this.followLoading = true
					const {
						success,
						result,
						msg
					} = await Http.post(urls.user_follow, {
						id: this.user.id,
						type: 1
					})
					this.followLoading = false
					if (success) {
						uni.startPullDownRefresh()
					}
				} catch (e) {
					this.followLoading = false
				}
			},
			handleSetGroup() {},
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .uni-list-item {
		::v-deep .uni-list-item__content-title {
			text-align: center;
		}
	}
</style>
