import 'package:blog_vipot/notifiers/base_list_fetch_notifier.dart';
import 'package:blog_vipot/http/index.dart';

class UserFollowersNotifier extends BaseListFetchNotifier{
  final String userId;
  int followersTotal = 0;

  UserFollowersNotifier({required this.userId});

  @override
  Future<List> getPageList() async{
    List list = [];
    try{
      var res = await $http.fetch(ApiUrl.USER_FRIENDS, params: { 'uid': userId, 'relateType': 2, 'page': currentPage, 'pageSize': pageSize });

      if(res['success']){
        list.addAll(res['result']['list']);
        followersTotal = res['result']['total'];
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