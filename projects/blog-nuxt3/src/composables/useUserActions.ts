import type { User } from 'sys-types'

export const useUserActions = (user?: User) => {
  const {$HttpUtils} = useNuxtApp()
  const currentUser = ref<User | undefined>(user)
  const followLoading = ref(false)

  async function handleFollowUser(type: number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      followLoading.value = true
      try {
        const { result, success, code, msg } = await $HttpUtils.post(
          '/user/follow',
          {
            id: currentUser.value!.id,
            type
          }
        )
        followLoading.value = false
        if (success) {
          return resolve()
        } else {
          ElMessage.error(msg as string)
          reject()
        }
      } catch (e) {
        followLoading.value = false
        reject()
        console.log('======handleFollowUser=======', e)
      }
    })
  }

  return {
    currentUser,
    followLoading,
    handleFollowUser
  }
}
