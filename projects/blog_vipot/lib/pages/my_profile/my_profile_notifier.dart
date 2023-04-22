import 'package:blog_vipot/components/helper/bot_toast_helper.dart';
import 'package:blog_vipot/notifiers/base_fetch_notifier.dart';
import 'package:blog_vipot/notifiers/global_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';
import 'package:blog_vipot/http/index.dart';

class MyProfileNotifier extends BaseFetchNotifier{
  GlobalKey<FormState> formKey = GlobalKey<FormState>();
  Map<String, dynamic> editForm;

  MyProfileNotifier({ required this.editForm });

  onChangeGender(int? v){
    if(v == null) return;

    editForm['gender'] = v;
    notifyListeners();
  }

  @override
  Future getData() async{
    try{
      var res = await Provider.of<GlobalNotifier>(pageContext!, listen: false).getUserInfo(false);
    }catch(e){
      return Future.error(e.toString());
    }
  }

  handleSave() async{
    var form = formKey.currentState; // 或者Form.of(context)
    if(form!.validate()){
      form.save();
      setBusy();
      try{
        var res = await $http.fetch(ApiUrl.USER_UPDATE, params: {
          'name': editForm['name'],
          'avatar': editForm['avatar'],
          'profileCardBg': editForm['profileCardBg'],
          'gender': editForm['gender'],
          'birthday': editForm['birthday'],
          'introduce': editForm['introduce'],
        });

        setComplete();
        if(res['success']){
          ToastHelper.success('已更新');
          refreshData();
          Navigator.of(pageContext!).pop();
        }else{
          ToastHelper.error(res['msg'] ?? '操作失败');
        }
      }catch(e){
        setComplete();
        return Future.error(e.toString());
      }
    }
  }
}
