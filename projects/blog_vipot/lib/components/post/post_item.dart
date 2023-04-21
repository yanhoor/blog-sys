import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:flutter/material.dart';
import 'package:blog_vipot/route/route_name.dart';
import '../../http/index.dart';
import '../user/user_avatar.dart';
import '../user/user_name.dart';
import '../media/media_list.dart';
import '../expandable_content.dart';
import '../../utils/time_util.dart';

class PostItem extends StatelessWidget {
  final Map<String, dynamic> post;
  final ScrollController scrollController;
  final Function(Map<String, dynamic>) onUpdatePost;

  const PostItem(
      {super.key, required this.post, required this.scrollController, required this.onUpdatePost});

  handleLikePost() async{
    try{
      var res = await $http.fetch(ApiUrl.BLOG_LIKE, params: { 'id':  post['id'], 'isLike': post['isLike'] ? 0 : 1 });
      if(res['success']){
        post['isLike'] = !post['isLike'];
        post['likedByCount'] = post['likedByCount'] + (post['isLike'] ? 1 : -1);
        onUpdatePost(post);
      }
    }catch(e){
      // print('=========${jsonEncode(e)}');
    }
  }

  handleCollectPost() async{
    try{
      var res = await $http.fetch(ApiUrl.BLOG_COLLECT, params: { 'id':  post['id'], 'isCollect': post['isCollect'] ? 0 : 1 });
      if(res['success']){
        post['isCollect'] = !post['isCollect'];
        post['collectedByCount'] = post['collectedByCount'] + (post['isCollect'] ? 1 : -1);
        onUpdatePost(post);
      }
    }catch(e){
      // print('=========${jsonEncode(e)}');
    }
  }

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
                const SizedBox(
                  width: 6,
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    UserName(user: post['createBy']),
                    Text(
                      TimeUtil.formatTime(post['createdAt']),
                      style: TextStyle(color: Theme.of(context).hintColor),
                    )
                  ],
                )
              ],
            ),
            GestureDetector(
              onTap: () {
                Navigator.of(context).pushNamed(RouteName.post,
                    arguments: {'postId': post['id']});
              },
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(
                    height: 6,
                  ),
                  ExpandableContent(
                      content: post['content'],
                      scrollController: scrollController),
                  const SizedBox(
                    height: 6,
                  ),
                  MediaList(
                      mediaList: post['medias'].map((m) => m['file']).toList()),
                  const SizedBox(
                    height: 6,
                  ),
                  Row(
                    children: [
                      Expanded(
                          child: RawMaterialButton(
                            onPressed: () {
                              handleLikePost();
                            },
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  post['isLike']
                                      ? Icons.thumb_up_alt
                                      : Icons.thumb_up_alt_outlined,
                                  size: 18,
                                  color: post['isLike'] ? Theme.of(context).colorScheme.primary : null,
                                ),
                                const SizedBox(
                                  width: 4,
                                ),
                                Text(post['likedByCount'].toString())
                              ],
                            ),
                          )),
                      Expanded(
                          child: RawMaterialButton(
                            onPressed: () {
                              Navigator.of(context).pushNamed(RouteName.post,
                                  arguments: {'postId': post['id']});
                            },
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  post['commentsCount'] > 0 ? Icons.messenger : Icons.messenger_outline,
                                  size: 18,
                                ),
                                const SizedBox(
                                  width: 4,
                                ),
                                Text(post['commentsCount'].toString())
                              ],
                            ),
                          )),
                      Expanded(
                          child: RawMaterialButton(
                            onPressed: handleCollectPost,
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  post['isCollect']
                                      ? Icons.favorite
                                      : Icons.favorite_border,
                                  size: 18,
                                  color: post['isCollect'] ? Theme.of(context).colorScheme.primary : null,
                                ),
                                const SizedBox(
                                  width: 4,
                                ),
                                Text(post['collectedByCount'].toString())
                              ],
                            ),
                          ))
                    ],
                  )
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
