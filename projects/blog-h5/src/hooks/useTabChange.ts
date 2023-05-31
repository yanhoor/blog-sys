import { useEffect, useState, useTransition } from 'react'

export function useTabChange<T>(initTab: T) {
  const [scrollTopInfo, setScrollTopInfo] = useState<Map<T, number>>(new Map())
  const [currentTab, setCurrentTab] = useState<T>(initTab)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const meo = scrollTopInfo.get(currentTab)
    // console.log('======获取当前tab记住的滚动位置=========', meo)
    if (meo) document.documentElement.scrollTo(0, meo)
  }, [currentTab, scrollTopInfo])

  function onTabChange(name: T, tabIndex: number) {
    const scrollTop = document.documentElement.scrollTop
    setScrollTopInfo((v) => {
      v.set(currentTab, scrollTop)
      // console.log('=======记忆切换前的tab的滚动位置========', v)
      return v
    })
    startTransition(() => {
      setCurrentTab(name)
    })
  }

  return {
    currentTab,
    onTabChange
  }
}
