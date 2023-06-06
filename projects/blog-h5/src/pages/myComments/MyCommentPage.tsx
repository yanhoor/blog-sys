import PageWrapper from '@/components/page-wrapper'
import CustomNavBar from '@/components/custom/custom-nav-bar'
import { Comment } from 'sys-types'
import $http, { comment_delete, user_myCommentList } from '@/http'
import AppendListWrapper from '@/components/append-list-wrapper'
import UserName from '@/components/user/user-name'
import YCard from '@/components/y-card'
import ExpandableContent from '@/components/expandable-content'
import { useNavigate } from 'react-router-dom'
import YTime from '@/components/y-time'
import { DeleteO } from '@react-vant/icons'
import { Dialog, Toast } from 'react-vant'
import { useState } from 'react'

export default function MyCommentPage() {
  const navigate = useNavigate()
  const [listKey, setListKey] = useState(new Date().getTime())

  function handleDeleteComment(id: number) {
    Dialog.confirm({
      message: '确定删除该评论吗？评论的所有回复也会被删除。',
      confirmButtonText: '删除',
      confirmButtonColor: 'red'
    })
      .then(async () => {
        try {
          const { msg, success, result } = await $http.post(comment_delete, {
            id
          })
          if (success) {
            Toast.success('已删除')
            setListKey(new Date().getTime())
          } else {
            Toast.fail(msg || '删除失败')
          }
        } catch (e) {
          Toast.fail('删除失败')
        }
      })
      .catch(() => {})
  }

  function createCommentList(commentList: Comment[]) {
    return (
      <div className="my-comment-list text-[12px]">
        {commentList.map((comment) => (
          <YCard key={comment.id}>
            <div className="flex flex-col gap-[6px]">
              {comment.replyTo ? (
                <div className="flex">
                  <span>我回复了</span>
                  <UserName
                    user={comment.replyTo}
                    showAt
                    className="mx-[4px]"
                  />
                  <span>的评论：</span>
                </div>
              ) : (
                <span>我评论了：</span>
              )}
              <ExpandableContent
                className="inline"
                content={comment.content || ''}
                imageUrl={comment.image?.url}
                maxLength={60}
              />
              <div
                className="bg-block-section min-w-full rounded px-2 py-1"
                onClick={
                  comment.blog
                    ? () => navigate('/post/' + comment.blogId)
                    : undefined
                }
              >
                {comment.blog ? (
                  <ExpandableContent
                    className="inline"
                    content={comment.blog.content}
                    maxLength={60}
                  />
                ) : (
                  <span className="text-red-500">博客不存在</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <YTime time={comment.createdAt}></YTime>
                <DeleteO
                  onClick={() => handleDeleteComment(comment.id as number)}
                />
              </div>
            </div>
          </YCard>
        ))}
      </div>
    )
  }

  return (
    <PageWrapper title="我的点赞">
      <CustomNavBar title="我的点赞" />
      <div className="mx-[5px] mt-[5px]">
        <AppendListWrapper
          url={user_myCommentList}
          key={listKey}
          createList={createCommentList}
        />
      </div>
    </PageWrapper>
  )
}
