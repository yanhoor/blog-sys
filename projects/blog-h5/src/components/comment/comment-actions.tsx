import { Comment } from 'sys-types'
import { Popover, Toast, Dialog } from 'react-vant'
import {
  GoodJob,
  GoodJobO,
  Ellipsis,
  OtherPay,
  DeleteO
} from '@react-vant/icons'
import { useRef, useState } from 'react'
import { useAppSelector } from '@/store/hooks'
import $http, {
  blog_info,
  blog_like,
  comment_delete,
  comment_like
} from '@/http'
import { useLocation, useNavigate } from 'react-router-dom'

interface Props {
  comment: Comment
  onDelete?: () => void
}
export default function CommentActions({ comment: com, onDelete }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const popoverRef = useRef<any>()
  const [comment, setComment] = useState(com)
  const myInfo = useAppSelector((state) => state.user.myInfo)

  function handleCopy() {
    navigator.clipboard.writeText(comment.content || '').then(() => {
      popoverRef.current?.hide()
      Toast.success({
        message: '复制成功'
      })
    })
  }

  async function handleDeleteComment() {
    try {
      await Dialog.confirm({
        message: '确定删除评论吗，该评论下的所有回复也会被删除',
        confirmButtonText: '删除',
        confirmButtonColor: '#EF4444'
      })
      const { msg, success, result } = await $http.post(comment_delete, {
        id: comment.id
      })
      if (success) {
        Toast.success({
          message: '已删除'
        })
        onDelete?.()
      } else {
        Toast.fail({
          message: msg || '删除失败'
        })
      }
    } catch (e) {}
  }

  async function handleLikeComment() {
    if (!myInfo) {
      Toast.fail({
        message: '请先登录'
      })
      navigate(`/login?from=${location.pathname}${location.search}`)
    }
    try {
      const { msg, success, result } = await $http.post(comment_like, {
        id: comment.id,
        isLike: comment.isLike ? 0 : 1
      })
      if (success) {
        setComment((comment) => ({
          ...comment,
          isLike: !comment.isLike,
          likedByCount: comment.isLike
            ? comment.likedByCount! - 1
            : comment.likedByCount! + 1
        }))
      } else {
        Toast.fail(msg || '点赞失败')
      }
    } catch (e) {
      Toast.fail('点赞失败')
      console.log('=====handleLike error======', e)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1" onClick={handleLikeComment}>
        {comment.isLike ? <GoodJob className="text-green-700" /> : <GoodJobO />}
        <span className="text-[14px]">
          {comment.likedByCount ? comment.likedByCount : ''}
        </span>
      </div>
      <Popover
        ref={popoverRef}
        reference={<Ellipsis fontSize="14px" />}
        placement="bottom-end"
      >
        <div className="flex flex-col gap-2 p-3">
          <div className="flex items-center gap-[4px]" onClick={handleCopy}>
            <OtherPay fontSize="16px" />
            <div className="text-[14px] whitespace-nowrap">复制内容</div>
          </div>
          {myInfo?.id === comment.createById && (
            <div
              className="flex items-center gap-[4px] text-red-500"
              onClick={handleDeleteComment}
            >
              <DeleteO fontSize="16px" />
              <div className="text-[14px] whitespace-nowrap">删除</div>
            </div>
          )}
        </div>
      </Popover>
    </div>
  )
}
