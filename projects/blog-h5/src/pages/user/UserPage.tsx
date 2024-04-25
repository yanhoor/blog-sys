import { useNavigate, useParams } from 'react-router-dom'
import $http, { user_info, blog_list } from '@/http'
import { PullRefresh, Toast } from 'react-vant'
import { Search } from '@react-vant/icons'
import { ReactNode, useState } from 'react'
import PageFetchWrapper from '@/components/page-fetch-wrapper'
import MediaImageItem from '@/components/media/media-image-item'
import type { Blog, User } from 'sys-types'
import YCard from '@/components/y-card'
import UserAvatar from '@/components/user/user-avatar'
import defaultBg from '@/assets/images/profile_card_default_bg.jpeg'
import UserName from '@/components/user/user-name'
import UserImageWall from '@/pages/user/components/user-image-wall'
import AppendListWrapper from '@/components/append-list-wrapper'
import PostItem from '@/components/post/post-item'
import PageWrapper from '@/components/page-wrapper'
import CustomNavBar from '@/components/custom/custom-nav-bar'

export default function UserPage() {
  const params = useParams()
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState<User>()
  const [errorMsg, setErrorMsg] = useState<string>()
  const [refreshTime, setRefreshTime] = useState<number>()
  const [postTotal, setPostTotal] = useState(0)

  async function onInit() {
    setRefreshTime(Date.now())
    await Promise.all([getUserInfo()])
  }

  async function getUserInfo() {
    try {
      const { msg, success, result } = await $http.post(user_info, {
        uid: params.id
      })
      if (success) {
        setUserInfo(result)
      } else {
        setErrorMsg(msg || '获取用户信息失败')
        Toast.fail(msg || '获取用户信息失败')
      }
    } catch (e) {
      Toast.fail('获取用户信息失败')
      console.log('=====getUserInfo error======', e)
    }
  }

  const createPostList = (postList: Blog[]): ReactNode => {
    return (
      <div className="post-list">
        {postList.map((post) => (
          <PostItem post={post} key={post.id}></PostItem>
        ))}
      </div>
    )
  }

  return (
    <PageWrapper title={userInfo ? `@${userInfo.name}的主页` : '加载中...'}>
      <CustomNavBar
        title={userInfo ? `@${userInfo.name}的主页` : '加载中...'}
      />
      <PageFetchWrapper onInit={onInit} errorMsg={errorMsg}>
        <PullRefresh className="min-h-[100vh]" onRefresh={onInit}>
          {userInfo ? (
            <div className="user-page">
              {userInfo.profileCardBg ? (
                <MediaImageItem
                  className="h-[150px] w-full overflow-clip object-cover"
                  url={userInfo.profileCardBg}
                />
              ) : (
                <img src={defaultBg} alt="" />
              )}
              <div className="relative -top-[72px]">
                <YCard className="!rounded-tl-[18px] !rounded-tr-[18px]">
                  <div className="flex items-start gap-[12px]">
                    <UserAvatar size={56} user={userInfo} />
                    <div className="flex flex-1 flex-col">
                      <UserName
                        className="text-[24px] font-semibold"
                        user={userInfo}
                      />
                      <div className="divide-color flex justify-around divide-x">
                        <div
                          className="flex flex-1 items-center justify-center gap-[8px]"
                          onClick={() => {
                            navigate('/follower/' + userInfo.id)
                          }}
                        >
                          <span className="secondary-text">粉丝</span>
                          <span className="regular-text text-center text-[18px] font-semibold">
                            {userInfo.followerCount}
                          </span>
                        </div>
                        <div
                          className="flex flex-1 items-center justify-center gap-[8px]"
                          onClick={() => {
                            navigate('/following/' + userInfo.id)
                          }}
                        >
                          <span className="secondary-text">关注</span>
                          <span className="regular-text text-center text-[18px] font-semibold">
                            {userInfo.followingCount}
                          </span>
                        </div>
                        <div className="flex flex-1 items-center justify-center gap-[8px]">
                          <span className="secondary-text">获赞</span>
                          <span className="regular-text text-center text-[18px] font-semibold">
                            {userInfo.likedCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="secondary-text mt-[12px] text-[12px]">
                    简介：{userInfo.introduce || '暂无简介'}
                  </div>
                </YCard>

                <UserImageWall userId={params.id as string} key={refreshTime} />

                <div className="post-section">
                  <div className="mx-[5px] flex items-center justify-between">
                    <div className="flex items-center gap-[4px]">
                      <span className="secondary-text text-[14px]">博客</span>
                      <span className="regular-text text-[16px] font-semibold">
                        {postTotal}
                      </span>
                    </div>
                    <Search fontSize="16px" />
                  </div>

                  <AppendListWrapper
                    className="mx-[5px]"
                    url={blog_list}
                    key={'post-list-' + refreshTime}
                    createList={createPostList}
                    initParams={{ uid: params.id }}
                    onFetchComplete={(result) => {
                      setPostTotal(result.total)
                    }}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </PullRefresh>
      </PageFetchWrapper>
    </PageWrapper>
  )
}
