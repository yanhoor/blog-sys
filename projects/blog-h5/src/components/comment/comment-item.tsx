import { Comment } from 'sys-types'
import UserAvatar from '@/components/user/user-avatar'
import UserName from '@/components/user/user-name'
import ExpandableContent from '@/components/expandable-content'
import MediaImageItem from '@/components/media/media-image-item'
import YTime from '@/components/y-time'
import { ImagePreview, Space } from 'react-vant'
import CommentActions from '@/components/comment/comment-actions'
import CommentReply from '@/components/comment/comment-reply'
import { useState } from 'react'
interface Props {
  comment: Comment
  className?: string
  onDelete?: () => void
  onReply: () => void
}
export default function CommentItem({
  comment,
  className,
  onDelete,
  onReply
}: Props) {
  const [showReply, setShowReply] = useState(false)

  function handlePreviewImage(url: string) {
    const base: string = import.meta.env.VITE_IMAGE_BASE
    ImagePreview.open({
      showIndex: false,
      images: [base + url]
    })
  }

  return (
    <div className={`comment-item flex flex-col items-start py-3 ${className}`}>
      <div className="flex items-center gap-2">
        <UserAvatar user={comment.createBy} />
        <UserName user={comment.createBy} />
      </div>
      <div className="w-full" onClick={() => setShowReply(true)}>
        <ExpandableContent
          className="my-1"
          content={comment.content || '图片评论'}
          maxLength={60}
        />
        {comment.image && (
          <MediaImageItem
            className="max-w-[120px] max-h-[160px]"
            url={comment.image.url}
          />
        )}
      </div>
      <div className="w-full flex justify-between mt-1">
        <YTime time={comment.createdAt}></YTime>
        <CommentActions comment={comment} onDelete={onDelete} />
      </div>

      {comment.childComments?.length ? (
        <div className="px-2 py-1 bg-gray-100 rounded min-w-full mt-2">
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
                {child.content ? (
                  <ExpandableContent
                    className="my-1 inline"
                    content={child.content}
                    maxLength={60}
                  />
                ) : (
                  <span
                    className="text-green-700"
                    onClick={() => handlePreviewImage(child.image?.url)}
                  >
                    查看图片
                  </span>
                )}
              </div>
            ))}
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
