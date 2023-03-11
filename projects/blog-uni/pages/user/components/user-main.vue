<template>
	<view>
		<SkeletonUserMain v-if="loading && !userInfo"></SkeletonUserMain>

		<view class="me-main" v-else>
			<view class="top-wrapper">
				<image class="bg-img" :src="imageHost + userInfo.profileCardBg" mode="aspectFill"
					@click="handleClickImage(userInfo.profileCardBg)" v-if="userInfo.profileCardBg"></image>
				<view class="bg-img default" v-else></view>
				<view class="info-card">
					<view class="user-info-container">
						<view class="user-left">
							<UserAvatar class="user-avatar" :size="72" :user="userInfo" :clickable="false">
							</UserAvatar>
							<UserName fontSize="22" :user="userInfo"></UserName>
							<uni-icons custom-prefix="iconfont" type="y-male" size="18" color="#409eff"
								v-if="userInfo.gender === 1"></uni-icons>
							<uni-icons custom-prefix="iconfont" type="y-female" size="18" color="#f56c6c"
								v-if="userInfo.gender === 2"></uni-icons>
						</view>
						<view class="user-right">
							<UserBtn :user="userInfo"></UserBtn>
						</view>
					</view>
					<view class="user-stats-container">
						<view class="stats-item" @click="handleToPage('/pages/followings/followings?userId=' + userId)">
							<view class="stats-num">
								{{ userInfo.followingCount }}
							</view>
							<view class="stats-desc">
								关注
							</view>
						</view>
						<view class="stats-item" @click="handleToPage('/pages/followers/followers?userId=' + userId)">
							<view class="stats-num">
								{{ userInfo.followerCount }}
							</view>
							<view class="stats-desc">
								粉丝
							</view>
						</view>
						<view class="stats-item">
							<view class="stats-num">
								{{ userInfo.likedCount }}
							</view>
							<view class="stats-desc">
								获赞
							</view>
						</view>
					</view>
					<view class="introduce" v-if="userInfo.introduce">
						{{ userInfo.introduce }}
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
					<view class="action-section">
						<view class="all-btn"
							@click="handleToPage('/pages/user-all-image/user-all-image?id=' + userId)">
							全部
						</view>
					</view>
				</view>
				<UserImageWall :userId="userInfo.id" @fetch-end="imageTotal = $event.total"></UserImageWall>
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
					<view class="action-section">
						<uni-icons type="search" size="20" @click="showSearch = true"></uni-icons>
					</view>
				</view>
				<PostList class="post-list" :pageUrl="'/user/' + userId" :searchParams="{ uid: userInfo.id, keyword }"
					@fetch-end="postTotal = $event.total"></PostList>
			</view>

			<view class="search-wrapper" v-if="showSearch">
				<uni-search-bar focus @cancel="handleCancelSearch" v-model="keyword" @confirm="handleConfirmSearch" />
			</view>

		</view>
	</view>
</template>

<script>
	import YImage from '@/components/y-image.vue'
	import SkeletonUserMain from '@/components/skeleton/skeleton-user-main.vue'
	import {
		imageHost
	} from "@/config/index.js"
	import PostList from '@/components/post/post-list.vue'
	import UserImageWall from './user-image-wall.vue'
	import UserBtn from '@/components/user/user-btn.vue'
	import {
		mapState,
		mapActions,
	} from 'pinia'
	import {
		useScrollStatusStore
	} from '@/stores/scrollStatus.js'
	import Http, {
		urls
	} from '@/http'

	export default {
		name: 'user-main',
		props: {
			userId: Number
		},
		emits: ['fetch-user-end'],
		components: {
			YImage,
			PostList,
			UserImageWall,
			UserBtn,
			SkeletonUserMain,
		},
		data() {
			return {
				imageHost,
				loading: false,
				postTotal: 0,
				imageTotal: 0,
				userInfo: null,
				showSearch: false,
				keyword: ''
			}
		},
		created() {
			this.initPage().finally(() => {
				uni.stopPullDownRefresh()
			})
		},
		methods: {
			...mapActions(useScrollStatusStore, ['setPullDownRefresh']),
			async initPage() {
				try {
					this.loading = true
					await Promise.all([
						this.getUserInfo()
					])
					this.$nextTick(() => {
						this.setPullDownRefresh('/user/' + this.userId)
					})
					this.$emit('fetch-user-end')
					this.loading = false
					return true
				} catch (e) {
					this.loading = false
					return false
				}
			},
			async getUserInfo() {
				const {
					success,
					result,
					msg
				} = await Http.post('/user/' + this.userId)
				if (success) {
					this.userInfo = result
				} else {
					return await Promise.reject(false)
				}
			},
			handleClickImage(url) {
				uni.previewImage({
					urls: [this.imageHost + url],
					current: this.imageHost + url,
					indicator: 'number'
				})
			},
			handleToPage(url) {
				uni.navigateTo({
					url
				})
			},
			handleCancelSearch() {
				this.showSearch = false
				this.keyword = ''
				setTimeout(() => {
					this.setPullDownRefresh('/user/' + this.userId)
				})
			},
			handleConfirmSearch() {
				this.keyword = this.keyword.trim()
				setTimeout(() => {
					this.setPullDownRefresh('/user/' + this.userId)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.me-main {
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
					gap: 10rpx;

					.user-avatar {
						position: relative;
						top: -52rpx;

						&.default {
							width: 72px;
							height: 72px;
							border-radius: 50%;
						}
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
				font-size: 14px;
				margin-top: 40rpx;
				color: $uni-secondary-color;
				word-break: break-word;
			}
		}
	}

	.content-section {
		display: flex;
		flex-direction: column;

		.section-container {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 0 5px;

			.title-section {
				display: flex;
				align-items: center;
				gap: 10rpx;

				.title {
					// font-weight: 300;
					font-size: 14px;
					color: $uni-secondary-color;
				}

				.title-num {
					// font-size: 22px;
					font-weight: 600;
				}
			}

			.action-section {
				.all-btn {
					font-size: 14px;
				}
			}
		}
	}

	.search-wrapper {
		position: fixed;
		bottom: 30rpx;
		left: 0;
		right: 0;
		margin: 0 40rpx;
		background-color: #f8f8f8;
		padding: 0rpx 10rpx;
		border-radius: 60rpx;
	}
</style>
