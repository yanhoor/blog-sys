<template>
	<view>
		<NotificationBase :type="2" v-model="pageList">
			<uni-card margin="5px" v-for="notification in pageList" :key="notification.id">
				<view class="item-container">
					<view class="item-top">
						<UserAvatar :user="notification.createBy" :size="32"></UserAvatar>
						<UserName fontSize="16" :user="notification.createBy"></UserName>
						<view>点赞了</view>
					</view>
					
					<YExpandanleContent class="reply-content" :maxLength="80" :showBtn="false"
						:content="notification.blog.content" @tap="handleClickPost(notification.blog)" v-if="notification.blog">
					</YExpandanleContent>
					<view class="reply-content blog-is-delete" v-else>
						博客已经被删除
					</view>
					<YTime class="item-time" :time="notification.createdAt"></YTime>
				</view>
			</uni-card>
		</NotificationBase>
	</view>
</template>

<script>
	import NotificationBase from './notification-base.vue'
	import YExpandanleContent from '@/components/y-expandable-content.vue'
	import YTime from '@/components/y-time.vue'

	export default {
		name: "notification-like",
		components: {
			YExpandanleContent,
			YTime,
			NotificationBase,
		},
		data() {
			return {
				pageList: []
			}
		},
		created() {
			// console.log('++++++++notification-comment created++++++++++++', getCurrentPages())
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

	.reply-content {
		width: 100%;
		box-sizing: border-box;
		background-color: #f3f4f6;
		padding: 10px;
		border-radius: 5px;
		&.blog-is-delete{
			color: $uni-error;
		}
	}

	.item-time {
		font-size: 14px;
		color: $uni-secondary-color;
	}
</style>
