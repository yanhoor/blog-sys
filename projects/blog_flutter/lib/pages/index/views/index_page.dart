import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:blog_flutter/pages/index/data/index_controller.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:blog_flutter/components/post/post_item.dart';

class IndexPage extends GetView<IndexController> {
  IndexPage({super.key}){
    Get.lazyPut<IndexController>(() => IndexController());
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      body: SafeArea(
        child: GetX<IndexController>(
          // init: IndexController(),
          autoRemove: false,
          // global: false,
          builder: (controller){
            if (controller.isInitializing) {
              return Column(
                children: [
                  const Text('initializing'),
                  ElevatedButton(onPressed: (){
                    print('========${controller.pageList.length}=====${controller.isMore}=====');
                  }, child: const Text('test'))
                ],
              );
            } else if (controller.isError) {
              return const Text('error');
            } else {
              return RefreshConfiguration.copyAncestor(
                  context: context,
                  child: SmartRefresher(
                    controller: controller.refreshController,
                    enablePullDown: true,
                    enablePullUp: true,
                    onRefresh: controller.refreshData,
                    onLoading: controller.handleLoadMore,
                    child: CustomScrollView(
                      controller: controller.scrollController,
                      slivers: [
                        SliverToBoxAdapter(
                          child: Column(
                            children: [
                              ListView.builder(
                                  shrinkWrap: true,
                                  padding: const EdgeInsets.all(0),
                                  physics: const NeverScrollableScrollPhysics(), // 禁止滑动
                                  itemCount: controller.pageList.length,
                                  itemBuilder: (context, index) {
                                    Map<String, dynamic> post = controller.pageList[index];
                                    return PostItem(post: post, scrollController: controller.scrollController);
                                  })
                            ],
                          ),
                        )
                      ],
                    ),
                  ));
            }
          },
        ),
      ),
    );
  }
}
