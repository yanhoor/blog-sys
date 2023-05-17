import { useParams } from 'react-router-dom'
import $http, {
  blog_collect,
  blog_info,
  blog_like,
  comment_list,
  blog_action_user_list
} from '@/http'
import { Popover, PullRefresh, Tabs, Toast } from 'react-vant'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { Blog, Comment, User } from 'sys-types'
import {
  GoodJob,
  GoodJobO,
  StarO,
  Star,
  CommentO,
  ClockO,
  Sort
} from '@react-vant/icons'
import PageFetchWrapper from '@/components/page-fetch-wrapper'
import UserAvatar from '@/components/user/user-avatar'
import UserName from '@/components/user/user-name'
import YTime from '@/components/y-time'
import ExpandableContent from '@/components/expandable-content'
import MediaList from '@/components/media/media-list'
import YCard from '@/components/y-card'
import { useTabChange } from '@/hooks/useTabChange'
import AppendListWrapper from '@/components/append-list-wrapper'
import CommentItem from '@/components/comment/comment-item'
import CommentReply from '@/components/comment/comment-reply'
import UserItem from '@/components/user/user-item'
import PageWrapper from '@/components/page-wrapper'
import CustomNavBar from '@/components/custom/custom-nav-bar'

export default function PostPage() {
  const params = useParams()
  const commentListRef = useRef<any>()
  const commentFilterRef = useRef<any>()
  const [commentCount, setCommentCount] = useState(0)
  const likeUserListRef = useRef<any>()
  const collectUserListRef = useRef<any>()
  const [showReply, setShowReply] = useState(false)
  const [postDetail, setPostDetail] = useState<Blog>()
  const { onTabChange, currentTab } = useTabChange<string>('comment')
  const [errorMsg, setErrorMsg] = useState<string>()
  const [commentFiltType, setCommentFiltType] = useState(1) // 1-- 时间，2--热度

  // 页面初始化
  async function onInit() {
    let listFetch
    switch (currentTab) {
      case 'comment':
        listFetch =
          commentListRef.current && commentListRef.current.handleRefreshList()
        break
      case 'like':
        listFetch =
          likeUserListRef.current && likeUserListRef.current.handleRefreshList()
        break
      case 'collect':
        listFetch =
          collectUserListRef.current &&
          collectUserListRef.current.handleRefreshList()
        break
    }
    return Promise.all([getPostDetail(), listFetch])
  }

  // 获取博客详情
  async function getPostDetail() {
    try {
      const { msg, success, result } = await $http.post(blog_info, {
        id: params.id
      })
      if (success) {
        setPostDetail(result)
      } else {
        setErrorMsg(msg || '获取博客失败')
        return Promise.reject()
      }
    } catch (e) {
      setErrorMsg('获取博客失败')
      return Promise.reject()
    }
  }

  // 评论筛选改变
  function handleChangeCommentFilter(v: number) {
    commentFilterRef.current?.hide()
    setCommentFiltType(v)
    if (commentListRef.current) {
      commentListRef.current.handleChangeListParams({ sort: v })
      commentListRef.current.handleRefreshList()
    }
  }

  async function handleLike() {
    try {
      const { msg, success, result } = await $http.post(blog_like, {
        id: postDetail?.id,
        isLike: postDetail?.isLike ? 0 : 1
      })
      if (success) {
        onInit()
      } else {
        Toast.fail(msg || '点赞失败')
      }
    } catch (e) {
      Toast.fail('点赞失败')
      console.log('=====handleLike error======', e)
    }
  }

  async function handleCollect() {
    try {
      const { msg, success, result } = await $http.post(blog_collect, {
        id: postDetail?.id,
        isCollect: postDetail?.isCollect ? 0 : 1
      })
      if (success) {
        onInit()
      } else {
        Toast.fail(msg || '收藏失败')
      }
    } catch (e) {
      Toast.fail('收藏失败')
      console.log('=====handleCollect error======', e)
    }
  }

  // 评论列表显示
  const createCommentList = (commentList: Comment[]): ReactNode => {
    return (
      <div className="comment-list divide-y">
        {commentList.map((comment) => (
          <CommentItem
            comment={comment}
            key={comment.id}
            onDelete={onInit}
            onReply={onInit}
          />
        ))}
      </div>
    )
  }

  // 评论 tab 显示
  const commentTab = (): ReactNode => {
    return (
      <div className="flex items-center gap-[2px]">
        <Popover
          ref={commentFilterRef}
          placement="bottom-start"
          reference={
            commentFiltType === 1 ? (
              <ClockO fontSize="16px" />
            ) : (
              <Sort fontSize="16px" />
            )
          }
        >
          {currentTab === 'comment' && (
            <div className="flex flex-col gap-2 p-3">
              <div
                className={`flex items-center gap-[4px] ${
                  commentFiltType === 1 ? 'text-green-700' : ''
                }`}
                onClick={() => handleChangeCommentFilter(1)}
              >
                <ClockO fontSize="16px" />
                <span className="text-[14px]">时间</span>
              </div>
              <div
                className={`flex items-center gap-[4px] ${
                  commentFiltType === 2 ? 'text-green-700' : ''
                }`}
                onClick={() => handleChangeCommentFilter(2)}
              >
                <Sort fontSize="16px" />
                <span className="text-[14px]">热度</span>
              </div>
            </div>
          )}
        </Popover>
        <span>{`评论${commentCount ? ` ${commentCount}` : ''}`}</span>
      </div>
    )
  }

  return (
    <PageWrapper title={postDetail?.content || '加载中...'}>
      <CustomNavBar title="博客正文" />
      <PageFetchWrapper onInit={onInit} errorMsg={errorMsg}>
        {postDetail ? (
          <div className="post-page">
            <PullRefresh className="min-h-[100vh]" onRefresh={onInit}>
              <YCard>
                <div className="flex gap-2">
                  <UserAvatar user={postDetail.createBy} />
                  <div className="flex flex-col">
                    <UserName user={postDetail.createBy}></UserName>
                    <YTime time={postDetail.createdAt} isAlias={false}></YTime>
                  </div>
                </div>
                <ExpandableContent
                  className="my-2"
                  content={postDetail.content}
                />
                <div className="w-full">
                  <MediaList list={postDetail.medias} maxCount={0} />
                </div>
                <div className="w-full mt-6 flex items-center">
                  <div
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={handleLike}
                  >
                    {postDetail.isLike ? (
                      <GoodJob fontSize="16px" className="text-green-700" />
                    ) : (
                      <GoodJobO fontSize="16px" />
                    )}
                  </div>
                  <div
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => setShowReply(true)}
                  >
                    <CommentO fontSize="16px" />
                  </div>
                  <div
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={handleCollect}
                  >
                    {postDetail.isCollect ? (
                      <Star fontSize="16px" className="text-green-700" />
                    ) : (
                      <StarO fontSize="16px" />
                    )}
                  </div>
                </div>
              </YCard>
              <YCard>
                <Tabs
                  lineWidth="0"
                  sticky
                  swipeable
                  stickyInitScrollbar={false}
                  align="start"
                  onChange={(name: string | number, tabIndex: number) => {
                    onTabChange(name as string, tabIndex)
                  }}
                  defaultActive={currentTab}
                >
                  <Tabs.TabPane key="comment" title={commentTab} name="comment">
                    <div
                      className={`mx-[5px] pt-[5px] ${
                        currentTab === 'comment' ? '' : 'hidden'
                      }`}
                    >
                      <AppendListWrapper
                        enablePullDown={false}
                        initParams={{
                          blogId: postDetail.id,
                          sort: commentFiltType
                        }}
                        ref={commentListRef}
                        url={comment_list}
                        createList={createCommentList}
                        onFetchComplete={(result) =>
                          setCommentCount(result.total)
                        }
                      ></AppendListWrapper>
                    </div>
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    key="like"
                    title={`点赞 ${postDetail.likedByCount}`}
                    name="like"
                  >
                    <div
                      className={`mx-[5px] pt-[5px] ${
                        currentTab === 'like' ? '' : 'hidden'
                      }`}
                    >
                      <AppendListWrapper
                        enablePullDown={false}
                        initParams={{
                          blogId: postDetail.id
                        }}
                        ref={likeUserListRef}
                        url={blog_action_user_list + '/1'}
                        createList={(userList: User[]) => (
                          <div className="divide-y">
                            {userList.map((user) => (
                              <UserItem user={user} key={user.id} />
                            ))}
                          </div>
                        )}
                      ></AppendListWrapper>
                    </div>
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    key="collect"
                    title={`收藏 ${postDetail.collectedByCount}`}
                    name="collect"
                  >
                    <div
                      className={`mx-[5px] pt-[5px] ${
                        currentTab === 'collect' ? '' : 'hidden'
                      }`}
                    >
                      <AppendListWrapper
                        enablePullDown={false}
                        initParams={{
                          blogId: postDetail.id
                        }}
                        ref={collectUserListRef}
                        url={blog_action_user_list + '/2'}
                        createList={(userList: User[]) => (
                          <div className="divide-y">
                            {userList.map((user) => (
                              <UserItem user={user} key={user.id} />
                            ))}
                          </div>
                        )}
                      ></AppendListWrapper>
                    </div>
                  </Tabs.TabPane>
                </Tabs>
              </YCard>
            </PullRefresh>
            <CommentReply
              visible={showReply}
              onClickOverlay={() => setShowReply(false)}
              onComplete={() => {
                onInit()
                setShowReply(false)
              }}
              postId={postDetail.id as number}
            />
          </div>
        ) : (
          <div></div>
        )}
      </PageFetchWrapper>
    </PageWrapper>
  )
}
