import PostList from '@/components/post/post-list'
import { useAppSelector } from '@/store/hooks'
import { Tabs } from 'react-vant'
import MyConfig from '@/config'
import { useEffect, useMemo, useState } from 'react'

export default function IndexHomePage() {
  const activeGid = localStorage.getItem(MyConfig.INDEX_GID)
  const [scrollTopInfo, setScrollTopInfo] = useState<Map<number, number>>(
    new Map()
  )
  const allGroupList = useAppSelector((state) => state.user.allGroupList)
  const [currentTab, setCurrentTab] = useState(Number(activeGid) || 0)
  const groupList = [
    {
      name: '全部',
      id: 0
    },
    ...allGroupList
  ]

  useEffect(() => {
    const meo = scrollTopInfo.get(currentTab)
    console.log('======获取当前tab记住的滚动位置=========', meo)
    if (meo) document.documentElement.scrollTo(0, meo)
  }, [currentTab, scrollTopInfo])

  function onTabChange(name: string | number, tabIndex: number) {
    const scrollTop = document.documentElement.scrollTop
    setScrollTopInfo((v) => {
      v.set(currentTab, scrollTop)
      console.log('=======记忆切换前的tab的滚动位置========', v)
      return v
    })
    setCurrentTab(name as number)
    localStorage.setItem(MyConfig.INDEX_GID, name.toString())
  }

  return allGroupList.length ? (
    <Tabs
      sticky
      swipeable
      stickyInitScrollbar={false}
      align="start"
      onChange={onTabChange}
      defaultActive={currentTab}
    >
      {groupList.map((group) => (
        <Tabs.TabPane key={group.id} title={group.name} name={group.id}>
          <div
            className={`index-home mb-[50px] mx-[5px] pt-[5px] ${
              currentTab === group.id ? '' : 'hidden'
            }`}
          >
            <PostList key={group.id} initParams={{ gid: group.id || '' }} />
          </div>
        </Tabs.TabPane>
      ))}
    </Tabs>
  ) : (
    <div className="index-home mb-[50px] mx-[5px] pt-[5px]">
      <PostList key={0} />
    </div>
  )
}
