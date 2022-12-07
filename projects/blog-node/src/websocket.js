const { Server } = require('ws')
const { defaultLogger, errorLogger } = require('./log')

const WEBSOCKET_MESSAGE_TYPE = {
  notification: 'notification',
  heart_beat: 'heart_beat'
}
class WS{
  websocket = null
  wss = null
  koaServer = null
  wsList = []
  init = (server) => {
    this.koaServer = server
    this.wss = new Server({
      server,
      // port: 9000,
      // clientTracking: true
    }, (c) => {

    })

    // console.log('++++++++initSocketServer++++++++', [...this.wss.clients])

    this.wss.on('error', (e) => {
      errorLogger.error('++++++++this.wss error++++++++', e)
    })

    this.wss.on('headers', () => {
      console.log('++++++++this.wss headers++++++++')
    })

    this.wss.on('listening', () => {
      console.log('++++++++this.wss listening++++++++')
    })

    this.wss.on('wsClientError', () => {
      console.log('++++++++this.wss wsClientError++++++++')
    })

    this.wss.on('close', () => {
      defaultLogger.error('++++++++this.wss close++++++++')
    })

    this.wss.on('connection', (ws, req) => {
      const sp = new URLSearchParams(req.url.slice(1))
      const uid = sp.get('token')
      const i = this.wsList.findIndex(item => item.uid == uid)
      if(i > -1){
        // 前端刷新页面就会重连，所以需要替换原来的ws
        this.wsList.splice(i, 1, {
          uid,
          ws
        })
      }else{
        this.wsList.push({
          uid,
          ws
        })
      }

      this.websocket = ws

      ws.on('message', data => {
        const msg = data.toString()
        console.log('ws message---->', msg)
        // 心跳检测
        if(msg === '1'){
          ws.send(JSON.stringify({
            type: WEBSOCKET_MESSAGE_TYPE.heart_beat
          }))
        }
      })

      // 每个客户端的通过 new WebSocket('ws://127.0.0.1:8000') 建立的连接都会创建一个新的 ws，然后与客户端的 ws 进行通信。
      // 所以这个 ws 永远对应最后一个建立连接的客户端
      // 可以通过客户端发送的特定 uuid 记录其对应的 ws，后面再通过 uuid 找到 ws，给客户端发送消息
      // ws.send('something');

      ws.on('error', function(data) {
        console.log('ws error--->', data);
      });

      ws.on('close', function(data) {
        console.log('ws close--->', data);
      });

      ws.on('open', function(data) {
        console.log('ws open--->', data);
      });
    });
  }

  sendWsMessage = (uid, msg) => {
    console.log('sendWsMessage--->', uid)
    // 通过客户端发送的特定 uuid 记录其对应的 ws，后面再通过 uuid 找到 ws，给客户端发送消息
    const info = this.wsList.find(w => w.uid == uid)
    const ws = info?.ws
    try {
      if(ws){
        ws.send(msg)
      }
    }catch (e) {
      errorLogger.error('sendWsMessage------->', e.message)
    }
  }
}

const websocket = new WS()
module.exports = { websocket, WEBSOCKET_MESSAGE_TYPE }
