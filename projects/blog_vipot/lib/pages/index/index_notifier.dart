import 'package:blog_vipot/notifiers/base_list_fetch_notifier.dart';
import 'package:blog_vipot/http/index.dart';
import 'package:blog_vipot/storage/storage_manager.dart';

class IndexNotifier extends BaseListFetchNotifier{
  String groupId;

  IndexNotifier({required this.groupId});

  @override
  Future<List> getPageList() async {
    String token = MyStorageManager.sharedPreferences.getString(MyStorageManager.TOKEN) ?? '';
    if(token.isEmpty) groupId = '';

    List list = [];
    var res = await $http.fetch(ApiUrl.BLOG_LIST, params: { 'gid': groupId, 'page': currentPage, 'pageSize': pageSize });

    if(res['success']){
      list.addAll(res['result']['list']);
      // print('-----getPageList-------$list');
      return list;
    }else{
      return Future.error(res['msg']);
    }
  }
}