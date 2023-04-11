import 'package:blog_vipot/storage/storage_manager.dart';
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

  getUserInfo() async {
    try{
      String token = MyStorageManager.sharedPreferences.getString(MyStorageManager.TOKEN) ?? '';
      if(token.isEmpty) return;

      var res = await $http.fetch(ApiUrl.USER_INFO, method: 'get');
      if(res['success']){
        myInfo = res['result'];
      }
    }catch(e){
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