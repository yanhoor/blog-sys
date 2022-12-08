
import { createDiscreteApi } from "naive-ui"

const WEBSOCKET_MESSAGE_TYPE = {
  notification: 'notification',
  heart_beat: 'heart_beat'
}
class WS {
  heartBeatTime = 10000 // 心跳检测间隔
  reconnectCount = 0 // 重连次数
  reconnectTime = 3000 // 多少时间后尝试重连
  heartBeatTimer: number = 0
  ws: WebSocket | null = null
  isClosed = false
  init = () => {
    this.isClosed = false
    const userInfo = useUserInfo()
    const config = useRuntimeConfig()
    this.ws = new WebSocket(config.wsHost + '?token=' + userInfo.value?.id)

    // 监听连接开启
    this.ws.onopen = (evt) => {
      // 主动向后台发送数据
      this.ws?.send("msg from client")
      this.initHeartBeat()
      // console.log('============', ws.readyState)
    }

    // 监听websocket通讯
    this.ws.onmessage = (evt) => {
      // 这是服务端返回的数据
      const res = JSON.parse(evt.data)
      // message.success(res)
      // console.log('==========websocket 接收的服务器数据==============', res.type, res)
      // 服务端接收到心跳消息后也会发消息返回，能接收到任何消息即未断开，需要重置
      this.initHeartBeat()
      switch (res.type) {
        case WEBSOCKET_MESSAGE_TYPE.heart_beat:
          break
        case WEBSOCKET_MESSAGE_TYPE.notification:
          useFetchNotificationList()
          useShowNotificationDetail(res.id)
          break
      }
    }

    // 监听连接关闭
    this.ws.onclose = (evt) => {
      console.log("Connection closed.", evt)
      if(!this.isClosed){
        this.reconnect()
      }
    }

    this.ws.onerror = (e) => {
      console.log('======onerror=====', e)
      this.reconnect()
    }
  }

  close = () => {
    this.isClosed = true
    clearTimeout(this.heartBeatTimer)
    this.ws?.close()
  }

  // 失败重连
  reconnect = () => {
    const { message } = createDiscreteApi(["message"])
    setTimeout(() => {
      if(this.reconnectCount === 5){
        message.error('网络连接异常，请检查网络连接，刷新页面')
        this.reconnectTime = 5000
      }
      if(this.reconnectCount === 20) return

      this.reconnectCount ++
      this.init()
    }, this.reconnectTime)
  }

  initHeartBeat = () => {
    if(this.isClosed) return

    this.heartBeatTimer = window.setTimeout(() => {
      this.ws?.send('1')
    }, this.heartBeatTime)
  }
}

export default new WS()
