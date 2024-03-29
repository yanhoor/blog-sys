import 'package:blog_vipot/components/multi_upload.dart';
import 'package:blog_vipot/components/no_shadow_scroll_behavior.dart';
import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:blog_vipot/pages/new_post/new_post_notifier.dart';
import 'package:blog_vipot/route/route_name.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:blog_vipot/components/state/state_button_busy.dart';
import 'package:flutter/services.dart';
class NewPostPage extends StatefulWidget{
  const NewPostPage({super.key});

  @override
  State<NewPostPage> createState() => _NewPostPageState();
}

class _NewPostPageState extends State<NewPostPage> with AutomaticKeepAliveClientMixin{

  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return AnnotatedRegion<SystemUiOverlayStyle>(
        value: isDark ? SystemUiOverlayStyle.light : SystemUiOverlayStyle.dark,
        child: Scaffold(
          body: SafeArea(
            child: ProviderWidget<NewPostNotifier>(
              model: NewPostNotifier(),
              onModelReady: (model){},
              builder: (context, model, child){
                return ScrollConfiguration(
                    behavior: NoShadowScrollBehavior(),
                    child: SingleChildScrollView(
                      child: Container(
                        padding: const EdgeInsets.only(left: 10, right: 10, bottom: 30),
                        child: Form(
                            key: model.formKey,
                            autovalidateMode: AutovalidateMode.onUserInteraction,
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisSize: MainAxisSize.min,
                              children: <Widget>[
                                const SizedBox(height: 10,),
                                TextFormField(
                                  minLines: 6,
                                  maxLines: 15,
                                  controller: model.textEditController,
                                  keyboardType: TextInputType.multiline,
                                  decoration: const InputDecoration(
                                    fillColor: Colors.red,
                                    labelText: '发布内容',
                                    hintText: '有什么新鲜事想分享给大家？',
                                    border: OutlineInputBorder(),
                                  ),
                                  onChanged: (val){
                                    model.editForm['content'] = val.trim();
                                  },
                                ),
                                const SizedBox(height: 12,),
                                MultiUpload(
                                    key: ValueKey<int>(model.uploadKey),
                                    onUploadCompleted: (list){
                                      model.editForm['medias'] = list;
                                    }
                                ),
                                Container(
                                  width: MediaQuery.of(context).size.width,
                                  margin: const EdgeInsets.symmetric(vertical: 20),
                                  child: ElevatedButton(
                                    onPressed: () async{
                                      if(model.isBusy) return;

                                      bool result = await model.handleSubmitForm();
                                      if(result && context.mounted) FocusScope.of(context).unfocus();
                                    },
                                    // color: Theme.of(context).colorScheme.secondary,
                                    child: model.isBusy ? const StateButtonBusy() : const Text('发布'),
                                  ),
                                ),
                              ],
                            )
                        ),
                      ),
                    )
                );
              },
            ),
          ),
        )
    );
  }
}