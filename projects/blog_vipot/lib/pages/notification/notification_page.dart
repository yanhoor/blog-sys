import 'package:blog_vipot/components/wrapper/tab_view_wrapper.dart';
import 'package:blog_vipot/pages/notification/notification_collect_page.dart';
import 'package:blog_vipot/pages/notification/notification_comment_page.dart';
import 'package:blog_vipot/pages/notification/notification_like_page.dart';
import 'package:blog_vipot/pages/notification/notification_system_audit_page.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class NotificationPage extends StatefulWidget{
  const NotificationPage({super.key});

  @override
  State<NotificationPage> createState() => _NotificationPageState();
}

class _NotificationPageState extends State<NotificationPage>{

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: TabViewWrapper(
          tabList: const ['评论', '点赞', '收藏', '系统审核'],
          pageBuilder: (BuildContext context, int index) {
            switch(index){
              case 1:
                return const NotificationLikePage();
              case 2:
                return const NotificationCollectPage();
              case 3:
                return const NotificationSystemAuditPage();
              default:
                return const NotificationCommentPage();
            }
          },
        ),
      ),
    );
  }
}