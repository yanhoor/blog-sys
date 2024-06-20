// 无限加载
import { Ref } from 'vue'

type InitParams<T> = {
  initList?: T[]
  currentPage?: number
  pageSize?: number
  uniqueKey?: string // 过滤重复项的key
}

interface PageFetchParams {
  page: number
  pageSize: number
  [x: string]: any
}
export const useListAppendFetch = <T>(
  url: string,
  params: Object = {},
  initParams: InitParams<T>
) => {
  const pageTotal = ref(0)
  const pageList = ref<T[]>(
    initParams.initList ? [...initParams.initList] : []
  ) as Ref<T[]>
  const pageLoading = ref(false)
  const pageLoadedFinish = ref(false) // 是否加载全部
  const fetchResult = ref(null)
  const pageFetchParams = ref<PageFetchParams>({
    page: 0,
    pageSize: initParams.pageSize || 20,
    ...params
  })

  async function fetchPage(resetList = false) {
    try {
      pageLoading.value = true
      const respone = await $HttpUtils.post<any>(url, pageFetchParams.value)
      pageLoading.value = false
      const { result, success } = respone
      if (success) {
        if (resetList) {
          pageList.value = initParams.initList ? [...initParams.initList] : []
        }
        fetchResult.value = result
        for (const item of result.list) {
          if (!initParams.uniqueKey) {
            pageList.value.push(item)
          } else if (
            !pageList.value.some(
              (old: any) =>
                old[initParams.uniqueKey as string] ===
                item[initParams.uniqueKey as string]
            )
          ) {
            pageList.value.push(item)
          }
        }
        pageTotal.value = result.total
        pageLoadedFinish.value =
          result.list.length < pageFetchParams.value.pageSize
      }
      return respone
    } catch (e) {
      console.log('=======useListAppendFetch======', e)
      pageLoading.value = false
    }
  }

  async function handlePageChange(page: number) {
    pageFetchParams.value.page = page
    return await fetchPage(page == 1)
  }

  async function handleLoadNextPage(page?: number) {
    if (page) {
      return await handlePageChange(page)
    }
    if (pageLoadedFinish.value) return
    pageFetchParams.value.page++
    return await fetchPage()
  }

  function handleChangeFetchParams(params: Object = {}) {
    pageFetchParams.value = {
      ...pageFetchParams.value,
      ...params
    }
    handleLoadNextPage(1)
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
    handleChangeFetchParams
  }
}
