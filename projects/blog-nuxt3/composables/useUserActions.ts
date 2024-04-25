import type { User } from 'sys-types'

export const useUserActions = (user?: User) => {
  const currentUser = ref<User | undefined>(user)
  const followLoading = ref(false)
  const { message } = useDiscreteApi(['message'])

  async function handleFollowUser(type: number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      followLoading.value = true
      try {
        const { result, success, code, msg } = await useFetchPost(
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
          message.error(msg as string)
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
