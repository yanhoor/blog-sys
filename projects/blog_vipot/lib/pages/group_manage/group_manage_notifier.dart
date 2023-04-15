import 'package:blog_vipot/components/helper/bot_toast_helper.dart';
import 'package:blog_vipot/components/helper/dialog_helper.dart';
import 'package:blog_vipot/notifiers/base_fetch_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:blog_vipot/http/index.dart';
import 'package:provider/provider.dart';

import '../../notifiers/global_notifier.dart';

class GroupManageNotifier extends BaseFetchNotifier{
  List pageList = [];
  Map<String, dynamic>? _selectedGroup;
  Map<String, dynamic> editForm = {
    'id': '',
    'name': '',
  };
  TextEditingController editingController = TextEditingController();

  @override
  Future getData() async {
    bool result = await Provider.of<GlobalNotifier>(pageContext!, listen: false).getAllGroup();
    pageList.clear();
    pageList.addAll(Provider.of<GlobalNotifier>(pageContext!, listen: false).groupList);
    notifyListeners();
    return result;
  }

  handleEditGroup() async{
    if((editForm['name'] as String).isEmpty){
      ToastHelper.warning('分组名称不能为空');
      return;
    }

    if((editForm['name'] as String).length > 8){
      ToastHelper.warning('分组名称不能超过8个字符');
      return;
    }

    try{
      var res = await $http.fetch(ApiUrl.GROUP_EDIT, params: editForm);
      if(res['success']){
        getData();
        selectedGroup = null;
        ToastHelper.success('保存成功');
      }else{
        ToastHelper.error(res['msg'] ?? '保存失败');
      }
    }catch(e){

    }
  }

  handleDeleteGroup() async{
    DialogHelper.showIOSAlertDialog(
        context: pageContext!,
        message: '确定删除吗？',
        onConfirm: () async {
          try{
            var res = await $http.fetch(ApiUrl.GROUP_DELETE, params: { 'id': editForm['id'] });
            if(res['success']){
              getData();
              selectedGroup = null;
              ToastHelper.success('删除成功');
            }else{
              ToastHelper.error(res['msg'] ?? '删除失败');
            }
          }catch(e){

          }
        });
  }

  handleCommitSort() async{
    try{
      var res = await $http.fetch(ApiUrl.GROUP_SORT, params: {'ids': pageList.map((e) => e['id']).join(',')});
      if(res['success']){
      }else{
        ToastHelper.error(res['msg'] ?? '保存失败');
      }
    }catch(e){

    }
    getData();
  }

  onReorder(int oldIndex, int newIndex){
    var item = pageList.removeAt(oldIndex);
    pageList.insert(newIndex, item);
    notifyListeners();
    handleCommitSort();
  }

  Map<String, dynamic>? get selectedGroup => _selectedGroup;

  set selectedGroup(Map<String, dynamic>? value) {
    _selectedGroup = value;
    if(value != null) {
      editForm = value;
    }else{
      editForm = {
        'id': '',
        'name': '',
      };
    }
    editingController.text = editForm['name'];
    notifyListeners();
  }
}