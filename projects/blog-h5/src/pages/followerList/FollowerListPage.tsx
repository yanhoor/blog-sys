import { useParams } from 'react-router-dom'
import FriendList from '@/components/user/friend-list'

export default function FollowerListPage() {
  const params = useParams()

  return <FriendList uid={Number(params.uid)} relateType={2} />
}
