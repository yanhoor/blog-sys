<template>
	<uni-card margin="5px">
		<view class="comment-container" v-if="topComment">
			<view class="comment-top-container">
				<UserAvatar :user="topComment.createBy" :size="48"></UserAvatar>
				<view class="top-right">
					<UserName fontSize="16" :user="topComment.createBy"></UserName>
					<YTime class="item-time" type="format" :time="topComment.createdAt"></YTime>
				</view>
			</view>
			<view class="comment-bottom-contsiner" @click.stop="handleShowReply(topComment)">
				<YExpandanleContent :maxLength="120" :content="topComment.content"></YExpandanleContent>
			</view>
		</view>
		<YAppendListWrapper v-model="replyList" pageUrl="pages/comment-detail/comment-detail" :url="urls.reply_list"
			:searchParams="{ blogId, topCommentId }" @fetch-end="handleListFetchEnd">
			<view class="comment-reply-container">
				<view class="reply-item" v-for="reply in replyList" :key="reply.id">
					<UserName :user="reply.createBy" :text="'@' + reply.createBy.name"></UserName>
					{{ reply.replyComment && reply.replyComment.topCommentId ? '' : ':'}}
					<view class="at-user-contsiner" v-if="reply.replyComment && reply.replyComment.topCommentId">
						回复<UserName :user="reply.replyComment.createBy" :text="'@' + reply.replyComment.createBy.name">
						</UserName>:
					</view>
					<view class="reply-content" @click.stop="handleShowReply(reply)">
						<YExpandanleContent :maxLength="120" :content="reply.content"></YExpandanleContent>
					</view>
				</view>
			</view>

			<template #skeleton>
				<SkeletonCommentDetail></SkeletonCommentDetail>
			</template>
		</YAppendListWrapper>

		<CommentReplyForm :currentReplyItem="currentReplyItem" v-model:show="showReply"></CommentReplyForm>

	</uni-card>
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
				showReply: false
			}
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
			s.setPullDownRefresh('pages/comment-detail/comment-detail')
		},
		methods: {
			handleListFetchEnd(result) {
				this.topComment = result.topComment
			},
			handleShowReply(comment) {
				this.currentReplyItem = comment
				this.showReply = true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.comment-container {
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		gap: 20rpx;
	}

	.comment-top-container {
		display: flex;
		align-items: center;
		gap: 20rpx;

		.top-right {
			display: flex;
			flex-direction: column;

			.item-time {
				color: $uni-secondary-color;
				font-size: 14px;
			}
		}
	}

	.comment-bottom-contsiner {
		margin-bottom: 20rpx;
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

			.at-user-contsiner {
				display: inline;
			}

			.reply-content {
				margin-left: 10rpx;
				display: inline;
			}
		}
	}
</style>
