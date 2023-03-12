import {
	socketBase
} from '@/config/index.js'
import {
	useMyInfoStore
} from '@/stores/userInfo.js'

let socketOpen = false
let socketMsgQueue = []
let socketTask, heartBeatTimer, heartBeatSpaceTime = 1000

function initSocket(userId) {
	if (socketTask) {
		console.log('+++++++++已存在socket实例++++++++++')
		return
	}

	socketTask = uni.connectSocket({
		url: socketBase + '/?token=' + userId,
		fail: () => {
			console.log('+++++++++connectSocket fail++++++++++')
		},
		complete: () => {},
	})

	uni.onSocketOpen(function(res) {
		socketOpen = true
		heartBeat()

		for (let i = 0; i < socketMsgQueue.length; i++) {
			sendSocketMessage(socketMsgQueue[i])
		}
		socketMsgQueue = []
	})

	uni.onSocketError(function(res) {
		clearTimeout(heartBeatTimer)
		socketTask = undefined
		console.log('WebSocket连接打开失败，请检查！')
	})

	uni.onSocketMessage(function(e) {
		const res = JSON.parse(e.data)
		const userStore = useMyInfoStore()
		// console.log('收到服务器内容：' + res.type)
		switch (res.type) {
			case 'heart_beat':
				heartBeat()
				break
			case 'notification':
				userStore.getNotificationCount()
				break
		}
	})

	uni.onSocketClose(function(res) {
		clearTimeout(heartBeatTimer)
		socketTask = undefined
		console.log('WebSocket 已关闭！')
	})
}

function heartBeat() {
	heartBeatTimer = setTimeout(() => {
		sendSocketMessage('1')
	}, heartBeatSpaceTime)
}

function sendSocketMessage(msg) {
	if (socketOpen) {
		uni.sendSocketMessage({
			data: msg
		})
	} else {
		socketMsgQueue.push(msg)
	}
}

function closeSocket() {
	uni.closeSocket()
}

export {
	initSocket,
	closeSocket,
	sendSocketMessage
}
