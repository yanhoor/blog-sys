import 'package:blog_vipot/components/skeleton/skeleton_list_wrapper.dart';
import 'package:blog_vipot/components/skeleton/skeleton_user_item.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class SkeletonUserList extends StatelessWidget{
  const SkeletonUserList({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      shrinkWrap: true,
      padding: const EdgeInsets.all(0),
      physics: const NeverScrollableScrollPhysics(), // 禁止滑动
      children: List.generate(20, (index) => const SkeletonUserItem()),
    );
  }
}