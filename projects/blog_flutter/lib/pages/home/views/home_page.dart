import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:blog_flutter/pages/home/data/home_controller.dart';
import 'package:blog_flutter/pages/index/views/index_page.dart';
import 'package:blog_flutter/pages/search/views/search_page.dart';
import 'package:blog_flutter/pages/new-post/views/new_post_page.dart';
import 'package:blog_flutter/pages/notification/views/notification_page.dart';
import 'package:blog_flutter/pages/me/views/me_page.dart';
import 'home_drawer.dart';
import 'package:blog_flutter/pages/index/data/index_controller.dart';
import 'package:blog_flutter/components/keep_alive_wrapper.dart';

class HomePage extends GetView<HomeController>{
  const HomePage({super.key});

  @override
  Widget build(context) {
    print('home_page build');

    return Scaffold(
      drawer: HomeDrawer(),
      body: PageView(
        controller: controller.pageController,
        physics: const NeverScrollableScrollPhysics(), // 禁止滑动
        children: [
          KeepAliveWrapper(child: IndexPage()),
          KeepAliveWrapper(child: SearchPage()),
          KeepAliveWrapper(child: NewPostPage(),),
          KeepAliveWrapper(child: NotificationPage()),
          KeepAliveWrapper(child: MePage()),
        ],
        onPageChanged: (index) {
          controller.currentTab.value = index;
          controller.tabController.animateTo(index);
        },
      ),
      bottomNavigationBar: Obx(() => BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: controller.currentTab.value,
        // selectedItemColor: Colors.green[700],
        items: [
          BottomNavigationBarItem(icon: const Icon(Icons.home_outlined), activeIcon: const Icon(Icons.home_sharp), label: 'tab_home'.tr),
          BottomNavigationBarItem(activeIcon: const Icon(Icons.search), icon: const Icon(Icons.search_outlined), label: 'tab_search'.tr),
          BottomNavigationBarItem(activeIcon: const Icon(Icons.add_circle_outlined), icon: const Icon(Icons.add_circle_outline), label: 'tab_post'.tr),
          BottomNavigationBarItem(activeIcon: const Icon(Icons.pending), icon: const Icon(Icons.pending_outlined), label: 'tab_notification'.tr),
          BottomNavigationBarItem(activeIcon: const Icon(Icons.account_circle), icon: const Icon(Icons.account_circle_outlined), label: 'tab_me'.tr),
        ],
        onTap: (index) {
          // 如果已经在当前tab就刷新，否则跳到点击的tab
          if(controller.currentTab.value == index){
            switch(index){
              case 0:
                IndexController c = Get.find<IndexController>();
                if(c.offsetTop < 50){
                  if(!c.isRefreshing) {
                    c.setRefreshing();
                    c.refreshController.requestRefresh();
                  }
                }else{
                  c.scrollToOffset();
                }
                break;
            }
          }else{
            controller.currentTab.value = index;
            controller.pageController.jumpToPage(index);
          }
        },
      )),
    );
  }
}
