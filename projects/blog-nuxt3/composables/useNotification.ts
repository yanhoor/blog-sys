import {Notification} from '@/types'
import {createDiscreteApi, NButton, NTime} from "naive-ui"
import { h } from 'vue'

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

export const useFetchNotificationList = async (params = {}) => {
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

export const useShowNotificationDetail = async (id: string) => {
  const { notification } = createDiscreteApi(["notification"])
  try{
    const { result: info, success } = await useFetchPost('/notification/info', { id })
    if(success){
      const content = JSON.parse(info.content)
      const n = notification.create({
        title: '通知',
        // @ts-ignore
        content: () =>
          h(
            'div',
            null,
            [
              '你的博客有新评论，',
              h(
                NButton,
                {
                  text: true,
                  type: 'primary',
                  onClick: () => {
                    setRead(info.id)
                    n.destroy()
                    navigateTo({  path: '/blog',  query: { id: content.blogId }})
                  }
                },
                {
                  default: () => '查看详情'
                }
              )
            ]
          ),
        // @ts-ignore
        meta: () =>
          h(
            NTime,
            {
              type: 'datetime',
              time: new Date(info.createdAt)
            }
          ),
        // @ts-ignore
        action: () =>
          h(
            NButton,
            {
              text: true,
              type: 'primary',
              onClick: async () => {
                setRead(info.id)
                n.destroy()
              }
            },
            {
              default: () => '已读'
            }
          ),
        onClose: () => {

        }
      })
    }
  }catch (e) {

  }

  async function setRead(id: string) {
    try{
      const { result, success } = await useFetchPost('/notification/read', { id })
      if(success){
        useFetchNotificationList()
      }
    }catch (e) {

    }
  }
}
