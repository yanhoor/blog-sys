import {ref, reactive, watchEffect} from 'vue'
import $http from "@/http"

export default function useListFetch<T>(url: string, params: Object = {}) {
  const pageTotal = ref(0)
  const pageList = ref<T[]>([])
  const listLoading = ref(false)
  const pageFetchParams = ref({
    page: 1,
    pageSize: 20,
    ...params
  })

  function handlePageChange(page: number){
    pageFetchParams.value.page = page
    getList()
  }

  function handleChangeFetchParams(params: Object = []) {
    pageFetchParams.value = {
      ...pageFetchParams.value,
      ...params
    }
    handlePageChange(pageFetchParams.value.page)
  }

  async function getList() {
    try {
      listLoading.value = true
      const { result, msg, success } = await $http.post(url, pageFetchParams.value)
      if(success){
        pageList.value = result.list
        pageTotal.value = result.total
      }
      listLoading.value = false
    }catch (e) {
      listLoading.value = false
    }
  }

  return {
    pageList,
    pageTotal,
    listLoading,
    pageFetchParams,
    handlePageChange,
    handleChangeFetchParams
  }
}
