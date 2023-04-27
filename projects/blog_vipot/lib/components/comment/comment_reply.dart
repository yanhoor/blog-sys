import 'package:blog_vipot/components/media/media_image_item.dart';
import 'package:blog_vipot/notifiers/global_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../http/index.dart';
import '../helper/bot_toast_helper.dart';
import '../upload_img.dart';
import '../user/user_avatar.dart';

class CommentReply extends StatefulWidget{
  final String postId;
  Map<String, dynamic>? comment;
  Function()? onSuccess;

  CommentReply({
    super.key,
    this.comment,
    this.onSuccess,
    required this.postId
  });

  @override
  State<CommentReply> createState() => _CommentReplyState();
}

class _CommentReplyState extends State<CommentReply>{
  Map<String, dynamic>? replyImage;
  String content = '';

  @override
  void initState() {
    super.initState();
    debugPrint('========_CommentReplyState initState========${widget.comment!['id']}');
  }

  @override
  void dispose() {
    super.dispose();
    debugPrint('========_CommentReplyState dispose========${widget.comment!['id']}');
  }

  void handleSubmit() async{
    if(content.isEmpty && replyImage == null) return;

    try{
      var res = await $http.fetch(ApiUrl.COMMENT_COMMIT, params: {
        'blogId': widget.postId,
        'content': content.isEmpty ? null : content,
        'imageId': replyImage == null ? null : replyImage!['id'],
        if(widget.comment != null) ...{
          'replyCommentId': widget.comment!['id'],
          'replyToId': widget.comment!['createBy']['id'],
          'topCommentId': widget.comment!['topCommentId'] ?? widget.comment!['id'],
        }
      });
      if(res['success']) {
        widget.onSuccess?.call();
        ToastHelper.success('发表成功');
      }
    }catch(e){
      ToastHelper.error('操作失败');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<GlobalNotifier>(
        builder: (_, model, child){
          return Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              UserAvatar(user: model.myInfo!),
              const SizedBox(
                width: 10,
              ),
              Expanded(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      TextField(
                        textInputAction: TextInputAction.send,
                        maxLines: 3,
                        autofocus: true,
                        decoration: InputDecoration(
                          // hintText: '请输入内容',
                            labelText: widget.comment == null ? '发表评论' : '回复@${widget.comment!['createBy']['name']}',
                            border: const OutlineInputBorder()),
                        onChanged: (v){
                          content = v.trim();
                        },
                        onSubmitted: (v) async {
                          content = v.trim();
                          handleSubmit();
                        },
                      ),
                      // const SizedBox(height: 6,),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          UploadImg(
                            key: ValueKey<String>(replyImage == null ? '' : replyImage!['url']),
                            width: 32,
                            height: 32,
                            size: 'mini',
                            url: replyImage == null ? '' : replyImage!['url'],
                            preview: replyImage == null ? null : MediaImageItem(url: replyImage!['url']),
                            onUploadCompleted: (path, file){
                              setState(() {
                                replyImage = file;
                              });
                            },
                          ),
                          CupertinoButton(
                              onPressed: handleSubmit,
                              child: const Text('发送')
                          )
                        ],
                      )
                    ],
                  )
              )
            ],
          );
        }
    );
  }
}