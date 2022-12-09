
export const usePageListFetch = async <T>(url: string, params: Object = {}) => {
  const currentPage = ref(1)
  const pageSize = ref(20)
  const pageTotal = ref(0)
  const pageList = ref<T[]>([])
  const pageLoading = ref(false)
  fetchPage()

  async function fetchPage() {
    try{
      pageLoading.value = true
      const { result, success } = await useFetchPost(url, { page: currentPage.value, pageSize: pageSize.value, ...params })
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
    currentPage.value = page
    fetchPage()
  }

  return {
    currentPage,
    pageTotal,
    pageList,
    pageLoading,
    handlePageChange,
  }
}
