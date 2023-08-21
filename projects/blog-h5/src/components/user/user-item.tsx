import { User } from 'sys-types'
import UserAvatar from '@/components/user/user-avatar'
import UserName from '@/components/user/user-name'

interface Props {
  user: User
}

export default function UserItem({ user }: Props) {
  return (
    <div className="flex items-center gap-4 py-[5px]">
      <UserAvatar user={user} />
      <div className="flex flex-1 flex-col items-start">
        <UserName user={user} />
        <span className="text-gray-500 text-[12px]">
          {user.introduce || '暂无简介'}
        </span>
        <span className="text-gray-500 text-[12px]">
          粉丝：{user.followerCount}
        </span>
      </div>
    </div>
  )
}
