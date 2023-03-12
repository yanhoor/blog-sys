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

// 未读审核通知数
export const useNotificationUnreadAuditCount = () => {
  return useState<number>('notificationUnreadAuditCount', () => 0)
}

export const useFetchNotificationCount = async (params = {}) => {
  const notificationTotalCount = useNotificationTotalCount()
  const notificationUnreadCount = useNotificationUnreadCount()
  const unreadCommentCount = useNotificationUnreadCommentCount()
  const unreadLikeCount = useNotificationUnreadLikeCount()
  const unreadCollectCount = useNotificationUnreadCollectCount()
  const unreadAuditCount = useNotificationUnreadAuditCount()
  try{
    const { result, success } = await useFetchPost('/notification/count', params)
    if(success){
      notificationTotalCount.value = result.total
      notificationUnreadCount.value = result.unreadTotal
      unreadCommentCount.value = result.unreadComment
      unreadLikeCount.value = result.unreadLike
      unreadCollectCount.value = result.unreadCollect
      unreadAuditCount.value = result.unreadAudit
    }
  }catch (e) {

  }
}

// 评论通知弹窗详情显示
export const useShowNotificationDetail = async (id: string) => {
  const { notification } = createDiscreteApi(["notification"])
  try{
    const { result, success } = await useFetchPost('/notification/info', { id })
    if(!['comment_reply', 'comment', 'system_audit'].includes(result.type)) return
    if(success){
      const n = notification.create({
        title: '通知',
        // @ts-ignore
        content: () =>
          result.type === 'system_audit' ? h(
            'div',
            null,
            [
              '你有新的系统审核动态，',
              h(
                NButton,
                {
                  text: true,
                  type: 'primary',
                  onClick: () => {
                    setRead(result.blogId)
                    n.destroy()
                    navigateTo('/notification/system')
                  }
                },
                {
                  default: () => '去查看'
                }
              )
            ]
          ) : h(
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
                    navigateTo('/post/' + result.blogId)
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
