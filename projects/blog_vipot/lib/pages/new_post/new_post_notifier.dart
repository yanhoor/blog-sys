import 'package:blog_vipot/notifiers/state_notifier.dart';
import 'package:flutter/cupertino.dart';

import 'package:blog_vipot/components/helper/bot_toast_helper.dart';
import 'package:blog_vipot/http/index.dart';

class NewPostNotifier extends StateNotifier{
  GlobalKey<FormState> formKey = GlobalKey<FormState>();
  int uploadKey = DateTime.now().millisecondsSinceEpoch;
  TextEditingController textEditController = TextEditingController();
  Map<String, dynamic> editForm = {
    'content': '',
    'medias': [],
  };

  Future<bool> handleSubmitForm() async{
    var form = formKey.currentState; // 或者Form.of(context)
    if(editForm['content'].isEmpty){
      ToastHelper.warning('请输入内容');
      return false;
    }

    if(form!.validate()){
      // form.save();
      setBusy();
      try{
        var res = await $http.fetch(ApiUrl.BLOG_EDIT, params: editForm);
        setComplete();
        if(res['success']){
          ToastHelper.success('发布成功');
          textEditController.text = '';
          editForm['content'] = '';
          editForm['medias'] = [];
          uploadKey = DateTime.now().millisecondsSinceEpoch;
          notifyListeners();
          return true;
        }else{
          ToastHelper.error(res['msg'] ?? '发布失败');
          return false;
        }
      }catch(e){
        setComplete();
        return false;
      }
    }else{
      return false;
    }
  }
}