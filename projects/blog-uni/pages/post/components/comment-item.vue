<template>
	<view class="comment-item">
		<view class="comment-left">
			<UserAvatar :user="comment.createBy" :size="36"></UserAvatar>
		</view>
		<view class="comment-right">
			<UserName :user="comment.createBy"></UserName>
			<YExpandanleContent :maxLength="120" :content="comment.content" @tap="$emit('showReply', comment)"></YExpandanleContent>
			<view class="comment-bottom">
				<YTime class="item-time" type="format" :time="comment.createdAt"></YTime>
				<uni-icons class="action-icon" type="more-filled" size="20" color="#909399"
					@click.stop="handleShowMenu"></uni-icons>
			</view>
			<view class="comment-reply-container" v-if="comment.childComments.length">
				<view class="reply-item" v-for="reply in comment.childComments" :key="reply.id"
					@click.stop="handleViewAllReply">
					<UserName :user="reply.createBy" :text="'@' + reply.createBy.name"></UserName>
					{{ reply.replyComment && reply.replyComment.topCommentId ? '' : ':'}}
					<view class="at-user-contsiner" v-if="reply.replyComment && reply.replyComment.topCommentId">
						回复<UserName :user="reply.replyComment.createBy" :text="'@' + reply.replyComment.createBy.name">
						</UserName>:
					</view>
					<view class="reply-content">
						<YExpandanleContent :maxLength="120" :content="reply.content"></YExpandanleContent>
					</view>
				</view>
				<view class="more-action-container" v-if="comment.childCommentsCount > 2"
					@click.stop="handleViewAllReply">
					<view>共{{ comment.childCommentsCount }}条回复</view>
					<uni-icons type="bottom" size="18" color="#18a058"></uni-icons>
				</view>
			</view>
		</view>
	</view>
	<uni-popup ref="menuPopupRef" type="bottom" background-color="#fff">
		<uni-list class="menu-list">
			<uni-list-item clickable @click.stop="handleDelete" v-if="comment.createById === myInfo?.id">
				<template v-slot:body>
					<view class="action-sheet-text red">删除</view>
				</template>
			</uni-list-item>
			<uni-list-item clickable @click.stop="handleCopyContent">
				<template v-slot:body>
					<view class="action-sheet-text">复制内容</view>
				</template>
			</uni-list-item>
		</uni-list>
	</uni-popup>
</template>

<script>
	import YExpandanleContent from '@/components/y-expandable-content.vue'
	import YTime from '@/components/y-time.vue'
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
		name: 'comment-item',
		props: {
			comment: Object
		},
		emits: ['showReply'],
		components: {
			YExpandanleContent,
			YTime,
		},
		data() {
			return {

			}
		},
		computed: {
			...mapState(useMyInfoStore, ['myInfo'])
		},
		methods: {
			handleViewAllReply() {
				uni.navigateTo({
					url: `/pages/comment-detail/comment-detail?id=${this.comment.id}&blogId=${this.comment.blogId}`
				})
			},
			handleShowMenu() {
				this.$refs.menuPopupRef.open()
			},
			handleCopyContent(){
				uni.setClipboardData({
					data: this.comment.content,
					success: () => {
						uni.showToast({
							title: '已复制'
						})
					},
					complete: () => {
						this.$refs.menuPopupRef.close()
					}
				})
			},
			handleDelete() {
				uni.showModal({
					title: '提示',
					confirmColor: '#e43d33',
					content: '确定删除该评论吗，评论下的所有回复也会被删除',
					success: async (res) => {
						if (res.confirm) {
							try {
								const {
									success,
									result,
									msg
								} = await Http.post(urls.comment_delete, {
									id: this.comment.id
								})
								if (success) {
									uni.showToast({
										title: '已删除'
									})
									setTimeout(() => {
										uni.startPullDownRefresh()
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
	.comment-item {
		display: flex;
		align-items: flex-start;
		gap: 20rpx;
	}

	.comment-right {
		display: flex;
		flex-direction: column;
		gap: 8rpx;
		flex: 1;

		.comment-bottom {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 8rpx;
			width: 100%;

			.item-time {
				color: $uni-secondary-color;
				font-size: 14px;
			}
		}
	}

	.comment-reply-container {
		border-radius: 6rpx;
		background-color: $uni-bg-color;
		padding: 26rpx;
		width: 100%;
		box-sizing: border-box;

		.reply-item {
			word-wrap: break-word;
			word-break: break-word;
			white-space: pre-wrap;

			.reply-user {
				color: $uni-primary;
				font-weight: 600;
			}

			.at-user-contsiner {
				display: inline;

				.at-user {
					margin: 0 2rpx;
					color: $uni-primary;
					font-weight: 600;
					display: inline;
				}
			}

			.reply-content {
				margin-left: 10rpx;
				display: inline;
			}
		}

		.more-action-container {
			color: $uni-primary;
			margin-top: 8rpx;
			font-size: 16px;
			display: flex;
			align-items: center;
			gap: 10rpx;
		}
	}
</style>
