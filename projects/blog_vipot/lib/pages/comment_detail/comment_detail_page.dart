import 'package:blog_vipot/pages/comment_detail/comment_detail_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

import '../../components/comment/comment_reply_modal.dart';
import '../../components/expandable_content.dart';
import '../../components/user/user_avatar.dart';
import '../../components/user/user_name.dart';
import '../../components/wrapper/provider_wrapper.dart';
import '../../utils/time_util.dart';

class CommentDetailPage extends StatefulWidget {
  final String commentId;

  const CommentDetailPage({super.key, required this.commentId});

  @override
  State<CommentDetailPage> createState() => _CommentDetailPageState();
}

class _CommentDetailPageState extends State<CommentDetailPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: SafeArea(
          child: ProviderWidget<CommentDetailNotifier>(
              model: CommentDetailNotifier(commentId: widget.commentId),
              onModelReady: (model) {
                model.initData();
                model.initScrollController(controller: ScrollController());
              },
              builder: (context, model, child) {
                if (model.isInitializing) {
                  return Column(
                    children: [
                      const Text('initializing'),
                      ElevatedButton(
                          onPressed: () {
                            // print('========${controller.pageList.length}=====${controller.isMore}=====');
                          },
                          child: const Text('test'))
                    ],
                  );
                } else if (model.isError) {
                  return Column(
                    children: [
                      const Text('error'),
                      ElevatedButton(
                          onPressed: () {
                            model.refreshData();
                          },
                          child: const Text('refresh'))
                    ],
                  );
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
                              child: Card(
                                margin: const EdgeInsets.all(0),
                                child: Container(
                                  padding: const EdgeInsets.all(10),
                                  child: Row(
                                    mainAxisAlignment:
                                    MainAxisAlignment.start,
                                    children: [
                                      UserAvatar(
                                          user: model.topComment['createBy']),
                                      const SizedBox(
                                        width: 12,
                                      ),
                                      Expanded(
                                          child: Column(
                                            crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                            children: [
                                              UserName(
                                                  user: model
                                                      .topComment['createBy']),
                                              const SizedBox(
                                                height: 6,
                                              ),
                                              GestureDetector(
                                                onTap: () {
                                                  showCommentReplyBottomSheet(
                                                    pageContext: context,
                                                    postId: model
                                                        .topComment['blogId']
                                                        .toString(),
                                                    comment: model.topComment,
                                                    onSuccess: (ctx) {
                                                      Navigator.pop(ctx);
                                                      model.refreshData();
                                                    },
                                                  );
                                                },
                                                child: ExpandableContent(
                                                    content: model
                                                        .topComment['content'],
                                                    scrollController:
                                                    model.scrollController),
                                              ),
                                              const SizedBox(
                                                height: 6,
                                              ),
                                              Text(
                                                TimeUtil.formatTime(model
                                                    .topComment['createdAt']),
                                                style: TextStyle(
                                                    color: Theme.of(context)
                                                        .hintColor),
                                              )
                                            ],
                                          ))
                                    ],
                                  ),
                                ),
                              ),
                            ),
                            SliverToBoxAdapter(
                              child: Card(
                                child: Container(
                                  padding: const EdgeInsets.all(10),
                                  child: ListView.builder(
                                      physics:
                                      const NeverScrollableScrollPhysics(),
                                      shrinkWrap: true,
                                      itemCount: model.pageList.length,
                                      itemBuilder: (_, index) {
                                        Map<String, dynamic> reply =
                                        model.pageList[index];

                                        return Container(
                                          padding: const EdgeInsets.symmetric(
                                              vertical: 12),
                                          decoration: BoxDecoration(
                                              border: index <
                                                  model.pageList.length -
                                                      1
                                                  ? Border(
                                                  bottom: BorderSide(
                                                      color: Theme.of(
                                                          context)
                                                          .highlightColor))
                                                  : null),
                                          child: Row(
                                            mainAxisAlignment:
                                            MainAxisAlignment.start,
                                            children: [
                                              UserAvatar(
                                                  user: reply['createBy']),
                                              const SizedBox(
                                                width: 12,
                                              ),
                                              Expanded(
                                                  child: Column(
                                                    crossAxisAlignment:
                                                    CrossAxisAlignment.start,
                                                    children: [
                                                      UserName(
                                                          user:
                                                          reply['createBy']),
                                                      const SizedBox(
                                                        height: 6,
                                                      ),
                                                      GestureDetector(
                                                        onTap: () {
                                                          showCommentReplyBottomSheet(
                                                            pageContext: context,
                                                            postId: model
                                                                .topComment[
                                                            'blogId']
                                                                .toString(),
                                                            comment: reply,
                                                            onSuccess: (ctx) {
                                                              Navigator.pop(ctx);
                                                              model.refreshData();
                                                            },
                                                          );
                                                        },
                                                        child: Text.rich(TextSpan(
                                                            children: [
                                                              reply['replyComment']
                                                              [
                                                              'topCommentId'] ==
                                                                  null
                                                                  ? TextSpan(
                                                                  text: reply[
                                                                  'content'])
                                                                  : TextSpan(
                                                                  children: [
                                                                    const TextSpan(
                                                                        text:
                                                                        '回复'),
                                                                    TextSpan(
                                                                        text:
                                                                        '@${reply['replyComment']['createBy']['name']}: ',
                                                                        style:
                                                                        TextStyle(color: Theme.of(context).colorScheme.primary)),
                                                                    TextSpan(
                                                                        text:
                                                                        reply['content'])
                                                                  ])
                                                            ])),
                                                      ),
                                                      const SizedBox(
                                                        height: 6,
                                                      ),
                                                      Text(
                                                        TimeUtil.formatTime(
                                                            reply['createdAt']),
                                                        style: TextStyle(
                                                            color:
                                                            Theme.of(context)
                                                                .hintColor),
                                                      )
                                                    ],
                                                  ))
                                            ],
                                          ),
                                        );
                                      }),
                                ),
                              ),
                            )
                          ],
                        ),
                      ));
                }
              }),
        ));
  }
}
