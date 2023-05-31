import { Blog } from 'sys-types'
import UserAvatar from '@/components/user/user-avatar'
import UserName from '@/components/user/user-name'
import YTime from '@/components/y-time'
import MediaList from '@/components/media/media-list'
import YCard from '@/components/y-card'
import ExpandableContent from '@/components/expandable-content'
import { GoodJob, GoodJobO, StarO, Star, CommentO } from '@react-vant/icons'
import { useState } from 'react'
import $http, { blog_collect, blog_like } from '@/http'
import { Toast } from 'react-vant'
import { useNavigate } from 'react-router-dom'

interface Props {
  post: Blog
}
export default function PostItem({ post }: Props) {
  const [postDetail, setPostDetail] = useState<Blog>(post)
  const navigate = useNavigate()

  async function handleLike() {
    try {
      const { msg, success, result } = await $http.post(blog_like, {
        id: postDetail.id,
        isLike: postDetail.isLike ? 0 : 1
      })
      if (success) {
        setPostDetail((post) => ({
          ...post,
          isLike: !post.isLike,
          likedByCount: postDetail.isLike
            ? post.likedByCount! - 1
            : post.likedByCount! + 1
        }))
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
        id: postDetail.id,
        isCollect: postDetail.isCollect ? 0 : 1
      })
      if (success) {
        setPostDetail((post) => ({
          ...post,
          isCollect: !post.isCollect,
          collectedByCount: postDetail.isCollect
            ? post.collectedByCount! - 1
            : post.collectedByCount! + 1
        }))
      } else {
        Toast.fail(msg || '收藏失败')
      }
    } catch (e) {
      Toast.fail('收藏失败')
      console.log('=====handleCollect error======', e)
    }
  }

  function toPostDetail() {
    navigate('/post/' + postDetail.id)
  }

  return (
    <YCard>
      <div className="flex flex-col items-start gap-2">
        <div className="flex gap-2">
          <UserAvatar user={postDetail.createBy} />
          <div className="flex flex-col">
            <UserName user={postDetail.createBy}></UserName>
            <YTime time={postDetail.createdAt}></YTime>
          </div>
        </div>
        <div className="w-full" onClick={toPostDetail}>
          <ExpandableContent content={postDetail.content} />
          <div className="w-full">
            <MediaList list={postDetail.medias} />
          </div>
        </div>
        <div className="regular-text flex w-full">
          <div
            className="flex flex-1 items-center justify-center gap-1"
            onClick={handleLike}
          >
            {postDetail.isLike ? (
              <GoodJob fontSize="14px" className="text-primary" />
            ) : (
              <GoodJobO fontSize="14px" />
            )}
            <span>{postDetail.likedByCount}</span>
          </div>
          <div
            className="flex flex-1 items-center justify-center gap-1"
            onClick={toPostDetail}
          >
            <CommentO fontSize="14px" />
            <span>{postDetail.commentsCount}</span>
          </div>
          <div
            className="flex flex-1 items-center justify-center gap-1"
            onClick={handleCollect}
          >
            {postDetail.isCollect ? (
              <Star fontSize="14px" className="text-primary" />
            ) : (
              <StarO fontSize="14px" />
            )}
            <span>{postDetail.collectedByCount}</span>
          </div>
        </div>
      </div>
    </YCard>
  )
}
