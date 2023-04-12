import 'package:blog_vipot/notifiers/base_fetch_notifier.dart';
import 'package:blog_vipot/notifiers/base_list_fetch_notifier.dart';

import '../../http/index.dart';

class PostNotifier extends BaseListFetchNotifier{
  final String postId;
  int _currentTab = 1;
  late Map<String, dynamic> postDetail;

  PostNotifier({required this.postId});

  @override
  Future<List> getPageList() async{
    List list = [];
    switch(currentTab){
      case 1:
        list = await getCommentList();
        break;
      case 2:
        list = await getLikeUserList();
        break;
      case 3:
        list = await getCollectUserList();
        break;
    }
    return list;
  }

  @override
  Future getOtherData() async{
    var res = await $http.fetch(ApiUrl.BLOG_INFO, params: { 'id':  postId});
    postDetail = res['result'];
    notifyListeners();
  }

  Future<List> getCommentList() async{
    List list = [];
    var res = await $http.fetch(ApiUrl.COMMENT_LIST, params: { 'blogId': postId, 'page': currentPage, 'pageSize': pageSize });
    list.addAll(res['result']['list']);
    return list;
  }

  Future<List> getLikeUserList() async{
    List list = [];
    var res = await $http.fetch('${ApiUrl.BLOG_ACTION_USER}/1', params: { 'blogId': postId, 'page': currentPage, 'pageSize': pageSize });
    list.addAll(res['result']['list']);
    return list;
  }

  Future<List> getCollectUserList() async{
    List list = [];
    var res = await $http.fetch('${ApiUrl.BLOG_ACTION_USER}/2', params: { 'blogId': postId, 'page': currentPage, 'pageSize': pageSize });
    list.addAll(res['result']['list']);
    return list;
  }

  handleLikePost() async{
    try{
      var res = await $http.fetch(ApiUrl.BLOG_LIKE, params: { 'id':  postDetail['id'], 'isLike': postDetail['isLike'] ? 0 : 1 });
      if(res['success']){
        refreshData();
      }
    }catch(e){
      // print('=========${jsonEncode(e)}');
    }
  }

  handleCollectPost() async{
    try{
      var res = await $http.fetch(ApiUrl.BLOG_COLLECT, params: { 'id':  postDetail['id'], 'isCollect': postDetail['isCollect'] ? 0 : 1 });
      if(res['success']){
        refreshData();
      }
    }catch(e){
      // print('=========${jsonEncode(e)}');
    }
  }

  int get currentTab => _currentTab;

  set currentTab(int value) {
    _currentTab = value;
    notifyListeners();
  }
}