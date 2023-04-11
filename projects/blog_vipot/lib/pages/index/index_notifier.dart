import 'package:blog_vipot/notifiers/base_list_fetch_notifier.dart';
import 'package:blog_vipot/http/index.dart';

class IndexNotifier extends BaseListFetchNotifier{
  @override
  Future<List> getPageList() async {
    List list = [];
    var res = await $http.fetch(ApiUrl.BLOG_LIST, params: { 'page': currentPage, 'pageSize': pageSize });
    list.addAll(res['result']['list']);
    // print('-----getPageList-------$list');
    return list;
  }

}