import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:blog_vipot/pages/home/home_notifier.dart';
import 'package:blog_vipot/pages/index/index_page.dart';
import 'package:blog_vipot/pages/my/my_page.dart';
import 'package:blog_vipot/pages/new_post/new_post_page.dart';
import 'package:blog_vipot/pages/notification/notification_page.dart';
import 'package:blog_vipot/pages/search/search_page.dart';
import 'package:blog_vipot/route/route_name.dart';
import 'package:flutter/material.dart';
import 'package:blog_vipot/notifiers/global_notifier.dart';
import 'package:provider/provider.dart';
import 'package:blog_vipot/notifiers/my_theme_notifier.dart';
import 'home_drawer.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage>
    with AutomaticKeepAliveClientMixin<HomePage>, WidgetsBindingObserver {
  late GlobalNotifier globalNotifier;

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    super.dispose();
    WidgetsBinding.instance.removeObserver(this);
  }

  @override
  void didChangePlatformBrightness() {
    context.read<MyThemeNotifier>().themeMode = WidgetsBinding.instance.window.platformBrightness == Brightness.dark ? ThemeMode.dark : ThemeMode.light;
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    globalNotifier = Provider.of<GlobalNotifier>(context);

    return ProviderWidget<HomeNotifier>(
        model: HomeNotifier(),
        onModelReady: (model) {},
        builder: (context, model, child) {
          return Scaffold(
            drawer: const HomeDrawer(),
            body: PageView(
              controller: globalNotifier.homePageController,
              physics: const NeverScrollableScrollPhysics(), // 禁止滑动
              children: const [
                IndexPage(),
                SearchPage(),
                NewPostPage(),
                NotificationPage(),
                MyPage(),
              ],
              onPageChanged: (index) {

              },
            ),
            bottomNavigationBar: BottomNavigationBar(
              type: BottomNavigationBarType.fixed,
              currentIndex: model.currentTab,
              // selectedItemColor: Colors.green[700],
              items: const [
                BottomNavigationBarItem(
                    icon: Icon(Icons.home_outlined),
                    activeIcon: Icon(Icons.home_sharp),
                    label: '首页'),
                BottomNavigationBarItem(
                    activeIcon: Icon(Icons.search),
                    icon: Icon(Icons.search_outlined),
                    label: '搜索'),
                BottomNavigationBarItem(
                    activeIcon: Icon(Icons.add_circle_outlined),
                    icon: Icon(Icons.add_circle_outline),
                    label: '发布'),
                BottomNavigationBarItem(
                    activeIcon: Icon(Icons.pending),
                    icon: Icon(Icons.pending_outlined),
                    label: '通知'),
                BottomNavigationBarItem(
                    activeIcon: Icon(Icons.account_circle),
                    icon: Icon(Icons.account_circle_outlined),
                    label: '我的'),
              ],
              onTap: (index) {
                if([2,3,4].contains(index) && globalNotifier.myInfo == null){
                  Navigator.of(context).pushNamed(RouteName.login);
                  return;
                }
                // 如果已经在当前tab就刷新，否则跳到点击的tab
                if (model.currentTab == index) {
                  switch (index) {
                    case 0:
                      if (model.indexNotifier.scrollController!.offset < 50) {
                        if (!model.indexNotifier.isRefreshing) {
                          model.indexNotifier.setRefreshing();
                          model.indexNotifier.refreshController.requestRefresh();
                        }
                      } else {
                        model.indexNotifier.scrollToOffset();
                      }
                      break;
                  }
                } else {
                  model.setCurrentTab(index);
                  globalNotifier.homePageController.jumpToPage(index);
                }
              },
            ),
          );
        });
  }
}
