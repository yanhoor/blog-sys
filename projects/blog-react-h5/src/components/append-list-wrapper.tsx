import { useFetchAppendList } from '@/hooks'
import { ReactNode, useEffect } from 'react'
import StatusLoading from '@/components/status/status-loading'
import { List, PullRefresh } from 'react-vant'
import { ListFetchState } from '@/hooks/useFetchAppendList'

interface Props<E> {
  url: string
  createItem: (item: E) => ReactNode
  createSkeletonItem?: () => ReactNode
}
export default function AppendListWrapper<T>({
  url,
  createItem,
  createSkeletonItem
}: Props<T>) {
  const {
    handleChangeListParams,
    handleLoadNextPage,
    handleInitFetchPageList,
    pageList,
    listState
  } = useFetchAppendList<T>(url)

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
          {pageList.map((item) => createItem(item))}
        </List>
      </PullRefresh>
    )
  }

  return <div className="append-list-wrapper">{result}</div>
}
