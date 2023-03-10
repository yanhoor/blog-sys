import 'package:flutter/material.dart';
import 'package:blog_flutter/components/user/user_avatar.dart';
import 'package:blog_flutter/components/user/user_name.dart';
import 'package:blog_flutter/components/media/media_list.dart';
import 'package:blog_flutter/components/expandable_content.dart';
import 'package:blog_flutter/utils/time_util.dart';

class PostItem extends StatelessWidget{
  final Map<String, dynamic> post;
  final ScrollController scrollController;
  const PostItem({super.key, required this.post, required this.scrollController});

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5)),
      child: Container(
        padding: const EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                UserAvatar(user: post['createBy']),
                const SizedBox(width: 6,),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    UserName(user: post['createBy']),
                    Text(TimeUtil.formatTime(post['createdAt']),)
                  ],
                )
              ],
            ),
            const SizedBox(height: 6,),
            ExpandableContent(content: post['content'], scrollController: scrollController),
            const SizedBox(height: 6,),
            MediaList(mediaList: post['medias'])
          ],
        ),
      ),
    );
  }

}