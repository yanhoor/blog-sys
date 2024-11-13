import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import type { ClientToServerEvents, Notification } from 'sys-types'

enum SOCKET_EVENT_TYPE {
  notification = 'notification'
}

interface ServerToClientEvents {
  new_comment_notification: (n: Notification) => void
  blog_notification: (n: Notification) => void
}

type SocketClient = Socket<ServerToClientEvents, ClientToServerEvents>

export default defineNuxtPlugin(({ $pinia }) => {
  const { handleFetchNotificationCount } = useFetchNotificationCount()
  const { handleShowNotificationDetail } = useShowNotificationDetail()

  let socketClient: SocketClient

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

    socketClient.on(SOCKET_EVENT_TYPE.notification as any, (arg: any) => {
      handleFetchNotificationCount()
      handleShowNotificationDetail(arg)
      // console.log('===========new-comment-notification=============', arg) //
    })
  }

  function handleDisconnect() {
    socketClient?.disconnect()
  }

  return {
    provide: {
      webSocketClient: {
        initSocketIo,
        handleDisconnect
      }
    }
  }
})
