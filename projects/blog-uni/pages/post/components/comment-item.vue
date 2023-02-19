<template>
	<view class="comment-item">
		<view class="comment-left">
			<UserAvatar :user="comment.createBy" :size="48"></UserAvatar>
		</view>
		<view class="comment-right" @click.stop="$emit('showReply', comment)">
			<view class="user-name text-ellipsis">
				{{ comment.createBy.name }}
			</view>
			<YExpandanleContent :maxLength="120" :content="comment.content"></YExpandanleContent>
			<view class="comment-bottom">
				<YTime class="item-time" type="format" :time="comment.createdAt"></YTime>
			</view>
			<view class="comment-reply-container" v-if="comment.childComments.length">
				<view class="reply-item" v-for="reply in comment.childComments" :key="reply.id"
					@click.stop="$emit('showReply', reply)">
					<UserName :user="reply.createBy" :text="'@' + reply.createBy.name"></UserName>{{ reply.replyComment && reply.replyComment.topCommentId ? '' : ':'}}
					<view class="at-user-contsiner" v-if="reply.replyComment && reply.replyComment.topCommentId">
						回复<UserName :user="reply.replyComment.createBy" :text="'@' + reply.replyComment.createBy.name"></UserName>:
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
</template>

<script>
	import YExpandanleContent from '@/components/y-expandable-content.vue'
	import YTime from '@/components/y-time.vue'
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
		methods: {
			handleViewAllReply() {
				uni.navigateTo({
					url: `/pages/comment-detail/comment-detail?id=${this.comment.id}&blogId=${this.comment.blogId}`
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
		align-items: flex-start;
		gap: 8rpx;
		flex: 1;

		.user-name {
			font-size: 16px;
			color: $uni-primary;
			font-weight: 600;
		}

		.comment-bottom {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			gap: 8rpx;

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
