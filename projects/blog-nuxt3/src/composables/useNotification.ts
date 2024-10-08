import type { Notification } from 'sys-types'
import { ElButton } from 'element-plus'
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
  const {$HttpUtils} = useNuxtApp()
  try {
    const { result, success } = await $HttpUtils.post<any>(
      '/notification/count',
      params
    )
    if (success) {
      notificationTotalCount.value = result.total
      notificationUnreadCount.value = result.unreadTotal
      unreadCommentCount.value = result.unreadComment
      unreadLikeCount.value = result.unreadLike
      unreadCollectCount.value = result.unreadCollect
      unreadAuditCount.value = result.unreadAudit
    }
  } catch (e) {}
}

// 评论通知弹窗详情显示
export const useShowNotificationDetail = async (result: Notification) => {
  // todo: Error: [nuxt] A composable that requires access to the Nuxt instance was called outside of a plugin, Nuxt hook, Nuxt middleware, or Vue setup function. This is probably not a Nuxt bug.
  const n = ElNotification.success({
    title: '通知',
    message:
      result.type === 'system_audit'
        ? h('div', null, [
            '你有新的系统审核动态，',
            h(
              ElButton,
              {
                text: true,
                type: 'primary',
                onClick: () => {
                  setRead(result.blogId)
                  n.close()
                  navigateTo('/notification/system')
                }
              },
              {
                default: () => '去查看'
              }
            )
          ])
        : h('div', null, [
            '你的博客有新评论，',
            h(
              ElButton,
              {
                text: true,
                type: 'primary',
                onClick: () => {
                  setRead(result.blogId)
                  n.close()
                  navigateTo('/post/' + result.blogId)
                }
              },
              {
                default: () => '查看详情'
              }
            )
          ]),
    meta: () =>
      h('div', {
        type: 'datetime',
        format: 'MM-dd HH:mm',
        time: new Date(result.createdAt)
      }),
    action: () =>
      h(
        ElButton,
        {
          text: true,
          type: 'primary',
          onClick: async () => {
            setRead(result.id as number)
            n.close()
          }
        },
        {
          default: () => '已读'
        }
      ),
    onClose: () => {}
  })

  async function setRead(id: number) {
    try {
      const { result, success } = await $HttpUtils.post('/notification/read', {
        id
      })
      if (success) {
        useFetchNotificationCount()
      }
    } catch (e) {}
  }
}
