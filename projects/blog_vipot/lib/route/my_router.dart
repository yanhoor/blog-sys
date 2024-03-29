import 'package:blog_vipot/pages/advertise/advertise_page.dart';
import 'package:blog_vipot/pages/comment_detail/comment_detail_page.dart';
import 'package:blog_vipot/pages/group_manage/group_manage_page.dart';
import 'package:blog_vipot/pages/home/home_page.dart';
import 'package:blog_vipot/pages/image_preview/image_preview.dart';
import 'package:blog_vipot/pages/login/login_page.dart';
import 'package:blog_vipot/pages/media_detail/media_detail_page.dart';
import 'package:blog_vipot/pages/my_collections/my_collections_page.dart';
import 'package:blog_vipot/pages/my_comments/my_comments_page.dart';
import 'package:blog_vipot/pages/my_like/my_like_page.dart';
import 'package:blog_vipot/pages/my_profile/my_profile_page.dart';
import 'package:blog_vipot/pages/page_not_found.dart';
import 'package:blog_vipot/pages/post/post_page.dart';
import 'package:blog_vipot/pages/register/register_page.dart';
import 'package:blog_vipot/pages/search_result/search_result_page.dart';
import 'package:blog_vipot/pages/user_followers/user_followers_page.dart';
import 'package:blog_vipot/pages/user_followings/user_followings_page.dart';
import 'package:blog_vipot/pages/user_image_wall/user_image_wall_page.dart';
import 'package:blog_vipot/pages/welcome/welcome_page.dart';
import 'package:blog_vipot/route/animate_page_route.dart';
import 'package:blog_vipot/route/route_name.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:blog_vipot/pages/user/user_page.dart';

class MyRouter{
  static final RouteObserver<PageRoute> routeObserver = RouteObserver<PageRoute>(); // 页面路由监听

  // static GoRouter getGoRouter({String? initialLocation}){
  //   return GoRouter(
  //     initialLocation: initialLocation,
  //     errorBuilder: (BuildContext context, GoRouterState state) => const PageNotFoundPage(),
  //     redirect: (BuildContext context, GoRouterState state) {
  //       debugPrint('=========GoRouter redirect==========');
  //       // return context.namedLocation(RouteName.pageNoFound);
  //     },
  //     debugLogDiagnostics: true,
  //     observers: [
  //       BotToastNavigatorObserver(),
  //     ],
  //     routes: <GoRoute>[
  //       GoRoute(
  //         name: RouteName.root,
  //         path: RouteName.root,
  //         builder: (BuildContext context, GoRouterState state) => const HomePage(),
  //         // 可以继续嵌套子路由
  //         // routes: <GoRoute>[
  //         //   GoRoute(
  //         //     name: RouteName.pageNoFound,
  //         //     path: RouteName.pageNoFound,
  //         //     builder: (BuildContext context, GoRouterState state) => const PageNotFoundPage(),
  //         //   ),
  //         // ],
  //       ),
  //       GoRoute(
  //         name: RouteName.pageNoFound,
  //         path: RouteName.pageNoFound,
  //         builder: (BuildContext context, GoRouterState state) => const PageNotFoundPage(),
  //       ),
  //       GoRoute(
  //         name: RouteName.welcome,
  //         path: RouteName.welcome,
  //         builder: (BuildContext context, GoRouterState state) => const WelcomePage(),
  //       ),
  //       GoRoute(
  //         name: RouteName.advertise,
  //         path: RouteName.advertise,
  //         builder: (BuildContext context, GoRouterState state) => const AdvertisePage(),
  //       ),
  //       GoRoute(
  //         name: RouteName.login,
  //         path: RouteName.login,
  //         builder: (BuildContext context, GoRouterState state) => const LoginPage(),
  //       ),
  //       GoRoute(
  //         name: RouteName.register,
  //         path: RouteName.register,
  //         builder: (BuildContext context, GoRouterState state) => const RegisterPage(),
  //       ),
  //       // GoRoute(
  //       //   name: RouteName.searchResult,
  //       //   path: RouteName.register,
  //       //   builder: (BuildContext context, GoRouterState state) => const RegisterPage(),
  //       // ),
  //       // GoRoute(
  //       //   name: RouteName.register,
  //       //   path: RouteName.register,
  //       //   builder: (BuildContext context, GoRouterState state) => const RegisterPage(),
  //       // ),
  //       // GoRoute(
  //       //   name: RouteName.register,
  //       //   path: RouteName.register,
  //       //   builder: (BuildContext context, GoRouterState state) => const RegisterPage(),
  //       // ),
  //     ],
  //   );
  // }

  // 路由拦截器
  static Route<dynamic> generateRoute(RouteSettings settings){
    debugPrint('===========路由===========${settings.name}');
    // CupertinoPageRoute 需要传 settings，否则 popUntil 会黑屏
    switch(settings.name){
      case RouteName.root:
        return CupertinoPageRoute(settings: settings, builder: (_) => const HomePage());

      case RouteName.welcome:
        return CupertinoPageRoute(settings: settings, builder: (_) => const WelcomePage());

      case RouteName.advertise:
        return CupertinoPageRoute(settings: settings, builder: (_) => const AdvertisePage());

      case RouteName.login:
        return CupertinoPageRoute(settings: settings, builder: (_) => const LoginPage());

      case RouteName.register:
        return CupertinoPageRoute(settings: settings, builder: (_) => const RegisterPage());

      case RouteName.user:
        Map param = settings.arguments as Map ?? {};
        return CupertinoPageRoute(settings: settings, builder: (_) => UserPage(userId: param['userId'].toString()));

      case RouteName.userFollowings:
        Map param = settings.arguments as Map ?? {};
        return CupertinoPageRoute(settings: settings, builder: (_) => UserFollowingsPage(userId: param['userId'].toString()));

      case RouteName.userFollowers:
        Map param = settings.arguments as Map ?? {};
        return CupertinoPageRoute(settings: settings, builder: (_) => UserFollowersPage(userId: param['userId'].toString()));

      case RouteName.userImageWall:
        Map param = settings.arguments as Map ?? {};
        return CupertinoPageRoute(settings: settings, builder: (_) => UserImageWallPage(userId: param['userId'].toString()));

      case RouteName.mediaDetail:
        Map param = settings.arguments as Map ?? {};
        return CupertinoPageRoute(settings: settings, builder: (_) => MediaDetailPage(initIndex: param['initIndex'], mediaList: param['mediaList'],));

      case RouteName.post:
        Map param = settings.arguments as Map ?? {};
        return CupertinoPageRoute(settings: settings, builder: (_) => PostPage(postId: param['postId'].toString()));

      case RouteName.commentDetail:
        Map param = settings.arguments as Map ?? {};
        return CupertinoPageRoute(settings: settings, builder: (_) => CommentDetailPage(commentId: param['commentId'].toString()));

      case RouteName.imagePreview:
        Map param = settings.arguments as Map ?? {};
        return CupertinoPageRoute(settings: settings, builder: (_) => ImagePreview(imageList: param['imageList'], initPage: param['initPage'],));

      case RouteName.groupManage:
        return CupertinoPageRoute(settings: settings, builder: (_) => const GroupManagePage());

      case RouteName.searchResult:
        Map param = settings.arguments as Map ?? {};
        return CupertinoPageRoute(settings: settings, builder: (_) => SearchResultPage(keyword: param['keyword'].toString()));

      case RouteName.myCollections:
        return CupertinoPageRoute(settings: settings, builder: (_) => const MyCollectionsPage());

      case RouteName.myLike:
        return CupertinoPageRoute(settings: settings, builder: (_) => const MyLikePage());

      case RouteName.myComments:
        return CupertinoPageRoute(settings: settings, builder: (_) => const MyCommentsPage());

      case RouteName.myProfile:
        return CupertinoPageRoute(settings: settings, builder: (_) => const MyProfilePage());

      default:
        return SizeRoute(PageNotFoundPage(routeName: settings.name,));
    }
  }
}