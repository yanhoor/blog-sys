import 'package:blog_vipot/components/state/state_request_empty.dart';
import 'package:blog_vipot/components/state/state_request_error.dart';
import 'package:blog_vipot/components/user/user_item.dart';
import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:blog_vipot/pages/post/post_comment_item.dart';
import 'package:blog_vipot/pages/post/post_notifier.dart';
import 'package:blog_vipot/pages/post/post_skeleton.dart';
import 'package:flutter/material.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:blog_vipot/components/expandable_content.dart';
import 'package:blog_vipot/components/user/user_avatar.dart';
import 'package:blog_vipot/components/user/user_name.dart';
import 'package:blog_vipot/utils/time_util.dart';
import 'package:blog_vipot/components/media/media_list.dart';
import 'package:blog_vipot/components/wrapper/sliverAppBarDelegate.dart';

import '../../components/comment/comment_reply_modal.dart';

class PostPage extends StatefulWidget{
  final String postId;
  const PostPage({super.key, required this.postId});

  @override
  State<PostPage> createState() => _PostPageState();
}

class _PostPageState extends State<PostPage> with AutomaticKeepAliveClientMixin{

  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);

    return Scaffold(
      body: SafeArea(
        child: ProviderWidget<PostNotifier>(
            model: PostNotifier(postId: widget.postId),
            onModelReady: (model) {
              model.initScrollController(controller: ScrollController());
              model.initData();
            },
            builder: (context, model, child) {
              if (model.isInitializing) {
                return const PostSkeleton();
              } else if (model.isError) {
                return StateRequestError(size: 60, onPressed: model.initData);
              }else{
                return RefreshConfiguration.copyAncestor(
                  context: context,
                  child:  SmartRefresher(
                    controller: model.refreshController,
                    enablePullDown: true,
                    enablePullUp: true,
                    onRefresh: model.refreshData,
                    onLoading: model.handleLoadMore,
                    child: CustomScrollView(
                      controller: model.scrollController,
                      slivers: [
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
                                          Text(TimeUtil.formatTime(model.postDetail['createdAt']), style: TextStyle(color: Theme.of(context).hintColor),)
                                        ],
                                      )
                                    ],
                                  ),
                                  const SizedBox(height: 6,),
                                  ExpandableContent(content: model.postDetail['content'], scrollController: model.scrollController),
                                  const SizedBox(height: 6,),
                                  MediaList(mediaList: model.postDetail['medias'].map((m) => m['file']).toList(), maxCount: -1,),
                                  const SizedBox(height: 6,),
                                  Row(
                                    children: [
                                      Expanded(
                                          child: RawMaterialButton(
                                            onPressed: model.handleLikePost,
                                            child: Icon(
                                              model.postDetail['isLike']
                                                  ? Icons.thumb_up_alt
                                                  : Icons.thumb_up_alt_outlined,
                                              size: 18,
                                              color: model.postDetail['isLike'] ? Theme.of(context).primaryColor : null,
                                            ),
                                          )),
                                      Expanded(
                                          child: RawMaterialButton(
                                            onPressed: () {
                                              showCommentReplyBottomSheet(
                                                  pageContext: context,
                                                  postId: model.postDetail['id'].toString(),
                                                  onSuccess: (ctx){
                                                    Navigator.pop(ctx);
                                                    model.refreshData();
                                                  }
                                              );
                                            },
                                            child: const Icon(
                                              Icons.messenger,
                                              size: 18,
                                            ),
                                          )),
                                      Expanded(
                                          child: RawMaterialButton(
                                            onPressed: model.handleCollectPost,
                                            child: Icon(
                                              model.postDetail['isCollect']
                                                  ? Icons.favorite
                                                  : Icons.favorite_border,
                                              size: 18,
                                              color: model.postDetail['isCollect'] ? Theme.of(context).primaryColor : null,
                                            ),
                                          ))
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
                                            model.refreshData();
                                          },
                                          child: Text('评论 ${model.postDetail['commentsCount']}', style: TextStyle(fontSize: 12, color: model.currentTab == 1 ? Theme.of(context).colorScheme.primary : null),),
                                        ),
                                        const SizedBox(width: 10,),
                                        GestureDetector(
                                          onTap: (){
                                            if(model.currentTab == 2) return;

                                            model.currentTab = 2;
                                            model.refreshData();
                                          },
                                          child: Text('点赞 ${model.postDetail['likedByCount']}', style: TextStyle(fontSize: 12, color: model.currentTab == 2 ? Theme.of(context).colorScheme.primary : null)),
                                        ),
                                        const SizedBox(width: 10,),
                                        GestureDetector(
                                          onTap: (){
                                            if(model.currentTab == 3) return;

                                            model.currentTab = 3;
                                            model.refreshData();
                                          },
                                          child: Text('收藏 ${model.postDetail['collectedByCount']}', style: TextStyle(fontSize: 12, color: model.currentTab == 3 ? Theme.of(context).colorScheme.primary : null)),
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
                              child: model.pageList.isNotEmpty ? ListView.builder(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
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
                                      result = PostCommentItem(
                                          post: model.postDetail,
                                          comment: comment,
                                          index: index,
                                          total: model.pageList.length,
                                          onSuccess: (ctx){
                                            Navigator.pop(ctx);
                                            model.refreshData();
                                          },
                                          scrollController: model.scrollController
                                      );
                                  }

                                  return result;
                                },
                              ) : StateRequestEmpty(onPressed: model.refreshData,),
                            ),
                          ),
                        )
                      ],
                    ),
                  ),
                );
              }
            }
        ),
      ),
    );
  }
}