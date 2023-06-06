import MediaImageItem from '@/components/media/media-image-item'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import YCard from '@/components/y-card'
import UserAvatar from '@/components/user/user-avatar'
import { Cell, Toast, Dialog } from 'react-vant'
import {
  Edit,
  Exchange,
  FriendsO,
  Friends,
  Star,
  Like,
  Comment,
  Bars,
  Arrow
} from '@react-vant/icons'
import UserName from '@/components/user/user-name'
import { useNavigate } from 'react-router-dom'
import $http, { logout } from '@/http'
import MyConfig from '@/config'
import { clearMyInfo } from '@/store/user/userSlice'

export default function IndexMyPage() {
  const dispatch = useAppDispatch()
  const myInfo = useAppSelector((state) => state.user.myInfo)
  const navigate = useNavigate()

  async function handleLogout() {
    Dialog.confirm({
      message: '确定退出登录吗？',
      confirmButtonText: '退出登录',
      confirmButtonColor: 'red'
    })
      .then(async () => {
        try {
          const { msg, success, result } = await $http.post(logout)
          if (success) {
            Toast.success('已退出登录')
            localStorage.setItem(MyConfig.TOKEN, '')
            dispatch(clearMyInfo())
            navigate('/', { replace: true })
          } else {
            Toast.fail(msg || '退出登录失败')
          }
        } catch (e) {
          Toast.fail('退出登录失败')
        }
      })
      .catch(() => {})
  }

  return (
    <div className="index-my">
      {!!myInfo && (
        <>
          <div className="aspect-video w-full">
            {myInfo.profileCardBg ? (
              <MediaImageItem
                className="h-full w-full overflow-clip object-cover"
                url={myInfo.profileCardBg}
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-slate-500 to-emerald-500 dark:from-slate-900 dark:to-emerald-900"></div>
            )}
          </div>
          <YCard>
            <div className="divide-color flex flex-col divide-y">
              <div
                className="flex items-center gap-[8px] pb-[6px]"
                onClick={() => navigate('/user/' + myInfo.id)}
              >
                <UserAvatar user={myInfo} size={48} enable={false} />
                <div className="flex flex-1 flex-col">
                  <UserName user={myInfo} enable={false} />
                  <div className="flex gap-[12px]">
                    <div className="flex items-center gap-[4px]">
                      <span className="regular-text text-[14px] font-semibold">
                        {myInfo.followerCount}
                      </span>
                      <span className="secondary-text text-[12px]">粉丝</span>
                    </div>
                    <div className="flex items-center gap-[4px]">
                      <span className="regular-text text-[14px] font-semibold">
                        {myInfo.followingCount}
                      </span>
                      <span className="secondary-text text-[12px]">关注</span>
                    </div>
                  </div>
                </div>
                <Arrow fontSize={24} />
              </div>
              <div className="divide-color flex items-center divide-x p-[6px]">
                <div className="flex flex-1 items-center justify-center gap-[6px]">
                  <Edit />
                  <span className="text-[14px]">编辑资料</span>
                </div>
                <div
                  className="flex flex-1 items-center justify-center gap-[6px]"
                  onClick={handleLogout}
                >
                  <Exchange />
                  <span className="text-[14px]">退出登录</span>
                </div>
              </div>
            </div>
          </YCard>

          <YCard>
            <Cell
              title="我的关注"
              icon={<Friends />}
              isLink
              onClick={() => navigate('/following/' + myInfo.id)}
            ></Cell>
            <Cell
              title="我的粉丝"
              icon={<FriendsO />}
              isLink
              onClick={() => navigate('/follower/' + myInfo.id)}
            ></Cell>
            <Cell
              title="我的收藏"
              icon={<Star />}
              isLink
              onClick={() => navigate('/myCollections')}
            ></Cell>
            <Cell
              title="我的点赞"
              icon={<Like />}
              isLink
              onClick={() => navigate('/myLikes')}
            ></Cell>
            <Cell
              title="我的评论"
              icon={<Comment />}
              isLink
              onClick={() => navigate('/myComments')}
            ></Cell>
            <Cell title="我的分组" icon={<Bars />} isLink></Cell>
          </YCard>
        </>
      )}
    </div>
  )
}
