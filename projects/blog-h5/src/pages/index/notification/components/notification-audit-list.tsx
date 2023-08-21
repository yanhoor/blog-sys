import NotificationWrapper from './notification-wrapper'
import { Notification } from 'sys-types'
import { ReactNode } from 'react'
import { Tag } from 'react-vant'
import YCard from '@/components/y-card'
import YTime from '@/components/y-time'
import { useNavigate } from 'react-router-dom'
import ExpandableContent from '@/components/expandable-content'

export default function NotificationAuditList() {
  const navigate = useNavigate()

  function createNotificationList(notificationList: Notification[]): ReactNode {
    return (
      <div className="notification-list mt-[5px]">
        {notificationList.map((notification) => (
          <YCard key={notification.id} className="mx-[5px]">
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center gap-[6px] text-[12px]">
                <span>您的{notification.comment ? '评论' : '博客'}审核</span>
                <Tag
                  type={
                    notification.content.auditStatusText === '审核通过'
                      ? 'success'
                      : 'danger'
                  }
                >
                  {notification.content.auditStatusText}
                </Tag>
              </div>
              {!!notification.comment && (
                <div className="bg-block-section mt-2 min-w-full rounded px-2 py-1 text-[12px]">
                  <ExpandableContent
                    className="inline"
                    content={notification.comment.content!}
                  />
                </div>
              )}
              <span className="text-[12px]">
                审核意见：{notification.content.auditTip || '无'}
              </span>
              <div
                className="bg-block-section mt-2 min-w-full rounded px-2 py-1 text-[12px]"
                onClick={
                  notification.blog
                    ? () => navigate('/post/' + notification.blogId)
                    : undefined
                }
              >
                {notification.blog ? (
                  <ExpandableContent
                    className="inline"
                    content={notification.blog.content}
                  />
                ) : (
                  <span>博客不存在</span>
                )}
              </div>
              <YTime time={notification.createdAt}></YTime>
            </div>
          </YCard>
        ))}
      </div>
    )
  }

  return (
    <NotificationWrapper
      initParams={{ type: 'system_audit' }}
      createNotificationList={createNotificationList}
    />
  )
}
