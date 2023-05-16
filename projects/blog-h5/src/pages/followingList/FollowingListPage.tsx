import { useParams } from 'react-router-dom'
import FriendList from '@/components/user/friend-list'
import YCard from '@/components/y-card'

export default function FollowingListPage() {
  const params = useParams()

  return (
    <YCard>
      <FriendList uid={Number(params.uid)} relateType={1} />
    </YCard>
  )
}
