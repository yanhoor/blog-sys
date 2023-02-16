<template>
	<uni-card margin="5px">
		<view class="post-top">
			<UserAvatar :url="post.createBy.avatar" :size="42"></UserAvatar>
			<view class="item-user">
				<view class="user-name">{{ post.createBy.name }}</view>
				<YTime class="item-time" :time="post.createdAt"></YTime>
			</view>
		</view>
		<YExpandanleContent :content="post.content"></YExpandanleContent>
	</uni-card>
</template>

<script>
	import YImage from '@/components/y-image.vue'
	import YTime from '@/components/y-time.vue'
	import YExpandanleContent from '@/components/y-expandable-content.vue'
	import UserAvatar from '@/components/user/user-avatar.vue'

	export default {
		name: 'post-item',
		props: {
			post: Object
		},
		components: {
			YImage,
			YTime,
			YExpandanleContent,
			UserAvatar,
		},
		data() {
			return {

			}
		}
	}
</script>

<style lang="less" scoped>
	.post-item {
		display: flex;
	}

	.post-top {
		display: flex;
		align-items: center;
		justify-content: flex-start;

		.item-user {
			margin-left: 20rpx;

			.user-name {
				font-size: 18px;
				font-weight: 600;
				color: #18a058;
			}

			.item-time {
				color: #6B7280;
			}
		}
	}
</style>
