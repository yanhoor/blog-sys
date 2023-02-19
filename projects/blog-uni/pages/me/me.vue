<template>
	<view>
		<view v-if="loading || !myInfo"></view>

		<view class="me-main" v-else>
			<view class="top-wrapper">
				<image class="bg-img" :src="imageHost + myInfo.profileCardBg" mode="aspectFill"
					@click="handleClickImage(myInfo.profileCardBg)" v-if="myInfo.profileCardBg"></image>
				<view class="bg-img default" v-else></view>
				<view class="info-card">
					<view class="user-info-container">
						<view class="user-left">
							<UserAvatar class="user-avatar" :size="72" :user="myInfo" :clickable="false"
								v-if="myInfo.avatar">
							</UserAvatar>
							<image class="user-avatar default" src="@/static/images/personal.png" v-else></image>
							<view class="user-name text-ellipsis">
								{{ myInfo.name }}
							</view>
						</view>
						<view class="user-right">
							<!-- <uni-icons type="bars" size="24" @click.stop="handleShowMenu"></uni-icons> -->
							<uni-icons class="logout" custom-prefix="iconfont" type="y-logout" size="24"
								@click="handleLogout"></uni-icons>
						</view>
					</view>
					<view class="user-stats-container">
						<view class="stats-item">
							<view class="stats-num">
								{{ myInfo.followingCount }}
							</view>
							<view class="stats-desc">
								关注
							</view>
						</view>
						<view class="stats-item">
							<view class="stats-num">
								{{ myInfo.followerCount }}
							</view>
							<view class="stats-desc">
								粉丝
							</view>
						</view>
						<view class="stats-item">
							<view class="stats-num">
								{{ myInfo.likedCount }}
							</view>
							<view class="stats-desc">
								获赞
							</view>
						</view>
					</view>
					<view class="introduce" v-if="myInfo.introduce">
						{{ myInfo.introduce }}
					</view>
				</view>
			</view>
			
			<view class="content-section">
				<view class="section-container" v-if="imageTotal">
					<view class="title-section">
						<view class="title">
							相册
						</view>
						<view class="title-num">
							{{ imageTotal }}
						</view>
					</view>
				</view>
				<MediaImageWall :userId="myInfo.id" @fetch-end="imageTotal = $event.total"></MediaImageWall>
			</view>

			<view class="content-section">
				<view class="section-container">
					<view class="title-section">
						<view class="title">
							全部博客
						</view>
						<view class="title-num">
							{{ postTotal }}
						</view>
					</view>
				</view>
				<PostList class="post-list" pageUrl="pages/me/me" :searchParams="{ uid: myInfo.id }"
					@fetch-end="postTotal = $event.total"></PostList>
			</view>

		</view>

		<uni-popup ref="menuPopupRef" type="right" background-color="#fff">
			<uni-list>
				<uni-list-item title="title" note="node"></uni-list-item>
				<uni-list-item title="退出登录" clickable @click.stop="handleLogout"></uni-list-item>
			</uni-list>
		</uni-popup>
	</view>
</template>

<script>
	import YImage from '@/components/y-image.vue'
	import {
		imageHost
	} from "@/config/index.js"
	import UserAvatar from '@/components/user/user-avatar.vue'
	import PostList from '@/components/post/post-list.vue'
	import MediaImageWall from '@/components/media/media-image-wall.vue'
	import {
		mapState,
		mapActions,
	} from 'pinia'
	import {
		useMyInfoStore
	} from '@/stores/userInfo.js'
	import {
		useScrollStatusStore
	} from '@/stores/scrollStatus.js'
	import Http, {
		urls
	} from '@/http'

	export default {
		components: {
			UserAvatar,
			YImage,
			PostList,
			MediaImageWall,
		},
		data() {
			return {
				imageHost,
				loading: false,
				postTotal: 0,
				imageTotal: 0,
			}
		},
		computed: {
			...mapState(useMyInfoStore, ['myInfo'])
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
			} else if (!this.myInfo) {
				this.toLogin()
				return
			}
		},
		onLoad() {
			// console.log('+++++me onLoad++++++')
			if (this.myInfo) {
				uni.startPullDownRefresh()
			}
		},
		onPullDownRefresh() {
			this.initPage().finally(() => {
				uni.stopPullDownRefresh()
			})
		},
		methods: {
			...mapActions(useMyInfoStore, ['clearMyInfo', 'getMyInfo']),
			...mapActions(useScrollStatusStore, ['setPullDownRefresh']),
			async initPage() {
				try {
					this.loading = true
					await Promise.all([
						this.getMyInfo()
					])
					setTimeout(() => {
						this.setPullDownRefresh('pages/me/me')
					})
					this.loading = false
					return true
				} catch (e) {
					this.loading = false
					return false
				}
			},
			toLogin() {
				uni.navigateTo({
					url: "/pages/login/login"
				})
			},
			handleShowMenu() {
				this.$refs.menuPopupRef.open()
			},
			handleClickImage(url) {
				uni.previewImage({
					urls: [this.imageHost + url],
					current: this.imageHost + url,
					indicator: 'number'
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
									this.clearMyInfo()
									uni.removeTabBarBadge({
										index: 3
									})
									uni.setStorageSync('token', '')
									uni.switchTab({
										url: '/pages/index/index'
									})
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
	.me-main{
		display: flex;
		flex-direction: column;
		gap: 12rpx;
	}
	.top-wrapper {
		display: flex;
		flex-direction: column;
		position: relative;
		box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.08);
		border-bottom: 1px solid $uni-border-3;

		.bg-img {
			width: 100%;
			height: 220px;

			&.default {
				background-image: linear-gradient(to right, #eae5c9, #6cc6cb);
			}
		}

		.info-card {
			padding: 0 20px 20px;
			box-sizing: border-box;
			margin-top: -20rpx;
			background-color: #fff;
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;

			.user-info-container {
				display: flex;
				align-items: flex-start;
				gap: 24rpx;
				margin-bottom: -52rpx;

				.user-left {
					flex: 1;
					display: flex;
					align-items: flex-start;
					gap: 24rpx;

					.user-avatar {
						position: relative;
						top: -52rpx;

						&.default {
							width: 72px;
							height: 72px;
							border-radius: 50%;
						}
					}

					.user-name {
						font-size: 22px;
						font-weight: 600;
					}
				}

				.user-right {
					position: relative;
					top: 6rpx;
				}

			}


			.user-stats-container {
				display: flex;
				justify-content: space-around;

				.stats-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					gap: 16rpx;

					.stats-num {
						font-size: 18px;
						font-weight: 600;
					}

					.stats-desc {
						color: $uni-secondary-color;
					}
				}
			}

			.introduce {
				font-size: 16px;
				margin-top: 40rpx;
				color: $uni-secondary-color;
			}
		}
	}
	
	.content-section{
		display: flex;
		flex-direction: column;
		.section-container{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 0 5px;
			.title-section{
				display: flex;
				align-items: center;
				gap: 10rpx;
				.title{
					font-weight: 300;
				}
				
				.title-num{
					font-size: 22px;
					font-weight: 600;
				}
			}
		}
	}
</style>
