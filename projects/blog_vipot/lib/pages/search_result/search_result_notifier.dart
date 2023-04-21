import 'package:blog_vipot/notifiers/base_list_fetch_notifier.dart';

import 'package:blog_vipot/http/index.dart';

class SearchResultNotifier extends BaseListFetchNotifier{
  final String keyword;

  SearchResultNotifier({required this.keyword});

  @override
  Future<List> getPageList() async{
    List list = [];
    var res = await $http.fetch(ApiUrl.BLOG_LIST, params: { 'keyword': keyword, 'page': currentPage, 'pageSize': pageSize });

    if(res['success']){
      list.addAll(res['result']['list']);
      // print('-----getPageList-------$list');
      return list;
    }else{
      return Future.error(res['msg']);
    }
  }
}