import {
  forwardRef,
  ReactNode,
  Ref,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import StatusLoading from '@/components/status/status-loading'
import { List, PullRefresh } from 'react-vant'
import { PageState } from 'sys-types'
import $http from '@/http'
import StatusEmpty from '@/components/status/status-empty'

interface Props {
  url: string
  initParams?: any
  enablePullDown?: boolean
  createList: (list: any[]) => ReactNode
  createSkeletonItem?: () => ReactNode
  onFetchComplete?: (result: any) => void
}
interface FetchParams {
  page: number
  pageSize: number
  [other: string]: any
}
export default forwardRef(function AppendListWrapper(
  {
    url,
    initParams,
    createList,
    createSkeletonItem,
    onFetchComplete,
    enablePullDown = true
  }: Props,
  ref: Ref<any>
) {
  const [listState, setListState] = useState<PageState>(PageState.initializing)
  const fetchParamsRef = useRef<FetchParams>({
    page: 0, // 从 0 开始，因为 onload 自动执行
    pageSize: 20,
    ...initParams
  })
  const [listTotal, setListTotal] = useState(0)
  const [pageList, setPageList] = useState([])

  async function getList(clear = false) {
    console.log('-----getList params--------', fetchParamsRef.current)
    try {
      const { msg, success, result } = await $http.post(
        url,
        fetchParamsRef.current
      )
      onFetchComplete?.(result)
      setPageList(clear ? result.list : [...pageList, ...result.list])
      setListTotal(result.total)
      if (
        result.total == 0 ||
        (fetchParamsRef.current.page === 1 && result.list.length === 0)
      ) {
        setListState(PageState.empty)
      } else if (result.list.length < fetchParamsRef.current.pageSize) {
        setListState(PageState.finish)
      } else {
        setListState(PageState.more)
      }
    } catch (e) {
      setListState(PageState.error)
      console.log('=====useFetchAppendList error======', e)
    }
  }

  function handleInitFetchPageList() {
    setListState(PageState.initializing)
    handleRefreshList(false)
  }

  async function handleRefreshList(refresh = true) {
    // console.log('============handleRefreshList===============')
    fetchParamsRef.current.page = 1
    setListTotal(0)
    if (refresh) setListState(PageState.refreshing)
    return getList(true)
  }

  async function handleLoadNextPage(p?: number) {
    if (listState === PageState.finish) return

    if (p) {
      fetchParamsRef.current.page = p
    } else {
      fetchParamsRef.current.page++
    }
    getList()
  }

  function handleChangeListParams(params: object = {}) {
    fetchParamsRef.current = {
      ...fetchParamsRef.current,
      ...params
    }
    handleRefreshList()
  }

  useImperativeHandle(ref, () => ({
    handleRefreshList,
    handleChangeListParams
  }))

  const onLoad = async (isRetry: boolean) => {
    if (isRetry) {
      getList()
    } else {
      handleLoadNextPage()
    }
  }

  let result: ReactNode

  if (listState === PageState.loading && pageList.length === 0) {
    result = createSkeletonItem ? createSkeletonItem() : <StatusLoading />
  } else if (listState === PageState.empty) {
    return <StatusEmpty onRefresh={handleRefreshList} />
  } else if (listState === PageState.error) {
    result = <div>Error</div>
  } else {
    result = (
      <PullRefresh onRefresh={handleRefreshList} disabled={!enablePullDown}>
        <List
          onLoad={onLoad}
          finished={listState === PageState.finish}
          errorText="请求失败，点击重新加载"
          finishedText="没有更多了"
          offset={50}
        >
          {createList(pageList)}
        </List>
      </PullRefresh>
    )
  }

  return <div className="append-list-wrapper">{result}</div>
})
