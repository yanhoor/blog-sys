import 'package:get/get.dart';
import 'package:blog_flutter/pages/other/other.dart';
import 'package:blog_flutter/pages/home/data/home_bindings.dart';
import 'package:blog_flutter/pages/index/data/index_binding.dart';
import 'package:blog_flutter/pages/home/views/home_page.dart';
import 'package:blog_flutter/pages/test/data/test_binding.dart';
import 'package:blog_flutter/pages/index/views/index_page.dart';
import 'package:blog_flutter/pages/search/views/search_page.dart';
import 'package:blog_flutter/pages/new-post/views/new_post_page.dart';
import 'package:blog_flutter/pages/notification/views/notification_page.dart';
import 'package:blog_flutter/pages/me/views/me_page.dart';

abstract class RouteName {
  static const root = '/';
  static const index = '/index';
  static const search = '/search';
  static const newPost = '/new-post';
  static const notification = '/notification';
  static const me = '/me';
  static const other = '/other';
  static const test = '/test';
}

class RouteManage {
  static void routingCallback(Routing? routing) {
    /// You can listen in addition to the routes, the snackbars, dialogs and bottomsheets on each screen.
    ///If you need to enter any of these 3 events directly here,
    ///you must specify that the event is != Than you are trying to do.
    print(
        'routing info--->previous:${routing?.previous}---current:${routing?.current}---isBack:${routing?.isBack}');
    if (routing?.current == '/second') {
      Get.snackbar("Hi", "You are on second route");
    } else if (routing?.current == RouteName.other) {
      // Get.snackbar("Hi", "You are on second route");
      print('last route called');
    }
  }

  static final routeList = [
    GetPage(
        name: RouteName.root,
        page: () => const HomePage(),
        binding: HomeBinding()),
    GetPage(
        name: RouteName.index,
        page: () => IndexPage()),
    GetPage(name: RouteName.search, page: () => SearchPage()),
    GetPage(name: RouteName.newPost, page: () => NewPostPage()),
    GetPage(name: RouteName.notification, page: () => NotificationPage()),
    GetPage(name: RouteName.me, page: () => MePage()),
    GetPage(
        name: RouteName.other,
        page: () => Other(),
        transition: Transition.zoom),
    GetPage(
        name: RouteName.test,
        page: () => Other(),
        binding: TestBinding(),
        transition: Transition.zoom),
  ];
}
