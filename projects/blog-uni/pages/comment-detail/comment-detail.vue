<template>
	<uni-card margin="5px" spacing="0" isFull>
		<view class="comment-item" v-if="topComment">
			<view class="comment-left">
				<UserAvatar :user="topComment.createBy" :size="36"></UserAvatar>
			</view>
			<view class="comment-right">
				<UserName :user="topComment.createBy"></UserName>
				<YExpandanleContent :maxLength="120" :content="topComment.content" @tap="handleShowReply(topComment)">
				</YExpandanleContent>
				<view class="comment-bottom">
					<YTime class="item-time" type="format" :time="topComment.createdAt"></YTime>
					<uni-icons class="action-icon" type="more-filled" size="20" color="#909399"
						@click.stop="handleShowMenu(topComment)"></uni-icons>
				</view>
			</view>

		</view>
	</uni-card>

	<uni-card margin="5px" spacing="0">
		<YAppendListWrapper v-model="replyList" :pageUrl="pageUrl" :url="urls.reply_list"
			:searchParams="{ blogId, topCommentId }" @fetch-end="handleListFetchEnd">
			<view class="comment-reply-container">
				<view class="comment-item" v-for="reply in replyList" :key="reply.id">
					<view class="comment-left">
						<UserAvatar :user="reply.createBy" :size="36"></UserAvatar>
					</view>
					<view class="comment-right">
						<UserName :user="reply.createBy"></UserName>
						<view class="reply-content-container" @click="handleShowReply(reply)">
							<view class="at-user-contsiner" v-if="reply.replyComment && reply.replyComment.topCommentId">
								回复<UserName :user="reply.replyComment.createBy" :text="'@' + reply.replyComment.createBy.name">
								</UserName>:
							</view>
							<YExpandanleContent :maxLength="120" :content="reply.content">
							</YExpandanleContent>
						</view>
						<view class="comment-bottom">
							<YTime class="item-time" type="format" :time="reply.createdAt"></YTime>
							<uni-icons class="action-icon" type="more-filled" size="20" color="#909399"
								@click.stop="handleShowMenu(reply)"></uni-icons>
						</view>
					</view>
				</view>
			</view>

			<template #skeleton>
				<SkeletonCommentDetail></SkeletonCommentDetail>
			</template>
		</YAppendListWrapper>
	</uni-card>
	
	<CommentReplyForm :currentReplyItem="currentReplyItem" v-model:show="showReply"></CommentReplyForm>
	
	<uni-popup ref="menuPopupRef" type="bottom" background-color="#fff">
		<uni-list class="menu-list" v-if="operationItem">
			<uni-list-item clickable @click.stop="handleDelete" v-if="operationItem.createById === myInfo?.id">
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
	import YAppendListWrapper from '@/components/y-append-list-wrapper.vue'
	import YExpandanleContent from '@/components/y-expandable-content.vue'
	import CommentReplyForm from '@/components/comment-reply-form.vue'
	import SkeletonCommentDetail from '@/components/skeleton/skeleton-comment-detail.vue'
	import YTime from '@/components/y-time.vue'
	import Http, {
		urls
	} from '@/http'
	import {
		useScrollStatusStore
	} from '@/stores/scrollStatus.js'
	import scrollMixin from '@/mixins/scrollMixin.js'
	import {
		mapState,
		mapActions,
	} from 'pinia'
	import {
		useMyInfoStore
	} from '@/stores/userInfo.js'

	export default {
		components: {
			YAppendListWrapper,
			YExpandanleContent,
			CommentReplyForm,
			YTime,
			SkeletonCommentDetail,
		},
		mixins: [scrollMixin],
		data() {
			return {
				urls,
				topCommentId: '',
				blogId: '',
				replyList: [],
				topComment: null,
				currentReplyItem: null,
				operationItem: null, // 正在操作的评论
				showReply: false,
				pageUrl: "pages/comment-detail/comment-detail"
			}
		},
		computed: {
			...mapState(useMyInfoStore, ['myInfo'])
		},
		created() {
			// console.log('+++++++++created+++++++==')
		},
		onLoad(params) {
			// console.log('+++++++++onLoad+++++++==')
			this.blogId = params.blogId
			this.topCommentId = params.id
			this.$nextTick(() => {
				uni.startPullDownRefresh()
			})
		},
		onPullDownRefresh() {
			const s = useScrollStatusStore()
			s.setPullDownRefresh(this.pageUrl)
		},
		methods: {
			handleListFetchEnd(result) {
				this.topComment = result.topComment
			},
			handleShowReply(comment) {
				this.currentReplyItem = comment
				this.showReply = true
			},
			handleShowMenu(item) {
				this.operationItem = item
				this.$refs.menuPopupRef.open()
			},
			handleCopyContent() {
				uni.setClipboardData({
					data: this.operationItem.content,
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
									id: this.operationItem.id
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
	.comment-reply-container{
		display: flex;
		flex-direction: column;
		gap: 12rpx;
		.comment-item{
			&+.comment-item{
				padding-top: 12rpx;
				border-top: 1px solid $uni-border-3;
			}
		}
	}
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
		
		.at-user-contsiner{
			display: inline;
		}
	}
</style>
