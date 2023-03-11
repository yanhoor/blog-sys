<template>
	<view class="search-result-page">
		<view class="search-section">
			<uni-card margin="5px" padding="0" spacing="0" isFull>
				<view class="search-container">
					<uni-search-bar class="search-bar" v-model="searchParams.keyword" @confirm="handleSearch"
						bgColor="#f0f0f0" @cancel="handleBack" maxlength="20"></uni-search-bar>
					<uni-icons type="tune" size="18" @click="handleShowFilter" color="#707070"></uni-icons>
				</view>
			</uni-card>
		</view>
		<PostList :pageUrl="pageUrl" :searchParams="searchParams" :showSkeleton="false"></PostList>
		<uni-popup ref="filterPopupRef" type="right" background-color="#fff">
			<view class="filter-container">
				<view class="filter-section-container">
					<view class="filter-section">
						<view class="filter-section-title">
							排序
						</view>
						<uni-data-checkbox v-model="searchParams.sort" :localdata="sortTypeList">
						</uni-data-checkbox>
					</view>
					<view class="filter-section">
						<view class="filter-section-title">
							时间
						</view>
						<uni-data-checkbox v-model="selectTime" :localdata="filterTimeList">
						</uni-data-checkbox>
					</view>
				</view>
				<view class="action-section">
					<button type="primary" @click="handleFilterConfirm">确定</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import PostList from '@/components/post/post-list.vue'
	import scrollMixin from '@/mixins/scrollMixin.js'
	import {
		useScrollStatusStore
	} from '@/stores/scrollStatus.js'
	import dayjs from 'dayjs'

	export default {
		mixins: [scrollMixin],
		components: {
			PostList
		},
		data() {
			return {
				pageUrl: '/pages/search',
				selectTime: 0,
				searchParams: {
					keyword: '',
					sort: 1,
					startTime: '',
					endTime: '',
				},
				historyList: [],
				sortTypeList: [{
						value: 1,
						text: "综合排序"
					},
					{
						value: 2,
						text: "最新优先"
					},
					{
						value: 3,
						text: "最热优先"
					},
				],
				filterTimeList: [{
						value: 0,
						text: "时间不限"
					},
					{
						value: 1,
						text: "最近一天"
					},
					{
						value: 2,
						text: "最近一周"
					},
					{
						value: 3,
						text: "最近三个月"
					},
				]
			}
		},
		created() {
			this.historyList = JSON.parse(uni.getStorageSync('search-history')) || []
		},
		onLoad(params) {
			this.searchParams.keyword = params.keyword
			uni.startPullDownRefresh()
		},
		onPullDownRefresh() {
			const s = useScrollStatusStore()
			if (this.searchParams.keyword) {
				s.setPullDownRefresh(this.pageUrl)
			} else {
				uni.stopPullDownRefresh()
			}
		},
		methods: {
			handleSearch() {
				if (!this.searchParams.keyword) {
					uni.showToast({
						icon: 'error',
						title: '请输入内容'
					})
					return
				}

				if (!this.historyList.includes(this.searchParams.keyword)) {
					this.historyList.push(this.searchParams.keyword)
					uni.setStorageSync('search-history', JSON.stringify(this.historyList))
				}

				uni.startPullDownRefresh()
			},
			handleFilterConfirm() {
				this.$refs.filterPopupRef.close()
				switch (this.selectTime) {
					case 0:
						this.searchParams.startTime = ''
						this.searchParams.endTime = ''
						break
					case 1:
						this.searchParams.startTime = dayjs().subtract(24, 'h')
						this.searchParams.endTime = dayjs()
						break
					case 2:
						this.searchParams.startTime = dayjs().subtract(7, 'd').endOf('date')
						this.searchParams.endTime = dayjs().endOf('date')
						break
					case 3:
						this.searchParams.startTime = dayjs().subtract(90, 'd').endOf('date')
						this.searchParams.endTime = dayjs().endOf('date')
						break
				}
				this.handleSearch()
			},
			handleShowFilter() {
				this.$refs.filterPopupRef.open()
			},
			handleBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search-section {
		position: sticky;
		top: 0;
		z-index: 1;
	}

	.search-container {
		display: flex;
		align-items: center;
		gap: 12rpx;

		padding-right: 20rpx;

		.search-bar {
			flex: 1;
		}
	}

	.filter-container {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding: 20rpx 20rpx env(safe-area-inset-bottom);
		max-width: 80vw;
		min-height: 100vh;

		.filter-section-container {
			flex: 1;

			.filter-section {
				display: flex;
				flex-direction: column;
				gap: 10rpx;

				&+.filter-section {
					margin-top: 20rpx;
				}

				&-title {
					color: $uni-secondary-color;
				}
			}
		}

		.action-section {
			align-self: flex-end;
			width: 100%;

			button {
				width: 100%;
			}
		}
	}
</style>
