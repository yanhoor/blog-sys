import { Comment, MediaFile } from 'sys-types'
import { ActionSheet, Input, hooks, Toast } from 'react-vant'
import { PhotoO } from '@react-vant/icons'
import { useAppSelector } from '@/store/hooks'
import UserAvatar from '@/components/user/user-avatar'
import UploadImg from '@/components/upload/uploadImg'
import { useState } from 'react'
import MediaImageItem from '@/components/media/media-image-item'
import $http, { comment_commit } from '@/http'

interface Props {
  comment?: Comment
  postId: number
  onComplete: () => void
  visible: boolean
  onClickOverlay?: () => void
}

export default function CommentReply({
  postId,
  comment,
  onComplete,
  onClickOverlay,
  visible
}: Props) {
  const [editForm, updateEditForm] = hooks.useSetState({
    content: ''
  })
  const myInfo = useAppSelector((state) => state.user.myInfo)
  const [image, setImage] = useState<MediaFile>()

  async function handleCommitComment() {
    const postData: any = {
      blogId: postId,
      content: editForm.content,
      imageId: image?.id
    }
    if (comment) {
      postData.replyCommentId = comment.id
      postData.replyToId = comment.createById
      postData.topCommentId = comment.topCommentId || comment.id
    }

    if (!postData.content && !postData.imageId) {
      Toast.fail('请输入内容')
      return
    }

    try {
      const { msg, success, result } = await $http.post(
        comment_commit,
        postData
      )
      if (success) {
        onComplete()
        Toast.success('评论成功')
      } else {
        Toast.fail(msg || '评论失败')
      }
    } catch (e) {
      Toast.fail('评论失败')
      console.log('=====handleCommitComment error======', e)
    }
  }

  return myInfo ? (
    <ActionSheet visible={visible} onClickOverlay={onClickOverlay}>
      <div className="flex items-start gap-4 px-[12px] py-[24px]">
        <UserAvatar user={myInfo} />
        <div className="flex-1 flex flex-col gap-4">
          <Input.TextArea
            className="border p-3 rounded"
            placeholder={
              comment ? `回复 @${comment.createBy.name}:` : '发表评论'
            }
            showWordLimit
            autoSize={{ minHeight: 80, maxHeight: 120 }}
            onChange={(v) => updateEditForm({ content: v.trim() })}
          />
          <div className="flex justify-between items-center">
            <UploadImg
              url={image?.url}
              preview={
                <MediaImageItem
                  url={image?.url ?? ''}
                  className="w-[32px] h-[32px]"
                  enablePreview={false}
                />
              }
              onComplete={(url, file) => setImage(file)}
              trigger={<PhotoO fontSize="32px" className="text-green-700" />}
            />
            <span className="text-green-700" onClick={handleCommitComment}>
              发送
            </span>
          </div>
        </div>
      </div>
    </ActionSheet>
  ) : null
}
