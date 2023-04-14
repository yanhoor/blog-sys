import 'package:blog_vipot/components/skeleton/skeleton_comment_item.dart';
import 'package:blog_vipot/components/skeleton/skeleton_page_wrapper.dart';
import 'package:flutter/cupertino.dart';

class CommentDetailSkeleton extends StatelessWidget{
  const CommentDetailSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return SkeletonPageWrapper(
        child: ListView.builder(
            shrinkWrap: true,
            itemCount: 20,
            itemBuilder: (_, index){
              return const SkeletonCommentItem();
            }
        )
    );
  }
}