import 'package:blog_vipot/config/index.dart';
import 'package:blog_vipot/notifiers/state_notifier.dart';
import 'package:blog_vipot/utils/file_util.dart';
import 'package:dio/dio.dart';
import 'package:flutter/cupertino.dart';
import 'package:image_picker/image_picker.dart';

import 'package:blog_vipot/components/bot_toast_helper.dart';
import 'package:blog_vipot/http/index.dart';

class NewPostNotifier extends StateNotifier{
  GlobalKey<FormState> formKey = GlobalKey<FormState>();
  Map<String, dynamic> editForm = {
    'content': '',
    'medias': [],
  };
  int _selectMode = 3; // 选择模式，1--图片，2--视频，3--都可以
  double _uploadPercent = 1;

  handleSubmitForm() async{
    var form = formKey.currentState; // 或者Form.of(context)
    if(editForm['content'].isEmpty){
      ToastHelper.warning('请输入内容');
      return;
    }

    if(form!.validate()){
      // form.save();
      setBusy();
      try{
        var res = await $http.fetch(ApiUrl.BLOG_EDIT, params: editForm);
        setComplete();
        if(res['success']){
          ToastHelper.success('发布成功');
          form.reset();
          editForm['medias'] = [];
        }else{
          ToastHelper.error(res['msg'] ?? '发布失败');
        }
      }catch(e){
        setComplete();
      }
    }
  }

  removeMedia(media){
    editForm['medias'].remove(media);
    if(editForm['medias'].isEmpty) selectMode = 3;
    notifyListeners();
  }

  // 打开图库选择图片
  Future getImage(int type) async {
    final picker = ImagePicker();
    List<XFile> pickedFileList = [];

    if(type == 1){
      pickedFileList = await picker.pickMultiImage();
    } else if(type == 2){
      XFile? f = await picker.pickImage(source: ImageSource.camera);
      if (f != null) pickedFileList.add(f);
    }

    if (pickedFileList.isNotEmpty) {
      List<Future> list = [];
      for (var pickedFile in pickedFileList) {
        list.add(uploadPic(pickedFile));
      }
      await Future.wait(list);
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

    // final imageBytes = await pickedFile.readAsBytes();
    MultipartFile imageFile = await MultipartFile.fromFile(
      path,
      // filename: fileName,
    );
    try{
      var res = await $http.fetch(ApiUrl.UPLOAD, params: { 'file': imageFile }, isFormData: true, onSendProgress: (int sent, int total) => uploadPercent = sent / total);

      if(res['success']){
        editForm['medias'].add({
          'file': res['result'],
          'fileId': res['result']['id']
        });
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

    MultipartFile video = await MultipartFile.fromFile(
      path,
      // filename: fileName,
    );
    try{
      var res = await $http.fetch(ApiUrl.UPLOAD, params: { 'file': video }, isFormData: true, onSendProgress: (int sent, int total) => uploadPercent = sent / total);

      if(res['success']){
        editForm['medias'].add({
          'file': res['result'],
          'fileId': res['result']['id']
        });
        notifyListeners();
      }else{
        ToastHelper.error(res['msg']);
      }
    }catch(e){}
  }

  double get uploadPercent => _uploadPercent;

  set uploadPercent(double value) {
    _uploadPercent = value;
    notifyListeners();
  }

  int get selectMode => _selectMode;

  set selectMode(int value) {
    _selectMode = value;
    notifyListeners();
  }
}