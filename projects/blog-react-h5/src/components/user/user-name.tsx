import { User } from '@/types'

interface Props {
  user: User
}
export default function UserName({ user }: Props) {
  return <span className="user-name">{user.name}</span>
}
