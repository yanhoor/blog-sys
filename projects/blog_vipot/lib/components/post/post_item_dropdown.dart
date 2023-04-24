import 'package:blog_vipot/components/helper/bot_toast_helper.dart';
import 'package:blog_vipot/components/helper/dialog_helper.dart';
import 'package:blog_vipot/notifiers/global_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../http/index.dart';

class PostItemDropdown extends StatefulWidget{
  final Map<String, dynamic> post;
  Function()? onDelete;
  Icon? trigger;

  PostItemDropdown({super.key, required this.post, this.onDelete, this.trigger = const Icon(Icons.expand_more_rounded)});

  @override
  State<PostItemDropdown> createState() => _PostItemDropdownState();
}

class _PostItemDropdownState extends State<PostItemDropdown>{

  handleDelete() async{
    DialogHelper.showIOSAlertDialog(
        context: context,
        message: '确定删除该博客吗？',
        confirmBtnText: '删除',
        confirmBtnColor: Colors.redAccent,
        onConfirm: () async{
          try{
            var res = await $http.fetch(ApiUrl.BLOG_DELETE, params: { 'id':  widget.post['id'] });
            if(res['success']){
              ToastHelper.success('已删除');
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

  @override
  Widget build(BuildContext context) {
    return Consumer<GlobalNotifier>(
        builder: (_, model, child){
          return PopupMenuButton<String>(
            child: widget.trigger,
            itemBuilder: (BuildContext context){
              return [
                if(model.myInfo != null && model.myInfo!['id'] == widget.post['createBy']['id']) PopupMenuItem(
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
                PopupMenuItem(
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
                PopupMenuItem(
                  value: 'browser',
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: const [
                      Icon(Icons.public, size: 18),
                      SizedBox(width: 12,),
                      Text('浏览器打开')
                    ],
                  ),
                ),
              ];
            },
            onSelected: (v){
              switch(v){
                case 'delete':
                  handleDelete();
                  break;
                case 'copy':
                  Clipboard.setData(ClipboardData(text: widget.post['content']));
                  break;
                case 'browser':
                  launchUrl(Uri.parse('https://niubility.website/blog/post/${widget.post['id']}'));
                  break;
              }
            },
          );
        }
    );
  }
}