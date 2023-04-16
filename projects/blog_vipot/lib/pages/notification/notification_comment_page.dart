import 'package:blog_vipot/components/expandable_content.dart';
import 'package:blog_vipot/components/user/user_avatar.dart';
import 'package:blog_vipot/components/user/user_name.dart';
import 'package:blog_vipot/http/api_url.dart';
import 'package:blog_vipot/pages/notification/notification_notifier.dart';
import 'package:blog_vipot/pages/notification/notification_tab_page_base.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';

import '../../route/route_name.dart';
import '../../utils/time_util.dart';

class NotificationCommentPage extends StatefulWidget{
  const NotificationCommentPage({super.key});

  @override
  State<NotificationCommentPage> createState() => _NotificationCommentPageState();
}

class _NotificationCommentPageState extends State<NotificationCommentPage> with AutomaticKeepAliveClientMixin{

  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);

    return NotificationTabPageBase(
        model: NotificationNotifier(fetchParams: { 'type': "comment,comment_reply", 'isRead': 3 }),
        itemBuilder: (_, index, item, model){
          return Card(
            key: ValueKey(item['id'].toString()),
            child: Container(
              padding: const EdgeInsets.all(12),
              child: Column(
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
                      child: ExpandableContent(content: item['comment']['replyComment']['content'], scrollController: model.scrollController!,),
                    ),
                    const SizedBox(height: 4,)
                  ],
                  ExpandableContent(content: item['comment']['content'], style: TextStyle(color: item['isRead'] == 1 ? Theme.of(context).hintColor : null), scrollController: model.scrollController!),
                  const Divider(),
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