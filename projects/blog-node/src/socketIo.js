const { Server } = require('socket.io')
const { defaultLogger, errorLogger } = require('./log')

const SOCKETEVENTTYPE = {
  notification: 'notification'
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
      // query.client 客户端信息
      const query = handshake.query
      // console.log('==========建立新的客户端连接============', query)
      socket.join(query.uid, () => {})
      socket.on('disconnect', (reason) => {
        console.log('==========客户端主动断开连接===========', query, reason)
      })
      // console.log('==========io connection rooms===========', socket.rooms)
    })
  }
}

module.exports = {
  mySocketIo: new MySocketIo(),
  SOCKETEVENTTYPE
}
