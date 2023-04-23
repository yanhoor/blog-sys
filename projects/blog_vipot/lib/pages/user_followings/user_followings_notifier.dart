import 'package:blog_vipot/notifiers/base_list_fetch_notifier.dart';

import '../../http/index.dart';

class UserFollowingsNotifier extends BaseListFetchNotifier{
  final String userId;
  int followingsTotal = 0;

  UserFollowingsNotifier({required this.userId});

  @override
  Future<List> getPageList() async{
    List list = [];
    try{
      var res = await $http.fetch(ApiUrl.USER_FRIENDS, params: { 'uid': userId, 'relateType': 1, 'page': currentPage, 'pageSize': pageSize });

      if(res['success']){
        list.addAll(res['result']['list']);
        followingsTotal = res['result']['total'];
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