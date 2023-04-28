import 'package:blog_vipot/components/comment/comment_reply.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:blog_vipot/notifiers/global_notifier.dart';

showCommentReplyBottomSheet({
  required BuildContext pageContext,
  required String postId,
  Map<String, dynamic>? comment,
  Function()? onSuccess
}) {

  var myInfo = Provider.of<GlobalNotifier>(pageContext, listen: false).myInfo;
  if (myInfo == null) return;

  // debugPrint('========showCommentReplyBottomSheet========${comment!['id']}');

  showModalBottomSheet(
      context: pageContext,
      isScrollControlled: true, // 1. 避免软键盘遮挡
      builder: (BuildContext ctx) {
        return Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: Theme.of(pageContext).cardColor,
            // borderRadius: const BorderRadius.only(
            //     topLeft: Radius.circular(10),
            //     topRight: Radius.circular(10)
            // )
          ),
          child: SafeArea(
            child: Padding(
              // 2. 避免软键盘遮挡
              padding: EdgeInsets.only(
                  bottom: MediaQuery.of(ctx).viewInsets.bottom
              ),
              child: CommentReply(
                key: ValueKey<int>(comment == null ? 0 : comment['id']),
                postId: postId,
                comment: comment,
                onSuccess: (){
                  Navigator.of(ctx).pop();
                  onSuccess?.call();
                },
              ),
            ),
          ),
        );
      }
  );
}
