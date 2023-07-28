import { Image } from 'react-vant'
import { User } from 'sys-types'
import { UserO } from '@react-vant/icons'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

interface Props {
  user: User
  size?: number | string
  enable?: boolean
}

export default function UserAvatar({ user, size = 38, enable = true }: Props) {
  const ErrorIcon = <UserO />
  const navigate = useNavigate()
  const location = useLocation()

  function toUserPage(e: any) {
    if (!enable) return

    e.stopPropagation()
    if (location.pathname === '/user/' + user.id) return

    navigate('/user/' + user.id)
  }

  return (
    <div className="user-avatar" onClick={toUserPage}>
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
