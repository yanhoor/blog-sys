import 'package:blog_vipot/components/helper/bot_toast_helper.dart';
import 'package:blog_vipot/config/index.dart';
import 'package:blog_vipot/pages/notification/notification_notifier.dart';
import 'package:blog_vipot/route/route_name.dart';
import 'package:blog_vipot/storage/storage_manager.dart';
import 'package:blog_vipot/websocket.dart';
import 'package:flutter/material.dart';
import 'package:blog_vipot/http/index.dart';
import 'package:blog_vipot/pages/index/index_notifier.dart';
import 'package:video_player/video_player.dart';

import '../my_system_notification.dart';

class GlobalNotifier extends ChangeNotifier{
  late PageController homePageController;
  late BuildContext pageContext;
  String initRouteName = RouteName.welcome;
  int currentTab = 0;
  late IndexNotifier indexNotifier;
  late NotificationNotifier notificationNotifier;
  VideoPlayerController? videoPlayerController;
  Map<String, dynamic>? _myInfo;
  List allGroupList = []; // 所有分组
  List indexGroupList = []; // 首页的分组，所有分组 + “全部”分组
  List groupList = []; // 所有分组 - 系统分组
  int groupRefreshTime = DateTime.now().millisecondsSinceEpoch;
  int unreadTotal = 0;
  int unreadAudit = 0;
  int unreadCollect = 0;
  int unreadComment = 0;
  int unreadLike = 0;

  GlobalNotifier(){
    String? v = MyStorageManager.sharedPreferences.getString(MyStorageManager.VERSION);
    if(v != null && v == MyConfig.version ){
      initRouteName = RouteName.advertise;
    } else{
      initRouteName = RouteName.welcome;
    }
    getUserInfo();
  }

  setPageContext(BuildContext context){
    pageContext = context;
  }

  setHomePageController(PageController pc){
    homePageController = pc;
  }

  setIndexNotifier(IndexNotifier inf){
    indexNotifier = inf;
  }

  setCurrentTab(int v){
    currentTab = v;
    notifyListeners();
  }

  Future<bool> logout() async{
    try{
      String token = MyStorageManager.sharedPreferences.getString(MyStorageManager.TOKEN) ?? '';
      if(token.isEmpty) return false;

      var res = await $http.fetch(ApiUrl.LOGOUT);
      if(res['success']){
        ToastHelper.success('已退出登录');
        myWebSocket.dispose();
        unreadTotal = 0;
        await MyStorageManager.sharedPreferences.setString(MyStorageManager.TOKEN, '');
        await MyStorageManager.sharedPreferences.setString(MyStorageManager.INDEX_GROUP_ID, '');
        myInfo = null;
        allGroupList.clear();
        indexGroupList.clear();
        groupList.clear();
        notifyListeners();
        return true;
      }else{
        ToastHelper.error(res['msg'] ?? '操作失败');
        return false;
      }
    }catch(e){
      return false;
      // print('=========${jsonEncode(e)}');
    }
  }

  getUserInfo([bool init = true]) async {
    try{
      String token = MyStorageManager.sharedPreferences.getString(MyStorageManager.TOKEN) ?? '';
      if(token.isEmpty) return false;

      var res = await $http.fetch(ApiUrl.USER_INFO, method: 'get');
      if(res['success']){
        myInfo = res['result'];
        if(init && pageContext.mounted) myWebSocket.init(myInfo!['id'].toString(), context: pageContext);
        getAllGroup();
        getNotificationCount();
        return true;
      }
      return Future.error(res['msg']);
    }catch(e){
      return Future.error(e.toString());
      // print('=========${jsonEncode(e)}');
    }
  }

  Future getAllGroup() async {
    try{
      var res = await $http.fetch(ApiUrl.GROUP_ALL);
      if(res['success']){
        groupList = res['result'];
        if(allGroupList.length != groupList.length) groupRefreshTime = DateTime.now().millisecondsSinceEpoch;
        allGroupList.clear();
        indexGroupList.clear();
        indexGroupList.add({
          'id': '',
          'name': '全部'
        });
        allGroupList.addAll(groupList);
        indexGroupList.addAll(groupList);
        groupList.retainWhere((g) => g['system'] == 2);
        notifyListeners();
        return true;
      }else{
        return Future.error(res['msg']);
      }
    }catch(e){
      return Future.error(e);
    }
  }

  Future getNotificationCount() async {
    try{
      var res = await $http.fetch(ApiUrl.NOTIFICATION_COUNT);
      if(res['success']){
        // unreadTotal = 99;
        unreadTotal = res['result']['unreadTotal'];
        unreadAudit = res['result']['unreadAudit'];
        unreadCollect = res['result']['unreadCollect'];
        unreadComment = res['result']['unreadComment'];
        unreadLike = res['result']['unreadLike'];
        notifyListeners();
      }else{
        // return Future.error(res['msg']);
      }
    }catch(e){
      // return Future.error(e);
    }
  }

  Future getNotificationDetail(int id) async {
    try{
      var res = await $http.fetch(ApiUrl.NOTIFICATION_INFO, params: { 'id': id });
      if(res['success']){
        var detail = res['result'];
        if(detail['type'] == 'comment'){
          await MySystemNotification.flutterLocalNotificationsPlugin.show(
              MySystemNotification.notificationId++, 'Vipot', '您的博客有新评论', MySystemNotification.notificationDetails,
              payload: 'item x');
        }
      }else{
        // return Future.error(res['msg']);
      }
    }catch(e){
      // return Future.error(e);
    }
  }

  Map<String, dynamic>? get myInfo => _myInfo;

  set myInfo(Map<String, dynamic>? value) {
    _myInfo = value;
    notifyListeners();
  }

  @override
  void dispose() {
    super.dispose();
    homePageController.dispose();
  }
}