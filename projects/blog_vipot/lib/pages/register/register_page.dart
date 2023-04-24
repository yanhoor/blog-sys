import 'package:blog_vipot/components/y-card.dart';
import 'package:blog_vipot/pages/register/register_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../../components/state/state_button_busy.dart';
import '../../components/wrapper/provider_wrapper.dart';
import '../../route/route_name.dart';

class RegisterPage extends StatefulWidget{
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage>{
  @override
  Widget build(BuildContext context) {
    return ProviderWidget<RegisterNotifier>(
        model: RegisterNotifier(),
        builder: (context, model, child){
          return Scaffold(
            appBar: AppBar(
              title: const Text('注册'),
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
                    key: model.formKey,
                    // autovalidateMode: AutovalidateMode.onUserInteraction,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: <Widget>[
                        TextFormField(
                          maxLength: 8,
                          // controller: model.userNameController,
                          keyboardType: TextInputType.text,
                          decoration: const InputDecoration(
                              fillColor: Colors.red,
                              labelText: '用户名',
                              hintText: '请输入用户名'
                          ),
                          onChanged: (val){
                            model.editForm['name'] = val.trim();
                          },
                          // validator: (val){
                          //   RegExp mobilePhone = RegExp(r"^[1][3,4,5,6,7,8,9][0-9]{9}$");
                          //   return mobilePhone.hasMatch(val?.trim() ?? '') ? null : '手机号错误';
                          // },
                        ),
                        const SizedBox(height: 12,),
                        TextFormField(
                          maxLength: 11,
                          // controller: model.userNameController,
                          keyboardType: TextInputType.phone,
                          decoration: const InputDecoration(
                              fillColor: Colors.red,
                              labelText: '手机号',
                              hintText: '请输入手机号'
                          ),
                          onChanged: (val){
                            model.editForm['mobile'] = val.trim();
                          },
                          // validator: (val){
                          //   RegExp mobilePhone = RegExp(r"^[1][3,4,5,6,7,8,9][0-9]{9}$");
                          //   return mobilePhone.hasMatch(val?.trim() ?? '') ? null : '手机号错误';
                          // },
                        ),
                        TextFormField(
                          obscureText: true,
                          keyboardType: TextInputType.visiblePassword,
                          // controller: model.pwdController,
                          decoration: const InputDecoration(
                            labelText: '密码',
                            hintText: '请输入密码',
                          ),
                          onChanged: (val){
                            model.editForm['password'] = val.trim();
                          },
                          // validator: (val){
                          //   if(val == null) return null;
                          //
                          //   return val!.trim().length < 6 ? '密码至少6位' : null;
                          // },
                        ),
                        TextFormField(
                          obscureText: true,
                          keyboardType: TextInputType.visiblePassword,
                          // controller: model.pwdController,
                          decoration: const InputDecoration(
                            labelText: '再次输入密码',
                            hintText: '请再次输入密码',
                          ),
                          onChanged: (val){
                            model.formKey.currentState!.validate();
                            model.editForm['repeatPassword'] = val.trim();
                          },
                          validator: (val){
                            if(val == null) return null;

                            return val.isNotEmpty && val.trim() == model.editForm['password'] ? null : '两次输入的密码不一致';
                          },
                        ),
                        Container(
                          width: MediaQuery.of(context).size.width,
                          margin: const EdgeInsets.symmetric(vertical: 20),
                          child: ElevatedButton(
                            onPressed: model.isBusy ? null : () async{
                              bool r = await model.doRegister();
                              if(r && context.mounted) Navigator.of(context).pop();
                            },
                            // color: Theme.of(context).colorScheme.secondary,
                            child: model.isBusy ? const StateButtonBusy() : const Text('注册'),
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