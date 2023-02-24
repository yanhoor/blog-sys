<template>
	<view class="container">
		<PostList :pageUrl="pageUrl" :searchParams="{ gid: currentGroupId }" @fetch-end="handleListFetchEnd">
		</PostList>

		<view class="group-list-container" v-if="groupList.length">
			<view class="list-wrapper">
				<scroll-view scroll-x class="group-list" id="groupList" :scroll-into-view="scrollIntoEl">
					<view class="group-item-container" :class="{'active': currentGroupId == group.id}"
						:id="'group' + group.id" v-for="group in groupList" :key="group.id"
						@click="handleChangeGroup(group.id)">{{ group.name }}
					</view>
				</scroll-view>
			</view>
			<uni-icons type="list" size="18" @click="handleManageGroup"></uni-icons>
		</view>
	</view>
</template>

<script>
	import scrollMixin from '@/mixins/scrollMixin.js'
	import PostList from '@/components/post/post-list.vue'
	import {
		useScrollStatusStore
	} from '@/stores/scrollStatus.js'
	import {
		useMyInfoStore
	} from '@/stores/userInfo.js'
	import {
		mapState,
		mapActions,
	} from 'pinia'
	import Http, {
		urls
	} from '@/http'

	export default {
		components: {
			PostList
		},
		mixins: [scrollMixin],
		data() {
			return {
				groupList: [],
				currentGroupId: '',
				pageUrl: 'pages/index',
				scrollIntoEl: ''
			}
		},
		computed: {
			...mapState(useMyInfoStore, ['myInfo']),
		},
		async created() {
			await this.getMyInfo()
			if (this.myInfo) {
				this.currentGroupId = uni.getStorageSync('index-view-group-id') || ''
			}
			uni.startPullDownRefresh()
			uni.$on('refresh_index_page', () => {
				this.groupList = []
				// 不能使用 startPullDownRefresh，因为登录后返回其他tab时无效，刷新的是其他tab
				this.initPage()
			})
			
			uni.$on('refresh_index_group', () => {
				this.getAllGroup()
			})
		},
		onShow() {
			const back = uni.getStorageSync('back_from_login')
			if (back == 2) {
				uni.startPullDownRefresh()
			}
			uni.removeStorageSync('back_from_login')
		},
		onPullDownRefresh() {
			this.initPage()
		},
		methods: {
			...mapActions(useMyInfoStore, ['getMyInfo']),
			...mapActions(useScrollStatusStore, ['setPullDownRefresh']),
			initPage() {
				// console.log('+++++++++initPage++++++++++')
				this.setPullDownRefresh(this.pageUrl)
				this.getAllGroup()
			},
			async getAllGroup() {
				if (!this.myInfo) return

				try {
					const {
						success,
						result,
						msg
					} = await Http.post(urls.followGroup_all)
					if (success) {
						this.groupList = [{
								id: '',
								name: '全部'
							},
							...result
						]
						this.handleScrollToCurrentGroup()
					}
				} catch (e) {}
			},
			handleChangeGroup(groupId) {
				this.currentGroupId = groupId
				uni.setStorageSync('index-view-group-id', groupId)
				// 不用 $nextTick 的话在真机获取的是上一个分组的列表？
				this.$nextTick(() => {
					uni.startPullDownRefresh()
				})
			},
			handleListFetchEnd(result) {
				if (result.code == 12) {
					// 分组不存在
					this.handleChangeGroup('')
				}
			},
			handleScrollToCurrentGroup() {
				// 直接绑定会无效
				this.scrollIntoEl = 'group' + this.currentGroupId
			},
			handleManageGroup() {
				uni.navigateTo({
					url: '/pages/user-group-manage/user-group-manage'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.group-list-container {
		max-width: 80%;
		position: fixed;
		bottom: 30rpx;
		left: 50%;
		transform: translateX(-50%);
		background-color: #f0f0f0;
		// background: rgba(250, 250, 250, 0.7);
		border-radius: 30rpx;
		box-shadow: $uni-shadow-sm;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		gap: 12rpx;
	}

	.list-wrapper {
		flex: 1;
		overflow: auto;
	}

	.group-list {
		box-sizing: border-box;
		white-space: nowrap;

		&::-webkit-scrollbar {
			display: none;
		}

		.group-item-container {
			font-size: 14px;
			color: $uni-base-color;
			word-break: keep-all;
			display: inline-block;
			padding: 16rpx 0;

			&+.group-item-container {
				margin-left: 16rpx;
			}

			&.active {
				color: $uni-primary;
				font-weight: 600;
			}
		}
	}
</style>
