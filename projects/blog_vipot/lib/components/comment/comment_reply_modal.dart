import 'package:blog_vipot/components/comment/comment_reply.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:blog_vipot/notifiers/global_notifier.dart';

showCommentReplyBottomSheet(
    {required BuildContext pageContext,
    required String postId,
    Map<String, dynamic>? comment,
      Function()? onSuccess
    }) {
  var myInfo = Provider.of<GlobalNotifier>(pageContext, listen: false).myInfo;
  if (myInfo == null) return;

  showModalBottomSheet(
      context: pageContext,
      isScrollControlled: true,
      builder: (BuildContext ctx) {
        return CommentReply(
          postId: postId,
          comment: comment,
          onSuccess: (){
            Navigator.of(ctx).pop();
            onSuccess?.call();
          },
        );
      });
}
