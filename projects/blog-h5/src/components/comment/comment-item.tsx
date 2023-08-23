import { Comment } from 'sys-types'
import UserAvatar from '@/components/user/user-avatar'
import UserName from '@/components/user/user-name'
import ExpandableContent from '@/components/expandable-content'
import MediaImageItem from '@/components/media/media-image-item'
import YTime from '@/components/y-time'
import { Space } from 'react-vant'
import CommentActions from '@/components/comment/comment-actions'
import CommentReply from '@/components/comment/comment-reply'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowDown } from '@react-vant/icons'

interface Props {
  comment: Comment
  showChildren?: boolean
  className?: string
  onDelete?: () => void
  onReply: () => void
}
export default function CommentItem({
  comment,
  className,
  onDelete,
  showChildren = true,
  onReply
}: Props) {
  const [showReply, setShowReply] = useState(false)
  const navigate = useNavigate()

  return (
    <div className={`comment-item flex flex-col items-start py-3 ${className}`}>
      <div className="flex items-center gap-2">
        <UserAvatar user={comment.createBy} />
        <UserName user={comment.createBy} />
      </div>
      <div className="w-full" onClick={() => setShowReply(true)}>
        <div className="my-1 inline w-full whitespace-pre-wrap break-words">
          {comment.replyComment && comment.replyComment.topCommentId ? (
            <>
              <span>回复</span>
              <UserName user={comment.replyComment.createBy} showAt />
              <span className="mr-[2px]">:</span>
            </>
          ) : null}
          <ExpandableContent
            className="inline"
            content={comment.content || '图片评论'}
            maxLength={60}
          />
        </div>
        {comment.image && (
          <MediaImageItem
            className="max-h-[160px] max-w-[120px]"
            url={comment.image.url}
          />
        )}
      </div>
      <div className="mt-1 flex w-full justify-between">
        <YTime time={comment.createdAt}></YTime>
        <CommentActions comment={comment} onDelete={onDelete} />
      </div>

      {comment.childComments?.length && showChildren ? (
        <div
          className="bg-block-section mt-2 min-w-full rounded px-2 py-1"
          onClick={() => navigate('/commentDetail/' + comment.id)}
        >
          <Space direction="vertical" gap={4}>
            {comment.childComments.map((child) => (
              <div className="whitespace-pre-wrap break-words" key={child.id}>
                <UserName user={child.createBy} showAt />
                {child.replyComment?.topCommentId && (
                  <>
                    <span className="mx-[2px]">回复</span>
                    <UserName user={child.replyComment.createBy} showAt />
                  </>
                )}
                <span className="ml-[2px] mr-[4px]">:</span>
                <ExpandableContent
                  className="my-1 inline"
                  imageUrl={child.image?.url}
                  content={child.content || ''}
                  maxLength={60}
                />
              </div>
            ))}
            {comment.childCommentsCount! > 2 ? (
              <div className="flex items-center gap-[2px] text-primary">
                <span>共 {comment.childCommentsCount} 条回复</span>
                <ArrowDown />
              </div>
            ) : null}
          </Space>
        </div>
      ) : (
        ''
      )}

      <CommentReply
        visible={showReply}
        onClickOverlay={() => setShowReply(false)}
        comment={comment}
        onComplete={() => {
          onReply()
          setShowReply(false)
        }}
        postId={comment.blogId as number}
      />
    </div>
  )
}
