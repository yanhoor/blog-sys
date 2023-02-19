<template>
	<view>
		<NotificationBase :type="3" v-model="pageList">
			<uni-card margin="5px" v-for="notification in pageList" :key="notification.id">
				<view class="item-container">
					<view class="item-top">
						<UserAvatar :user="notification.createBy" :size="32"></UserAvatar>
						<view class="item-user-name">
							{{ notification.createBy.name }}
						</view>
						<view>收藏了</view>
					</view>
					<YExpandanleContent class="reply-content" :maxLength="80" :showBtn="false"
						:content="notification.blog.content">
					</YExpandanleContent>
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
	import UserAvatar from '@/components/user/user-avatar.vue'

	export default {
		name: "notification-collect",
		components: {
			YExpandanleContent,
			YTime,
			UserAvatar,
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

		.item-user-name {
			color: $uni-success;
			font-weight: 600;
			font-size: 16px;
		}
	}

	.reply-content {
		width: 100%;
		box-sizing: border-box;
		background-color: #f3f4f6;
		padding: 10px;
		border-radius: 5px;
	}
	.item-time{
		font-size: 14px;
		color: $uni-secondary-color;
	}
</style>
