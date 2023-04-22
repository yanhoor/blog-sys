import 'package:blog_vipot/components/skeleton/skeleton_item.dart';
import 'package:blog_vipot/components/skeleton/skeleton_post_item.dart';
import 'package:flutter/cupertino.dart';

class SkeletonUserPage extends StatelessWidget{
  const SkeletonUserPage({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              const SizedBox(height: 12,),
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 5),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        SkeletonItem(width: 100, height: 100, isCircle: true,),
                        const SizedBox(width: 12,),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            SkeletonItem(width: 80, height: 12),
                            const SizedBox(height: 12,),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: [
                                Column(
                                  children: [
                                    SkeletonItem(width: 20, height: 12),
                                    const SizedBox(height: 6,),
                                    SkeletonItem(width: 40, height: 12),
                                  ],
                                ),
                                const SizedBox(height: 6,),
                                Column(
                                  children: [
                                    SkeletonItem(width: 20, height: 12),
                                    const SizedBox(height: 6,),
                                    SkeletonItem(width: 40, height: 12),
                                  ],
                                ),
                                const SizedBox(height: 6,),
                                Column(
                                  children: [
                                    SkeletonItem(width: 20, height: 12),
                                    const SizedBox(height: 6,),
                                    SkeletonItem(width: 40, height: 12),
                                  ],
                                ),
                              ],
                            )
                          ],
                        )
                      ],
                    ),
                    const SizedBox(height: 12,),
                    SkeletonItem(width: double.infinity, height: 12),
                    const SizedBox(height: 4,),
                    SkeletonItem(width: double.infinity, height: 12),
                    const SizedBox(height: 4,),
                    SkeletonItem(width: 120, height: 12)
                  ],
                ),
              ),
              const SizedBox(height: 12,),
              ListView.builder(
                  padding: EdgeInsets.zero,
                  shrinkWrap: true,
                  itemCount: 10,
                  physics: const NeverScrollableScrollPhysics(),
                  itemBuilder: (_, index){
                    return const SkeletonPostItem();
                  }
              )
            ],
          ),
        )
    );
  }
}