import 'package:blog_flutter/theme/theme_data.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'routes/index.dart';
import 'lang/translation_service.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:dynamic_color/dynamic_color.dart';
import 'package:blog_flutter/theme/theme_controller.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget{
  late ThemeController themeController;
  MyApp({super.key}){
    themeController = Get.put<ThemeController>(ThemeController());
  }

  @override
  Widget build(BuildContext context) {
    return RefreshConfiguration(
      headerBuilder: () => const ClassicHeader(
        refreshingText: '正在刷新',
        releaseText: '松手即可刷新',
        completeText: '刷新成功',
        failedText: '刷新失败',
        idleText: '下拉刷新',
      ),
      footerBuilder: () => const ClassicFooter(
        idleText: '上拉加载',
        canLoadingText: '松手加载更多',
        failedText: '加载失败，请重试！',
        // loadingIcon: CupertinoActivityIndicator(),
        noDataText: '已全部加载完成',
      ),
      hideFooterWhenNotFull: true, // Viewport不满一屏时,禁用上拉加载更多功能
      child: DynamicColorBuilder(
        builder: (ColorScheme? lightDynamic, ColorScheme? darkDynamic){
          return GetMaterialApp(
            // navigatorKey: Get.key,
            themeMode: ThemeMode.system,
            theme: MyTheme.lightTheme(lightDynamic),
            darkTheme: MyTheme.darkTheme(darkDynamic), // 有这个时，Get.changeTheme(Get.isDarkMode ? MyTheme.light: MyTheme.dark); 无效
            routingCallback: RouteManage.routingCallback,
            initialRoute: RouteName.root,
            getPages: RouteManage.routeList,
            locale: TranslationService.locale,
            fallbackLocale: TranslationService.fallbackLocale,
            translations: TranslationService(),
          );
        },
      ),
    );
  }

}
