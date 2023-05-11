import { ReactNode, useEffect, useState } from 'react'
import { PageState } from 'sys-types'
import StatusLoading from '@/components/status/status-loading'

interface Props {
  children: ReactNode
  skeleton?: ReactNode
  onInit: () => Promise<any>
  errorMsg?: string
}
export default function PageFetchWrapper({
  children,
  skeleton,
  onInit,
  errorMsg
}: Props) {
  const [pageState, setPageState] = useState<PageState>(PageState.initializing)

  useEffect(() => {
    setPageState(PageState.initializing)
    onInit()
      .then(() => {
        setPageState(PageState.finish)
      })
      .catch((e) => {
        console.log('=========PageFetchWrapper onInit error=========', e)
        setPageState(PageState.error)
      })
  }, [])

  function getContent(): ReactNode {
    if (pageState === PageState.initializing) {
      return skeleton || <StatusLoading />
    } else if (pageState === PageState.error) {
      return <div>{errorMsg || 'error'}</div>
    } else {
      return children
    }
  }

  return <div className="page-fetch-wrapper">{getContent()}</div>
}
