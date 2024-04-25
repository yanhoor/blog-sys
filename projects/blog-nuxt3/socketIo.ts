import { io, Socket } from 'socket.io-client'
import type { ClientToServerEvents, Notification } from 'sys-types'
import { useShowNotificationDetail } from '~/composables/useNotification'

const SOCKETEVENTTYPE = {
  notification: 'notification'
}

interface ServerToClientEvents {
  new_comment_notification: (n: Notification) => void
  blog_notification: (n: Notification) => void
}

let socketClient: Socket<ServerToClientEvents, ClientToServerEvents> | undefined

function initSocketIo(host: string, uid: string) {
  // console.log('=======initSocketIo========', uid)
  socketClient = io(host, {
    query: {
      uid,
      client: `web-${process.client ? navigator.userAgent : 'unknown'}`
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

  socketClient.on(SOCKETEVENTTYPE.notification, (arg) => {
    useFetchNotificationCount()
    useShowNotificationDetail(arg)
    // console.log('===========new-comment-notification=============', arg) //
  })
}

export { initSocketIo, socketClient }
