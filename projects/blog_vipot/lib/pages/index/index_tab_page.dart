import 'package:blog_vipot/components/skeleton/skeleton_post_list.dart';
import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:blog_vipot/notifiers/global_notifier.dart';
import 'package:blog_vipot/route/route_name.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:blog_vipot/components/post/post_item.dart';
import 'package:blog_vipot/components/state/state_request_error.dart';
import 'package:blog_vipot/components/state/state_request_empty.dart';
import 'index_notifier.dart';

class IndexTabPage extends StatefulWidget{
  final String gid;
  final Function(IndexNotifier model) onModelReady;

  IndexTabPage({super.key, required this.gid, required this.onModelReady}){
    print('--------IndexTabPage--------$key');
  }

  @override
  State<IndexTabPage> createState() => _IndexTabPageState();
}

class _IndexTabPageState extends State<IndexTabPage> with AutomaticKeepAliveClientMixin{

  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Consumer<GlobalNotifier>(
      builder: (_, globalNotifier, child){
        return ProviderWidget<IndexNotifier>(
          model: IndexNotifier(groupId: widget.gid),
          onModelReady: (model){
            model.initData();
            model.initScrollController(controller: ScrollController());
            widget.onModelReady(model);
          },
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

            return SafeArea(
              child: Stack(
                children: [
                  Column(
                    children: [
                      Expanded(
                          child: RefreshConfiguration.copyAncestor(
                              context: context,
                              child: SmartRefresher(
                                controller: model.refreshController,
                                enablePullDown: true,
                                enablePullUp: true,
                                onRefresh: model.refreshData,
                                onLoading: model.handleLoadMore,
                                child: content,
                              )
                          )
                      )
                    ],
                  )
                ],
              ),
            );
          },
        );
      },
    );
  }

}