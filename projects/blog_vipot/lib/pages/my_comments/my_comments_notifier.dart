import 'package:blog_vipot/components/helper/bot_toast_helper.dart';
import 'package:blog_vipot/notifiers/base_list_fetch_notifier.dart';

import 'package:blog_vipot/http/index.dart';

class MyCommentsNotifier extends BaseListFetchNotifier{
  int total = 0;

  @override
  Future<List> getPageList() async{
    List list = [];
    try{
      var res = await $http.fetch(ApiUrl.USER_MY_COMMENT_LIST, params: { 'page': currentPage, 'pageSize': pageSize });

      if(res['success']){
        list.addAll(res['result']['list']);
        total = res['result']['total'];
        // print('-----getPageList-------$list');
        return list;
      }else{
        return Future.error(res['msg']);
      }
    }catch(e){
      return Future.error(e.toString());
    }
  }

  handleDeleteComment(String id) async{
    try{
      var res = await $http.fetch(ApiUrl.COMMENT_DELETE, params: { 'id': id });

      if(res['success']){
        ToastHelper.success('已删除');
        refreshData();
      }else{
        ToastHelper.error(res['msg'] ?? '操作失败');
        return Future.error(res['msg']);
      }
    }catch(e){
      return Future.error(e.toString());
    }
  }
}