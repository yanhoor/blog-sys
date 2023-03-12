<template>
	<view>
		<YAppendListWrapper :pageUrl="pageUrl" :url="url" :searchParams="searchParams" v-model="userList">
			<template #skeleton>
				<SkeletonUserList></SkeletonUserList>
			</template>
			<view class="item-container">
				<view class="user-item" v-for="user in userList" :key="user.id">
					<view class="item-left">
						<UserAvatar :user="user" :size="36"></UserAvatar>
						<view class="name-container">
							<UserName fontSize="16" :user="user"></UserName>
							<YExpandanleContent :content="user.introduce" :maxLength="30" :showBtn="false">
							</YExpandanleContent>
							<view class="fans-count">
								粉丝：{{ user.followersCount }}
							</view>
						</view>
					</view>
					<view class="item-right">
						<UserBtn :user="user"></UserBtn>
					</view>
				</view>
			</view>
		</YAppendListWrapper>
	</view>
</template>

<script>
	import YAppendListWrapper from '@/components/y-append-list-wrapper.vue'
	import UserBtn from '@/components/user/user-btn.vue'
	import YExpandanleContent from '@/components/y-expandable-content.vue'
	import SkeletonUserList from '@/components/skeleton/skeleton-user-list.vue'

	export default {
		name: 'user-list',
		props: {
			pageUrl: String,
			url: String,
			searchParams: Object
		},
		components: {
			YAppendListWrapper,
			UserBtn,
			YExpandanleContent,
			SkeletonUserList,
		},
		data() {
			return {
				userList: []
			}
		},
		methods: {

		},
	}
</script>

<style lang="scss" scoped>
	.item-container {
		display: flex;
		flex-direction: column;
		gap: 12rpx;
		margin-top: 20rpx;
	}

	.user-item {
		display: flex;
		justify-content: space-between;
		align-items: center;

		&+.user-item {
			border-top: 1px solid $uni-border-2;
			padding-top: 8rpx
		}

		.item-left {
			flex: 1;
			display: flex;
			gap: 8rpx;
			align-items: center;

			.name-container {
				display: flex;
				flex-direction: column;
			}
		}
	}
</style>
