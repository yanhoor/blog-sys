import 'package:blog_vipot/route/my_router.dart';
import 'package:blog_vipot/storage/storage_manager.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'notifiers/global_notifier.dart';
import 'notifiers/my_theme_notifier.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await MyStorageManager.init();
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp>{
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => GlobalNotifier()),
          ChangeNotifierProvider(create: (_) => MyThemeNotifier()),
        ],
        child: RefreshConfiguration(
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
            child: Consumer<MyThemeNotifier>(
              builder: (context, themeModel, child){
                return MaterialApp(
                  theme: MyThemeNotifier.lightTheme,
                  darkTheme: MyThemeNotifier.darkTheme,
                  // home: const MyHomePage(title: 'Flutter Demo Home Page'),
                  onGenerateRoute: MyRouter.generateRoute,
                  themeMode: themeModel.themeMode,
                );
              },
            )
        )
    );
  }
}
