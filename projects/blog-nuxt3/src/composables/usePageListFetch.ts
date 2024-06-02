interface PageFetchParams {
  page: number
  pageSize: number
  [x: string]: any
}
export const usePageListFetch = async <T>(url: string, params: any = {}) => {
  const pageTotal = ref(0)
  const pageList = ref<T[]>([])
  const pageLoading = ref(false)
  const fetchResult = ref(null)
  const pageFetchParams = reactive<PageFetchParams>({
    page: 1,
    pageSize: 20,
    ...params
  })
  fetchPage()

  async function fetchPage() {
    try {
      pageLoading.value = true
      const { result, success } = await useFetchPost(url, pageFetchParams)
      if (success) {
        fetchResult.value = result
        pageList.value = result.list
        pageTotal.value = result.total
      }
      pageLoading.value = false
    } catch (e) {
      pageLoading.value = false
    }
  }

  function handlePageChange(page?: number) {
    pageFetchParams.page = page || pageFetchParams.page
    fetchPage()
  }

  return {
    pageTotal,
    pageList,
    pageLoading,
    pageFetchParams,
    fetchResult,
    fetchPage,
    handlePageChange
  }
}
