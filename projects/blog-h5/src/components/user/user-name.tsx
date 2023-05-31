import { User } from 'sys-types'

interface Props {
  user: User
  showAt?: boolean
  className?: string
}
export default function UserName({ user, showAt = false, className }: Props) {
  return (
    <span
      className={`user-name whitespace-pre-wrap break-words text-primary ${
        className || ''
      }`}
    >
      {(showAt ? '@' : '') + user.name}
    </span>
  )
}
