
// 列表的蒙版
import 'package:blog_vipot/components/skeleton/skeleton_page_wrapper.dart';
import 'package:flutter/cupertino.dart';

class SkeletonListWrapper extends StatelessWidget{
  final int itemCount;
  final IndexedWidgetBuilder builder;

  const SkeletonListWrapper({super.key, this.itemCount = 10, required this.builder});

  @override
  Widget build(BuildContext context) {

    return SkeletonPageWrapper(
      child: Column(
        children: List.generate(itemCount, (index) => builder(context, index)),
      ),
    );
  }
}