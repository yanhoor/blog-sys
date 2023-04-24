import 'package:blog_vipot/components/custom/custom_icon_button.dart';
import 'package:blog_vipot/components/helper/dialog_helper.dart';
import 'package:blog_vipot/components/user/user_group_select.dart';
import 'package:blog_vipot/notifiers/global_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:blog_vipot/http/index.dart';
import '../helper/bot_toast_helper.dart';

class UserActionsDropdown extends StatefulWidget{
  final Map<String, dynamic> user;

  const UserActionsDropdown({super.key, required this.user});

  @override
  State<UserActionsDropdown> createState()=> _UserActionsDropdownState();
}

class _UserActionsDropdownState extends State<UserActionsDropdown>{

  handleFollow() async{
    try{
      var res = await $http.fetch(ApiUrl.USER_FOLLOW, params: { 'id': widget.user['id'], 'type': 1 });

      if(res['success']){
        setState(() {
          widget.user['isFollowing'] = true;
          if(widget.user['isMyFan'] != null && widget.user['isMyFan']) widget.user['isMutualFollowing'] = true;
        });
        ToastHelper.success('关注成功');
      }else{
        ToastHelper.error(res['msg'] ?? '操作失败');
        return Future.error(res['msg']);
      }
    }catch(e){
      return Future.error(e.toString());
    }
  }

  handleUnfollow(context) async{
    DialogHelper.showIOSAlertDialog(
        context: context,
        message: '确定取消关注${widget.user['name']}吗？',
        onConfirm: () async{
          try{
            var res = await $http.fetch(ApiUrl.USER_FOLLOW, params: { 'id': widget.user['id'], 'type': 2 });

            if(res['success']){
              setState(() {
                widget.user['isFollowing'] = false;
                widget.user['isMutualFollowing'] = false;
              });
              ToastHelper.success('取消关注成功');
            }else{
              ToastHelper.error(res['msg'] ?? '操作失败');
              return Future.error(res['msg']);
            }
          }catch(e){
            return Future.error(e.toString());
          }
        }
    );
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<GlobalNotifier>(
        builder: (_, model, child){
          var myInfo = model.myInfo;

          Widget btnContent;

          if(myInfo == null || myInfo['id'] == widget.user['id']){
            return Container();
          }else if(widget.user['isMutualFollowing'] != null && widget.user['isMutualFollowing']){
            btnContent = const Icon(Icons.check_circle, size: 28,);
          }else if(widget.user['isFollowing']){
            btnContent = const Icon(Icons.check_circle_outline, size: 28,);
          }else{
            return CustomIconButton(
              onPressed: (){
                handleFollow();
              },
              icon: Icon(Icons.add_circle, color: Theme.of(context).colorScheme.primary, size: 28,),
            );
          }

          return PopupMenuButton<int>(
            itemBuilder: (BuildContext context){
              return const [
                PopupMenuItem(value: 1,child: Text("取消关注"),),
                PopupMenuItem(value: 2,child: Text("设置分组"),),
              ];
            },
            onSelected: (v){
              if(v == 1){
                handleUnfollow(context);
              }
              if(v == 2){
                showModalBottomSheet(
                    context: context,
                    builder: (dialogContext){
                      return Material(
                        child: SizedBox(
                          height: MediaQuery.of(context).size.height * 0.6,
                          child: UserGroupSelect(
                            user: widget.user,
                            onSave: (){
                              Navigator.of(dialogContext).pop(true);
                            },
                          ),
                        ),
                      );
                    }
                );
              }
            },
            child: btnContent,
          );
        }
    );
  }
}
