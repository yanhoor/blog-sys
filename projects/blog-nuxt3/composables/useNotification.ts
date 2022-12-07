import {Notification} from '@/types'

export const useNotification = () => {
  return useState<Notification[]>('notification', () => [])
}

// 所有通知总数
export const useNotificationTotalCount = () => {
  return useState<number>('notificationCount', () => 0)
}

// 未读通知数
export const useNotificationUnreadCount = () => {
  return useState<number>('notificationUnreadCount', () => 0)
}
export const useFetchNotification = async (params = {}) => {
  const notification = useNotification()
  const notificationTotalCount = useNotificationTotalCount()
  const notificationUnreadCount = useNotificationUnreadCount()
  try{
    const { result, success } = await useFetchPost('/notification/list', params)
    if(success){
      notification.value = result.list
      notificationTotalCount.value = result.total
      notificationUnreadCount.value = result.unreadTotal
    }
  }catch (e) {

  }
}
