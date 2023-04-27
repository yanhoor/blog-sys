import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../../http/index.dart';
import '../../route/route_name.dart';
import '../../utils/time_util.dart';
import '../expandable_content.dart';
import '../helper/bot_toast_helper.dart';
import '../media/media_image_item.dart';
import '../user/user_avatar.dart';
import '../user/user_name.dart';
import 'comment_reply_modal.dart';

class CommentItem extends StatefulWidget{
  final Map<String, dynamic> comment;
  Function()? onReplySuccess;
  final ScrollController scrollController;
  
  CommentItem({super.key, required this.comment, this.onReplySuccess, required this.scrollController});

  @override
  State<CommentItem> createState() => _CommentItemState();
}

class _CommentItemState extends State<CommentItem>{

  void handleLikeComment() async{
    try{
      var res = await $http.fetch(ApiUrl.COMMENT_LIKE, params: {
        'id': widget.comment['id'],
        'isLike': widget.comment['isLike'] ? 0 : 1
      });
      if(res['success']) {
        setState(() {
          widget.comment['isLike'] = !widget.comment['isLike'];
          widget.comment['isLike'] ? widget.comment['likedByCount'] ++ : widget.comment['likedByCount'] --;
        });
      }
    }catch(e){
      ToastHelper.error('操作失败');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              UserAvatar(user: widget.comment['createBy']),
              const SizedBox(width: 6,),
              Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      UserName(user: widget.comment['createBy']),
                      const SizedBox(height: 2),
                      Text(
                        TimeUtil.formatTime(widget.comment['createdAt']),
                        style: TextStyle(color: Theme.of(context).hintColor, fontSize: 12),
                      ),
                    ],
                  )
              ),
              if(widget.comment['likedByCount'] != null) GestureDetector(
                onTap: handleLikeComment,
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Icon(
                      widget.comment['isLike']
                          ? Icons.thumb_up_alt
                          : Icons.thumb_up_alt_outlined,
                      size: 18,
                      color: widget.comment['isLike'] ? Theme.of(context).colorScheme.primary : Theme.of(context).hintColor,
                    ),
                    if(widget.comment['likedByCount'] > 0) Text(widget.comment['likedByCount'].toString())
                  ],
                ),
              )
            ],
          ),
          GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: () {
              showCommentReplyBottomSheet(
                pageContext: context,
                postId: widget.comment['blogId'].toString(),
                comment: widget.comment,
                onSuccess: widget.onReplySuccess,
              );
            },
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [

                const SizedBox(height: 6),
                ExpandableContent(
                  content: widget.comment['content'] ?? (widget.comment['replyComment'] != null ? '图片回复' : '图片评论'),
                  scrollController: widget.scrollController,
                  onTap: () {
                    showCommentReplyBottomSheet(
                      pageContext: context,
                      postId: widget.comment['blogId'].toString(),
                      comment: widget.comment,
                      onSuccess: widget.onReplySuccess,
                    );
                  },
                  prefix: widget.comment['replyComment'] != null ? TextSpan(
                      children: [
                        if(widget.comment['replyComment']['topCommentId'] != null)TextSpan(
                            children: [
                              const TextSpan(text: '回复 '),
                              TextSpan(text: '@${widget.comment['replyComment']['createBy']['name']}: ', style: TextStyle(color: Theme.of(context).colorScheme.primary)),
                            ]
                        )
                      ]
                  ) : null,
                ),
                if(widget.comment['image'] != null) ...[
                  const SizedBox(height: 8,),
                  Container(
                      constraints: BoxConstraints(
                        maxWidth: MediaQuery.of(context).size.width * 0.8,
                        maxHeight: MediaQuery.of(context).size.width * 0.8 * 3 / 4,
                      ),
                      child: GestureDetector(
                        onTap: (){
                          Navigator.of(context).pushNamed(RouteName.imagePreview, arguments: { 'imageList': [widget.comment['image']['url']], 'initPage': 0});
                        },
                        child: MediaImageItem(url: widget.comment['image']['url'], fit: BoxFit.scaleDown, ratio: 60,),
                      )
                  )
                ],


                // 回复列表
                if (widget.comment['childComments'] != null && widget.comment['childComments'].length > 0) ...[
                  const SizedBox(
                    height: 8,
                  ),
                  GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTap: (){
                      Navigator.of(context).pushNamed(RouteName.commentDetail,
                          arguments: {'commentId': widget.comment['id']});
                    },
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                          color: Theme.of(context).scaffoldBackgroundColor,
                          borderRadius: BorderRadius.circular(5)
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ListView.builder(
                              physics: const NeverScrollableScrollPhysics(),
                              shrinkWrap: true,
                              padding: EdgeInsets.zero,
                              itemCount: widget.comment['childComments'].length,
                              itemBuilder: (_, index) {
                                Map<String, dynamic> reply = widget.comment['childComments'][index];

                                return Container(
                                  key: ValueKey<int>(reply['id']),
                                  padding: const EdgeInsets.only(bottom: 4),
                                  child: ExpandableContent(
                                    content: reply['content'] ?? '',
                                    imageUrl: reply['image'] == null ? null : reply['image']['url'],
                                    prefix: TextSpan(
                                        children: [
                                          reply['replyComment']['topCommentId'] != null
                                              ? TextSpan(
                                              children: [
                                                TextSpan(text: '@${reply['createBy']['name']}', style: TextStyle(color: Theme.of(context).colorScheme.primary)),
                                                const TextSpan(text: ' 回复 '),
                                                TextSpan(text: '@${reply['replyComment']['createBy']['name']}: ', style: TextStyle(color: Theme.of(context).colorScheme.primary)),
                                              ]
                                          )
                                              : TextSpan(text: '@${reply['createBy']['name']}: ', style: TextStyle(color: Theme.of(context).colorScheme.primary)),
                                        ]
                                    ),
                                    onTap: (){
                                      Navigator.of(context).pushNamed(RouteName.commentDetail,arguments: {'commentId': widget.comment['id']});
                                    },
                                  ),
                                );
                              }
                          ),
                          if(widget.comment['childCommentsCount'] > 2) Row(
                            children: [
                              Text('共 ${widget.comment['childCommentsCount'].toString()} 条回复', style: TextStyle(color: Theme.of(context).colorScheme.primary),),
                              Icon(Icons.keyboard_arrow_down, color: Theme.of(context).colorScheme.primary)
                            ],
                          )
                        ],
                      ),
                    ),
                  ),
                ]
              ],
            ),
          )
        ],
      ),
    );
  }
}