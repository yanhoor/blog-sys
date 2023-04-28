import 'package:blog_vipot/components/skeleton/skeleton_user_item.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class SkeletonUserList extends StatelessWidget{
  const SkeletonUserList({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      shrinkWrap: true,
      padding: const EdgeInsets.all(0),
      physics: const NeverScrollableScrollPhysics(), // 禁止滑动
      separatorBuilder: (_, __){
        return const Divider();
      },
      itemCount: 20,
      itemBuilder: (_, __){
        return const SkeletonUserItem();
      },
    );
  }
}