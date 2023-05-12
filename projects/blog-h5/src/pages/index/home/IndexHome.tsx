import PostList from '@/components/post/post-list'
import { useAppSelector } from '@/store/hooks'
import { Tabs } from 'react-vant'
import MyConfig from '@/config'
import { useTabChange } from '@/hooks/useTabChange'

export default function IndexHomePage() {
  const activeGid = localStorage.getItem(MyConfig.INDEX_GID)
  const allGroupList = useAppSelector((state) => state.user.allGroupList)
  const { onTabChange, currentTab } = useTabChange<number>(
    Number(activeGid) || 0
  )
  const groupList = [
    {
      name: '全部',
      id: 0
    },
    ...allGroupList
  ]

  return (
    <div className="min-h-[100vh]">
      {allGroupList.length ? (
        <Tabs
          sticky
          swipeable
          stickyInitScrollbar={false}
          align="start"
          onChange={(name: string | number, tabIndex: number) => {
            onTabChange(name as number, tabIndex)
            localStorage.setItem(MyConfig.INDEX_GID, name.toString())
          }}
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
      )}
    </div>
  )
}
