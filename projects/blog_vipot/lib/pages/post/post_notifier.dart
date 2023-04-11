import 'package:blog_vipot/notifiers/base_fetch_notifier.dart';

import '../../http/index.dart';

class PostNotifier extends BaseFetchNotifier{
  final String postId;
  late Map<String, dynamic> postDetail;

  PostNotifier({required this.postId});

  @override
  Future getData() async{
    var res = await $http.fetch(ApiUrl.BLOG_INFO, params: { 'id':  postId});
    postDetail = res['result'];
    notifyListeners();
  }
}