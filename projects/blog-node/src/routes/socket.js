const router = require('koa-router')()

router.all('/notice/:id', function (ctx) {
  // `ctx` is the regular koa context created from the `ws` onConnection `socket.upgradeReq` object.
  // the websocket is added to the context on `ctx.websocket`.
  ctx.websocket.send('msg from server: Hello World')
  ctx.websocket.on('message', function(message) {
    // do something with the message from client
    console.log('socket msg from client====', message)
  })
  ctx.websocket.on('close', () => {
    console.log('client close websocket')
  })
})

module.exports = router
