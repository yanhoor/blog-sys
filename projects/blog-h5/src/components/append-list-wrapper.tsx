import { useFetchAppendList } from '@/hooks'
import { ReactNode, useEffect } from 'react'
import StatusLoading from '@/components/status/status-loading'
import { List, PullRefresh } from 'react-vant'
import { ListFetchState } from '@/hooks/useFetchAppendList'
import StatusEmpty from '@/components/status/status-empty'

interface Props<E> {
  url: string
  initParams?: any
  createItem: (item: E) => ReactNode
  createSkeletonItem?: () => ReactNode
}
export default function AppendListWrapper<T>({
  url,
  initParams,
  createItem,
  createSkeletonItem
}: Props<T>) {
  const {
    handleChangeListParams,
    handleLoadNextPage,
    handleInitFetchPageList,
    pageList,
    listState
  } = useFetchAppendList<T>(url, initParams)

  console.log('------handleInitFetchPageList-------')
  useEffect(() => {
    handleInitFetchPageList()
  }, [])

  const onLoad = async (isRefresh: boolean) => {
    console.log('-------------', isRefresh)
    if (isRefresh) {
      handleInitFetchPageList()
    } else {
      handleLoadNextPage()
    }
  }

  let result: ReactNode

  if (listState === ListFetchState.loading && pageList.length === 0) {
    result = createSkeletonItem ? createSkeletonItem() : <StatusLoading />
  } else if (listState === ListFetchState.error) {
    result = <div>Error</div>
  } else {
    result = (
      <PullRefresh onRefresh={handleInitFetchPageList}>
        <List
          onLoad={onLoad}
          finished={listState === ListFetchState.finish}
          errorText="请求失败，点击重新加载"
          offset={50}
        >
          {pageList.length ? (
            pageList.map((item) => createItem(item))
          ) : (
            <StatusEmpty onRefresh={handleInitFetchPageList} />
          )}
        </List>
      </PullRefresh>
    )
  }

  return <div className="append-list-wrapper">{result}</div>
}
