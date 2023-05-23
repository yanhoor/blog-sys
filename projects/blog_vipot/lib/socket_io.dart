import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

import 'my_system_notification.dart';
import 'notifiers/global_notifier.dart';

class SocketEventType{
  static const String notification = 'notification';
}

class MySocketIo{
  IO.Socket? socketClient;
  BuildContext? pageContext;

  init(int uid, BuildContext context){
    debugPrint('==========socket init===========');
    pageContext = context;
    // String host = 'ws://127.0.0.1:8000';
    String host = 'wss://niubility.website';
    try{
      socketClient = IO.io(
          host,
          IO.OptionBuilder().setTransports(['websocket']).setQuery({
            'uid': uid,
            'client': '${Platform.operatingSystem}-${Platform.operatingSystemVersion}'
          }).build()
      );
    }catch(e){
      debugPrint('==========socket init===========${e.toString()}');
    }
    socketClient?.onConnect((_) {
      debugPrint('==========socket 连接成功===========');
    });
    socketClient?.onConnecting((_) {
      debugPrint('==========socket onConnecting===========$_');
    });
    socketClient?.onConnectTimeout((_) {
      debugPrint('==========socket onConnectTimeout===========$_');
    });
    socketClient?.onError((_) {
      debugPrint('==========socket 连接失败===========$_');
    });
    socketClient?.onDisconnect((_) {
      debugPrint('==========socket 已断开===========');
    });
    socketClient?.on(SocketEventType.notification, (notification) async {
      debugPrint('==========socket 接收到消息 ${SocketEventType.notification}===========$notification');
      // final dataList = notification as List;
      // final ack = dataList.last as Function;
      // ack(null);
      GlobalNotifier globalNotifier = Provider.of<GlobalNotifier>(pageContext!, listen: false);
      globalNotifier.getNotificationCount();
      String content = '';
      switch(notification['type']){
        case 'comment':
          content = '您的博客有新评论';
          break;
        case 'comment_reply':
          content = '您的评论有新回复';
          break;
        case 'system_audit':
          content = '${notification['commentId'] == null ? '您的博客审核状态更新' : '您的评论审核状态更新'}：${notification['content']['auditStatusText']}';
          break;
      }
      await MySystemNotification.flutterLocalNotificationsPlugin.show(
          MySystemNotification.notificationId++, 'Vipot', content, MySystemNotification.notificationDetails,
          payload: 'item x');
    });
  }

  disconnect(){
    socketClient?.dispose();
  }
}

final MySocketIo mySocketIo = MySocketIo();