import { useParams } from 'react-router-dom'
import { Comment } from 'sys-types'
import { useContext, useRef, useState } from 'react'
import $http, { comment_info, comment_reply_list } from '@/http'
import PageFetchWrapper from '@/components/page-fetch-wrapper'
import AppendListWrapper from '@/components/append-list-wrapper'
import YCard from '@/components/y-card'
import CommentItem from '@/components/comment/comment-item'
import { Popover, PullRefresh } from 'react-vant'
import { ClockO, Sort } from '@react-vant/icons'
import PageWrapper from '@/components/page-wrapper'
import CustomNavBar from '@/components/custom/custom-nav-bar'
import { ThemeContext } from '@/contexts'

export default function CommentDetailPage() {
  const params = useParams()
  const [commentDetail, setCommentDetail] = useState()
  const commentFilterRef = useRef<any>()
  const [errorMsg, setErrorMsg] = useState<string>()
  const [replyTotal, setReplyTotal] = useState(0)
  const commentListRef = useRef<any>()
  const [commentFiltType, setCommentFiltType] = useState(1) // 1-- 时间，2--热度
  const theme = useContext(ThemeContext)

  async function onInit() {
    await Promise.all([
      getCommentDetail(),
      commentListRef.current && commentListRef.current.handleRefreshList()
    ])
  }

  async function getCommentDetail() {
    try {
      const { msg, success, result } = await $http.post(comment_info, {
        id: params.id
      })
      if (success) {
        setCommentDetail(result)
      } else {
        setErrorMsg(msg || '获取评论失败')
        return Promise.reject()
      }
    } catch (e) {
      setErrorMsg('获取评论失败')
      return Promise.reject()
    }
  }

  function handleChangeFilterType(v: number) {
    setCommentFiltType(v)
    if (commentListRef.current) {
      commentListRef.current.handleChangeListParams({
        sort: v
      })
      commentListRef.current.handleRefreshList()
    }
    commentFilterRef.current?.hide()
  }

  return (
    <PageWrapper title="评论详情">
      <CustomNavBar title="评论详情" />
      <PageFetchWrapper onInit={onInit} errorMsg={errorMsg}>
        <PullRefresh className="min-h-[100vh]" onRefresh={onInit}>
          {commentDetail ? (
            <>
              <YCard>
                <CommentItem
                  comment={commentDetail}
                  onReply={onInit}
                  onDelete={() => history.back()}
                ></CommentItem>
              </YCard>
              <div className="mx-[5px] flex flex-col gap-[4px]">
                <div className="secondary-text flex items-center justify-between">
                  <span className="text-[14px] font-semibold">
                    共 {replyTotal} 条回复
                  </span>
                  <Popover
                    ref={commentFilterRef}
                    theme={theme}
                    placement="bottom-end"
                    reference={
                      commentFiltType === 1 ? (
                        <div className="flex items-center gap-[2px] text-[14px]">
                          <ClockO fontSize="14px" />
                          <span>按时间</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-[2px] text-[14px]">
                          <Sort fontSize="14px" />
                          <span>按热度</span>
                        </div>
                      )
                    }
                  >
                    <div className="flex flex-col gap-2 p-3">
                      <div
                        className={`flex items-center gap-[4px] ${
                          commentFiltType === 1 ? 'text-green-700' : ''
                        }`}
                        onClick={() => handleChangeFilterType(1)}
                      >
                        <ClockO fontSize="16px" />
                        <span className="text-[14px]">时间</span>
                      </div>
                      <div
                        className={`flex items-center gap-[4px] ${
                          commentFiltType === 2 ? 'text-green-700' : ''
                        }`}
                        onClick={() => handleChangeFilterType(2)}
                      >
                        <Sort fontSize="16px" />
                        <span className="text-[14px]">热度</span>
                      </div>
                    </div>
                  </Popover>
                </div>
                <YCard>
                  <AppendListWrapper
                    ref={commentListRef}
                    enablePullDown={false}
                    initParams={{
                      topCommentId: params.id,
                      sort: commentFiltType
                    }}
                    url={comment_reply_list}
                    createList={(replyList: Comment[]) => (
                      <div className="divide-color divide-y">
                        {replyList.map((reply) => (
                          <CommentItem
                            key={reply.id}
                            comment={reply}
                            onReply={onInit}
                            onDelete={onInit}
                          ></CommentItem>
                        ))}
                      </div>
                    )}
                    onFetchComplete={(result) => setReplyTotal(result.total)}
                  ></AppendListWrapper>
                </YCard>
              </div>
            </>
          ) : null}
        </PullRefresh>
      </PageFetchWrapper>
    </PageWrapper>
  )
}
