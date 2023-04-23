import 'package:blog_vipot/components/skeleton/skeleton_item.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class SkeletonMediaList extends StatelessWidget{
  const SkeletonMediaList({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: GridView.count(
        shrinkWrap: true,
        crossAxisCount: 3,
        physics: const NeverScrollableScrollPhysics(),
        childAspectRatio: 1,
        crossAxisSpacing: 4,
        mainAxisSpacing: 4,
        children: List.generate(30, (index) => SkeletonItem(width: 30, height: 30)),
      ),
    );
  }
}