<template>
	<view>
		<YAppendListWrapper :pageUrl="pageUrl" :url="urls.user_myCommentList" v-model="pageList">
			<uni-card margin="5px" spacing="0" v-for="comment in pageList" :key="comment.id">
				<view class="item-container">
					<view class="item-top">
						<template v-if="comment.replyTo">
							我回复了
							<UserName :user="comment.replyTo" :text="'@' + comment.replyTo.name"></UserName>:
						</template>
						<template v-else>
							我评论了:
						</template>
					</view>
					<YExpandanleContent class="item-content" :content="comment.content">
					</YExpandanleContent>
					<YExpandanleContent class="reply-content" :maxLength="80" :showBtn="false"
						:content="comment.blog.content" @tap="handleClickPost(comment.blog)">
					</YExpandanleContent>
					<YTime class="item-time" :time="comment.createdAt"></YTime>
				</view>
			</uni-card>
		</YAppendListWrapper>
	</view>
</template>

<script>
	import YAppendListWrapper from '@/components/y-append-list-wrapper.vue'
	import YExpandanleContent from '@/components/y-expandable-content.vue'
	import YTime from '@/components/y-time.vue'
	import scrollMixin from '@/mixins/scrollMixin.js'
	import Http, {
		urls
	} from '@/http'
	import {
		useScrollStatusStore
	} from '@/stores/scrollStatus.js'

	export default {
		mixins: [scrollMixin],
		components: {
			YAppendListWrapper,
			YExpandanleContent,
			YTime,
		},
		data() {
			return {
				pageUrl: '/pages/my-comment',
				pageList: [],
				urls
			}
		},
		onLoad(params) {
			uni.startPullDownRefresh()
		},
		onPullDownRefresh() {
			const s = useScrollStatusStore()
			s.setPullDownRefresh(this.pageUrl)
		},
		methods: {
			handleClickPost(post) {
				uni.navigateTo({
					url: '/pages/post/post?id=' + post.id
				})
			}
		}

	}
</script>

<style lang="scss" scoped>
	.item-container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 6px;
	}

	.item-top {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.item-content {
		color: $uni-main-color;
		width: 100%;
	}

	.reply-content {
		width: 100%;
		box-sizing: border-box;
		background-color: #f3f4f6;
		padding: 10px;
		border-radius: 5px;
	}

	.item-time {
		font-size: 14px;
		color: $uni-secondary-color;
	}
</style>
