const { Server } = require('ws')
const { defaultLogger, errorLogger } = require('./log')

let websocket, wss, koaServer, wsList = [] // [{ uid, ws }]
function initSocketServer(server) {
  koaServer = server
  wss = new Server({
    server,
    // port: 9000,
    // clientTracking: true
  }, (c) => {

  })

  // console.log('++++++++initSocketServer++++++++', [...wss.clients])

  wss.on('error', (e) => {
    errorLogger.error('++++++++wss error++++++++', e)
  })

  wss.on('headers', () => {
    console.log('++++++++wss headers++++++++')
  })

  wss.on('listening', () => {
    console.log('++++++++wss listening++++++++')
  })

  wss.on('wsClientError', () => {
    console.log('++++++++wss wsClientError++++++++')
  })

  wss.on('close', () => {
    defaultLogger.error('++++++++wss close++++++++')
  })

  wss.on('connection', function(ws, req) {
    const sp = new URLSearchParams(req.url.slice(1))
    const uid = sp.get('token')
    const info = wsList.find(w => w.uid == uid)

    // 前端刷新页面就会重连，所以需要除重
    if(!info){
      wsList.push({
        uid,
        ws
      })
    }

    websocket = ws

    ws.on('message', data => {
      const msg = data.toString()
      console.log('ws message---->', msg)
      // 心跳检测
      if(msg === '1'){
        ws.send(JSON.stringify({
          type: 'HEART_BEAT'
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
  });

  // wss.close(() => {
  //   console.log('wss close--->');
  // })
}

function sendWsMessage(uid, msg){
  console.log('sendWsMessage--->', uid)
  // 通过客户端发送的特定 uuid 记录其对应的 ws，后面再通过 uuid 找到 ws，给客户端发送消息
  const info = wsList.find(w => w.uid == uid)
  const ws = info?.ws
  if(ws){
    ws.send(msg)
  }
}

module.exports = { sendWsMessage, initSocketServer }
