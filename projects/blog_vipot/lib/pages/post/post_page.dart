import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:blog_vipot/pages/post/post_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:blog_vipot/components/expandable_content.dart';
import 'package:blog_vipot/components/user/user_avatar.dart';
import 'package:blog_vipot/components/user/user_name.dart';
import 'package:blog_vipot/utils/time_util.dart';
import 'package:blog_vipot/components/media/media_list.dart';

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
      body: ProviderWidget<PostNotifier>(
          model: PostNotifier(postId: widget.postId),
          onModelReady: (model) {
            model.initScrollController(controller: ScrollController());
            model.initData();
          },
          builder: (context, model, child) {
            if (model.isInitializing) {
              return Column(
                children: [
                  const Text('initializing'),
                  ElevatedButton(onPressed: (){
                    // print('========${controller.pageList.length}=====${controller.isMore}=====');
                  }, child: const Text('test'))
                ],
              );
            } else if (model.isError) {
              return Column(
                children: [
                  const Text('error'),
                  ElevatedButton(onPressed: (){
                    model.refreshData();
                  }, child: const Text('refresh'))
                ],
              );
            }else{
              return SafeArea(
                child: RefreshConfiguration.copyAncestor(
                  context: context,
                  child:  SmartRefresher(
                    controller: model.refreshController,
                    enablePullDown: true,
                    onRefresh: model.refreshData,
                    child: ListView(
                      children: [
                        Card(
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
                                MediaList(mediaList: model.postDetail['medias'].map((m) => m['file']).toList(), maxCount: -1,)
                              ],
                            ),
                          ),
                        )
                      ],
                    ),
                  ),
                ),
              );
            }
          }
      ),
    );
  }
}