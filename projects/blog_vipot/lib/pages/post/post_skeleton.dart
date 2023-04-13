import 'package:blog_vipot/components/skeleton/skeleton_comment_item.dart';
import 'package:blog_vipot/components/skeleton/skeleton_page_wrapper.dart';
import 'package:blog_vipot/components/skeleton/skeleton_post_item.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class PostSkeleton extends StatelessWidget{
  const PostSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return SkeletonPageWrapper(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SkeletonPostItem(),
            ...List.generate(10, (index) {
              return const SkeletonCommentItem();
            })
          ],
        )
    );
  }
}