import PageWrapper from '@/components/page-wrapper'
import { useTabChange } from '@/hooks'
import { useEffect, useState } from 'react'
import { Tabs } from 'react-vant'
import NotificationCommentList from '@/pages/index/notification/components/notification-comment-list'
import NotificationLikeList from '@/pages/index/notification/components/notification-like-list'
import NotificationCollectList from '@/pages/index/notification/components/notification-collect-list'
import NotificationAuditList from '@/pages/index/notification/components/notification-audit-list'
import { useAppSelector } from '@/store/hooks'

export enum NotificationTab {
  comment = 'comment',
  like = 'like',
  collect = 'collect',
  audit = 'audit'
}

export default function IndexNotificationPage() {
  const unreadAudit = useAppSelector((state) => state.user.unreadAudit)
  const unreadCollect = useAppSelector((state) => state.user.unreadCollect)
  const unreadComment = useAppSelector((state) => state.user.unreadComment)
  const unreadLike = useAppSelector((state) => state.user.unreadLike)
  const { onTabChange, currentTab } = useTabChange<NotificationTab>(
    NotificationTab.comment
  )
  const [documentTitle, setDocumentTitle] = useState('评论')

  useEffect(() => {
    switch (currentTab) {
      case NotificationTab.comment:
        setDocumentTitle('评论')
        break
      case NotificationTab.like:
        setDocumentTitle('点赞')
        break
      case NotificationTab.collect:
        setDocumentTitle('收藏')
        break
      case NotificationTab.audit:
        setDocumentTitle('系统审核')
        break
    }
  }, [currentTab])

  return (
    <div className="index-notification">
      <PageWrapper title={`通知--${documentTitle}`}>
        <Tabs
          sticky
          swipeable
          stickyInitScrollbar={false}
          align="start"
          onChange={(name: string | number, tabIndex: number) => {
            onTabChange(name as NotificationTab, tabIndex)
          }}
          defaultActive={currentTab}
        >
          <Tabs.TabPane
            key={NotificationTab.comment}
            title={`评论${unreadComment ? `(${unreadComment})` : ''}`}
            name={NotificationTab.comment}
          >
            <div
              className={`${
                currentTab === NotificationTab.comment ? '' : 'hidden'
              }`}
            >
              <NotificationCommentList />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane
            key={NotificationTab.like}
            title={`点赞${unreadLike ? `(${unreadLike})` : ''}`}
            name={NotificationTab.like}
          >
            <div
              className={`${
                currentTab === NotificationTab.like ? '' : 'hidden'
              }`}
            >
              <NotificationLikeList />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane
            key={NotificationTab.collect}
            title={`收藏${unreadCollect ? `(${unreadCollect})` : ''}`}
            name={NotificationTab.collect}
          >
            <div
              className={`${
                currentTab === NotificationTab.collect ? '' : 'hidden'
              }`}
            >
              <NotificationCollectList />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane
            key={NotificationTab.audit}
            title={`系统审核${unreadAudit ? `(${unreadAudit})` : ''}`}
            name={NotificationTab.audit}
          >
            <div
              className={`${
                currentTab === NotificationTab.audit ? '' : 'hidden'
              }`}
            >
              <NotificationAuditList />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </PageWrapper>
    </div>
  )
}
