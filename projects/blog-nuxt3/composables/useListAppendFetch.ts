// 无限加载

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
  const pageList = ref<T[]>(initParams.initList || [])
  const pageLoading = ref(false)
  const pageLoadedFinish = ref(false) // 是否加载全部
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
        for(let item of result.list){
          if(!pageList.value.some((old: any) => initParams.uniqueKey && old[initParams.uniqueKey] === item[initParams.uniqueKey])){
            pageList.value.push(item)
          }
          if(!initParams.uniqueKey){
            pageList.value.push(item)
          }
        }
        pageTotal.value = result.total
        if(result.list.length < pageFetchParams.pageSize) pageLoadedFinish.value = true
      }
      pageLoading.value = false
    }catch (e) {
      pageLoading.value = false
    }
  }

  async function handlePageChange(page: number) {
    pageFetchParams.page = page
    return await fetchPage()
  }

  return {
    pageTotal,
    pageList,
    pageLoading,
    pageLoadedFinish,
    pageFetchParams,
    handlePageChange
  }
}
