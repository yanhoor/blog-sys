import { list } from 'postcss'
import { user_friends } from '@/http'
import AppendListWrapper from '@/components/append-list-wrapper'
import { ReactNode, useState } from 'react'
import { User } from '../../../../../modules/sys-types'
import UserItem from '@/components/user/user-item'

interface Props {
  relateType: number
  uid: number
}

export default function FriendList({ relateType, uid }: Props) {
  const [friendTotal, setFriendTotal] = useState(0)

  const createViewList = (itemList: User[]): ReactNode => {
    return (
      <div className="divide-y">
        {itemList.map((item) => (
          <UserItem user={item} key={item.id} />
        ))}
      </div>
    )
  }

  return (
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
  )
}
