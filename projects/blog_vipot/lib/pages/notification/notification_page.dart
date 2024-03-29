import 'package:blog_vipot/components/wrapper/tab_view_wrapper.dart';
import 'package:blog_vipot/pages/notification/notification_collect_page.dart';
import 'package:blog_vipot/pages/notification/notification_comment_page.dart';
import 'package:blog_vipot/pages/notification/notification_like_page.dart';
import 'package:blog_vipot/pages/notification/notification_system_audit_page.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:blog_vipot/notifiers/global_notifier.dart';

class NotificationPage extends StatefulWidget{
  const NotificationPage({super.key});

  @override
  State<NotificationPage> createState() => _NotificationPageState();
}

class _NotificationPageState extends State<NotificationPage>{
  List<Map<String, dynamic>> tabModelList = [];

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return AnnotatedRegion<SystemUiOverlayStyle>(
        value: isDark ? SystemUiOverlayStyle.light : SystemUiOverlayStyle.dark,
        child: Scaffold(
          body: SafeArea(
            child: Consumer<GlobalNotifier>(
              builder: (context, model, child){
                return model.myInfo == null ? Container() : TabViewWrapper(
                  tabList: [
                    model.unreadComment > 0 ? '评论(${model.unreadComment})' : '评论',
                    model.unreadLike > 0 ? '点赞(${model.unreadLike})' : '点赞',
                    model.unreadCollect > 0 ? '收藏(${model.unreadCollect})' : '收藏',
                    model.unreadAudit > 0 ? '系统审核(${model.unreadAudit})' : '系统审核',
                  ],
                  onTabChange: (index) async{
                    int idx = tabModelList.indexWhere((m) => m['index'] == index);
                    if(idx > -1) model.notificationNotifier = tabModelList[idx]['model'];
                  },
                  pageBuilder: (BuildContext context, int index) {
                    switch(index){
                      case 1:
                        return NotificationLikePage(
                          onModelReady: (m){
                            model.notificationNotifier = m;
                            tabModelList.add({
                              'index': index,
                              'model': m
                            });
                          },
                        );
                      case 2:
                        return NotificationCollectPage(
                          onModelReady: (m){
                            model.notificationNotifier = m;
                            tabModelList.add({
                              'index': index,
                              'model': m
                            });
                          },
                        );
                      case 3:
                        return NotificationSystemAuditPage(
                          onModelReady: (m){
                            model.notificationNotifier = m;
                            tabModelList.add({
                              'index': index,
                              'model': m
                            });
                          },
                        );
                      default:
                        return NotificationCommentPage(
                          onModelReady: (m){
                            model.notificationNotifier = m;
                            tabModelList.add({
                              'index': index,
                              'model': m
                            });
                          },
                        );
                    }
                  },
                );
              },
            ),
          ),
        )
    );
  }
}