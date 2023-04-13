import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:web_socket_channel/status.dart' as status;

class MyWebSocket {
  WebSocketChannel? websocketChannel;
  int reconnectCount = 0;
  String? uid;

  init(String? uid) {
    this.uid = uid;
    if (uid == null || uid.isEmpty) return;

    print('======websocketChannel init=======$uid');
    websocketChannel = WebSocketChannel.connect(
      Uri.parse('wss://niubility.website/websocket/?token=$uid'),
      // Uri.parse('wss://echo.websocket.events'),
    );

    initHeartBeat();

    websocketChannel!.stream.listen((event) {
      // print('======websocketChannel onMessage=======$event');
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
      init(uid);
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
