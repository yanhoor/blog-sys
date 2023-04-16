import 'package:blog_vipot/notifiers/base_list_fetch_notifier.dart';

import '../../http/index.dart';

class NotificationNotifier extends BaseListFetchNotifier{
  final String url;
  Map<String, dynamic> fetchParams;

  NotificationNotifier({required this.url, required this.fetchParams});

  @override
  Future<List> getPageList() async {
    List list = [];
    var res = await $http.fetch(url, params: { 'page': currentPage, 'pageSize': pageSize, ...fetchParams });
    list.addAll(res['result']['list']);
    // print('-----getPageList-------$list');
    return list;
  }
}