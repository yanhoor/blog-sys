const { Server } = require('socket.io')
const { defaultLogger, errorLogger } = require('./log')

const SOCKETEVENTTYPE = {
  new_comment_notification: 'new-comment-notification',
  blog_notification: 'blog-notification'
}

class MySocketIo {
  ioInstance = undefined
  init(server) {
    this.ioInstance = new Server(server, {
      /* options */
      // path: '/websocket/' // 默认 /socket.io/
      cors: {
        origin: 'http://127.0.0.1:3000'
      }
    })

    this.ioInstance.on('connection', (socket) => {
      const handshake = socket.handshake
      const uid = handshake.query.uid
      console.log('==========建立新的客户端连接============', uid)
      socket.join(uid, () => {})
      socket.on('disconnect', (reason) => {
        console.log('==========客户端主动断开连接===========', uid, reason)
      })
      console.log('==========io connection rooms===========', socket.rooms)
    })
  }
}

module.exports = {
  mySocketIo: new MySocketIo(),
  SOCKETEVENTTYPE
}
