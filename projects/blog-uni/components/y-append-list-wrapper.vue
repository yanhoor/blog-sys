<template>
	<view>
		<view v-for="item in pageList" :key="item.id">
			<slot :pageItem="item"></slot>
		</view>
		<view v-if="fetchError" @click="handlePageChange(1)">加载错误，点击重试</view>
		<uni-load-more :status="loadStatus" @clickLoadMore="handleLoadMore" v-else>
		</uni-load-more>
	</view>
</template>

<script>
	import Http from '@/http'
	import {
		useScrollStatusStore
	} from '@/stores/scrollStatus.js'
	
	export default {
		name:"y-append-list-wrapper",
		props: {
			url: {
				type: String,
				require: true 
			},
			searchParams: Object
		},
		data() {
			return {
				pageList: [],
				pageSize: 20,
				page: 1,
				loadStatus: 'more',
				fetchError: false
			};
		},
		computed: {
			fetchParams(){
				return {
					pageSize: this.pageSize,
					page: this.page,
					...this.searchParams
				}
			}
		},
		created() {
			this.handlePageChange(1)
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
				  if(name === "setPullDownRefresh"){
					  this.handlePageChange(1).then( r => {
						  // console.log('_______________', r)
						  if(r) uni.stopPullDownRefresh()
					  })
					  return
				  }
				  if(name === "setReachBottom"){
					  this.handleLoadMore()
					  return
				  }
			    // 记录开始的时间变量
			//     const startTime = Date.now()
			//     // 这将在 `store` 上的操作执行之前触发
			//     console.log(`Start "${name}" with params [${args.join(', ')}].`)
			
			//     // 如果 action 成功并且完全运行后，after 将触发。
			//     // 它将等待任何返回的 promise
			//     after((result) => {
			//       console.log(
			//         `Finished "${name}" after ${
			//           Date.now() - startTime
			//         }ms.\nResult: ${result}.`
			//       )
			//     })
			
			//     // 如果 action 抛出或返回 Promise.reject ，onError 将触发
			//     onError((error) => {
			//       console.warn(
			//         `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
			//       )
			//     })
			  }
			)
		},
		methods: {
			async getList() {
				this.loadStatus = "loading"
				this.fetchError = false
				try {
					const {
						result,
						success,
						msg
					} = await Http.post(this.url, this.fetchParams)
					if(success){
						this.pageList = this.pageList.concat(result.list || [])
						if(this.pageSize > result.list.length ){
							this.loadStatus = "no-more"
						}else{
							this.loadStatus = "more"
						}
						return result
					}else{
						this.fetchError = true
						return false
					}
				} catch (e) {
					console.log('+++++++y-append-list-wrapper error+++++++++', e.message)
					this.fetchError = true
					return false
				}
			},
			async handlePageChange(page){
				this.page = page
				if(this.page === 1){
					this.pageList = []
				}
				return await this.getList()
			},
			async handleNextPage(page){
				if(page){
					return await this.handleNextPage(page)
				}
				this.page ++
				return await this.getList()
			},
			handleLoadMore(e) {
				// console.log('+++++++++++++++', e.detail)
				if(this.loadStatus === "no-more") return
				
				this.handleNextPage()
			}
		}
	}
</script>

<style>

</style>