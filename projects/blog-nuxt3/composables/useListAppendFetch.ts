// 无限加载
import { Ref } from 'vue'

type InitParams<T> = {
  initList?: T[]
  currentPage?: number
  pageSize?: number
  uniqueKey?: string // 过滤重复项的key
}

interface PageFetchParams{
  page: number
  pageSize: number
  [x: string]: any
}
export const useListAppendFetch = <T>(url: string, params: Object = {}, initParams: InitParams<T>) => {
  const pageTotal = ref(0)
  const pageList = ref<T[]>(initParams.initList ? [...initParams.initList] : []) as Ref<T[]>
  const pageLoading = ref(false)
  const pageLoadedFinish = ref(false) // 是否加载全部
  const fetchResult = ref(null)
  const pageFetchParams = reactive<PageFetchParams>({
    page: 0,
    pageSize: initParams.pageSize || 20,
    ...params
  })

  async function fetchPage() {
    try{
      pageLoading.value = true
      const { result, success } = await useFetchPost(url, pageFetchParams)
      if(success){
        fetchResult.value = result
        for(let item of result.list){
          if(!initParams.uniqueKey){
            pageList.value.push(item)
          }else if(!pageList.value.some((old: any) => old[initParams.uniqueKey as string] === item[initParams.uniqueKey as string])){
            pageList.value.push(item)
          }
        }
        pageTotal.value = result.total
        if(result.list.length < pageFetchParams.pageSize) {
          pageLoadedFinish.value = true
        }else{
          pageLoadedFinish.value = false
        }
      }
      pageLoading.value = false
    }catch (e) {
      pageLoading.value = false
    }
  }

  async function handlePageChange(page?: number) {
    pageFetchParams.page = page || pageFetchParams.page
    if(page == 1){
      pageList.value = initParams.initList ? [...initParams.initList] : []
    }
    return await fetchPage()
  }

  async function handleLoadNextPage() {
    if(pageLoadedFinish.value) return
    pageFetchParams.page ++
    return await fetchPage()
  }

  return {
    pageTotal,
    pageList,
    pageLoading,
    pageLoadedFinish,
    pageFetchParams,
    fetchResult,
    handlePageChange,
    handleLoadNextPage,
  }
}
