import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'package:blog_vipot/components/expandable_content.dart';
import 'package:blog_vipot/components/user/user_avatar.dart';
import 'package:blog_vipot/components/user/user_name.dart';
import 'package:blog_vipot/utils/time_util.dart';

import '../../components/comment/comment_reply_modal.dart';
import '../../route/route_name.dart';

class PostCommentItem extends StatelessWidget {
  final Map<String, dynamic> comment;
  final Map<String, dynamic> post;
  final int index;
  final int total;
  final ScrollController scrollController;
  Function(BuildContext ctx)? onSuccess;

  PostCommentItem(
      {super.key,
      required this.post,
      required this.comment,
      required this.index,
      required this.total,
      this.onSuccess,
      required this.scrollController});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: BoxDecoration(
          border: index < total - 1
              ? Border(
                  bottom: BorderSide(color: Theme.of(context).highlightColor))
              : null),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          UserAvatar(user: comment['createBy']),
          const SizedBox(
            width: 10,
          ),
          Expanded(
              child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              UserName(
                user: comment['createBy'],
                fontSize: 14,
              ),
              const SizedBox(
                height: 8,
              ),
              GestureDetector(
                onTap: (){
                  showCommentReplyBottomSheet(
                      pageContext: context,
                      postId: post['id'].toString(),
                      comment: comment,
                      onSuccess: onSuccess
                  );
                },
                child: ExpandableContent(
                    content: comment['content'],
                    scrollController: scrollController),
              ),
              const SizedBox(
                height: 8,
              ),
              Text(
                TimeUtil.formatTime(comment['createdAt']),
                style: TextStyle(color: Theme.of(context).hintColor),
              ),
              if (comment['childComments'].length > 0) ...[
                const SizedBox(
                  height: 8,
                ),
                GestureDetector(
                  onTap: (){
                    Navigator.of(context).pushNamed(RouteName.commentDetail,
                        arguments: {'commentId': comment['id']});
                  },
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                        color: const Color(0xfff2f2f2),
                        borderRadius: BorderRadius.circular(5)),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ListView.builder(
                            physics: const NeverScrollableScrollPhysics(),
                            shrinkWrap: true,
                            itemCount: comment['childComments'].length,
                            itemBuilder: (_, index) {
                              Map<String, dynamic> reply =
                              comment['childComments'][index];

                              return Container(
                                padding: const EdgeInsets.only(bottom: 4),
                                child: Text.rich(TextSpan(children: [
                                  reply['replyComment']['topCommentId'] != null
                                      ? TextSpan(children: [
                                    TextSpan(text: '@${reply['createBy']['name']}', style: TextStyle(color: Theme.of(context).colorScheme.primary)),
                                    const TextSpan(text: ' 回复 '),
                                    TextSpan(text: '@${reply['replyComment']['createBy']['name']}: ', style: TextStyle(color: Theme.of(context).colorScheme.primary)),
                                  ])
                                      : TextSpan(
                                      text: '@${reply['createBy']['name']}: ', style: TextStyle(color: Theme.of(context).colorScheme.primary)),
                                  TextSpan(text: reply['content']),
                                ])),
                              );
                            }),
                        if(comment['childCommentsCount'] > 2) Row(
                          children: [
                            Text('共 ${comment['childCommentsCount'].toString()} 条回复', style: TextStyle(color: Theme.of(context).colorScheme.primary),),
                            Icon(Icons.keyboard_arrow_down, color: Theme.of(context).colorScheme.primary)
                          ],
                        )
                      ],
                    ),
                  ),
                ),
              ]
            ],
          ))
        ],
      ),
    );
  }
}
