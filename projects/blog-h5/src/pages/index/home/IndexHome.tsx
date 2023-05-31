import PostList from '@/components/post/post-list'
import { useAppSelector } from '@/store/hooks'
import { Tabs } from 'react-vant'
import MyConfig from '@/config'
import { useTabChange } from '@/hooks'
import { useState } from 'react'
import PageWrapper from '@/components/page-wrapper'
import { FollowGroup } from 'sys-types'

export default function IndexHomePage() {
  const group = localStorage.getItem(MyConfig.INDEX_GROUP)
  const activeGroup: FollowGroup = group ? JSON.parse(group) : null
  const allGroupList = useAppSelector((state) => state.user.allGroupList)
  const { onTabChange, currentTab } = useTabChange<number>(
    activeGroup ? Number(activeGroup.id) : 0
  )
  const [documentTitle, setDocumentTitle] = useState(
    activeGroup?.name || '首页'
  )
  const groupList = [
    {
      name: '全部',
      id: 0
    },
    ...allGroupList
  ]

  return (
    <div className="index-home min-h-[100vh]">
      <PageWrapper title={documentTitle}>
        {allGroupList.length ? (
          <Tabs
            sticky
            swipeable
            stickyInitScrollbar={false}
            align="start"
            onChange={(name: string | number, tabIndex: number) => {
              const group = groupList[tabIndex]
              setDocumentTitle(group.name)
              onTabChange(name as number, tabIndex)
              localStorage.setItem(MyConfig.INDEX_GROUP, JSON.stringify(group))
            }}
            defaultActive={currentTab}
          >
            {groupList.map((group) => (
              <Tabs.TabPane key={group.id} title={group.name} name={group.id}>
                <div
                  className={`index-home mx-[5px] mb-[50px] pt-[5px] ${
                    currentTab === group.id ? '' : 'hidden'
                  }`}
                >
                  <PostList
                    key={group.id}
                    initParams={{ gid: group.id || '' }}
                  />
                </div>
              </Tabs.TabPane>
            ))}
          </Tabs>
        ) : (
          <div className="index-home mx-[5px] mb-[50px] pt-[5px]">
            <PostList key={0} />
          </div>
        )}
      </PageWrapper>
    </div>
  )
}
