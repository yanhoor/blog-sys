<template>
	<view class="post-page">
		<SkeletonPostDetail v-if="loading && !postInfo"></SkeletonPostDetail>

		<view v-else>
			<uni-card margin="5px" class="card">
				<view class="post-top">
					<UserAvatar :user="postInfo.createBy" :size="42"></UserAvatar>
					<view class="item-user">
						<UserName fontSize="18" :user="postInfo.createBy"></UserName>
						<YTime class="item-time" type="format" :time="postInfo.createdAt"></YTime>
					</view>
				</view>
				<YExpandanleContent class="post-content" :content="postInfo.content"></YExpandanleContent>
				<MediaList :list="postInfo.medias"></MediaList>

				<view class="action-container">
					<view class="action-item" @click="handleLike">
						<uni-icons class="action-icon" type="hand-up-filled" size="20" color="#18a058"
							v-if="postInfo.isLike">
						</uni-icons>
						<uni-icons class="action-icon" type="hand-up" size="20" color="#6B7280" v-else></uni-icons>
					</view>
					<view class="action-item" @click.stop="showReply = true">
						<uni-icons class="action-icon" type="chatbubble" size="20" color="#6B7280"></uni-icons>
					</view>
					<view class="action-item" @click="handleCollect">
						<uni-icons class="action-icon" type="star-filled" size="20" color="#18a058"
							v-if="postInfo.isCollect">
						</uni-icons>
						<uni-icons class="action-icon" type="star" size="20" color="#6B7280" v-else></uni-icons>
					</view>
					<view class="action-item" @click.stop="showAction = true">
						<uni-icons class="action-icon" type="more-filled" size="20" color="#6B7280"></uni-icons>
					</view>
				</view>
			</uni-card>
		</view>

		<uni-card margin="5px" class="tab-card">
			<view class="tab-container" v-if="postInfo">
				<view class="tab-item" :class="{'active': currentTab === 1}" @click="handleChangeTab(1)">
					<view>赞</view>
					<view class="tab-num">
						{{ postInfo.likedByCount }}
					</view>
				</view>
				<view class="tab-item" :class="{'active': currentTab === 2}" @click="handleChangeTab(2)">
					<view>评论</view>
					<view class="tab-num">
						{{ postInfo.commentsCount }}
					</view>
				</view>
				<view class="tab-item" :class="{'active': currentTab === 3}" @click="handleChangeTab(3)">
					<view>收藏</view>
					<view class="tab-num">
						{{ postInfo.collectedByCount }}
					</view>
				</view>
			</view>

			<view class="tab-content">
				<UserList v-if="currentTab === 1" pageUrl="pages/post/post/1" :searchParams="{blogId: Number(postId)}"
					url="/blog/actionUserList/1"></UserList>
				<CommentList class="post-comment" v-if="currentTab === 2" :blogId="Number(postId)"></CommentList>
				<UserList v-if="currentTab === 3" pageUrl="pages/post/post/3" :searchParams="{blogId: Number(postId)}"
					url="/blog/actionUserList/2"></UserList>
			</view>
		</uni-card>
		
		<CommentReplyForm :blogId="Number(postId)" v-model:show="showReply"></CommentReplyForm>
		
		<PostActions v-model="showAction" :post="postInfo" @delete="handleDeletePost"></PostActions>
	</view>
</template>

<script>
	import YImage from '@/components/y-image.vue'
	import YTime from '@/components/y-time.vue'
	import YExpandanleContent from '@/components/y-expandable-content.vue'
	import MediaList from '@/components/media/media-list.vue'
	import CommentList from './components/comment-list.vue'
	import CommentReplyForm from '@/components/comment-reply-form.vue'
	import SkeletonPostDetail from '@/components/skeleton/skeleton-post-detail.vue'
	import UserList from '@/components/user/user-list.vue'
	import PostActions from '@/components/post/post-actions.vue'
	import Http, {
		urls
	} from '@/http'
	import {
		useScrollStatusStore
	} from '@/stores/scrollStatus.js'
	import scrollMixin from '@/mixins/scrollMixin.js'
	export default {
		components: {
			YImage,
			YTime,
			YExpandanleContent,
			MediaList,
			CommentList,
			CommentReplyForm,
			SkeletonPostDetail,
			UserList,
			PostActions,
		},
		mixins: [scrollMixin],
		data() {
			return {
				postId: '',
				postInfo: null,
				loading: true,
				showReply: false,
				showAction: false,
				currentTab: 2, // 1--点赞，2--评论，3--收藏
			}
		},
		onLoad(params) {
			this.postId = params.id
			// console.log('+++++++++post onLoad+++++++==')
			uni.startPullDownRefresh()
		},
		onUnload() {
			// console.log('----------onUnload----------')
		},
		onPullDownRefresh() {
			this.initPage()
			const s = useScrollStatusStore()
			s.setPullDownRefresh('pages/post/post/' + this.currentTab)
		},
		onReachBottom() {
			const s = useScrollStatusStore()
			s.setReachBottom()
		},
		methods: {
			async initPage() {
				this.loading = true
				try {
					await Promise.all([
						this.getPostInfo()
					])
					uni.stopPullDownRefresh()
					this.loading = false
				} catch (e) {
					this.loading = false
					uni.stopPullDownRefresh()
				}
			},
			handleChangeTab(num) {
				this.currentTab = num
				// 因为使用 v-if
				this.$nextTick(() => {
					const s = useScrollStatusStore()
					s.setPullDownRefresh('pages/post/post/' + this.currentTab)
				})
			},
			async getPostInfo() {
				const {
					success,
					result,
					msg
				} = await Http.post(urls.blog_info, {
					id: this.postId
				})
				if (success) {
					this.postInfo = result
				} else {
					uni.showToast({
						icon: 'error',
						title: msg || '加载失败'
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 500)
					return Promise.reject(false)
				}
			},
			async handleLike() {
				try {
					const {
						success,
						result,
						msg
					} = await Http.post(urls.blog_like, {
						isLike: this.postInfo.isLike ? 0 : 1,
						id: this.postInfo.id
					})
					if (success) {
						if (this.currentTab === 1) {
							uni.startPullDownRefresh()
						} else {
							this.getPostInfo()
						}
					}
				} catch (e) {

				}
			},
			async handleCollect() {
				try {
					const {
						success,
						result,
						msg
					} = await Http.post(urls.blog_collect, {
						isCollect: this.postInfo.isCollect ? 0 : 1,
						id: this.postInfo.id
					})
					if (success) {
						if (this.currentTab === 3) {
							uni.startPullDownRefresh()
						} else {
							this.getPostInfo()
						}
					}
				} catch (e) {

				}
			},
			handleDeletePost(){
				setTimeout(() => {
					uni.navigateBack()
				}, 500)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.card {
		::v-deep .uni-card {
			padding: 0;
		}
	}

	.post-item {
		display: flex;
	}

	.post-top {
		display: flex;
		align-items: center;
		justify-content: flex-start;

		.item-user {
			margin-left: 20rpx;

			.item-time {
				color: #6B7280;
			}
		}
	}

	.post-content {
		::v-deep {
			color: $uni-main-color;
		}
	}

	.action-container {
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-top: 12px;

		.action-item {
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.tab-card {
		::v-deep .uni-card {
			padding: 0 !important;
			overflow: unset;

			.uni-card__content {
				padding: 0 !important;
			}
		}
	}

	.tab-container {
		display: flex;
		position: sticky;
		top: 0;
		left: 0;
		right: 0;
		padding: 20rpx 20rpx 0;
		background-color: #fff;

		.tab-item {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 6px;
			padding-bottom: 10rpx;
			margin: 0 40rpx;

			&.active {
				border-bottom: 2px solid $uni-primary;
			}

			.tab-num {
				font-size: 16px;
			}
		}
	}

	.tab-content {
		padding: 0 20rpx 20rpx;
	}

	.post-comment {
		::v-deep>view {
			margin-top: 20rpx;
		}
	}

</style>
