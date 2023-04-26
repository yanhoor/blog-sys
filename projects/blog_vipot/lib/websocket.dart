import 'dart:async';
import 'dart:convert';
import 'package:blog_vipot/notifiers/global_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:provider/provider.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:web_socket_channel/status.dart' as status;

import 'my_system_notification.dart';

class WebSocketMessageType{
  static String HEART_BEAT = 'heart_beat';
  static String NOTIFICATION = 'notification';
}

class MyWebSocket {
  WebSocketChannel? websocketChannel;
  int reconnectCount = 0;
  String? uid;
  BuildContext? pageContext;
  Timer? heartTimer;
  bool isClose = false; // 主动关闭
  DateTime? lastMsgTime;

  init(String? uid, {required BuildContext context}) {
    lastMsgTime = null;
    pageContext = context;
    this.uid = uid;
    if (uid == null || uid.isEmpty) return;

    debugPrint('======websocketChannel init=======$uid');
    websocketChannel = WebSocketChannel.connect(
      Uri.parse('wss://niubility.website/websocket/?token=$uid'),
      // Uri.parse('wss://echo.websocket.events'),
    );

    initHeartBeat();

    websocketChannel!.stream.listen((event) async{
      var msg = jsonDecode(event);
      String msgType = msg['type'];
      lastMsgTime = DateTime.now();
      // print('======websocketChannel onMessage=======');
      if(msgType == WebSocketMessageType.NOTIFICATION) {
        Provider.of<GlobalNotifier>(pageContext!, listen: false).getNotificationCount();
        try{
          await MySystemNotification.flutterLocalNotificationsPlugin.show(
              MySystemNotification.notificationId++, 'plain title', 'plain body', MySystemNotification.notificationDetails,
              payload: 'item x');
        }catch(e){
          debugPrint('===================$e');
        }
      }
    }, onDone: () {
      debugPrint('======websocketChannel onDone=======');
      reconnect();
    }, onError: (err, stack) {
      reconnect();
      debugPrint('======websocketChannel error=======$err');
      debugPrint('======websocketChannel stack=======$stack');
    }, cancelOnError: true);
  }

  sendData(String msg) {
    // print('======websocketChannel sendData=======$msg');
    websocketChannel!.sink.add(msg);
  }

  reconnect() {
    if (reconnectCount >= 10) return;

    Future.delayed(const Duration(seconds: 10)).then((_) {
      heartTimer?.cancel();
      init(uid, context: pageContext!);
      reconnectCount++;
    });
  }

  initHeartBeat() {
    heartTimer?.cancel();
    heartTimer = Timer.periodic(const Duration(seconds: 10), (timer) {
      // print('===========${timer.tick}');
      DateTime now = DateTime.now();
      if(lastMsgTime != null && now.difference(lastMsgTime!).inSeconds > 60){
        debugPrint('没有收到服务端回复，服务端 socket 已断开');
        // 还是重试一下，可能是在后台时没发消息给服务端然后才断开
        reconnect();
      }else{
        sendData('1');
      }
    });
    // Future.delayed(const Duration(seconds: 10)).then((_) {
    //   sendData('1');
    // });
  }

  dispose() {
    websocketChannel?.sink.close(status.goingAway);
    isClose = true;
    heartTimer?.cancel();
  }
}

final MyWebSocket myWebSocket = MyWebSocket();
