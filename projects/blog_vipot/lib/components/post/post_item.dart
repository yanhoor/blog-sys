import 'package:blog_vipot/components/post/post_item_dropdown.dart';
import 'package:flutter/material.dart';
import 'package:blog_vipot/route/route_name.dart';
import 'package:provider/provider.dart';
import '../../http/index.dart';
import '../../notifiers/global_notifier.dart';
import '../helper/bot_toast_helper.dart';
import '../user/user_avatar.dart';
import '../user/user_name.dart';
import '../media/media_list.dart';
import '../expandable_content.dart';
import '../../utils/time_util.dart';
import '../y-card.dart';

class PostItem extends StatefulWidget {
  final Map<String, dynamic> post;
  final ScrollController scrollController;
  final Function(Map<String, dynamic>) onUpdatePost;
  Function()? onDelete;

  PostItem(
      {super.key, required this.post, required this.scrollController, required this.onUpdatePost, this.onDelete});

  @override
  State<StatefulWidget> createState() => _PostItemState();
}

class _PostItemState extends State<PostItem>{
  late Map<String, dynamic> post;

  @override
  void initState() {
    super.initState();
    post = widget.post;
  }

  bool checkLoginStatus(){
    var myInfo = Provider.of<GlobalNotifier>(context, listen: false).myInfo;
    if(myInfo == null){
      ToastHelper.warning('请先登录');
      Navigator.of(context).pushNamed(RouteName.login);
      return false;
    }
    return true;
  }

  handleLikePost() async{
    if(!checkLoginStatus()) return;

    try{
      var res = await $http.fetch(ApiUrl.BLOG_LIKE, params: { 'id':  post['id'], 'isLike': post['isLike'] ? 0 : 1 });
      if(res['success']){
        setState(() {
          post['isLike'] = !post['isLike'];
          post['likedByCount'] = post['likedByCount'] + (post['isLike'] ? 1 : -1);
        });
        widget.onUpdatePost(post);
      }
    }catch(e){
      // print('=========${jsonEncode(e)}');
    }
  }

  handleCollectPost() async{
    if(!checkLoginStatus()) return;

    try{
      var res = await $http.fetch(ApiUrl.BLOG_COLLECT, params: { 'id':  post['id'], 'isCollect': post['isCollect'] ? 0 : 1 });
      if(res['success']){
        setState(() {
          post['isCollect'] = !post['isCollect'];
          post['collectedByCount'] = post['collectedByCount'] + (post['isCollect'] ? 1 : -1);
        });
        widget.onUpdatePost(post);
      }
    }catch(e){
      // print('=========${jsonEncode(e)}');
    }
  }

  @override
  Widget build(BuildContext context) {
    return YCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.center,
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
                            style: TextStyle(color: Theme.of(context).hintColor, fontSize: 12),
                          )
                        ],
                      )
                    ],
                  )
              ),
              PostItemDropdown(post: post, onDelete: widget.onDelete,)
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
                  scrollController: widget.scrollController,
                  onTap: () {
                    Navigator.of(context).pushNamed(RouteName.post,
                        arguments: {'postId': post['id']});
                  },
                ),
                if(post['medias'].isNotEmpty) ...[
                  const SizedBox(
                    height: 6,
                  ),
                  MediaList(
                      mediaList: post['medias']
                  ),
                ],
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
    );
  }
}
