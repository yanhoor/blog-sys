import 'package:blog_vipot/components/comment/comment_filter_dropdown.dart';
import 'package:blog_vipot/components/no_shadow_scroll_behavior.dart';
import 'package:blog_vipot/components/post/post_item_dropdown.dart';
import 'package:blog_vipot/components/state/state_request_empty.dart';
import 'package:blog_vipot/components/state/state_request_error.dart';
import 'package:blog_vipot/components/user/user_item.dart';
import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:blog_vipot/pages/post/post_notifier.dart';
import 'package:blog_vipot/pages/post/post_skeleton.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:blog_vipot/components/expandable_content.dart';
import 'package:blog_vipot/components/user/user_avatar.dart';
import 'package:blog_vipot/components/user/user_name.dart';
import 'package:blog_vipot/utils/time_util.dart';
import 'package:blog_vipot/components/media/media_list.dart';
import 'package:blog_vipot/components/wrapper/sliver_app_bar_delegate.dart';
import 'package:blog_vipot/components/comment/comment_reply_modal.dart';

import '../../components/comment/comment_item.dart';
import '../../components/helper/bot_toast_helper.dart';
import '../../notifiers/global_notifier.dart';
import '../../route/route_name.dart';

class PostPage extends StatefulWidget{
  final String postId;
  const PostPage({super.key, required this.postId});

  @override
  State<PostPage> createState() => _PostPageState();
}

class _PostPageState extends State<PostPage> with AutomaticKeepAliveClientMixin{

  @override
  bool get wantKeepAlive => true;

  bool checkLoginStatus(){
    var myInfo = Provider.of<GlobalNotifier>(context, listen: false).myInfo;
    if(myInfo == null){
      ToastHelper.warning('请先登录');
      Navigator.of(context).pushNamed(RouteName.login);
      return false;
    }
    return true;
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return AnnotatedRegion<SystemUiOverlayStyle>(
        value: isDark ? SystemUiOverlayStyle.light : SystemUiOverlayStyle.dark,
        child: Scaffold(
          body: SafeArea(
            bottom: false,
            child: ProviderWidget<PostNotifier>(
                model: PostNotifier(postId: widget.postId),
                onModelReady: (model) {
                  model.initScrollController(controller: ScrollController());
                  model.initData();
                },
                builder: (context, model, child) {
                  List<Widget> slivers;
                  if (model.isInitializing) {
                    slivers = [
                      const SliverToBoxAdapter(
                        child: PostSkeleton(),
                      )
                    ];
                  } else if (model.isError) {
                    slivers = [
                      SliverToBoxAdapter(
                        child: StateRequestError(msg: model.stateErrorText, size: 60, onPressed: model.initData),
                      )
                    ];
                  }else{
                    slivers = [
                      SliverToBoxAdapter(
                        child: Card(
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5)),
                          child: Container(
                            padding: const EdgeInsets.all(10),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.start,
                                  children: [
                                    UserAvatar(user: model.postDetail['createBy']),
                                    const SizedBox(width: 6,),
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        UserName(user: model.postDetail['createBy']),
                                        Text(TimeUtil.toLocalTime(model.postDetail['createdAt']), style: TextStyle(color: Theme.of(context).hintColor, fontSize: 12),)
                                      ],
                                    )
                                  ],
                                ),
                                const SizedBox(height: 6,),
                                ExpandableContent(content: model.postDetail['content'], scrollController: model.scrollController!),
                                const SizedBox(height: 6,),
                                MediaList(mediaList: model.postDetail['medias'], maxCount: -1,),
                                const SizedBox(height: 6,),
                                Row(
                                  children: [
                                    Expanded(
                                        child: RawMaterialButton(
                                          onPressed: (){
                                            if(!checkLoginStatus()) return;

                                            model.handleLikePost();
                                          },
                                          child: Icon(
                                            model.postDetail['isLike']
                                                ? Icons.thumb_up_alt
                                                : Icons.thumb_up_alt_outlined,
                                            size: 18,
                                            color: model.postDetail['isLike'] ? Theme.of(context).colorScheme.primary : null,
                                          ),
                                        )),
                                    Expanded(
                                        child: RawMaterialButton(
                                          onPressed: () {
                                            showCommentReplyBottomSheet(
                                                pageContext: context,
                                                postId: model.postDetail['id'].toString(),
                                                onSuccess: (){
                                                  model.refreshData();
                                                }
                                            );
                                          },
                                          child: const Icon(
                                            Icons.messenger_outline,
                                            size: 18,
                                          ),
                                        )),
                                    Expanded(
                                        child: RawMaterialButton(
                                          onPressed: (){
                                            if(!checkLoginStatus()) return;

                                            model.handleCollectPost();
                                          },
                                          child: Icon(
                                            model.postDetail['isCollect']
                                                ? Icons.favorite
                                                : Icons.favorite_border,
                                            size: 18,
                                            color: model.postDetail['isCollect'] ? Theme.of(context).colorScheme.primary : null,
                                          ),
                                        )
                                    ),
                                    Expanded(
                                        child: PostItemDropdown(
                                          trigger: const Icon(Icons.more_horiz),
                                          post: model.postDetail,
                                          onDelete: (){
                                            Navigator.of(context).pop();
                                          },
                                        )
                                    )
                                  ],
                                )
                              ],
                            ),
                          ),
                        ),
                      ),
                      SliverPersistentHeader(
                          pinned: true,
                          floating: true,
                          delegate: SliverAppBarDelegate(
                              maxHeight: 40,
                              minHeight: 40,
                              child: Card(
                                shape: const RoundedRectangleBorder(borderRadius: BorderRadius.only(topLeft: Radius.circular(5), topRight: Radius.circular(5)), side: BorderSide.none),
                                margin: const EdgeInsets.only(bottom: 0, left: 5, right: 5),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 0),
                                  child: Row(
                                    children: [
                                      GestureDetector(
                                        onTap: (){
                                          if(model.currentTab == 1) return;

                                          model.currentTab = 1;
                                          model.pageList.clear();
                                          model.notifyListeners();
                                          model.refreshData();
                                        },
                                        child: CommentFilterDropdown(
                                          value: model.commentSortType,
                                          enabled: model.currentTab == 1,
                                          onSelected: (int value) {
                                            if(model.commentSortType == value) return;

                                            model.commentSortType = value;
                                            model.refreshData();
                                          },
                                          trigger: Row(
                                            crossAxisAlignment: CrossAxisAlignment.center,
                                            children: [
                                              if(model.commentSortType == 1) Icon(Icons.timer_outlined, size: 18, color: model.currentTab == 1 ? Theme.of(context).colorScheme.primary : null),
                                              if(model.commentSortType == 2) Icon(Icons.thermostat_outlined, size: 18, color: model.currentTab == 1 ? Theme.of(context).colorScheme.primary : null),
                                              const SizedBox(width: 4,),
                                              Text('评论 ${model.postDetail['commentsCount']}', style: TextStyle(fontSize: 14, color: model.currentTab == 1 ? Theme.of(context).colorScheme.primary : null),)
                                            ],
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 10,),
                                      GestureDetector(
                                        onTap: (){
                                          if(model.currentTab == 2) return;

                                          model.currentTab = 2;
                                          model.pageList.clear();
                                          model.notifyListeners();
                                          model.refreshData();
                                        },
                                        child: Text('点赞 ${model.postDetail['likedByCount']}', style: TextStyle(fontSize: 14, color: model.currentTab == 2 ? Theme.of(context).colorScheme.primary : null)),
                                      ),
                                      const SizedBox(width: 10,),
                                      GestureDetector(
                                        onTap: (){
                                          if(model.currentTab == 3) return;

                                          model.currentTab = 3;
                                          model.refreshData();
                                        },
                                        child: Text('收藏 ${model.postDetail['collectedByCount']}', style: TextStyle(fontSize: 14, color: model.currentTab == 3 ? Theme.of(context).colorScheme.primary : null)),
                                      ),
                                    ],
                                  ),
                                ),
                              )
                          )
                      ),
                      // SliverAnimatedList(
                      //   initialItemCount: 150,
                      //   itemBuilder: (_, index, __){
                      //     return const ListTile(
                      //       title: Text('内容'),
                      //     );
                      //   },
                      // ),
                      SliverToBoxAdapter(
                        child: Card(
                          shape: const RoundedRectangleBorder(borderRadius: BorderRadius.only(bottomLeft: Radius.circular(5), bottomRight: Radius.circular(5)), side: BorderSide.none),
                          margin: const EdgeInsets.only(top: 0, left: 5, right: 5),
                          child: Container(
                            padding: const EdgeInsets.all(10),
                            child: model.pageList.isNotEmpty ? ListView.separated(
                              padding: const EdgeInsets.all(0),
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              separatorBuilder: (_, index){
                                return const Divider();
                              },
                              itemCount: model.pageList.length,
                              itemBuilder: (context, index){

                                Widget result;

                                switch(model.currentTab){
                                  case 2:
                                  case 3:
                                    Map<String, dynamic> user = model.pageList[index];
                                    result = UserItem(user: user);
                                    break;
                                  default:
                                    Map<String, dynamic> comment = model.pageList[index];
                                    result = CommentItem(
                                        key: ValueKey<int>(comment['id']),
                                        comment: comment,
                                        onReplySuccess: (){
                                          model.refreshData();
                                        },
                                        onDelete: (){
                                          model.pageList.removeAt(index);
                                          model.notifyListeners();
                                        },
                                        scrollController: model.scrollController!
                                    );
                                }

                                return result;
                              },
                            ) : StateRequestEmpty(onPressed: model.refreshData,),
                          ),
                        ),
                      )
                    ];
                  }

                  return ScrollConfiguration(
                      behavior: NoShadowScrollBehavior(),
                      child: RefreshConfiguration.copyAncestor(
                        context: context,
                        child:  SmartRefresher(
                          controller: model.refreshController,
                          enablePullDown: true,
                          enablePullUp: true,
                          onRefresh: model.refreshData,
                          onLoading: model.handleLoadMore,
                          child: CustomScrollView(
                            controller: model.scrollController,
                            slivers: slivers,
                          ),
                        ),
                      )
                  );
                }
            ),
          ),
        )
    );
  }
}