import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:dio/dio.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';

import '../config/index.dart';
import '../http/index.dart';
import '../route/route_name.dart';
import '../utils/file_util.dart';
import '../utils/permission_util.dart';
import 'helper/bot_toast_helper.dart';
import 'media/media_image_item.dart';

class UploadImg extends StatefulWidget{
  final Function(String url) onUploadCompleted;
  double size;
  final String url;

  UploadImg({super.key, required this.onUploadCompleted, this.size = 178, required this.url});

  @override
  State<UploadImg> createState() => _UploadImgState();
}

class _UploadImgState extends State<UploadImg>{
  @override
  Widget build(BuildContext context) {
    // print('++++++_UploadImgState++++++++${widget.url}');
    return SizedBox(
      width: widget.size,
      height: widget.size,
      child: ProviderWidget<UploadImgNotifier>(
        model: UploadImgNotifier(onUploadCompleted: widget.onUploadCompleted, imgUrl: widget.url),
        builder: (_, model, child){
          if(model.imgUrl.isEmpty){
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
                                      model.getImage(1);
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
                                Navigator.of(context).pushNamed(RouteName.imagePreview, arguments: { 'imageList': [model.imgUrl], 'initPage': 0});
                              },
                              child: const Text('预览')
                          ),
                          CupertinoActionSheetAction(
                              onPressed: (){
                                Navigator.pop(modalContext, true);
                                model.removeImg();
                              },
                              child: const Text('删除')
                          )
                        ],
                      );
                    });
              },
              child: MediaImageItem(url: model.imgUrl,),
            );
          }
        },
      ),
    );
  }
}

class UploadImgNotifier extends ChangeNotifier{
  final Function(String url) onUploadCompleted;
  double _uploadPercent = 1;
  String imgUrl;

  UploadImgNotifier({required this.onUploadCompleted, required this.imgUrl});

  removeImg(){
    onUploadCompleted('');
    notifyListeners();
  }

  // 打开图库选择图片
  Future getImage(int type) async {
    final picker = ImagePicker();
    XFile? uploadFile;

    if(type == 1){
      uploadFile = await picker.pickImage(source: ImageSource.gallery);
    } else if(type == 2){
      uploadFile = await picker.pickImage(source: ImageSource.camera);
    }

    if (uploadFile != null) {
      await uploadPic(uploadFile);
    } else {
      print('No image selected.');
    }
  }

  // 上传图片
  Future uploadPic(XFile pickedFile) async{
    String path = pickedFile.path;
    int size = FileUtil.isFileUnavailable(filePath: path, maxSize: 5, typeList: MyConfig.imageType.split(','));
    if(size == -1){
      return false;
    }

    MultipartFile imageFile = await MultipartFile.fromFile(path);
    try{
      var res = await $http.fetch(ApiUrl.UPLOAD, params: { 'file': imageFile }, isFormData: true, onSendProgress: (int sent, int total) => uploadPercent = sent / total);

      if(res['success']){
        onUploadCompleted( res['result']['url']);
        print('=========uploadPic completed===========${res['result']['url']}');
        notifyListeners();
      }else{
        ToastHelper.error(res['msg']);
      }
    }catch(e){
      print('=========uploadPic error===========${e.toString()}');
    }

  }

  double get uploadPercent => _uploadPercent;

  set uploadPercent(double value) {
    _uploadPercent = value;
    notifyListeners();
  }
}