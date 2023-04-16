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
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: ProviderWidget2<GlobalNotifier, IndexNotifier>(
        model1: context.read<GlobalNotifier>(),
        model2: IndexNotifier(),
        onModelReady: (_, model){
          model.initData();
          model.initScrollController(controller: ScrollController());
          Provider.of<GlobalNotifier>(context, listen: false).indexNotifier = model;
        },
        builder: (_, globalNotifier, model, child){
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
                              child: SingleChildScrollView(
                                controller: model.scrollController,
                                child: content,
                              ),
                            ))
                    )
                  ],
                ),
                if(globalNotifier.myInfo != null) Align(
                  alignment: Alignment.bottomCenter,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    margin: const EdgeInsets.only(bottom: 12),
                    constraints: BoxConstraints(
                        maxWidth: MediaQuery.of(context).size.width * 0.8
                    ),
                    decoration: BoxDecoration(
                        color: isDark ? const Color.fromRGBO(100, 100, 100, 0.8) : const Color.fromRGBO(240, 240, 240, 0.8),
                        borderRadius: const BorderRadius.all(Radius.circular(20))
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Expanded(
                            child: SingleChildScrollView(
                              scrollDirection: Axis.horizontal,
                              child: Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
                                    child: GestureDetector(
                                      onTap: (){
                                        if(model.groupId.isEmpty) return;

                                        model.groupId = '';
                                        model.refreshController.requestRefresh(needMove: false);
                                      },
                                      child: Text('全部关注', style: TextStyle(color: (model.groupId.isEmpty) ? Theme.of(context).primaryColor : null, fontSize: 16),),
                                    ),
                                  ),
                                  ...globalNotifier.allGroupList.map((g) => Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
                                    child: GestureDetector(
                                      onTap: (){
                                        if(model.groupId == g['id'].toString()) return;

                                        model.groupId = g['id'].toString();
                                        model.refreshController.requestRefresh(needMove: false);
                                      },
                                      child: Text(g['name'], style: TextStyle(color: model.groupId == g['id'].toString() ? Theme.of(context).primaryColor : null, fontSize: 16)),
                                    ),
                                  )).toList()
                                ],
                              ),
                            )
                        ),
                        const SizedBox(width: 6,),
                        IconButton(
                          constraints: const BoxConstraints(
                            minHeight: 0,
                            minWidth: 0
                          ),
                          padding: const EdgeInsets.all(0),
                          onPressed: (){
                            Navigator.of(context).pushNamed(RouteName.groupManage);
                          },
                          icon: const Icon(Icons.list),
                        )
                      ],
                    ),
                  ),
                )
              ],
            ),
          );
        },
      ),
    );
  }

}