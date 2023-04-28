import 'package:blog_vipot/components/no_shadow_scroll_behavior.dart';
import 'package:blog_vipot/components/state/state_button_busy.dart';
import 'package:blog_vipot/components/upload_img.dart';
import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:blog_vipot/notifiers/global_notifier.dart';
import 'package:blog_vipot/pages/my_profile/my_profile_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:blog_vipot/components/state/state_request_empty.dart';
import 'package:blog_vipot/components/state/state_request_error.dart';

class MyProfilePage extends StatefulWidget{
  const MyProfilePage({super.key});

  @override
  State<MyProfilePage> createState() => _MyProfilePageState();
}

class _MyProfilePageState extends State<MyProfilePage>{
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text('编辑资料'),
      ),
      body: SafeArea(
        bottom: false,
        child: Consumer<GlobalNotifier>(
          builder: (_, globalNotifier, child){
            return ProviderWidget<MyProfileNotifier>(
              model: MyProfileNotifier(editForm: globalNotifier.myInfo!),
              onModelReady: (model){
                model.setPageContext(context);
                model.initData();
              },
              builder: (_, model, child){
                Widget content;
                if (model.isInitializing) {
                  content = const Center(
                    child: Text('Loading...'),
                  );
                } else if (model.isEmpty) {
                  content = StateRequestEmpty(size: 60, onPressed: model.initData,);
                } else if (model.isError) {
                  content = StateRequestError(size: 60, onPressed: model.initData, msg: model.stateErrorText,);
                } else {
                  content = SingleChildScrollView(
                    child: Card(
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        child: Form(
                          key: model.formKey,
                          autovalidateMode: AutovalidateMode.onUserInteraction,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              TextFormField(
                                maxLength: 8,
                                initialValue: model.editForm['name'],
                                // controller: model.userNameController,
                                keyboardType: TextInputType.text,
                                decoration: const InputDecoration(
                                    fillColor: Colors.red,
                                    labelText: '用户名：',
                                    hintText: '请输入用户名',
                                  border: OutlineInputBorder(),
                                ),
                                onChanged: (val){
                                  model.editForm['name'] = val.trim();
                                },
                                validator: (val){
                                  return val != null && val.trim().isNotEmpty ? null : '用户名不能为空';
                                },
                              ),
                              const SizedBox(height: 12,),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('性别：'),
                                  const SizedBox(height: 4,),
                                  Row(
                                    crossAxisAlignment: CrossAxisAlignment.center,
                                    children: [
                                      Radio<int>(
                                          value: 0,
                                          activeColor: Theme.of(context).colorScheme.primary,
                                          groupValue: model.editForm['gender'],
                                          onChanged: (v){
                                            model.onChangeGender(v);
                                          }
                                      ),
                                      const Text('未定'),
                                      const SizedBox(width: 12,),

                                      Radio<int>(
                                          value: 1,
                                          activeColor: Theme.of(context).colorScheme.primary,
                                          groupValue: model.editForm['gender'],
                                          onChanged: (v){
                                            model.onChangeGender(v);
                                          }
                                      ),
                                      const Text('男'),

                                      const SizedBox(width: 12,),
                                      Radio<int>(
                                          value: 2,
                                          activeColor: Theme.of(context).colorScheme.primary,
                                          groupValue: model.editForm['gender'],
                                          onChanged: (v){
                                            model.onChangeGender(v);
                                          }
                                      ),
                                      const Text('女'),
                                    ],
                                  )
                                ],
                              ),
                              const SizedBox(height: 12,),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('生日：'),
                                  const SizedBox(height: 4,),
                                  TextButton(
                                      onPressed: () async{
                                        DateTime? d = await showDatePicker(
                                            context: context,
                                          initialDate: model.editForm['birthday'] == null ? DateTime.now() : DateTime.parse(model.editForm['birthday']),
                                          firstDate: DateTime(1949, 10),
                                          lastDate: DateTime.now(),
                                        );
                                        if(d == null) return;

                                        model.editForm['birthday'] = DateFormat('yyyy-MM-dd').format(d);
                                        model.notifyListeners();
                                      },
                                      child: Text(DateFormat('yyyy-MM-dd').format(model.editForm['birthday'] == null ? DateTime.now() : DateTime.parse(model.editForm['birthday'])))
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12,),
                              TextFormField(
                                maxLength: 80,
                                maxLines: 5,
                                initialValue: model.editForm['introduce'],
                                // controller: model.userNameController,
                                keyboardType: TextInputType.text,
                                decoration: const InputDecoration(
                                    fillColor: Colors.red,
                                    labelText: '个人简介：',
                                    hintText: '请输入个人简介',
                                  border: OutlineInputBorder(),
                                ),
                                onChanged: (val){
                                  model.editForm['introduce'] = val.trim();
                                },
                                validator: (val){
                                  return val != null && val.trim().length > 80 ? '个人简介不能超过80个字符' : null;
                                },
                              ),
                              const SizedBox(height: 12,),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('头像：'),
                                  const SizedBox(height: 4,),
                                  UploadImg(
                                      key: ValueKey(model.editForm['avatar']),
                                      url: model.editForm['avatar'] ?? '',
                                      onUploadCompleted: (url, _){
                                        model.editForm['avatar'] = url;
                                        model.notifyListeners();
                                      }
                                  )
                                ],
                              ),
                              const SizedBox(height: 12,),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('资料卡背景：'),
                                  const SizedBox(height: 4,),
                                  UploadImg(
                                      key: ValueKey(model.editForm['profileCardBg']),
                                      url: model.editForm['profileCardBg'] ?? '',
                                      onUploadCompleted: (url, _){
                                        model.editForm['profileCardBg'] = url;
                                        model.notifyListeners();
                                      }
                                  )
                                ],
                              ),
                              const SizedBox(height: 12,),
                              SizedBox(
                                width: double.infinity,
                                child: ElevatedButton(
                                    onPressed: (){
                                      model.handleSave();
                                    },
                                    child: model.isBusy ? const StateButtonBusy() : const Text('保存')
                                ),
                              )
                            ],
                          ),
                        ),
                      ),
                    ),
                  );
                }

                return ScrollConfiguration(
                    behavior: NoShadowScrollBehavior(),
                    child: RefreshConfiguration.copyAncestor(
                        context: context,
                        child: SmartRefresher(
                          controller: model.refreshController,
                          enablePullDown: true,
                          onRefresh: model.refreshData,
                          child: content,
                        )
                    )
                );
              },
            );
          },
        ),
      ),
    );
  }
}