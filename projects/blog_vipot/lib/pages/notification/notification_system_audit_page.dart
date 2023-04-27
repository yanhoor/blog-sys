import 'package:blog_vipot/components/expandable_content.dart';
import 'package:blog_vipot/components/state/state_tag.dart';
import 'package:blog_vipot/pages/notification/notification_notifier.dart';
import 'package:blog_vipot/pages/notification/notification_tab_page_base.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../../route/route_name.dart';
import '../../utils/time_util.dart';

class NotificationSystemAuditPage extends StatefulWidget{
  final Function(NotificationNotifier model) onModelReady;

  const NotificationSystemAuditPage({super.key, required this.onModelReady});

  @override
  State<NotificationSystemAuditPage> createState() => _NotificationSystemAuditPageState();
}

class _NotificationSystemAuditPageState extends State<NotificationSystemAuditPage> with AutomaticKeepAliveClientMixin{
  NotificationNotifier model = NotificationNotifier(fetchParams: { 'type': "system_audit", 'isRead': 3 });

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    widget.onModelReady(model);
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);

    return NotificationTabPageBase(
        model: model,
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
                      if(item['blog'] == null) return;

                      Navigator.of(context).pushNamed(RouteName.post,
                          arguments: {'postId': item['blogId']});
                    },
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      constraints: const BoxConstraints(
                          minWidth: double.infinity
                      ),
                      decoration: BoxDecoration(
                          color: Theme.of(context).scaffoldBackgroundColor,
                          borderRadius: BorderRadius.circular(5)),
                      child: item['blog'] == null ? const Text('博客不存在', style: TextStyle(color: Colors.red),) : ExpandableContent(
                        content: item['blog']['content'],
                        scrollController: model.scrollController!,
                        onTap: () {
                          Navigator.of(context).pushNamed(RouteName.post,
                              arguments: {'postId': item['blogId']});
                        },),
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