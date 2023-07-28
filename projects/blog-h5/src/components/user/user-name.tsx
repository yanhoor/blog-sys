import { User } from 'sys-types'
import { useNavigate } from 'react-router-dom'

interface Props {
  user: User
  showAt?: boolean
  enable?: boolean
  className?: string
}
export default function UserName({
  user,
  showAt = false,
  enable = true,
  className
}: Props) {
  const navigate = useNavigate()

  function toUserPage(e: any) {
    if (!enable) return

    e.stopPropagation()
    if (location.pathname === '/user/' + user.id) return

    navigate('/user/' + user.id)
  }

  return (
    <span
      className={`user-name whitespace-pre-wrap break-words text-primary ${
        className || ''
      }`}
      onClick={toUserPage}
    >
      {(showAt ? '@' : '') + user.name}
    </span>
  )
}
