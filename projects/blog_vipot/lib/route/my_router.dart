import 'package:blog_vipot/pages/home/home_page.dart';
import 'package:blog_vipot/pages/login/login_page.dart';
import 'package:blog_vipot/pages/page_not_found.dart';
import 'package:blog_vipot/pages/post/post_page.dart';
import 'package:blog_vipot/route/animate_page_route.dart';
import 'package:blog_vipot/route/route_name.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class MyRouter{
  static final RouteObserver<PageRoute> routeObserver = RouteObserver<PageRoute>(); // 页面路由监听

  // 路由拦截器
  static Route<dynamic> generateRoute(RouteSettings settings){
    // CupertinoPageRoute 需要传 settings，否则 popUntil 会黑屏
    switch(settings.name){
      case RouteName.root:
        return CupertinoPageRoute(settings: settings, builder: (_) => const HomePage());
      case RouteName.login:
        return CupertinoPageRoute(settings: settings, builder: (_) => const LoginPage());
      case RouteName.post:
        Map param = settings.arguments as Map ?? {};
        return CupertinoPageRoute(settings: settings, builder: (_) => PostPage(postId: param['postId'].toString()));
      default:
        return SizeRoute(PageNotFoundPage(routeName: settings.name,));
    }
  }
}