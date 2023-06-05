import AppendListWrapper from '@/components/append-list-wrapper'
import { notification_list } from '@/http/urls'
import { ReactNode } from 'react'
import { Notification } from 'sys-types'

interface Props {
  initParams: object
  createNotificationList: (notificationLis: Notification[]) => ReactNode
}

export default function NotificationWrapper({
  initParams,
  createNotificationList
}: Props) {
  return (
    <AppendListWrapper
      url={notification_list}
      createList={createNotificationList}
      initParams={{ ...initParams, isRead: 3 }}
    />
  )
}
