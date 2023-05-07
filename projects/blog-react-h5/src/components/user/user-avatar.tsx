import { Image } from 'react-vant'
import { User } from '@/types'
import { UserO } from '@react-vant/icons'

interface Props {
  user: User
  size?: number | string
}

export default function UserAvatar({ user, size = 38 }: Props) {
  const ErrorIcon = <UserO />

  return (
    <div className="user-avatar">
      <Image
        width={size}
        height={size}
        round
        fit="cover"
        src={import.meta.env.VITE_IMAGE_BASE + user.avatar}
        // iconSize="12"
        errorIcon={ErrorIcon}
        loadingIcon={ErrorIcon}
      ></Image>
    </div>
  )
}
