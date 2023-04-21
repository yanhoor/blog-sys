import 'package:blog_vipot/components/multi_upload.dart';
import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';

import '../route/route_name.dart';
import '../utils/permission_util.dart';
import 'media/media_image_item.dart';

class UploadImg extends StatefulWidget{
  final Function(List<Map<String, dynamic>> mediaList) onUploadCompleted;
  double size;

  UploadImg({super.key, required this.onUploadCompleted, this.size = 178});

  @override
  State<UploadImg> createState() => _UploadImgState();
}

class _UploadImgState extends State<UploadImg>{
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: widget.size,
      height: widget.size,
      child: ProviderWidget<MultiUploadNotifier>(
        model: MultiUploadNotifier(initMode: 1, onUploadCompleted: widget.onUploadCompleted),
        builder: (_, model, child){
          if(model.mediaList.isEmpty){
            return Container(
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
                                CupertinoActionSheetAction(
                                    onPressed: (){
                                      model.getImage(1, multi: false);
                                      Navigator.pop(modalContext, true);
                                    },
                                    child: const Text('选取图片')
                                ),
                                CupertinoActionSheetAction(
                                    onPressed: (){
                                      model.getImage(2);
                                      Navigator.pop(modalContext, true);
                                    },
                                    child: const Text('拍摄图片')
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
            );
          } else{
            var media = model.mediaList[0];

            return RawMaterialButton(
              onPressed: (){
                showCupertinoModalPopup(
                    context: context,
                    builder: (modalContext){
                      return CupertinoActionSheet(
                        actions: [
                          CupertinoActionSheetAction(
                              onPressed: (){
                                Navigator.pop(modalContext, true);
                                Navigator.of(context).pushNamed(RouteName.imagePreview, arguments: { 'imageList': model.mediaList.map((m) => m['file']['url']).toList(), 'initPage': 0});
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
            );
          }
        },
      ),
    );
  }
}