import 'package:blog_vipot/components/helper/bot_toast_helper.dart';
import 'package:blog_vipot/storage/storage_manager.dart';
import 'package:blog_vipot/websocket.dart';
import 'package:chewie/chewie.dart';
import 'package:flutter/material.dart';

import '../http/index.dart';

class GlobalNotifier extends ChangeNotifier{
  late PageController homePageController;
  ChewieController? chewieController;
  Map<String, dynamic>? _myInfo;

  GlobalNotifier(): homePageController = PageController(){
    getUserInfo();
  }

  setCurrentPlayController(ChewieController c){
    if(chewieController != null && chewieController!.isPlaying) chewieController!.pause();
    chewieController = c;
  }

  logout() async{
    try{
      String token = MyStorageManager.sharedPreferences.getString(MyStorageManager.TOKEN) ?? '';
      if(token.isEmpty) return false;

      var res = await $http.fetch(ApiUrl.LOGOUT);
      if(res['success']){
        ToastHelper.success('已退出登录');
        myWebSocket.dispose();
        await MyStorageManager.sharedPreferences.setString(MyStorageManager.TOKEN, '');
        myInfo = null;
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

  getUserInfo() async {
    try{
      String token = MyStorageManager.sharedPreferences.getString(MyStorageManager.TOKEN) ?? '';
      if(token.isEmpty) return false;

      var res = await $http.fetch(ApiUrl.USER_INFO, method: 'get');
      if(res['success']){
        myInfo = res['result'];
        myWebSocket.init(myInfo!['id'].toString());
        return true;
      }
      return false;
    }catch(e){
      return false;
      // print('=========${jsonEncode(e)}');
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