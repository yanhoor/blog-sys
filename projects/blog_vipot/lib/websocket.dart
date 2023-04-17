import 'dart:convert';
import 'package:blog_vipot/notifiers/global_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:web_socket_channel/status.dart' as status;

class WebSocketMessageType{
  static String HEART_BEAT = 'heart_beat';
  static String NOTIFICATION = 'notification';
}

class MyWebSocket {
  WebSocketChannel? websocketChannel;
  int reconnectCount = 0;
  String? uid;
  BuildContext? pageContext;

  init(String? uid, {required BuildContext context}) {
    pageContext = context;
    this.uid = uid;
    if (uid == null || uid.isEmpty) return;

    print('======websocketChannel init=======$uid');
    websocketChannel = WebSocketChannel.connect(
      Uri.parse('wss://niubility.website/websocket/?token=$uid'),
      // Uri.parse('wss://echo.websocket.events'),
    );

    initHeartBeat();

    websocketChannel!.stream.listen((event) {
      var msg = jsonDecode(event);
      String msgType = msg['type'];
      // print('======websocketChannel onMessage=======$event');
      if(msgType == WebSocketMessageType.NOTIFICATION) Provider.of<GlobalNotifier>(pageContext!, listen: false).getNotificationCount();
      initHeartBeat();
    }, onDone: () {
      print('======websocketChannel onDone=======');
      reconnect();
    }, onError: (err, stack) {
      reconnect();
      print('======websocketChannel error=======$err');
      print('======websocketChannel stack=======$stack');
    }, cancelOnError: true);
  }

  sendData(String msg) {
    // print('======websocketChannel sendData=======$msg');
    websocketChannel!.sink.add(msg);
  }

  reconnect() {
    if (reconnectCount >= 10) return;

    Future.delayed(const Duration(seconds: 10)).then((_) {
      init(uid, context: pageContext!);
      reconnectCount++;
    });
  }

  initHeartBeat() {
    Future.delayed(const Duration(seconds: 10)).then((_) {
      sendData('1');
    });
  }

  dispose() {
    websocketChannel?.sink.close(status.goingAway);
  }
}

final MyWebSocket myWebSocket = MyWebSocket();
