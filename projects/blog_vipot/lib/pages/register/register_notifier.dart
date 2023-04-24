import 'package:blog_vipot/components/helper/bot_toast_helper.dart';
import 'package:blog_vipot/http/index.dart';
import 'package:blog_vipot/notifiers/global_notifier.dart';
import 'package:blog_vipot/notifiers/state_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';

import '../../route/route_name.dart';
import '../../storage/storage_manager.dart';

class RegisterNotifier extends StateNotifier{
  GlobalKey<FormState> formKey = GlobalKey<FormState>();
  // final TextEditingController userNameController = TextEditingController();
  // final TextEditingController pwdController = TextEditingController();
  Map<String, String> editForm = {
    'name': '',
    'mobile': '',
    'password': '',
    'repeatPassword': '',
  };

  doRegister() async{
    var form = formKey.currentState; // 或者Form.of(context)
    if(form!.validate()){
      form.save();
      setBusy();
      try{
        var res = await $http.fetch(ApiUrl.USER_REGISTER, params: editForm);
        setComplete();
        if(res['success']){
          ToastHelper.success('注册成功');
          return true;
        }else{
          ToastHelper.error(res['msg'] ?? '注册失败');
          return false;
        }
      }catch(e){
        setComplete();
        return false;
      }
    }
  }
}