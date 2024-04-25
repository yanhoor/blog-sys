import type { Blog } from 'sys-types'
import type {
  DialogOptions
} from 'naive-ui'

export const usePostActions = (blog?: Blog) => {
  const currentPost = ref<Blog | undefined>(blog)
  const likeLoading = ref(false)
  const collectLoading = ref(false)
  const deleteLoading = ref(false)
  const userInfo = useUserInfo()
  const { message, dialog } = useDiscreteApi(['message', 'dialog'])

  function handlePostLike(handleResult = true): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!userInfo.value || likeLoading.value) {
        reject()
        return message.info('请先登录')
      }

      try {
        likeLoading.value = true
        const { result, success } = await useFetchPost('/blog/like', {
          id: currentPost.value.id,
          isLike: currentPost.value.isLike ? 0 : 1
        })
        likeLoading.value = false
        if (success) {
          if (handleResult) {
            currentPost.value.isLike = !currentPost.value.isLike
            currentPost.value.isLike
              ? currentPost.value.likedByCount++
              : currentPost.value.likedByCount--
          }
          return resolve()
        }
        reject()
      } catch (e) {
        likeLoading.value = false
        reject()
      }
    })
  }

  function handlePostCollect(handleResult = true): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!userInfo.value || collectLoading.value) {
        reject()
        return message.info('请先登录')
      }

      try {
        collectLoading.value = true
        const { result, success } = await useFetchPost('/blog/collect', {
          id: currentPost.value.id,
          isCollect: currentPost.value.isCollect ? 0 : 1
        })
        collectLoading.value = false
        if (success) {
          if (handleResult) {
            currentPost.value.isCollect = !currentPost.value.isCollect
            currentPost.value.isCollect
              ? currentPost.value.collectedByCount++
              : currentPost.value.collectedByCount--
          }
          return resolve()
        }
        reject()
      } catch (e) {
        collectLoading.value = false
        reject()
      }
    })
  }

  function handleDeletePost(): Promise<void> {
    return new Promise((resolve, reject) => {
      dialog.error({
        title: '删除博客',
        content: '确定删除？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
          if (deleteLoading.value) return

          try {
            deleteLoading.value = true
            const { result, success } = await useFetchPost('/blog/delete', {
              id: currentPost.value.id
            })
            deleteLoading.value = false
            if (success) {
              message.success('已删除')
              return resolve()
            }
            reject()
          } catch (e) {
            deleteLoading.value = false
            reject()
          }
        },
        onNegativeClick: () => {}
      } as DialogOptions)
    })
  }

  return {
    currentPost,
    likeLoading,
    collectLoading,
    handleDeletePost,
    handlePostCollect,
    handlePostLike
  }
}
