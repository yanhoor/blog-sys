import 'package:blog_vipot/notifiers/base_list_fetch_notifier.dart';
import 'package:blog_vipot/http/index.dart';
import 'package:blog_vipot/storage/storage_manager.dart';

class IndexNotifier extends BaseListFetchNotifier{
  String _groupId = '';

  IndexNotifier(){
    groupId = MyStorageManager.sharedPreferences.getString(MyStorageManager.INDEX_GROUP_ID) ?? '';
  }

  @override
  Future<List> getPageList() async {
    String token = MyStorageManager.sharedPreferences.getString(MyStorageManager.TOKEN) ?? '';
    if(token.isEmpty) groupId = '';

    List list = [];
    var res = await $http.fetch(ApiUrl.BLOG_LIST, params: { 'gid': groupId, 'page': currentPage, 'pageSize': pageSize });
    list.addAll(res['result']['list']);
    // print('-----getPageList-------$list');
    return list;
  }

  String get groupId => _groupId;

  set groupId(String value){
    _groupId = value;
    MyStorageManager.sharedPreferences.setString(MyStorageManager.INDEX_GROUP_ID, value ?? '');
    notifyListeners();
  }
}