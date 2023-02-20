<!-- 第一次需要手动 uni.startPulldownRefresh() 才请求 -->

<template>
	<view>
		<slot></slot>

		<slot name="skeleton" v-if="loadStatus === 'loading' && !pageList.length"></slot>
		<ResultError v-else-if="fetchError" @refresh="handleRefresh"></ResultError>
		<ResultEmpty v-else-if="!pageList.length" @refresh="handleRefresh"></ResultEmpty>
		<uni-load-more :status="loadStatus" @clickLoadMore="handleLoadMore" :contentText="{ contentdown: '上拉或点击加载更多' }" v-else>
		</uni-load-more>
	</view>
</template>

<script>
	import Http from '@/http'
	import {
		useScrollStatusStore
	} from '@/stores/scrollStatus.js'
	import ResultError from '@/components/result/result-error.vue'
	import ResultEmpty from '@/components/result/result-empty.vue'

	export default {
		name: "y-append-list-wrapper",
		props: {
			url: {
				type: String,
				required: true
			},
			// 唯一id，避免下拉时缓存的页面也会进行刷新
			pageUrl: {
				type: String,
				required: true
			},
			searchParams: {
				type: Object,
				default () {
					return {}
				}
			},
			modelValue: Array
		},
		emits: ['update:modelValue', 'fetch-end'],
		components: {
			ResultError,
			ResultEmpty
		},
		data() {
			return {
				pageList: [],
				pageSize: 20,
				page: 1,
				loadStatus: 'loading',
				fetchError: false,
			};
		},
		computed: {
			fetchParams() {
				return {
					pageSize: this.pageSize,
					page: this.page,
					...this.searchParams
				}
			}
		},
		created() {
			console.log('______y-append-list-wrapper created_________', this.pageUrl)
			// this.handlePageChange(1)

			const scrollStore = useScrollStatusStore()
			// 当组件被卸载时，它们将被自动删除
			const unsubscribe = scrollStore.$onAction(
				({
					name, // action 的名字
					store, // store 实例
					args, // 调用这个 action 的参数
					after, // 在这个 action 执行完毕之后，执行这个函数
					onError, // 在这个 action 抛出异常的时候，执行这个函数
				}) => {
					// const psgeList = getCurrentPages()
					// const currentPage = psgeList[psgeList.length - 1]
					// console.log('+++++++++scrollStore.$onAction scrollStore++++++++++++', name, store, args)

					if (name === "setPullDownRefresh" && args.length > 0) {
						const pagePaths = args[0]
						console.log('+++++++++scrollStore.$onAction++++++++++++', pagePaths, this.pageUrl)
						if (Array.isArray(pagePaths)) {
							// 页面url数组
							if (pagePaths.includes(this.pageUrl)) {
								this.handlePageChange(1).then(r => {
									// console.log('_______________', r)
									if (r) uni.stopPullDownRefresh()
								})
								return
							}
						} else {
							// 单个页面 url
							if (this.pageUrl === pagePaths) {
								this.handlePageChange(1).then(r => {
									// console.log('_______________', r)
									if (r) uni.stopPullDownRefresh()
								})
								return
							}
						}
					}

					if (name === "setReachBottom") {
						this.handleLoadMore()
						return
					}
				}
			)
		},
		boforeUnmount(){
			console.log('==========boforeUnmount===========', this.pageUrl)
		},
		methods: {
			async getList(reset) {
				this.loadStatus = "loading"
				this.fetchError = false
				try {
					const {
						result,
						success,
						msg
					} = await Http.post(this.url, this.fetchParams)
					uni.stopPullDownRefresh()
					if (success) {
						if(reset) this.pageList = []
						this.pageList = this.pageList.concat(result.list || [])
						if (this.pageSize > result.list.length) {
							this.loadStatus = "no-more"
						} else {
							this.loadStatus = "more"
						}
						this.$emit('update:modelValue', this.pageList)
						this.$emit('fetch-end', result)
						return result
					} else {
						this.loadStatus = "more"
						this.fetchError = true
						return false
					}
				} catch (e) {
					uni.stopPullDownRefresh()
					this.fetchError = true
					this.loadStatus = "more"
					return false
				}
			},
			async handlePageChange(page) {
				this.page = page
				return await this.getList(true)
			},
			async handleNextPage(page) {
				if (page) {
					return await this.handlePageChange(page)
				}
				this.page++
				return await this.getList()
			},
			handleLoadMore(e) {
				// console.log('+++++++++++++++', e.detail)
				if (this.loadStatus === "no-more") return

				this.handleNextPage()
			},
			handleRefresh(){
				uni.startPullDownRefresh()
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
