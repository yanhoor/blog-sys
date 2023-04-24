import 'package:blog_vipot/components/expandable_content.dart';
import 'package:blog_vipot/components/user/user_avatar.dart';
import 'package:blog_vipot/components/user/user_name.dart';
import 'package:blog_vipot/pages/notification/notification_notifier.dart';
import 'package:blog_vipot/pages/notification/notification_tab_page_base.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:blog_vipot/route/route_name.dart';
import 'package:blog_vipot/utils/time_util.dart';

class NotificationCollectPage extends StatefulWidget{
  final Function(NotificationNotifier model) onModelReady;

  const NotificationCollectPage({super.key, required this.onModelReady});

  @override
  State<NotificationCollectPage> createState() => _NotificationCollectPageState();
}

class _NotificationCollectPageState extends State<NotificationCollectPage> with AutomaticKeepAliveClientMixin{

  NotificationNotifier model = NotificationNotifier(fetchParams: { 'type': "collect_blog", 'isRead': 3 });

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
                          const Text('收藏了您的博客: ')
                        ],
                      ),
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
                          child: ExpandableContent(
                            content: item['blog']['content'],
                            scrollController: model.scrollController!,
                            isSelectable: false,
                          ),
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