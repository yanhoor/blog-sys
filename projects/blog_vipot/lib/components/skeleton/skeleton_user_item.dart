import 'package:blog_vipot/components/skeleton/skeleton_item.dart';
import 'package:flutter/cupertino.dart';

class SkeletonUserItem extends StatelessWidget{
  const SkeletonUserItem({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        SkeletonItem(width: 60, height: 60, isCircle: true),
        const SizedBox(width: 12,),
        Expanded(child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SkeletonItem(width: 180, height: 12),
            const SizedBox(height: 4,),
            SkeletonItem(width: MediaQuery.of(context).size.width, height: 12),
            const SizedBox(height: 4,),
            SkeletonItem(width: 120, height: 12),
          ],
        ))
      ],
    );
  }
}