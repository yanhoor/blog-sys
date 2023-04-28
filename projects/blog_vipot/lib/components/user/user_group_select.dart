import 'package:blog_vipot/components/state/state_button_busy.dart';
import 'package:blog_vipot/notifiers/global_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:blog_vipot/http/index.dart';
import 'package:blog_vipot/route/route_name.dart';
import '../helper/bot_toast_helper.dart';

class UserGroupSelect extends StatefulWidget{
  final Map<String, dynamic> user;
  final Function onSave;

  const UserGroupSelect({super.key, required this.user, required this.onSave});

  @override
  State<UserGroupSelect> createState() => _UserGroupSelectState();
}

class _UserGroupSelectState extends State<UserGroupSelect>{
  List<int> checkedList = [];
  bool loading = false;

  @override
  void initState() {
    super.initState();
    getContainList();
  }

  getContainList() async{
    if(loading) return;

    try{
      setState(() {
        loading = true;
      });
      var res = await $http.fetch(ApiUrl.GROUP_CONTAIN_LIST, params: { 'userId': widget.user['id'] });

      setState(() {
        loading = false;
      });
      if(res['success']){
        List list = res['result'];
        setState(() {
          checkedList.addAll(list.map((g) => g['id'] as int).toList());
        });
        return true;
      }else{
        return false;
      }
    }catch(e){
      setState(() {
        loading = false;
      });
      return false;
    }
  }

  handleSetGroup() async{
    try{
      var res = await $http.fetch(ApiUrl.USER_SET_GROUP, params: { 'userId': widget.user['id'], 'groupId': checkedList.join(',') });

      if(res['success']){
        ToastHelper.success('已关注');
        widget.onSave();
        return true;
      }else{
        ToastHelper.error(res['msg'] ?? '操作失败');
        return false;
      }
    }catch(e){
      return false;
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: Consumer<GlobalNotifier>(
          builder: (_, model, child){
            return Container(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const Text('设置分组', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w500),),
                  Expanded(
                      child:
                      Wrap(
                        spacing: 15,
                        runSpacing: 5,
                        children: model.allGroupList.map((group) => FilterChip(
                            label: Text(group['name'], style: TextStyle(color: checkedList.contains(group['id']) ? Colors.white : null),),
                            checkmarkColor: Colors.white,
                            selected: checkedList.contains(group['id']),
                            selectedColor: Theme.of(context).colorScheme.primary,
                            onSelected: (v){
                              if(v){
                                if(checkedList.contains(group['id'])) return;

                                setState(() {
                                  checkedList.add(group['id']);
                                });
                              }else{
                                setState(() {
                                  checkedList.remove(group['id']);
                                });
                              }
                            }
                        )).toList(),
                      ),
                  ),
                  SizedBox(
                    width: double.infinity,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        ElevatedButton(
                            onPressed: (){
                              handleSetGroup();
                            },
                            child: loading ? const StateButtonBusy() : const Text('保存')
                        ),
                        OutlinedButton(
                            onPressed: (){
                              Navigator.of(context).pushNamed(RouteName.groupManage);
                            },
                            child: const Text('分组管理')
                        )
                      ],
                    ),
                  )
                ],
              ),
            );
          },
        )
    );
  }
}