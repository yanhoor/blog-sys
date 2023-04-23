import 'package:blog_vipot/notifiers/base_list_fetch_notifier.dart';

import 'package:blog_vipot/http/index.dart';

class UserImageWallNotifier extends BaseListFetchNotifier{
  final String userId;
  int imageTotal = 0;

  UserImageWallNotifier({required this.userId});

  @override
  Future<List> getPageList() async{
    List list = [];
    try{
      var res = await $http.fetch(ApiUrl.USER_MEDIA_LIST, params: { 'userId': userId, 'type': 1, 'page': currentPage, 'pageSize': pageSize });

      if(res['success']){
        list.addAll(res['result']['list']);
        imageTotal = res['result']['total'];
        // print('-----getPageList-------$list');
        return list;
      }else{
        return Future.error(res['msg']);
      }
    }catch(e){
      return Future.error(e.toString());
    }
  }
}