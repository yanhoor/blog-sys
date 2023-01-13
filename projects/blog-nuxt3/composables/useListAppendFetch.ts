// 无限加载

type InitParams<T> = {
  initList?: T[]
  currentPage?: number
  pageSize?: number
  uniqueKey?: string // 过滤重复项的key
}
export const useListAppendFetch = <T>(url: string, params: Object = {}, initParams: InitParams<T>) => {
  const currentPage = ref(0) // 注意是 0
  const pageSize = ref(initParams.pageSize || 20)
  const pageTotal = ref(0)
  const pageList = ref<T[]>(initParams.initList || [])
  const pageLoading = ref(false)
  const pageLoadedFinish = ref(false) // 是否加载全部

  async function fetchPage() {
    try{
      pageLoading.value = true
      const { result, success } = await useFetchPost(url, { page: currentPage.value, pageSize: pageSize.value, ...params })
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
        if(result.list.length < pageSize.value) pageLoadedFinish.value = true
      }
      pageLoading.value = false
    }catch (e) {
      pageLoading.value = false
    }
  }

  async function handlePageChange(page: number) {
    currentPage.value = page
    return await fetchPage()
  }

  return {
    currentPage,
    pageTotal,
    pageList,
    pageLoading,
    pageLoadedFinish,
    handlePageChange
  }
}
