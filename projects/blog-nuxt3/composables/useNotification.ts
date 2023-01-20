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

// 未读评论通知数
export const useNotificationUnreadCommentCount = () => {
  return useState<number>('notificationUnreadCommentCount', () => 0)
}

// 未读点赞通知数
export const useNotificationUnreadLikeCount = () => {
  return useState<number>('notificationUnreadLikeCount', () => 0)
}

// 未读收藏通知数
export const useNotificationUnreadCollectCount = () => {
  return useState<number>('notificationUnreadCollectCount', () => 0)
}

export const useFetchNotificationCount = async (params = {}) => {
  const notificationTotalCount = useNotificationTotalCount()
  const notificationUnreadCount = useNotificationUnreadCount()
  const unreadCommentCount = useNotificationUnreadCommentCount()
  const unreadLikeCount = useNotificationUnreadLikeCount()
  const unreadCollectCount = useNotificationUnreadCollectCount()
  try{
    const { result, success } = await useFetchPost('/notification/count', params)
    if(success){
      notificationTotalCount.value = result.total
      notificationUnreadCount.value = result.unreadTotal
      unreadCommentCount.value = result.unreadComment
      unreadLikeCount.value = result.unreadLike
      unreadCollectCount.value = result.unreadCollect
    }
  }catch (e) {

  }
}

export const useFetchNotificationList = async (params = {}) => {
  const notification = useNotification()
  try{
    const { result, success } = await useFetchPost('/notification/list', params)
    if(success){
      notification.value = result.list
    }
  }catch (e) {

  }
}

// 评论通知弹窗详情显示
export const useShowNotificationDetail = async (id: string) => {
  const { notification } = createDiscreteApi(["notification"])
  try{
    const { result, success } = await useFetchPost('/notification/info', { id })
    if(success){
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
                    setRead(result.blogId)
                    n.destroy()
                    navigateTo({  path: '/blog',  query: { id: result.blogId }})
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
              time: new Date(result.createdAt)
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
                setRead(result.id)
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
        useFetchNotificationCount()
      }
    }catch (e) {

    }
  }
}
