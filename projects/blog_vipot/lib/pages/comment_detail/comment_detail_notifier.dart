import 'package:blog_vipot/notifiers/base_list_fetch_notifier.dart';

import '../../http/index.dart';

class CommentDetailNotifier extends BaseListFetchNotifier{
  final String commentId;
  int replyTotal = 0;
  late Map<String, dynamic> _topComment;
  int _commentSortType = 1; // 评论排序，1--时间降序，2--热度降序

  CommentDetailNotifier({required this.commentId});

  @override
  Future<List> getPageList() async{
    List list = [];
    try{
      var res = await $http.fetch(ApiUrl.COMMENT_REPLY_LIST, params: { 'topCommentId': commentId, 'sort': commentSortType, 'page': currentPage, 'pageSize': pageSize });
      if(res['success']){
        list.addAll(res['result']['list']);
        replyTotal = res['result']['total'];
        topComment = res['result']['topComment'];
        // print('-----getPageList-------$list');
        return list;
      }else{
        return Future.error(res['msg']);
      }
    }catch(e){
      return Future.error(e.toString());
    }
  }

  Map<String, dynamic> get topComment => _topComment;

  set topComment(Map<String, dynamic> value) {
    _topComment = value;
  }

  int get commentSortType => _commentSortType;

  set commentSortType(int value) {
    _commentSortType = value;
    notifyListeners();
  }
}