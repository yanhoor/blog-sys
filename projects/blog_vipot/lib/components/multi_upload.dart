import 'dart:async';
import 'package:blog_vipot/components/media/media_audio_record.dart';
import 'package:blog_vipot/components/upload_img.dart';
import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:dio/dio.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:provider/provider.dart';

import '../config/index.dart';
import '../http/index.dart';
import '../route/route_name.dart';
import '../utils/file_util.dart';
import '../utils/permission_util.dart';
import 'helper/bot_toast_helper.dart';
import 'media/media_audio_player.dart';
import 'media/media_image_item.dart';
import 'media/media_video_item.dart';

class MultiUpload extends StatefulWidget{
  final Function(List<Map<String, dynamic>> mediaList) onUploadCompleted;

  MultiUpload({super.key, required this.onUploadCompleted});

  @override
  State<MultiUpload> createState() => _MultiUploadState();
}

class _MultiUploadState extends State<MultiUpload>{
  @override
  Widget build(BuildContext context) {
    return ProviderWidget<MultiUploadNotifier>(
        model: MultiUploadNotifier(onUploadCompleted: widget.onUploadCompleted),
        builder: (_, model, child){
          return Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: const [
                  ModeChip(
                    value: 2,
                    avatar: Icons.image,
                    label: Text('图片'),
                  ),
                  SizedBox(width: 6,),
                  ModeChip(
                    value: 3,
                    avatar: Icons.video_collection,
                    label: Text('视频'),
                  ),
                  SizedBox(width: 6,),
                  ModeChip(
                    value: 4,
                    avatar: Icons.keyboard_voice_outlined,
                    label: Text('录音'),
                  )
                ],
              ),
              // if(model.uploadPercent < 1) LinearProgressIndicator(
              //   value: model.uploadPercent,
              // ),
              if(model.isUploading) const SizedBox(
                width: 42,
                height: 42,
                child: CupertinoActivityIndicator(),
              ),
              if(model.selectMode == 2 && model.mediaList.isNotEmpty) GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisSpacing: 4,
                mainAxisSpacing: 4,
                crossAxisCount: 3,
                childAspectRatio: 1,
                children: model.mediaList.map((media) => Container(
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
                                    child: const Text('删除', style: TextStyle(color: Colors.red),)
                                )
                              ],
                            );
                          });
                    },
                    child: MediaImageItem(url: media['file']['url'], width: double.infinity, height: double.infinity,),
                  ),
                )).toList(),
              ),
              if(model.selectMode == 3 && model.mediaList.isNotEmpty) ...[
                UploadImg(
                  key: ValueKey<String>(model.mediaList[0]['cover'] == null ? '' : model.mediaList[0]['cover']['url']),
                  width: MediaQuery.of(context).size.width * 0.7,
                  height: MediaQuery.of(context).size.width * 0.7 * 9 / 16,
                  uploadText: '上传视频封面',
                  onUploadCompleted: (url, file){
                    model.setCover(file);
                  },
                  url: model.mediaList[0]['cover'] == null ? '' : model.mediaList[0]['cover']['url'],
                ),
                const SizedBox(height: 10,),
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
              ],
              if(model.selectMode == 4) ...[
                Center(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      MediaAudioRecord(onComplete: (p){
                        model.audioFilePath = p;
                      }),
                      if(model.audioFilePath != null) ...[
                        const SizedBox(height: 12,),
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            const Text('点击播放：'),
                            MediaAudioPlayer(
                              key: ValueKey<String>(model.audioFilePath!),
                              isAbsolutePath: true,
                              path: model.audioFilePath!,
                              size: MediaAudioPlayerType.mini,
                            )
                          ],
                        ),
                        if(model.uploadedAudioFilePath != model.audioFilePath) ...[
                          const SizedBox(height: 12,),
                          OutlinedButton(
                              onPressed: (){
                                model.handleAudioFile();
                              },
                              child: const Text('点击上传')
                          )
                        ]
                      ]
                    ],
                  ),
                ),
                if(model.mediaList.isNotEmpty) ...[
                  const SizedBox(height: 12,),
                  UploadImg(
                    key: ValueKey<String>(model.mediaList[0]['cover'] == null ? '' : model.mediaList[0]['cover']['url']),
                    width: MediaQuery.of(context).size.width * 0.7,
                    height: MediaQuery.of(context).size.width * 0.7 * 9 / 16,
                    uploadText: '上传展示封面',
                    onUploadCompleted: (url, file){
                      model.setCover(file);
                    },
                    url: model.mediaList[0]['cover'] == null ? '' : model.mediaList[0]['cover']['url'],
                  ),
                  const SizedBox(height: 12,),
                  SizedBox(
                    width: MediaQuery.of(context).size.width,
                    child: RawMaterialButton(
                      fillColor: Colors.red,
                      onPressed: (){
                        model.removeMedia(model.mediaList[0]);
                      },
                      child: const Text('删除录音', style: TextStyle(color: Colors.white),),
                    ),
                  )
                ]
              ]
            ],
          );
        }
    );
  }
}

class MultiUploadNotifier extends ChangeNotifier{
  final Function(List<Map<String, dynamic>> mediaList) onUploadCompleted;
  int _selectMode = 1; // 选择模式，1--都可以，2--图片，3--视频，4--音频
  bool _lockChangeMode = false; // 锁定模式，不能选择
  double _uploadPercent = 1;
  bool _isUploading = false;
  String? _audioFilePath; // 录音的地址
  String? _uploadedAudioFilePath; // 上传完成的录音的 _audioFilePath
  List<Map<String, dynamic>> mediaList = [];

  MultiUploadNotifier({required this.onUploadCompleted});

  removeMedia(media){
    audioFilePath = null;
    mediaList.remove(media);
    onUploadCompleted(mediaList);
    if(mediaList.isEmpty) lockChangeMode = false;
    notifyListeners();
  }

  setCover(file){
    if(mediaList.isEmpty) return;

    var media = mediaList[0];
    media['cover'] = file;
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
      int total = pickedFileList.length;
      pickedFileList.retainWhere((pickedFile) => FileUtil.isFileUnavailable(filePath: pickedFile.path, maxSize: MyConfig.maxImageSize, typeList: MyConfig.imageType.split(',')) != -1);

      if(total != pickedFileList.length) ToastHelper.warning('已过滤超过 ${MyConfig.maxImageSize}M 的图片');

      isUploading = true;
      await Future.wait(pickedFileList.map((f) => uploadFile(f.path)).toList());
      isUploading = false;
    } else {
      debugPrint('No image selected.');
    }
  }

  // 选择视频
  Future getVideo(int type) async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickVideo(source: type == 1 ? ImageSource.gallery : ImageSource.camera);

    if (pickedFile != null) {
      String path = pickedFile.path;
      if(FileUtil.isFileUnavailable(filePath: path, typeList: MyConfig.videoType.split(',')) == -1){
        ToastHelper.error('不支持的文件类型');
        return false;
      }
      isUploading = true;
      await uploadFile(pickedFile.path);
      isUploading = false;
    } else {
      debugPrint('No image selected.');
    }
  }

  Future handleAudioFile() async{
    if(audioFilePath == null) return;

    isUploading = true;
    await uploadFile(audioFilePath!.replaceAll('file://', ''));
    isUploading = false;

    uploadedAudioFilePath = audioFilePath;
  }

  // 上传文件
  Future uploadFile(String path) async{

    MultipartFile multipartFile = await MultipartFile.fromFile(path);
    try{
      var res = await $http.fetch(
          ApiUrl.UPLOAD,
          params: { 'file': multipartFile },
          isFormData: true,
          onSendProgress: (int sent, int total) {
            uploadPercent = sent / total;
            // debugPrint('==========上传进度=====$uploadPercent=====');
            notifyListeners();
          }
      );

      if(res['success']){
        lockChangeMode = true;
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

  bool get lockChangeMode => _lockChangeMode;

  set lockChangeMode(bool value) {
    _lockChangeMode = value;
    notifyListeners();
  }

  String? get audioFilePath => _audioFilePath;

  set audioFilePath(String? value) {
    _audioFilePath = value;
    notifyListeners();
  }

  String? get uploadedAudioFilePath => _uploadedAudioFilePath;

  set uploadedAudioFilePath(String? value) {
    _uploadedAudioFilePath = value;
    notifyListeners();
  }

  bool get isUploading => _isUploading;

  set isUploading(bool value) {
    _isUploading = value;
    notifyListeners();
  }
}

class ModeChip extends StatelessWidget{
  final IconData avatar;
  final Widget label;
  final int value;

  const ModeChip({super.key, required this.avatar, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Consumer<MultiUploadNotifier>(
      builder: (_, model, child){
        return ActionChip(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          onPressed: model.uploadPercent < 1 || (model.lockChangeMode && model.selectMode != value) ? null : () async{
            model.selectMode = value;

            if(value == 4) return;

            if([3].contains(model.selectMode) && model.mediaList.isNotEmpty) return;

            await PermissionUtil.requestPermission(permissionList: [ Permission.camera, Permission.photos ], denyTip: '权限不足，您已永久禁止本应用图片或拍摄权限').then((result) {
              if(result){
                showCupertinoModalPopup(
                    context: context,
                    builder: (modalContext){
                      return CupertinoActionSheet(
                        title: const Text('选择操作'),
                        message: const Text('选择需要的操作'),
                        actions: [
                          if(model.selectMode == 2) CupertinoActionSheetAction(
                              onPressed: (){
                                model.getImage(1);
                                Navigator.pop(modalContext, true);
                              },
                              child: const Text('选取图片')
                          ),
                          if(model.selectMode == 2) CupertinoActionSheetAction(
                              onPressed: (){
                                model.getImage(2);
                                Navigator.pop(modalContext, true);
                              },
                              child: const Text('拍摄图片')
                          ),
                          if(model.selectMode == 3) CupertinoActionSheetAction(
                              onPressed: (){
                                model.getVideo(1);
                                Navigator.pop(modalContext, true);
                              },
                              child: const Text('选取视频')
                          ),
                          if(model.selectMode == 3) CupertinoActionSheetAction(
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
          backgroundColor: model.selectMode == value ? Theme.of(context).colorScheme.primary : null,
          avatar: Icon(avatar, color: model.selectMode == value ? Colors.white : Colors.black87, size: 18,),
          labelStyle: TextStyle(color: model.selectMode == value ? Colors.white : Colors.black87),
          label: label,
        );
      },
    );
  }
}