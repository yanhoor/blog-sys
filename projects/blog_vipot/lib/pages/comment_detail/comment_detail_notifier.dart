import 'package:blog_vipot/notifiers/base_list_fetch_notifier.dart';

import '../../http/index.dart';

class CommentDetailNotifier extends BaseListFetchNotifier{
  final String commentId;
  late Map<String, dynamic> _topComment;

  CommentDetailNotifier({required this.commentId});

  @override
  Future<List> getPageList() async{
    List list = [];
    var res = await $http.fetch(ApiUrl.COMMENT_REPLY_LIST, params: { 'topCommentId': commentId, 'page': currentPage, 'pageSize': pageSize });
    if(res['success']){
      list.addAll(res['result']['list']);
      topComment = res['result']['topComment'];
      // print('-----getPageList-------$list');
      return list;
    }else{
      return Future.error(res['msg']);
    }
  }

  Map<String, dynamic> get topComment => _topComment;

  set topComment(Map<String, dynamic> value) {
    _topComment = value;
  }
}