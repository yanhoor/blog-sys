
interface PageFetchParams {
  page: number
  pageSize: number
  [x: string]: any
}
export const usePageListFetch = async <T>(url: string, params: any = {}) => {
  const pageTotal = ref(0)
  const pageList = ref<T[]>([])
  const pageLoading = ref(false)
  const pageFetchParams = reactive<PageFetchParams>({
    page: 1,
    pageSize: 20,
    ...params
  })
  fetchPage()

  async function fetchPage() {
    try{
      pageLoading.value = true
      const { result, success } = await useFetchPost(url, pageFetchParams)
      if(success){
        pageList.value = result.list
        pageTotal.value = result.total
      }
      pageLoading.value = false
    }catch (e) {
      pageLoading.value = false
    }
  }

  function handlePageChange(page: number) {
    pageFetchParams.page = page
    console.log('-----------', pageFetchParams)
    fetchPage()
  }

  return {
    pageTotal,
    pageList,
    pageLoading,
    pageFetchParams,
    fetchPage,
    handlePageChange,
  }
}
