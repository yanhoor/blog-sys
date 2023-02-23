<template>
	<view class="me-page-empty" v-if="!myInfo">

	</view>

	<view class="me-page" v-else>
		<uni-card spacing="0" margin="5px">
			<view class="top-card-container">
				<view class="user-wrapper" @click="handleToPage('/pages/user/user?id=' + myInfo.id)">
					<UserAvatar disabled :user="myInfo" :size="60"></UserAvatar>
					<view class="user-info-container">
						<view class="user-name">
							{{ myInfo.name }}
						</view>
						<view class="stats-container">
							<view class="stats-item">
								{{ myInfo.followingCount }} 关注
							</view>
							<view class="stats-item">
								{{ myInfo.followerCount }} 粉丝
							</view>
						</view>
					</view>
					<uni-icons type="forward" size="32" color="#bbb"></uni-icons>
				</view>

				<view class="action-container">
					<view class="action-item" @click="handleToPage('/pages/profile/profile')">
						<uni-icons type="compose"></uni-icons>
						<view>编辑资料</view>
					</view>
					<view class="action-item" @click="handleLogout">
						<uni-icons type="clear"></uni-icons>
						<view>退出登录</view>
					</view>
				</view>
			</view>
		</uni-card>

		<uni-card spacing="0" margin="5px">
			<uni-list :border="false">
				<!-- <uni-list-item clickable show-extra-icon showArrow :extra-icon="{ type: 'compose' }" title="编辑资料" to="/pages/profile/profile"></uni-list-item> -->
				<uni-list-item clickable show-extra-icon showArrow :extra-icon="{ type: 'star-filled' }" title="我的收藏"
					to="/pages/my-collections/my-collections">
				</uni-list-item>
				<uni-list-item clickable show-extra-icon showArrow :extra-icon="{ type: 'hand-up-filled' }"
					to="/pages/my-like/my-like" title="我的点赞"></uni-list-item>
				<uni-list-item clickable show-extra-icon showArrow :extra-icon="{ type: 'chatbubble-filled' }"
					to="/pages/my-comment/my-comment" title="我的评论"></uni-list-item>
				<uni-list-item clickable show-extra-icon showArrow :extra-icon="{ type: 'staff-filled' }" to="/pages/user-group-manage/user-group-manage" title="我的分组"></uni-list-item>

			</uni-list>
		</uni-card>
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
		data() {
			return {

			}
		},
		computed: {
			...mapState(useMyInfoStore, ['myInfo'])
		},
		created() {
			console.log('+++++++++++++')
		},
		onShow() {
			const back = uni.getStorageSync('back_from_login')
			if (back == 1) {
				uni.switchTab({
					url: '/pages/index/index'
				})
				return
			} else if (!this.myInfo) {
				uni.navigateTo({
					url: '/pages/login/login'
				})
				return
			}
			console.log('+++++me show++++++', back)
			uni.removeStorageSync('back_from_login')
		},
		methods: {
			...mapActions(useMyInfoStore, ['clearMyInfo']),
			handleToPage(url) {
				uni.navigateTo({
					url
				})
			},
			handleLogout() {
				uni.showModal({
					title: '提示',
					content: '确定退出登录吗',
					success: async (res) => {
						if (res.confirm) {
							try {
								const {
									success,
									result,
									msg
								} = await Http.post(urls.logout)
								if (success) {
									uni.showToast({
										title: '已退出登录'
									})
									setTimeout(() => {
										this.clearMyInfo()
										uni.removeTabBarBadge({
											index: 3
										})
										uni.removeStorageSync('index-view-group-id')
										uni.setStorageSync('token', '')
										uni.$emit('refresh_index_page')
										uni.switchTab({
											url: '/pages/index/index'
										})
									}, 1000)
								}
							} catch (e) {}
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.me-page {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
	}

	.top-card-container {
		display: flex;
		flex-direction: column;
		gap: 12rpx;
	}

	.user-wrapper {
		display: flex;
		align-items: center;
		gap: 18rpx;

		.user-info-container {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 12rpx;

			.user-name {
				color: $uni-base-color;
				font-size: 18px;
				font-weight: 600;
			}

			.stats-container {
				display: flex;
				gap: 20rpx;

				.stats-item {
					color: $uni-secondary-color;
					font-size: 14px;
				}
			}
		}
	}

	.action-container {
		display: flex;
		justify-content: space-around;
		padding-top: 12rpx;
		border-top: 1px solid $uni-border-2;
		gap: 24rpx;

		.action-item {
			display: flex;
			align-items: center;
			gap: 12rpx;
		}
	}
</style>
