import 'package:blog_vipot/notifiers/base_list_fetch_notifier.dart';

import 'package:blog_vipot/http/index.dart';

import '../../components/post/post_list_filter_dropdown.dart';
import '../../storage/storage_manager.dart';

class SearchResultNotifier extends BaseListFetchNotifier{
  String keyword;
  PostSearchParams searchParams = PostSearchParams();

  SearchResultNotifier({required this.keyword});

  setKeyword(String v){
    keyword = v.trim();
    List<String> historyList = MyStorageManager.sharedPreferences.getStringList(MyStorageManager.SEARCH_HISTORY) ?? [];
    historyList.remove(keyword);
    historyList.insert(0, keyword);
    MyStorageManager.sharedPreferences.setStringList(MyStorageManager.SEARCH_HISTORY, historyList);
  }

  @override
  Future<List> getPageList() async{
    List list = [];
    var res = await $http.fetch(ApiUrl.BLOG_LIST, params: { 'keyword': keyword, 'page': currentPage, 'pageSize': pageSize, ...searchParams.toMap() });

    if(res['success']){
      list.addAll(res['result']['list']);
      // print('-----getPageList-------$list');
      return list;
    }else{
      return Future.error(res['msg']);
    }
  }
}