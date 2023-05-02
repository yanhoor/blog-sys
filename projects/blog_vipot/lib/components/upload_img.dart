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
  final Function(String url, dynamic file) onUploadCompleted;
  double width;
  double height;
  final String url;
  Widget? preview;
  String uploadText;
  String size;

  UploadImg({super.key, required this.onUploadCompleted, this.width = 178, this.height = 178, required this.url, this.preview, this.uploadText = '点击选择', this.size = 'normal'}){
    debugPrint('===========UploadImg====$key===$preview===');
  }

  @override
  State<UploadImg> createState() => _UploadImgState();
}

class _UploadImgState extends State<UploadImg>{
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: widget.width,
      height: widget.height,
      child: ProviderWidget<UploadImgNotifier>(
        model: UploadImgNotifier(onUploadCompleted: widget.onUploadCompleted, imgUrl: widget.url),
        builder: (_, model, child){
          if(model.imgUrl.isEmpty){
            return Container(
              decoration: widget.size == 'normal' ? BoxDecoration(
                  shape: BoxShape.rectangle,
                  borderRadius: BorderRadius.circular(3),
                  border: Border.all()
              ) : null,
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
                child: widget.size == 'normal' ? Container(
                  padding: const EdgeInsets.all(20),
                  child: model.isUploading ? CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(Theme.of(context).colorScheme.primary),
                  ) : Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.cloud_upload, size: 42,),
                      const SizedBox(height: 10,),
                      Text(widget.uploadText, style: const TextStyle(fontSize: 14),)
                    ],
                  ),
                ) : Container(
                  child: model.isUploading ? CupertinoActivityIndicator(color: Theme.of(context).colorScheme.primary,) : Icon(Icons.image,size: 32, color: Theme.of(context).colorScheme.primary,),
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
              child: widget.preview ?? MediaImageItem(url: model.imgUrl, width: double.infinity, height: double.infinity,),
            );
          }
        },
      ),
    );
  }
}

class UploadImgNotifier extends ChangeNotifier{
  final Function(String url, dynamic file) onUploadCompleted;
  double _uploadPercent = 1;
  bool _isUploading = false;
  String imgUrl;

  UploadImgNotifier({required this.onUploadCompleted, required this.imgUrl});

  removeImg(){
    onUploadCompleted('', null);
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
      debugPrint('No image selected.');
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
      isUploading = true;
      var res = await $http.fetch(ApiUrl.UPLOAD, params: { 'file': imageFile }, isFormData: true, onSendProgress: (int sent, int total) => uploadPercent = sent / total);

      isUploading = false;
      if(res['success']){
        onUploadCompleted( res['result']['url'], res['result']);
        debugPrint('=========uploadPic completed===========${res['result']['url']}');
        notifyListeners();
      }else{
        ToastHelper.error(res['msg']);
      }
    }catch(e){
      isUploading = false;
      debugPrint('=========uploadPic error===========${e.toString()}');
    }

  }

  double get uploadPercent => _uploadPercent;

  set uploadPercent(double value) {
    _uploadPercent = value;
    notifyListeners();
  }

  bool get isUploading => _isUploading;

  set isUploading(bool value) {
    _isUploading = value;
    notifyListeners();
  }
}