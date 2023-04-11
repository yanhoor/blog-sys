import 'package:blog_vipot/components/post/post_item.dart';
import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:flutter/cupertino.dart';

import 'package:blog_vipot/http/index.dart';
import 'package:blog_vipot/notifiers/base_list_fetch_notifier.dart';

class PostList extends StatefulWidget{
  final ScrollController scrollController;
  final Function(PostListNotifier model) onModelReady;

  const PostList({super.key, required this.scrollController, required this.onModelReady});

  @override
  State<PostList> createState() => _PostListState();
}

class _PostListState extends State<PostList>{
  @override
  Widget build(BuildContext context) {
    return ProviderWidget<PostListNotifier>(
        model: PostListNotifier(),
        onModelReady: (model){
          model.initScrollController(controller: widget.scrollController);
          model.initData();
          widget.onModelReady(model);
        },
        builder: (context, model, child){
          return ListView.builder(
              shrinkWrap: true,
              padding: const EdgeInsets.all(0),
              physics: const NeverScrollableScrollPhysics(), // 禁止滑动
              itemCount: model.pageList.length,
              itemBuilder: (context, index) {
                Map<String, dynamic> post = model.pageList[index];
                return PostItem(key: Key(post['id'].toString()), post: post, scrollController: model.scrollController);
              });
        }
    );
  }
}

class PostListNotifier extends BaseListFetchNotifier{
  @override
  Future<List> getPageList() async {
    List list = [];
    var res = await $http.fetch(ApiUrl.BLOG_LIST, params: { 'page': currentPage, 'pageSize': pageSize });
    list.addAll(res['result']['list']);
    return list;
  }
}