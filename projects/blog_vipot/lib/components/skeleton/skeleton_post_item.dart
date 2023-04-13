import 'package:blog_vipot/components/skeleton/skeleton_item.dart';
import 'package:flutter/cupertino.dart';

class SkeletonPostItem extends StatelessWidget{
  const SkeletonPostItem({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      // decoration: BoxDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              SkeletonItem(width: 60, height: 60, isCircle: true,),
              const SizedBox(width: 4,),
              Expanded(child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SkeletonItem(width: 200, height: 20,),
                  const SizedBox(height: 4,),
                  SkeletonItem(width: 160, height: 10,),
                ],
              ))
            ],
          ),
          const SizedBox(height: 10,),
          SkeletonItem(width: double.infinity, height: 10,),
          const SizedBox(height: 4,),
          SkeletonItem(width: double.infinity, height: 10,),
          const SizedBox(height: 4,),
          SkeletonItem(width: double.infinity, height: 10,),
          const SizedBox(height: 4,),
          SkeletonItem(width: MediaQuery.of(context).size.width * 0.3, height: 10,),
          const SizedBox(height: 10,),
          GridView.count(
            shrinkWrap: true,
            childAspectRatio: 1, // 子组件比例
            scrollDirection: Axis.vertical,
            crossAxisCount: 3,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 2,
            crossAxisSpacing: 2,
            children: List.generate(9, (index) {
              return Container(
                decoration: const BoxDecoration(
                    borderRadius: BorderRadius.all(Radius.circular(5))
                ),
                child: SkeletonItem(width: 120, height: 120,),
              );
            }),
          ),
          const SizedBox(height: 10,),
          Row(
            children: [
              Expanded(child: SkeletonItem(height: 20, width: 120,)),
              const SizedBox(width: 8,),
              Expanded(child: SkeletonItem(height: 20, width: 120,)),
              const SizedBox(width: 8,),
              Expanded(child: SkeletonItem(height: 20, width: 120,)),
            ],
          )
        ],
      ),
    );
  }
}