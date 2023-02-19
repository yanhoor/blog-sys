<template>
	<view>
		<YAppendListWrapper v-model="commentList" pageUrl="pages/post/post/2" :url="urls.comment_list"
			:searchParams="{ blogId }">
			<template #skeleton>
				<SkeletonCommentList></SkeletonCommentList>
			</template>
			
			<view class="list-wrapper">
				<CommentItem class="comment-item" :comment="comment" v-for="comment in commentList" :key="comment.id"
					@showReply="handleShowReply" />
			</view>
		</YAppendListWrapper>
		<CommentReplyForm :currentReplyItem="currentReplyItem" v-model:show="showReply"></CommentReplyForm>
	</view>
</template>

<script>
	import YAppendListWrapper from '@/components/y-append-list-wrapper.vue'
	import UserAvatar from '@/components/user/user-avatar.vue'
	import CommentItem from './comment-item.vue'
	import CommentReplyForm from '@/components/comment-reply-form.vue'
	import SkeletonCommentList from '@/components/skeleton/skeleton-comment-list.vue'
	import Http, {
		urls
	} from '@/http'

	export default {
		name: 'comment-list',
		props: {
			blogId: Number
		},
		components: {
			YAppendListWrapper,
			CommentItem,
			CommentReplyForm,
			SkeletonCommentList,
		},
		data() {
			return {
				commentList: [],
				urls,
				currentReplyItem: null,
				showReply: false
			}
		},
		created() {
			console.log('======created======')
		},
		beforeUnmount(){
			console.log('======beforeDestroy======')
		},
		methods: {
			handleShowReply(comment) {
				this.currentReplyItem = comment
				this.showReply = true
			},
		},
	}
</script>

<style lang="scss" scoped>
	.list-wrapper {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.comment-item {
		&+.comment-item {
			border-top: 1px solid $uni-border-2;
			padding-top: 16rpx
		}
	}

</style>
