import 'package:blog_vipot/components/comment/comment_item.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class PostCommentItem extends StatelessWidget {
  final Map<String, dynamic> comment;
  final Map<String, dynamic> post;
  final ScrollController scrollController;
  Function()? onSuccess;

  PostCommentItem(
      {super.key,
      required this.post,
      required this.comment,
      this.onSuccess,
      required this.scrollController});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: CommentItem(comment: comment, scrollController: scrollController, onReplySuccess: onSuccess,),
    );
  }
}
