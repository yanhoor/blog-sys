import 'package:blog_vipot/components/y-card.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'package:blog_vipot/components/state/state_button_busy.dart';
import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:blog_vipot/route/route_name.dart';
import 'login_notifier.dart';

class LoginPage extends StatefulWidget{
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage>{
  @override
  Widget build(BuildContext context) {
    return ProviderWidget<LoginNotifier>(
        model: LoginNotifier(pageContext: context),
        onModelReady: (model){

        },
        builder: (context, model, child){
          return Scaffold(
            appBar: AppBar(
              title: const Text('登录'),
              actions: <Widget>[
                IconButton(
                    icon: const Icon(Icons.home),
                    onPressed: (){
                      Navigator.of(context).popUntil(ModalRoute.withName(RouteName.root));
                    }
                )
              ],
            ),
            body: SingleChildScrollView(
              child: YCard(
                child: Form(
                    key: model.loginKey,
                    autovalidateMode: AutovalidateMode.onUserInteraction,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: <Widget>[
                        const SizedBox(height: 10,),
                        TextFormField(
                          maxLength: 11,
                          controller: model.userNameController,
                          keyboardType: TextInputType.phone,
                          decoration: const InputDecoration(
                            fillColor: Colors.red,
                            labelText: '手机号',
                              hintText: '请输入手机号'
                          ),
                          onChanged: (val){
                            model.loginForm['mobile'] = val.trim();
                          },
                          // validator: (val){
                          //   RegExp mobilePhone = RegExp(r"^[1][3,4,5,6,7,8,9][0-9]{9}$");
                          //   return mobilePhone.hasMatch(val?.trim() ?? '') ? null : '手机号错误';
                          // },
                        ),
                        TextFormField(
                          obscureText: model.hidePassword,
                          keyboardType: TextInputType.visiblePassword,
                          controller: model.pwdController,
                          decoration: InputDecoration(
                            labelText: '密码',
                            hintText: '请输入密码',
                            suffixIcon: IconButton(
                                icon: Icon(
                                  Icons.remove_red_eye_outlined,
                                  color: model.hidePassword ? Colors.grey : Theme.of(context).colorScheme.primary,
                                ),
                                onPressed: (){
                                  model.hidePassword = !model.hidePassword;
                                }
                            ),
                          ),
                          onChanged: (val){
                            model.loginForm['password'] = val.trim();
                          },
                          // validator: (val){
                          //   if(val == null) return null;
                          //
                          //   return val!.trim().length < 6 ? '密码至少6位' : null;
                          // },
                        ),
                        SwitchListTile(
                          contentPadding: const EdgeInsets.all(0),
                          value: model.rememberPassword,
                          onChanged: (val){
                            model.rememberPassword = val;
                          },
                          title: const Text('记住密码'),
                        ),
                        const SizedBox(height: 12,),
                        SizedBox(
                          width: MediaQuery.of(context).size.width,
                          child: ElevatedButton(
                            onPressed: model.isBusy ? null : model.doLogin,
                            // color: Theme.of(context).colorScheme.secondary,
                            child: model.isBusy ? const StateButtonBusy() : const Text('登录'),
                          ),
                        ),
                        const SizedBox(height: 12,),
                        SizedBox(
                          width: MediaQuery.of(context).size.width,
                          child: OutlinedButton(
                            onPressed: (){
                              Navigator.of(context).pushNamed(RouteName.register);
                            },
                            // color: Theme.of(context).colorScheme.secondary,
                            child: const Text('没有账号，去注册'),
                          ),
                        ),
                      ],
                    )
                ),
              ),
            ),
          );
        }
    );
  }
}