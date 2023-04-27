import 'package:blog_vipot/components/no_shadow_scroll_behavior.dart';
import 'package:blog_vipot/components/skeleton/skeleton_user_list.dart';
import 'package:blog_vipot/components/user/user_item.dart';
import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:blog_vipot/components/y-card.dart';
import 'package:blog_vipot/pages/user_followings/user_followings_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:blog_vipot/components/state/state_request_empty.dart';
import 'package:blog_vipot/components/state/state_request_error.dart';

class UserFollowingsPage extends StatefulWidget{
  final String userId;

  const UserFollowingsPage({super.key, required this.userId});

  @override
  State<UserFollowingsPage> createState() => _UserFollowingsPageState();
}

class _UserFollowingsPageState extends State<UserFollowingsPage>{
  @override
  Widget build(BuildContext context) {
    return ProviderWidget<UserFollowingsNotifier>(
      model: UserFollowingsNotifier(userId: widget.userId),
      onModelReady: (model){
        model.initData();
        model.initScrollController(controller: ScrollController());
      },
      builder: (_, model, child){
        Widget content;
        if (model.isInitializing) {
          content = const SkeletonUserList();
        } else if (model.isEmpty) {
          content = StateRequestEmpty(size: 60, onPressed: model.initData,);
        } else if (model.isError) {
          content = StateRequestError(size: 60, onPressed: model.initData, msg: model.stateErrorText,);
        } else {
          content = YCard(child: ListView.builder(
              shrinkWrap: true,
              // primary: false,
              controller: model.scrollController,
              padding: const EdgeInsets.all(0),
              physics: const NeverScrollableScrollPhysics(), // 禁止滑动
              itemCount: model.pageList.length,
              itemBuilder: (context, index) {
                Map<String, dynamic> user = model.pageList[index];
                return UserItem(user: user);
              })
          );
        }

        return Scaffold(
          appBar: AppBar(
            title: Text(model.followingsTotal > 0 ? '全部关注(${model.followingsTotal})' : '全部关注'),
          ),
          body: SafeArea(
            bottom: false,
            child: ScrollConfiguration(
              behavior: NoShadowScrollBehavior(),
              child: RefreshConfiguration.copyAncestor(
                  context: context,
                  child: SmartRefresher(
                    controller: model.refreshController,
                    enablePullDown: true,
                    enablePullUp: true,
                    onRefresh: model.refreshData,
                    onLoading: model.handleLoadMore,
                    child: SingleChildScrollView(
                      child: content,
                    ),
                  )
              ),
            ),
          ),
        );
      },
    );
  }
}