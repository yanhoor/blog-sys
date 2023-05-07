import { useState } from 'react'
import $http from '@/http'

export enum ListFetchState {
  loading,
  more,
  finish,
  error
}

export function useFetchAppendList<T>(url: string, initParams: any = {}) {
  const [listState, setListState] = useState<ListFetchState>(
    ListFetchState.loading
  )
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(initParams?.pageSize || 20)
  const [listTotal, setListTotal] = useState(0)
  const [pageList, setPageList] = useState(<T[]>[])

  let listParams = {
    page,
    pageSize,
    ...initParams
  }

  async function getList(clear = false) {
    setListState(ListFetchState.loading)
    try {
      const { msg, success, result } = await $http.post(url, {
        page,
        pageSize,
        ...listParams
      })
      setPageList(clear ? result.list : [...pageList, ...result.list])
      setListTotal(result.total)
      if (result.list.length < pageSize) {
        setListState(ListFetchState.finish)
      } else {
        setListState(ListFetchState.more)
      }
    } catch (e) {
      setListState(ListFetchState.error)
      console.log('=====useFetchAppendList error======', e)
    }
  }

  function handleInitFetchPageList() {
    listParams.page = 1
    listParams.pageSize = initParams?.pageSize || 20
    setPage(listParams.page)
    setPageSize(listParams.pageSize)
    setListTotal(0)
    getList(true)
  }

  async function handleLoadNextPage(p?: number) {
    if (listState === ListFetchState.finish) return
    console.log('=++++++++++++', listParams.page)

    if (p) {
      listParams.page = p
    } else {
      listParams.page++
    }
    setPage(listParams.page)
    getList()
  }

  function handleChangeListParams(params: object = {}) {
    listParams = {
      ...listParams,
      ...params
    }
    handleLoadNextPage(1)
  }

  return {
    handleChangeListParams,
    handleLoadNextPage,
    handleInitFetchPageList,
    pageList,
    listState,
    listTotal
  }
}
