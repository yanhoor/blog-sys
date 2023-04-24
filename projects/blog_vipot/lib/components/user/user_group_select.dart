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


  @override
  void initState() {
    super.initState();
    getContainList();
  }

  getContainList() async{
    try{
      var res = await $http.fetch(ApiUrl.GROUP_CONTAIN_LIST, params: { 'userId': widget.user['id'] });

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
                      child: ListView.separated(
                          shrinkWrap: true,
                          itemBuilder: (_, index){
                            var group = model.allGroupList[index];
                            return CheckboxListTile(
                                contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 12),
                                value: checkedList.contains(group['id']),
                                title: Text(group['name']),
                                onChanged: (v){
                                  if(v == null) return;

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
                            );
                          },
                          separatorBuilder: (_, __){
                            return const Divider();
                          },
                          itemCount: model.allGroupList.length
                      )
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
                            child: const Text('保存')
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