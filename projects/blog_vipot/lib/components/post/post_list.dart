import 'package:blog_vipot/components/no_shadow_scroll_behavior.dart';
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
  final bool needRefresh;

  const PostList({super.key, required this.model, this.needRefresh = false});

  @override
  State<PostList> createState() => _PostListState();
}

class _PostListState extends State<PostList> with AutomaticKeepAliveClientMixin{

  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);

    return Scaffold(
      body: ChangeNotifierProvider.value(
        value: widget.model,
        child: Consumer<BaseListFetchNotifier>(
          builder: (_, model, child){
            Widget content;
            if (model.isInitializing) {
              content = const SkeletonPostList();
            } else if (model.isEmpty) {
              content = StateRequestEmpty(size: 60, onPressed: model.initData,);
            } else if (model.isError) {
              content = StateRequestError(size: 60, onPressed: model.initData, msg: model.stateErrorText,);
            } else {
              debugPrint('========_PostListState==${model.scrollController}======');
              content = ListView.builder(
                  shrinkWrap: true,
                  // primary: false,
                  // controller: model.scrollController,
                  padding: const EdgeInsets.all(0),
                  physics: const NeverScrollableScrollPhysics(), // 禁止滑动
                  itemCount: model.pageList.length,
                  itemBuilder: (context, index) {
                    Map<String, dynamic> post = model.pageList[index];
                    return PostItem(
                      key: Key(post['id'].toString()),
                      post: post,
                      scrollController: model.scrollController!,
                      onUpdatePost: (v){
                        if(widget.needRefresh){
                          model.refreshData();
                        }else{
                          post = v;
                          model.notifyListeners();
                        }
                      },
                      onDelete: (){
                        model.pageList.removeWhere((p) => p['id'] == post['id']);
                        model.notifyListeners();
                      },
                    );
                  });
            }

            return ScrollConfiguration(
                behavior: NoShadowScrollBehavior(),
                child: RefreshConfiguration.copyAncestor(
                    context: context,
                    child: SmartRefresher(
                      controller: model.refreshController,
                      enablePullDown: true,
                      enablePullUp: true,
                      onRefresh: model.refreshData,
                      onLoading: model.handleLoadMore,
                      // todo: 用 SingleChildScrollView 会导致首页获取不到滚动位置，offset 一直是 0
                      // 只用 ListView 的话，上下滑动时内部的 SelectableText.rich 会跳动
                      child: ListView(
                        controller: model.scrollController,
                        children: [
                          content
                        ],
                      ),
                    )
                )
            );
          },
        ),
      ),
    );
  }
}