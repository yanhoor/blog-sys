import 'package:blog_vipot/components/media/media_video_item.dart';
import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:blog_vipot/pages/new_post/new_post_notifier.dart';
import 'package:blog_vipot/utils/permission_util.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'package:blog_vipot/components/state/state_button_busy.dart';
import 'package:permission_handler/permission_handler.dart';

import '../../components/media/media_image_item.dart';
import '../../route/route_name.dart';

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

    return Scaffold(
      body: ProviderWidget<NewPostNotifier>(
        model: NewPostNotifier(),
        onModelReady: (model){},
        builder: (context, model, child){
          return SingleChildScrollView(
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
                        maxLines: 5,
                        // controller: model.userNameController,
                        keyboardType: TextInputType.text,
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
                      if(model.selectMode == 2 && model.editForm['medias'].isNotEmpty) ...[
                        MediaVideoItem(url: model.editForm['medias'][0]['file']['url']),
                        const SizedBox(height: 10,),
                        SizedBox(
                          width: MediaQuery.of(context).size.width,
                          child: RawMaterialButton(
                            fillColor: Colors.red,
                            onPressed: (){
                              model.removeMedia(model.editForm['medias'][0]);
                            },
                            child: const Text('删除视频', style: TextStyle(color: Colors.white),),
                          ),
                        )
                      ]
                      else GridView.count(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        crossAxisSpacing: 4,
                        mainAxisSpacing: 4,
                        crossAxisCount: 3,
                        childAspectRatio: 1,
                        children: [
                          if(model.selectMode != 2 ) Container(
                            decoration: BoxDecoration(
                                shape: BoxShape.rectangle,
                                borderRadius: BorderRadius.circular(3),
                                border: Border.all()
                            ),
                            child: RawMaterialButton(
                              onPressed: () async{
                                if(model.uploadPercent != 1) return;

                                await PermissionUtil.requestPermission(permissionList: [ Permission.camera, Permission.photos ], denyTip: '权限不足，您已永久禁止本应用图片或拍摄权限').then((result) {
                                  if(result){
                                    showCupertinoModalPopup(
                                        context: context,
                                        builder: (modalContext){
                                          return CupertinoActionSheet(
                                            title: const Text('选择操作'),
                                            message: const Text('选择需要的操作'),
                                            actions: [
                                              if(model.selectMode != 2) CupertinoActionSheetAction(
                                                  onPressed: (){
                                                    model.getImage(1);
                                                    Navigator.pop(modalContext, true);
                                                  },
                                                  child: const Text('选取图片')
                                              ),
                                              if(model.selectMode != 2) CupertinoActionSheetAction(
                                                  onPressed: (){
                                                    model.getImage(2);
                                                    Navigator.pop(modalContext, true);
                                                  },
                                                  child: const Text('拍摄图片')
                                              ),
                                              if(model.selectMode != 1) CupertinoActionSheetAction(
                                                  onPressed: (){
                                                    model.getVideo(1);
                                                    Navigator.pop(modalContext, true);
                                                  },
                                                  child: const Text('选取视频')
                                              ),
                                              if(model.selectMode != 1) CupertinoActionSheetAction(
                                                  onPressed: (){
                                                    model.getVideo(2);
                                                    Navigator.pop(modalContext, true);
                                                  },
                                                  child: const Text('拍摄视频')
                                              ),
                                            ],
                                            cancelButton: CupertinoActionSheetAction(
                                              isDefaultAction: true,
                                              onPressed: ((){
                                                Navigator.pop(modalContext, false);
                                              }),
                                              child: const Text("取消"),
                                            ),
                                          );
                                        }
                                    );
                                  }
                                });
                              },
                              padding: const EdgeInsets.all(20),
                              child: model.uploadPercent != 1 ? CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor: AlwaysStoppedAnimation<Color>(Theme.of(context).colorScheme.primary),
                              ) : Column(
                                crossAxisAlignment: CrossAxisAlignment.center,
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: const [
                                  Icon(Icons.cloud_upload, size: 42,),
                                  SizedBox(height: 10,),
                                  Text('点击选择', style: TextStyle(fontSize: 14),)
                                ],
                              ),
                            ),
                          ),
                          if(model.selectMode == 1) ...model.editForm['medias'].map((media) {
                            return Container(
                              decoration: BoxDecoration(
                                  shape: BoxShape.rectangle,
                                  borderRadius: BorderRadius.circular(3),
                                  border: Border.all()
                              ),
                              child: RawMaterialButton(
                                onPressed: (){
                                  showCupertinoModalPopup(
                                      context: context,
                                      builder: (modalContext){
                                        return CupertinoActionSheet(
                                          actions: [
                                            CupertinoActionSheetAction(
                                                onPressed: (){
                                                  Navigator.pop(modalContext, true);
                                                  int index = model.editForm['medias'].indexOf(media);
                                                  Navigator.of(context).pushNamed(RouteName.imagePreview, arguments: { 'imageList': model.editForm['medias'].map((m) => m['file']['url']).toList(), 'initPage': index});
                                                },
                                                child: const Text('预览')
                                            ),
                                            CupertinoActionSheetAction(
                                                onPressed: (){
                                                  Navigator.pop(modalContext, true);
                                                  model.removeMedia(media);
                                                },
                                                child: const Text('删除')
                                            )
                                          ],
                                        );
                                      });
                                },
                                child: MediaImageItem(url: media['file']['url'],),
                              ),
                            );
                          }).toList()
                        ],
                      ),
                      Container(
                        width: MediaQuery.of(context).size.width,
                        margin: const EdgeInsets.symmetric(vertical: 20),
                        child: ElevatedButton(
                          onPressed: model.isBusy ? null : model.handleSubmitForm,
                          // color: Theme.of(context).colorScheme.secondary,
                          child: model.isBusy ? const StateButtonBusy() : const Text('发布'),
                        ),
                      ),
                    ],
                  )
              ),
            ),
          );
        },
      ),
    );
  }
}