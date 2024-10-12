import {io} from 'socket.io-client'

enum SOCKETEVENTTYPE {
  notification = 'notification'
}

export default defineNuxtPlugin(({$pinia}) => {
  const {handleFetchNotificationCount} = useFetchNotificationCount()
  const {handleShowNotificationDetail} = useShowNotificationDetail()

  let socketClient: SocketClient | undefined

  function initSocketIo(host: string, uid: string) {
    // console.log('=======initSocketIo========', uid)
    socketClient = io(host, {
      query: {
        uid,
        client: `web-${import.meta.client ? navigator.userAgent : 'unknown'}`
      }
    })

    socketClient.on('connect', () => {
      // console.log(
      //   '===========initSocketIo connect=============',
      //   socketClient?.connected
      // ) // true
    })

    socketClient.on('disconnect', () => {
      console.log(
        '===========initSocketIo disconnect=============',
        socketClient?.connected
      ) // false
    })

    socketClient.on(SOCKETEVENTTYPE.notification as any, (arg: any) => {
      handleFetchNotificationCount()
      handleShowNotificationDetail(arg)
      // console.log('===========new-comment-notification=============', arg) //
    })
  }

  return {
    provide: {initSocketIo, socketClient}
  }
})
