import 'package:blog_vipot/components/custom/custom_icon_button.dart';
import 'package:blog_vipot/components/expandable_content.dart';
import 'package:blog_vipot/components/helper/dialog_helper.dart';
import 'package:blog_vipot/components/user/user_name.dart';
import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:blog_vipot/pages/my_comments/my_comments_notifier.dart';
import 'package:blog_vipot/utils/time_util.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

import '../../components/skeleton/skeleton_activity_common_list.dart';
import '../../components/state/state_request_empty.dart';
import '../../components/state/state_request_error.dart';
import '../../route/route_name.dart';

class MyCommentsPage extends StatefulWidget{
  const MyCommentsPage({super.key});


  @override
  State<MyCommentsPage> createState() => _MyCommentsPageState();
}

class _MyCommentsPageState extends State<MyCommentsPage>{
  @override
  Widget build(BuildContext context) {
    return ProviderWidget<MyCommentsNotifier>(
      model: MyCommentsNotifier(),
      onModelReady: (model){
        model.initData();
        model.initScrollController(controller: ScrollController());
      },
      builder: (_, model, child){
        Widget content;
        if (model.isInitializing) {
          content = const SkeletonActivityCommonList();
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
                Map<String, dynamic> comment = model.pageList[index];
                return Card(
                  key: ValueKey(comment['id']),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if(comment['replyTo'] == null) const Text('我评论了：')
                        else Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            const Text('我回复了'),
                            const SizedBox(width: 2,),
                            UserName(user: comment['replyTo'], showAt: true),
                            const SizedBox(width: 2,),
                            const Text('的评论：'),
                          ],
                        ),
                        const SizedBox(height: 8,),
                        ExpandableContent(
                            content: comment['content'] ?? '',
                            imageUrl: comment['image'] == null ? null : comment['image']['url'],
                            scrollController: model.scrollController!
                        ),
                        const SizedBox(height: 4,),
                        GestureDetector(
                          onTap: () {
                            Navigator.of(context).pushNamed(RouteName.post,
                                arguments: {'postId': comment['blog']['id']});
                          },
                          child: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                                color: Theme.of(context).scaffoldBackgroundColor,
                                borderRadius: BorderRadius.circular(5)),
                            child: ExpandableContent(content: comment['blog']['content'], scrollController: model.scrollController!, isSelectable: false,),
                          ),
                        ),
                        const SizedBox(height: 4,),
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(TimeUtil.formatTime(comment['createdAt'])),
                            CustomIconButton(
                                onPressed: (){
                                  DialogHelper.showIOSAlertDialog(
                                      context: context,
                                      message: '确定删除该评论吗？评论下的所有回复也会被删除',
                                      confirmBtnColor: Colors.red,
                                      confirmBtnText: '删除',
                                      onConfirm: () async{
                                        model.handleDeleteComment(comment['id'].toString());
                                      }
                                  );
                                },
                                icon: const Icon(Icons.delete_outline, size: 18,)
                            )
                          ],
                        )
                      ],
                    ),
                  ),
                );
              });
        }

        return Scaffold(
          appBar: AppBar(
            title: Text(model.total > 0 ? '我的评论(${model.total})' : '我的评论'),
          ),
          body: SafeArea(
            bottom: false,
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
            ),
          ),
        );
      },
    );
  }
}