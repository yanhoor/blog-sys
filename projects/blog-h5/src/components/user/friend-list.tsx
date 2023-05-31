import { user_friends } from '@/http'
import AppendListWrapper from '@/components/append-list-wrapper'
import { ReactNode, useState } from 'react'
import { User } from 'sys-types'
import UserItem from '@/components/user/user-item'
import PageWrapper from '@/components/page-wrapper'
import CustomNavBar from '@/components/custom/custom-nav-bar'
import YCard from '@/components/y-card'

interface Props {
  relateType: number
  uid: number
}

export default function FriendList({ relateType, uid }: Props) {
  const [friendTotal, setFriendTotal] = useState(0)
  const title = relateType === 2 ? '全部粉丝' : '全部关注'

  const createViewList = (itemList: User[]): ReactNode => {
    return (
      <div className="divide-color divide-y">
        {itemList.map((item) => (
          <UserItem user={item} key={item.id} />
        ))}
      </div>
    )
  }

  return (
    <PageWrapper title={title}>
      <CustomNavBar title={`${title}(${friendTotal})`} />
      <YCard>
        <div className="friend-list">
          <AppendListWrapper
            className="mx-[5px]"
            url={user_friends}
            createList={createViewList}
            initParams={{ relateType, uid }}
            onFetchComplete={(result) => {
              setFriendTotal(result.total)
            }}
          />
        </div>
      </YCard>
    </PageWrapper>
  )
}
