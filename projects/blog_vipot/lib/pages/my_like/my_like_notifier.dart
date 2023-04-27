import 'package:blog_vipot/notifiers/base_list_fetch_notifier.dart';

import 'package:blog_vipot/http/index.dart';

class MyLikeNotifier extends BaseListFetchNotifier{
  int total = 0;

  @override
  Future<List> getPageList() async{
    List list = [];
    try{
      var res = await $http.fetch(ApiUrl.USER_MARK_BLOG_LIST, params: { 'type': 1, 'page': currentPage, 'pageSize': pageSize });

      if(res['success']){
        list.addAll(res['result']['list']);
        total = res['result']['total'];
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