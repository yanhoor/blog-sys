import 'package:blog_vipot/components/expandable_content.dart';
import 'package:blog_vipot/components/state/state_tag.dart';
import 'package:blog_vipot/components/user/user_avatar.dart';
import 'package:blog_vipot/components/user/user_name.dart';
import 'package:blog_vipot/http/api_url.dart';
import 'package:blog_vipot/pages/notification/notification_notifier.dart';
import 'package:blog_vipot/pages/notification/notification_tab_page_base.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../../route/route_name.dart';
import '../../utils/time_util.dart';

class NotificationSystemAuditPage extends StatefulWidget{
  const NotificationSystemAuditPage({super.key});

  @override
  State<NotificationSystemAuditPage> createState() => _NotificationSystemAuditPageState();
}

class _NotificationSystemAuditPageState extends State<NotificationSystemAuditPage> with AutomaticKeepAliveClientMixin{

  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);

    return NotificationTabPageBase(
        model: NotificationNotifier(url: ApiUrl.NOTIFICATION_LIST, fetchParams: { 'type': "system_audit", 'isRead': 3 }),
        itemBuilder: (_, index, item, model){
          return Card(
            key: ValueKey(item['id'].toString()),
            child: Container(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text('您的${item['comment'] == null ? '博客' : '评论'}审核'),
                      if(item['content']['auditStatusText'] == '审核通过') StateTag(text: item['content']['auditStatusText'], type: 'success',)
                      else StateTag(text: item['content']['auditStatusText'], type: 'error',)
                    ],
                  ),
                  const Divider(),
                  Text('审核意见：${item['content']['auditTip'] ?? '无'}'),
                  const Divider(),
                  if(item['comment'] != null) ...[
                    ExpandableContent(content: item['comment']['content'], scrollController: model.scrollController!,),
                    const Divider(),
                  ],
                  GestureDetector(
                    onTap: () {
                      Navigator.of(context).pushNamed(RouteName.post,
                          arguments: {'postId': item['blog']['id']});
                    },
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                          color: Theme.of(context).scaffoldBackgroundColor,
                          borderRadius: BorderRadius.circular(5)),
                      child: ExpandableContent(content: item['blog']['content'], scrollController: model.scrollController!,),
                    ),
                  ),
                  const Divider(),
                  Text(TimeUtil.formatTime(item['createdAt']), style: TextStyle(color: Theme.of(context).hintColor),)
                ],
              ),
            ),
          );
        }
    );
  }
}