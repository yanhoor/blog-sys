import 'package:blog_vipot/components/comment/comment_item_actions.dart';
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
  final Function() onDelete;
  final ScrollController scrollController;
  
  CommentItem({super.key, required this.comment, this.onReplySuccess, required this.scrollController, required this.onDelete});

  @override
  State<CommentItem> createState() => _CommentItemState();
}

class _CommentItemState extends State<CommentItem>{

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            UserAvatar(user: widget.comment['createBy']),
            const SizedBox(width: 6,),
            Expanded(
                child: UserName(user: widget.comment['createBy'])
            ),
          ],
        ),
        Flexible(
          fit: FlexFit.loose,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Flexible(
                    fit: FlexFit.loose,
                    child: GestureDetector(
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
                              prefix: widget.comment['replyComment'] != null && widget.comment['replyComment']['topCommentId'] != null ? Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Text('回复'),
                                  const SizedBox(width: 2,),
                                  UserName(user: widget.comment['replyComment']['createBy'], showAt: true,),
                                  const SizedBox(width: 2,),
                                  const Text(': '),
                                ],
                              ) : null
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
                        ],
                      ),
                    )
                ),

                // 操作
                const SizedBox(height: 4),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.start,
                  mainAxisSize: MainAxisSize.max,
                  children: [
                    Text(
                      TimeUtil.formatTime(widget.comment['createdAt']),
                      style: TextStyle(color: Theme.of(context).hintColor, fontSize: 12),
                    ),
                    Expanded(
                        child: CommentItemDActions(
                          comment: widget.comment,
                          trigger: const Icon(Icons.more_horiz_outlined),
                          onDelete: widget.onDelete,
                        )
                    ),
                  ],
                ),


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
                                    content: reply['content'],
                                    imageUrl: reply['image'] == null ? null : reply['image']['url'],
                                    prefix: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        if(reply['replyComment']['topCommentId'] == null) ...[
                                          UserName(user: reply['createBy'], showAt: true,),
                                          const SizedBox(width: 2,),
                                          const Text(': '),
                                        ]
                                        else ...[
                                          UserName(user: reply['createBy'], showAt: true,),
                                          const SizedBox(width: 2,),
                                          const Text('回复'),
                                          const SizedBox(width: 2,),
                                          UserName(user: reply['replyComment']['createBy'], showAt: true,),
                                          const SizedBox(width: 2,),
                                          const Text(': '),
                                          const SizedBox(width: 2,),
                                        ]
                                      ],
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
            )
        )
      ],
    );
  }
}