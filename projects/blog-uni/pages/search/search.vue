<template>
	<view class="search-page">
		<view class="input-container">
			<uni-easyinput v-model="keyword" placeholder="输入要搜索的内容" clearable :trim="true" confirmType="search"
				@confirm="handleSearch" />
			<button type="primary" size="mini" @click="handleSearch">搜索</button>
		</view>
		<view class="section-block" v-if="historyList.length">
			<view class="secction-title-container">
				<view class="section-title">
					搜索历史
				</view>
				<view class="section-action" @click="handleClearHistory">
					清除
				</view>
			</view>
			<uni-card margin="5px" spacing="0">
				<view class="history-container" v-for="(item, index) in historyList" :key="item">
					<view class="item" @click="handleClickHistoryItem(item)">
						{{ item }}
					</view>
					<uni-icons type="closeempty" color="#c7c7c7" @click.stop="handleDeleteHistoryItem(index)">
					</uni-icons>
				</view>
			</uni-card>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: '',
				historyList: []
			}
		},
		onShow() {
			this.historyList = JSON.parse(uni.getStorageSync('search-history')) || []
		},
		methods: {
			handleIconClick(type) {
				if (type === 'suffix') {
					this.handleSearch()
				}
			},
			handleClickHistoryItem(item) {
				this.keyword = item
				this.handleSearch()
			},
			handleSearch() {
				if (!this.keyword) {
					uni.showToast({
						icon: 'error',
						title: '请输入内容'
					})
					return
				}

				if (!this.historyList.includes(this.keyword)) {
					this.historyList.push(this.keyword)
					uni.setStorageSync('search-history', JSON.stringify(this.historyList))
				}

				uni.navigateTo({
					url: '/pages/search-result/search-result?keyword=' + this.keyword
				})
			},
			handleDeleteHistoryItem(index) {
				this.historyList.splice(index, 1)
				uni.setStorageSync('search-history', JSON.stringify(this.historyList))
			},
			handleClearHistory() {
				this.historyList = []
				uni.setStorageSync('search-history', JSON.stringify(this.historyList))
			}
		},
	}
</script>

<style lang="scss" scoped>
	.search-page {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
	}

	.section-block {
		display: flex;
		flex-direction: column;
		gap: 10rpx;

		.secction-title-container {
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: $uni-secondary-color;
			margin: 0 5px;

			.section-title {
				font-size: 14px;
				font-weight: 600;
			}

			.section-action {
				font-size: 14px;
			}
		}
	}

	.input-container {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin: 0 5px;
	}

	.history-container {
		display: flex;
		align-items: center;
		padding: 20rpx 0;

		&+.history-container {
			border-top: 1px solid $uni-border-3;
		}

		.item {
			flex: 1;
		}
	}
</style>
