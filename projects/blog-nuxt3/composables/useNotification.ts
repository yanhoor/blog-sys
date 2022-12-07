import {Notification} from '@/types'

export const useNotification = () => {
  return useState<Notification[]>('notification', () => [])
}

export const useNotificationCount = () => {
  return useState<number>('notificationCount', () => 0)
}

export const useFetchNotification = async (params = {}) => {
  const notification = useNotification()
  const notificationCount = useNotificationCount()
  try{
    const { result, success } = await useFetchPost('/notification/list', params)
    if(success){
      notification.value = result.list
      notificationCount.value = result.total
    }
  }catch (e) {

  }
}
