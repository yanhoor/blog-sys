import { User } from 'sys-types'

interface Props {
  user: User
  showAt?: boolean
}
export default function UserName({ user, showAt = false }: Props) {
  return (
    <span className="user-name whitespace-pre-wrap break-words text-green-700">
      {(showAt ? '@' : '') + user.name}
    </span>
  )
}
