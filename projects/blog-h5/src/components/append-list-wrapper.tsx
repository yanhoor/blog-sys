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
import StatusError from '@/components/status/status-error'

interface Props {
  url: string
  className?: string
  initParams?: any
  enablePullDown?: boolean
  createList: (list: any[]) => ReactNode
  createSkeletonItem?: () => ReactNode
  onFetchComplete?: (result: any) => void
  onListUpdate?: (list: any[]) => void
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
    className,
    onListUpdate,
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
  const listLoadingRef = useRef(false) // 避免一次加载多页
  const pageListRef = useRef([]) // 避免 useState 未更新
  const [listTotal, setListTotal] = useState(0)
  const [pageList, setPageList] = useState([])
  const [errorMsg, setErrorMsg] = useState<string>()

  async function getList(clear = false) {
    // console.log(
    //   '-----getList params--------',
    //   listLoadingRef.current,
    //   fetchParamsRef.current
    // )
    if (listLoadingRef.current) return

    listLoadingRef.current = true
    try {
      const { msg, success, result } = await $http.post(
        url,
        fetchParamsRef.current
      )
      listLoadingRef.current = false
      if (success) {
        onFetchComplete?.(result)
        pageListRef.current = clear
          ? result.list
          : [...pageListRef.current, ...result.list]
        setPageList(pageListRef.current)
        onListUpdate?.(pageListRef.current)
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
      } else {
        setErrorMsg(msg)
      }
    } catch (e) {
      listLoadingRef.current = false
      setListState(PageState.error)
      console.log('=====useFetchAppendList error======', e)
    }
  }

  async function handleRefreshList() {
    // console.log('============handleRefreshList===============')
    fetchParamsRef.current.page = 1
    setListTotal(0)
    setListState(PageState.refreshing)
    return getList(true)
  }

  async function handleLoadNextPage(p?: number) {
    if (listState === PageState.finish || listLoadingRef.current) return

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
      console.log('=====onLoad isRetry======')
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
    return <StatusError errorMsg={errorMsg} onRefresh={handleRefreshList} />
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

  return (
    <div className={`append-list-wrapper ${className || ''}`}>{result}</div>
  )
})
