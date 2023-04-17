import 'package:blog_vipot/notifiers/base_list_fetch_notifier.dart';
import 'package:blog_vipot/notifiers/global_notifier.dart';
import 'package:provider/provider.dart';

import '../../http/index.dart';

class NotificationNotifier extends BaseListFetchNotifier{
  Map<String, dynamic> fetchParams;

  NotificationNotifier({required this.fetchParams});

  @override
  Future<List> getPageList() async {
    List list = [];
    var res = await $http.fetch(ApiUrl.NOTIFICATION_LIST, params: { 'page': currentPage, 'pageSize': pageSize, ...fetchParams });
    if(res['success']){
      list.addAll(res['result']['list']);
      handleSetAllRead();
      // print('-----getPageList-------$list');
      return list;
    }else{
      return Future.error(res['msg']);
    }
  }

  handleSetAllRead() async{
    try{
      var res = await $http.fetch(ApiUrl.NOTIFICATION_READ, params: { 'isAll': 1, 'type': fetchParams['type'] });
      if(res['success']){
        Provider.of<GlobalNotifier>(pageContext!).getNotificationCount();
      }
    }catch(e){

    }
  }
}