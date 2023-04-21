import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:blog_vipot/components/post/post_item.dart';
import 'package:blog_vipot/components/skeleton/skeleton_post_list.dart';
import 'package:blog_vipot/components/state/state_request_empty.dart';
import 'package:blog_vipot/components/state/state_request_error.dart';
import 'package:blog_vipot/notifiers/base_list_fetch_notifier.dart';

class PostList extends StatefulWidget{
  final BaseListFetchNotifier model;

  const PostList({super.key, required this.model});

  @override
  State<PostList> createState() => _PostListState();
}

class _PostListState extends State<PostList>{
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: ChangeNotifierProvider.value(
          value: widget.model,
          child: Consumer<BaseListFetchNotifier>(
            builder: (_, model, child){
              Widget content;
              if (model.isInitializing) {
                content = const SkeletonPostList();
              } else if (model.isEmpty) {
                content = StateRequestEmpty(size: 60, onPressed: model.initData,);
              } else if (model.isError) {
                content = StateRequestError(size: 60, onPressed: model.initData);
              } else {
                content = ListView.builder(
                    shrinkWrap: true,
                    // primary: false,
                    controller: model.scrollController,
                    padding: const EdgeInsets.all(0),
                    // physics: const NeverScrollableScrollPhysics(), // 禁止滑动
                    itemCount: model.pageList.length,
                    itemBuilder: (context, index) {
                      Map<String, dynamic> post = model.pageList[index];
                      return PostItem(
                        key: Key(post['id'].toString()),
                        post: post,
                        scrollController: model.scrollController!,
                        onUpdatePost: (v){
                          post = v;
                          model.notifyListeners();
                        },
                      );
                    });
              }

              return RefreshConfiguration.copyAncestor(
                  context: context,
                  child: SmartRefresher(
                    controller: model.refreshController,
                    enablePullDown: true,
                    enablePullUp: true,
                    onRefresh: model.refreshData,
                    onLoading: model.handleLoadMore,
                    child: content,
                  )
              );
            },
          ),
        ),
      ),
    );
  }
}