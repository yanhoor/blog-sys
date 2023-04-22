import 'package:blog_vipot/components/skeleton/skeleton_item.dart';
import 'package:blog_vipot/components/skeleton/skeleton_list_wrapper.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class SkeletonActivityCommonList extends StatelessWidget{
  const SkeletonActivityCommonList({super.key});

  @override
  Widget build(BuildContext context) {
    return SkeletonListWrapper(
      builder: (_, __){
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SkeletonItem(width: MediaQuery.of(context).size.width * 0.6, height: 15),
            const SizedBox(height: 12,),
            SkeletonItem(width: double.infinity, height: 15),
            const SizedBox(height: 6,),
            SkeletonItem(width: double.infinity, height: 15),
            const SizedBox(height: 6,),
            SkeletonItem(width: 150, height: 15),
            const SizedBox(height: 12,),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                SkeletonItem(width: 150, height: 15),
                SkeletonItem(width: 80, height: 15),
              ],
            )
          ],
        );
      },
    );
  }
}