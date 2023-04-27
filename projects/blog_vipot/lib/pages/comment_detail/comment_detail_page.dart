import 'package:blog_vipot/components/comment/comment_item.dart';
import 'package:blog_vipot/components/no_shadow_scroll_behavior.dart';
import 'package:blog_vipot/components/y-card.dart';
import 'package:blog_vipot/pages/comment_detail/comment_detail_notifier.dart';
import 'package:blog_vipot/pages/comment_detail/comment_detail_skeleton.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:blog_vipot/components/state/state_request_error.dart';
import 'package:blog_vipot/components/state/state_request_empty.dart';
import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';

class CommentDetailPage extends StatefulWidget {
  final String commentId;

  const CommentDetailPage({super.key, required this.commentId});

  @override
  State<CommentDetailPage> createState() => _CommentDetailPageState();
}

class _CommentDetailPageState extends State<CommentDetailPage> {
  @override
  Widget build(BuildContext context) {
    return ProviderWidget<CommentDetailNotifier>(
        model: CommentDetailNotifier(commentId: widget.commentId),
        onModelReady: (model) {
          model.initData();
          model.initScrollController(controller: ScrollController());
        },
        builder: (context, model, child) {
          Widget content;
          if (model.isInitializing) {
            content = const CommentDetailSkeleton();
          } else if (model.isEmpty) {
            content = StateRequestEmpty(size: 60, onPressed: model.initData,);
          } else if (model.isError) {
            content = StateRequestError(size: 60, onPressed: model.initData, msg: model.stateErrorText,);
          } else {
            content = Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Card(
                  margin: const EdgeInsets.all(0),
                  child: Container(
                    padding: const EdgeInsets.all(10),
                    child: CommentItem(
                      comment: model.topComment,
                      scrollController: model.scrollController!,
                      onReplySuccess: (){
                        model.refreshData();
                      },
                    ),
                  ),
                ),
                YCard(
                  child: ListView.separated(
                      padding: EdgeInsets.zero,
                      physics: const NeverScrollableScrollPhysics(),
                      shrinkWrap: true,
                      separatorBuilder: (_, __){
                        return const Divider();
                      },
                      itemCount: model.pageList.length,
                      itemBuilder: (_, index) {
                        Map<String, dynamic> reply =
                        model.pageList[index];

                        return CommentItem(
                          key: ValueKey<int>(reply['id']),
                          comment: reply,
                          scrollController: model.scrollController!,
                          onReplySuccess: (){
                            model.refreshData();
                          },
                        );
                      }),
                )
              ],
            );
          }

          return Scaffold(
            appBar: AppBar(
              title: Text('全部回复${model.replyTotal > 0 ? '(${model.replyTotal})' : ''}'),
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
                        controller: model.scrollController,
                        child: content,
                      ),
                    )
                ),
              ),
            ),
          );
        });
  }
}
