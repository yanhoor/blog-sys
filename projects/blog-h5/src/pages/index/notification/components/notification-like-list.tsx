import NotificationWrapper from './notification-wrapper'
import { Notification } from 'sys-types'
import { ReactNode } from 'react'
import UserAvatar from '@/components/user/user-avatar'
import UserName from '@/components/user/user-name'
import YCard from '@/components/y-card'
import ExpandableContent from '@/components/expandable-content'
import YTime from '@/components/y-time'
import { useNavigate } from 'react-router-dom'

export default function NotificationLikeList() {
  const navigate = useNavigate()

  function createNotificationList(notificationList: Notification[]): ReactNode {
    return (
      <div className="notification-list mt-[5px]">
        {notificationList.map((notification) => (
          <YCard key={notification.id} className="mx-[5px]">
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center gap-[6px] text-[12px]">
                <UserAvatar user={notification.createBy} size={32} />
                <UserName user={notification.createBy} />
                <span>点赞了您的博客：</span>
              </div>
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
      initParams={{ type: 'like_blog' }}
      createNotificationList={createNotificationList}
    />
  )
}
