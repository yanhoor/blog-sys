import 'package:blog_vipot/components/skeleton/skeleton_list_wrapper.dart';
import 'package:blog_vipot/components/skeleton/skeleton_post_item.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class SkeletonPostList extends StatelessWidget{
  const SkeletonPostList({super.key});

  @override
  Widget build(BuildContext context) {
    return SkeletonListWrapper(
      builder: (_, __){
        return const SkeletonPostItem();
      },
    );
  }
}