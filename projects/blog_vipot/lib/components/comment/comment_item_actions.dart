import 'package:blog_vipot/components/helper/bot_toast_helper.dart';
import 'package:blog_vipot/components/helper/dialog_helper.dart';
import 'package:blog_vipot/notifiers/global_notifier.dart';
import 'package:blog_vipot/route/route_name.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../../http/index.dart';

class CommentItemDActions extends StatefulWidget{
  final Map<String, dynamic> comment;
  Function()? onDelete;
  Icon? trigger;

  CommentItemDActions({super.key, required this.comment, this.onDelete, this.trigger = const Icon(Icons.expand_more_rounded)});

  @override
  State<CommentItemDActions> createState() => _CommentItemActionsState();
}

class _CommentItemActionsState extends State<CommentItemDActions>{

  handleDelete() async{
    DialogHelper.showIOSAlertDialog(
        context: context,
        message: '确定删除该评论吗？该评论的所有回复也会被删除',
        confirmBtnText: '删除',
        confirmBtnColor: Colors.redAccent,
        onConfirm: () async{
          try{
            var res = await $http.fetch(ApiUrl.COMMENT_DELETE, params: { 'id':  widget.comment['id'] });
            if(res['success']){
              ToastHelper.success('评论已删除');
              widget.onDelete?.call();
            }else{
              ToastHelper.error(res['msg'] ?? '删除失败');
            }
          }catch(e){
            // print('=========${jsonEncode(e)}');
          }
        }
    );
  }

  void handleLikeComment() async{
    var myInfo = Provider.of<GlobalNotifier>(context, listen: false).myInfo;
    if(myInfo == null){
      ToastHelper.warning('请先登录');
      Navigator.of(context).pushNamed(RouteName.login);
      return;
    }

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
      }else{
        ToastHelper.error(res['msg'] ?? '点赞失败');
      }
    }catch(e){
      ToastHelper.error('点赞失败');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<GlobalNotifier>(
        builder: (_, model, child){
          List<PopupMenuItem<String>> itemList= [
            if(model.myInfo != null && model.myInfo!['id'] == widget.comment['createById']) PopupMenuItem(
              value: 'delete',
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: const [
                  Icon(Icons.delete_outline, size: 18, color: Colors.redAccent,),
                  SizedBox(width: 12,),
                  Text('删除', style: TextStyle(color: Colors.redAccent),)
                ],
              ),
            ),
            if(widget.comment['content'] != null) PopupMenuItem(
              value: 'copy',
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: const [
                  Icon(Icons.copy, size: 18),
                  SizedBox(width: 12,),
                  Text('复制内容')
                ],
              ),
            ),
          ];

          return Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              if(widget.comment['likedByCount'] != null) ...[
                GestureDetector(
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
                      if(widget.comment['likedByCount'] > 0) ...[
                        const SizedBox(width: 3,),
                        Text(widget.comment['likedByCount'].toString())
                      ]
                    ],
                  ),
                ),
                const SizedBox(width: 12,)
              ],
              if(itemList.isNotEmpty) PopupMenuButton<String>(
                child: widget.trigger,
                itemBuilder: (BuildContext context){
                  return itemList;
                },
                onSelected: (v){
                  switch(v){
                    case 'delete':
                      handleDelete();
                      break;
                    case 'copy':
                      Clipboard.setData(ClipboardData(text: widget.comment['content']));
                      break;
                  }
                },
              )
            ],
          );
        }
    );
  }
}