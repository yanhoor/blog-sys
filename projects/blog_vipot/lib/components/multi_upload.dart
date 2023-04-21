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
import 'media/media_video_item.dart';

class MultiUpload extends StatefulWidget{
  final Function(List<Map<String, dynamic>> mediaList) onUploadCompleted;
  int initMode;

  MultiUpload({super.key, required this.onUploadCompleted, this.initMode = 3});

  @override
  State<MultiUpload> createState() => _MultiUploadState();
}

class _MultiUploadState extends State<MultiUpload>{
  @override
  Widget build(BuildContext context) {
    return ProviderWidget<MultiUploadNotifier>(
        model: MultiUploadNotifier(onUploadCompleted: widget.onUploadCompleted, initMode: widget.initMode),
        builder: (_, model, child){
          return Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              if(model.selectMode == 2 && model.mediaList.isNotEmpty) ...[
                MediaVideoItem(url: model.mediaList[0]['file']['url']),
                const SizedBox(height: 10,),
                SizedBox(
                  width: MediaQuery.of(context).size.width,
                  child: RawMaterialButton(
                    fillColor: Colors.red,
                    onPressed: (){
                      model.removeMedia(model.mediaList[0]);
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
                  if(model.selectMode == 1) ...model.mediaList.map((media) {
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
                                          int index = model.mediaList.indexOf(media);
                                          Navigator.of(context).pushNamed(RouteName.imagePreview, arguments: { 'imageList': model.mediaList.map((m) => m['file']['url']).toList(), 'initPage': index});
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
            ],
          );
        }
    );
  }
}

class MultiUploadNotifier extends ChangeNotifier{
  final Function(List<Map<String, dynamic>> mediaList) onUploadCompleted;
  int _selectMode = 3; // 选择模式，1--图片，2--视频，3--都可以
  int initMode;
  double _uploadPercent = 1;
  List<Map<String, dynamic>> mediaList = [];

  MultiUploadNotifier({required this.onUploadCompleted, this.initMode = 3}){
    selectMode = initMode;
  }

  removeMedia(media){
    mediaList.remove(media);
    onUploadCompleted(mediaList);
    if(mediaList.isEmpty) selectMode = 3;
    notifyListeners();
  }

  // 打开图库选择图片
  Future getImage(int type, {bool multi = true}) async {
    final picker = ImagePicker();
    List<XFile> pickedFileList = [];

    if(type == 1){
      if(multi){
        pickedFileList = await picker.pickMultiImage();
      }else{
        XFile? f = await picker.pickImage(source: ImageSource.gallery);
        if (f != null) pickedFileList.add(f);
      }
    } else if(type == 2){
      XFile? f = await picker.pickImage(source: ImageSource.camera);
      if (f != null) pickedFileList.add(f);
    }

    if (pickedFileList.isNotEmpty) {
      await Future.wait(pickedFileList.map((f) => uploadPic(f)).toList());
      selectMode = 1;
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
        mediaList.add({
          'file': res['result'],
          'fileId': res['result']['id']
        });
        onUploadCompleted(mediaList);
        print('=========uploadPic completed===========');
        notifyListeners();
      }else{
        ToastHelper.error(res['msg']);
      }
    }catch(e){}

  }

  // 选择视频
  Future getVideo(int type) async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickVideo(source: type == 1 ? ImageSource.gallery : ImageSource.camera);

    if (pickedFile != null) {
      await uploadVideo(pickedFile);
      selectMode = 2;
    } else {
      print('No image selected.');
    }
  }

  // 上传视频
  Future uploadVideo(XFile pickedFile) async{
    String path = pickedFile.path;
    if(FileUtil.isFileUnavailable(filePath: path, typeList: MyConfig.videoType.split(',')) == -1){
      return false;
    }

    MultipartFile video = await MultipartFile.fromFile(path);
    try{
      var res = await $http.fetch(ApiUrl.UPLOAD, params: { 'file': video }, isFormData: true, onSendProgress: (int sent, int total) => uploadPercent = sent / total);

      if(res['success']){
        mediaList.add({
          'file': res['result'],
          'fileId': res['result']['id']
        });
        onUploadCompleted(mediaList);
        notifyListeners();
      }else{
        ToastHelper.error(res['msg']);
      }
    }catch(e){}
  }

  int get selectMode => _selectMode;

  set selectMode(int value) {
    _selectMode = value;
    notifyListeners();
  }

  double get uploadPercent => _uploadPercent;

  set uploadPercent(double value) {
    _uploadPercent = value;
    notifyListeners();
  }
}