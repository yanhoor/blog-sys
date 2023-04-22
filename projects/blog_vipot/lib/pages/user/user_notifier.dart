import 'package:blog_vipot/notifiers/base_list_fetch_notifier.dart';

import 'package:blog_vipot/components/helper/bot_toast_helper.dart';
import 'package:blog_vipot/http/index.dart';

class UserNotifier extends BaseListFetchNotifier{
  final String userId;
  late Map<String, dynamic> userInfo;
  late Map<String, dynamic> statisInfo;
  List mediaList = [];
  int imageTotal = 0;
  int postTotal = 0;

  UserNotifier({required this.userId});

  @override
  Future<List> getPageList() async {
    List list = [];
    try{
      var res = await $http.fetch(ApiUrl.BLOG_LIST, params: { 'uid': userId, 'page': currentPage, 'pageSize': pageSize });

      if(res['success']){
        list.addAll(res['result']['list']);
        postTotal = res['result']['total'];
        // print('-----getPageList-------$list');
        return list;
      }else{
        return Future.error(res['msg']);
      }
    }catch(e){
      return Future.error(e.toString());
    }
  }

  @override
  Future getOtherData() async{
    getUserStatisInfo();
    getUserMediaList();
    return getUserInfo();
  }

  getUserInfo() async{
    try{
      var res = await $http.fetch('${ApiUrl.USER_ID_INFO}/$userId');
      if(res['success']){
        userInfo = res['result'];
        notifyListeners();
        return Future.value(true);
      }else{
        setError(res['msg']);
        ToastHelper.error(res['msg']);
        return Future.error(res['msg']);
      }
    }catch(e){
      return Future.error(e.toString());
    }
  }

  getUserStatisInfo() async{
    try{
      var res = await $http.fetch(ApiUrl.STATIS_USER, params: { 'id': userId });
      if(res['success']){
        statisInfo = res['result'];
        notifyListeners();
        return Future.value(true);
      }else{
        return Future.error(res['msg']);
      }
    }catch(e){
      return Future.error(e.toString());
    }
  }

  getUserMediaList() async{
    try{
      var res = await $http.fetch(ApiUrl.USER_MEDIA_LIST, params: { 'userId': userId, 'type': 1 });
      if(res['success']){
        mediaList = res['result']['list'];
        imageTotal = res['result']['total'];
        notifyListeners();
        return Future.value(true);
      }else{
        return Future.error(res['msg']);
      }
    }catch(e){
      return Future.error(e.toString());
    }
  }
}