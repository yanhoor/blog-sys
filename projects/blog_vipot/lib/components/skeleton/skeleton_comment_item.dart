import 'package:blog_vipot/components/skeleton/skeleton_item.dart';
import 'package:flutter/cupertino.dart';

class SkeletonCommentItem extends StatelessWidget{
  const SkeletonCommentItem({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SkeletonItem(width: 60, height: 60, isCircle: true,),
          const SizedBox(width: 12,),
          Expanded(child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SkeletonItem(width: 130, height: 15,),
              const SizedBox(height: 10,),
              SkeletonItem(width: double.infinity, height: 10,),
              const SizedBox(height: 4,),
              SkeletonItem(width: double.infinity, height: 10,),
              const SizedBox(height: 4,),
              SkeletonItem(width: MediaQuery.of(context).size.width * 0.3, height: 10,),
              const SizedBox(height: 10,),
              SkeletonItem(width: 180, height: 10,),
            ],
          ))
        ],
      ),
    );
  }
}