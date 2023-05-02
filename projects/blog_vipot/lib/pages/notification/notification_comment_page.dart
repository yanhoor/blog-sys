import 'package:blog_vipot/components/expandable_content.dart';
import 'package:blog_vipot/components/user/user_avatar.dart';
import 'package:blog_vipot/components/user/user_name.dart';
import 'package:blog_vipot/pages/notification/notification_notifier.dart';
import 'package:blog_vipot/pages/notification/notification_tab_page_base.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../../route/route_name.dart';
import '../../utils/time_util.dart';

class NotificationCommentPage extends StatefulWidget{
  final Function(NotificationNotifier model) onModelReady;

  const NotificationCommentPage({super.key, required this.onModelReady});

  @override
  State<NotificationCommentPage> createState() => _NotificationCommentPageState();
}

class _NotificationCommentPageState extends State<NotificationCommentPage> with AutomaticKeepAliveClientMixin{
  NotificationNotifier model = NotificationNotifier(fetchParams: { 'type': "comment,comment_reply", 'isRead': 3 });

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
              child: Stack(
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          UserAvatar(user: item['createBy']),
                          const SizedBox(width: 3,),
                          UserName(user: item['createBy']),
                          const SizedBox(width: 3,),
                          if(item['comment']['replyComment'] == null) const Text('评论了您: ')
                          else const Text('回复了您的评论: ')
                        ],
                      ),
                      const Divider(),
                      if(item['comment']['replyComment'] != null) ...[
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                              color: Theme.of(context).scaffoldBackgroundColor,
                              borderRadius: BorderRadius.circular(5)),
                          child: ExpandableContent(content:item['comment']['replyComment']['content'],
                            imageUrl: item['comment']['replyComment']['image'] == null ? null : item['comment']['replyComment']['image']['url'],
                            scrollController: model.scrollController!,
                          ),
                        ),
                        const SizedBox(height: 4,)
                      ],
                      ExpandableContent(
                          content: item['comment']['content'] ?? '',
                          imageUrl: item['comment']['image'] == null ? null : item['comment']['image']['url'],
                          style: TextStyle(color: item['isRead'] == 1 ? Theme.of(context).hintColor : null),
                          scrollController: model.scrollController!
                      ),
                      const Divider(),
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
                  if(item['isRead'] == 0) Align(
                    alignment: const Alignment(1, -1),
                    child: Transform.rotate(
                        angle: 0.55,
                      child: const Icon(Icons.fiber_new_outlined, color: Colors.red, size: 36,),
                    ),
                  )
                ],
              ),
            ),
          );
        }
    );
  }
}