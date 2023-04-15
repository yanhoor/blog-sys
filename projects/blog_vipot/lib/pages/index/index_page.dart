import 'package:blog_vipot/components/skeleton/skeleton_post_list.dart';
import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:blog_vipot/components/post/post_item.dart';
import 'package:blog_vipot/components/state/state_request_error.dart';
import 'package:blog_vipot/components/state/state_request_empty.dart';
import '../home/home_notifier.dart';
import 'index_notifier.dart';

class IndexPage extends StatefulWidget{
  const IndexPage({super.key});

  @override
  State<IndexPage> createState() => _IndexPageState();
}

class _IndexPageState extends State<IndexPage> with AutomaticKeepAliveClientMixin{

  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return Scaffold(
      body: SafeArea(
        child: ProviderWidget<IndexNotifier>(
            model: IndexNotifier(),
            onModelReady: (model){
              model.initData();
              model.initScrollController(controller: ScrollController());
              Provider.of<HomeNotifier>(context).indexNotifier = model;
            },
            builder: (context, model, child){
              if (model.isInitializing) {
                return const SkeletonPostList();
              } else if (model.isEmpty) {
                return StateRequestEmpty(size: 60, onPressed: model.initData,);
              } else if (model.isError) {
                return StateRequestError(size: 60, onPressed: model.initData);
              } else {
                return RefreshConfiguration.copyAncestor(
                    context: context,
                    child: SmartRefresher(
                      controller: model.refreshController,
                      enablePullDown: true,
                      enablePullUp: true,
                      onRefresh: model.refreshData,
                      onLoading: model.handleLoadMore,
                      child: CustomScrollView(
                        controller: model.scrollController,
                        slivers: [
                          SliverToBoxAdapter(
                            child: Column(
                              children: [
                                ListView.builder(
                                    shrinkWrap: true,
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
                                          post = v;
                                          model.notifyListeners();
                                        },
                                      );
                                    })
                              ],
                            ),
                          )
                        ],
                      ),
                    ));
              }
            }
        ),
      ),
    );
  }

}