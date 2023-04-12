import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:blog_vipot/notifiers/global_notifier.dart';

import '../../http/index.dart';
import '../user/user_avatar.dart';

showCommentReplyBottomSheet(
    {required BuildContext pageContext,
    required String postId,
    Map<String, dynamic>? comment,
      Function(BuildContext ctx)? onSuccess
    }) {
  var myInfo = Provider.of<GlobalNotifier>(pageContext, listen: false).myInfo;
  if (myInfo == null) return;

  showModalBottomSheet(
      context: pageContext,
      builder: (BuildContext ctx) {
        return Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: Theme.of(pageContext).cardColor,
            // borderRadius: const BorderRadius.only(
            //     topLeft: Radius.circular(10),
            //     topRight: Radius.circular(10)
            // )
          ),
          child: SafeArea(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                UserAvatar(user: myInfo),
                const SizedBox(
                  width: 10,
                ),
                Expanded(
                    child: TextField(
                  textInputAction: TextInputAction.send,
                  maxLines: 3,
                  decoration: InputDecoration(
                      // hintText: '请输入内容',
                      labelText: comment == null ? '发表评论' : '回复@${comment['createBy']['name']}',
                      border: const OutlineInputBorder()),
                  // onChanged: (val){
                  //
                  // },
                  onSubmitted: (v) async {
                    try{
                      var res = await $http.fetch(ApiUrl.COMMENT_COMMIT, params: {
                        'blogId': postId,
                        'content': v.trim(),
                        if(comment != null) ...{
                          'replyCommentId': comment['id'],
                          'replyToId': comment['createBy']['id'],
                          'topCommentId': comment['topCommentId'] ?? comment['id'],
                        }
                      });
                      if(ctx.mounted && res['success']) onSuccess?.call(ctx);
                    }catch(e){}
                  },
                ))
              ],
            ),
          ),
        );
      });
}
