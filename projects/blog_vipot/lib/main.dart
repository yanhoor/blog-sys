import 'package:blog_vipot/my_system_notification.dart';
import 'package:blog_vipot/route/my_router.dart';
import 'package:blog_vipot/storage/storage_manager.dart';
import 'package:blog_vipot/websocket.dart';
import 'package:bot_toast/bot_toast.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'notifiers/global_notifier.dart';
import 'notifiers/my_theme_notifier.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  MySystemNotification().initialize();
  await MyStorageManager.init();
  runApp(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => GlobalNotifier()),
          ChangeNotifierProvider(create: (_) => MyThemeNotifier()),
        ],
        child: const MyApp(),
      )
  );
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> with WidgetsBindingObserver{

  @override
  void initState() {
    WidgetsBinding.instance.addObserver(this);
    Provider.of<GlobalNotifier>(context, listen: false).setPageContext(context);
    super.initState();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
    myWebSocket.dispose();
  }

  @override
  void didChangePlatformBrightness() {
    var brightness = Theme.of(context).brightness;
    // print('========didChangePlatformBrightness=========$brightness');
    super.didChangePlatformBrightness();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    print('========didChangeAppLifecycleState=========$state');
    if(state == AppLifecycleState.resumed){
      myWebSocket.initHeartBeat();
    }
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
        child: Consumer2<MyThemeNotifier, GlobalNotifier>(
          builder: (context, themeModel, globalModel, child){

            return GestureDetector(
              // behavior: HitTestBehavior.translucent,
              // onPointerUp: (e) {
              //   // 收起键盘
              //   // FocusScope.of(context).requestFocus(FocusNode());
              //   FocusScopeNode currentFocus = FocusScope.of(context);
              //
              //   // if (!currentFocus.hasPrimaryFocus) {
              //   //   currentFocus.unfocus();
              //   // }
              //   if (!currentFocus.hasPrimaryFocus) {
              //     currentFocus.focusedChild?.unfocus();
              //   }
              // },
              onTap: (){
                FocusManager.instance.primaryFocus?.unfocus();
              },
              child: MaterialApp(
                theme: MyThemeNotifier.lightTheme,
                darkTheme: MyThemeNotifier.darkTheme,
                builder: BotToastInit(),
                // home: const HomePage(),
                initialRoute: globalModel.initRouteName,
                onGenerateRoute: MyRouter.generateRoute,
                themeMode: themeModel.themeMode,
                navigatorObservers: [
                  BotToastNavigatorObserver(),
                  MyRouter.routeObserver
                ],
              ),
            );
          },
        )
    );
  }
}
