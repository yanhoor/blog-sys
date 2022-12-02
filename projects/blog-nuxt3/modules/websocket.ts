export default function (){
  if(process.client){
    const socket = new WebSocket('ws://127.0.0.1:8000/notice/2')
// 监听连接开启
    socket.onopen = function (evt) {
      // 主动向后台发送数据
      socket.send("msg from client")
    }
// 监听websocket通讯
    socket.onmessage = function (evt) {
      console.log('+++++++++++++', evt)
      // 这是服务端返回的数据
      let res = evt.data
      if(res.length > 5) {
        // 前端主动关闭连接
        socket.close()
      }
    }
// 监听连接关闭
    socket.onclose = function (evt) {
      console.log("Connection closed.")
    }
  }
}

