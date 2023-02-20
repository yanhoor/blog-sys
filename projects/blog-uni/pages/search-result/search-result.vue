<template>
	<view class="search-result-page">
		<view class="search-section">
			<uni-card margin="5px" padding="0" spacing="0" isFull>
				<view class="search-container">
					<uni-search-bar class="search-bar" v-model="searchParams.keyword" @confirm="handleSearch" bgColor="#f0f0f0"
						@cancel="handleBack"></uni-search-bar>
					<!-- <uni-icons type="tune" size="24" @click="showFilter = !showFilter" color="#d7d7d7"></uni-icons> -->
				</view>
				<view class="filter-container" v-if="showFilter">
					<uni-data-select v-model="searchParams.sort" :clear="false" :localdata="sortTypeList" @change="handleSearch">
					</uni-data-select>
					<uni-data-select v-model="searchParams.time" :clear="false" :localdata="filterTimeList" @change="handleSearch">
					</uni-data-select>
				</view>
			</uni-card>
		</view>
		<PostList :pageUrl="pageUrl" :searchParams="searchParams" :showSkeleton="false"></PostList>
	</view>
</template>

<script>
	import PostList from '@/components/post/post-list.vue'
	import scrollMixin from '@/mixins/scrollMixin.js'
	import {
		useScrollStatusStore
	} from '@/stores/scrollStatus.js'

	export default {
		mixins: [scrollMixin],
		components: {
			PostList
		},
		data() {
			return {
				pageUrl: '/pages/search',
				showFilter: false,
				searchParams: {
					keyword: '',
					sort: 1,
					time: 0
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
	
	.search-container{
		display: flex;
		align-items: center;
		gap: 12rpx;
		// padding-right: 10px;
		.search-bar{
			flex: 1;
		}
	}

	.filter-container {
		display: flex;
		align-items: center;
		justify-content: space-around;
		gap: 24rpx;
		z-index: 1;
	}
</style>
