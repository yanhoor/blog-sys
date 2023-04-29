import 'package:blog_vipot/http/index.dart';
import 'package:blog_vipot/notifiers/global_notifier.dart';
import 'package:blog_vipot/notifiers/state_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';

import '../../route/route_name.dart';
import '../../storage/storage_manager.dart';

class LoginNotifier extends StateNotifier{
  final BuildContext pageContext;
  GlobalKey<FormState> loginKey = GlobalKey<FormState>();
  final TextEditingController userNameController = TextEditingController();
  final TextEditingController pwdController = TextEditingController();
  bool _hidePassword = true;
  bool _rememberPassword = false;
  Map<String, String> loginForm = {
    'mobile': '',
    'password': '',
  };

  LoginNotifier({required this.pageContext}){
    rememberPassword = MyStorageManager.sharedPreferences.getBool(MyStorageManager.REMEMBER_PASSWORD) ?? false;
    loginForm['mobile'] = MyStorageManager.sharedPreferences.getString(MyStorageManager.LOGIN_MOBILE) ?? '';
    loginForm['password'] = MyStorageManager.sharedPreferences.getString(MyStorageManager.LOGIN_PASSWORD) ?? '';
    Future.delayed(const Duration()).then((value) {
      userNameController.text = loginForm['mobile']!;
      pwdController.text = loginForm['password']!;
    });
  }

  doLogin() async{
    var form = loginKey.currentState; // 或者Form.of(context)
    if(form!.validate()){
      form.save();
      setBusy();
      try{
        var res = await $http.fetch(ApiUrl.LOGIN, params: loginForm);
        setComplete();
        if(res['success']){
          await MyStorageManager.sharedPreferences.setString(MyStorageManager.TOKEN, res['result']);
          if(rememberPassword){
            await MyStorageManager.sharedPreferences.setString(MyStorageManager.LOGIN_MOBILE, loginForm['mobile'] ?? '');
            await MyStorageManager.sharedPreferences.setString(MyStorageManager.LOGIN_PASSWORD, loginForm['password'] ?? '');
          }
          if(pageContext.mounted) {
            Provider.of<GlobalNotifier>(pageContext, listen: false).getUserInfo();
            Navigator.of(pageContext).pop();
            // Navigator.of(pageContext).popUntil(ModalRoute.withName(RouteName.root));
          }
        }
      }catch(e){
        setComplete();
      }
    }
  }

  bool get rememberPassword => _rememberPassword;

  set rememberPassword(bool value) {
    _rememberPassword = value;
    MyStorageManager.sharedPreferences.setBool(MyStorageManager.REMEMBER_PASSWORD, value);
    notifyListeners();
  }

  bool get hidePassword => _hidePassword;

  set hidePassword(bool value) {
    _hidePassword = value;
    notifyListeners();
  }
}