import 'dart:io';

import 'package:blog_vipot/config/index.dart';

import '../components/helper/bot_toast_helper.dart';

class FileUtil{
  // 判断文件是否符合超出限制大小和类型
  // typeList, 例如：['.jpeg', '.png']
  // 返回值：符合时返回文件大小，否则返回-1
  static int isFileUnavailable({ List<String>? typeList, int? maxSize, required String filePath }){
    int size = File(filePath).lengthSync();
    if(maxSize != null){
      int test = maxSize * 1024 * 1024;
      if(size > test ){
        ToastHelper.error('所选文件不能大于${maxSize}M');
        return -1;
      }
    }

    if(typeList != null){
      typeList = typeList.map((e) => e.toLowerCase()).toList();
      int ldx = filePath.lastIndexOf('.');
      if(!typeList.contains(filePath.substring(ldx + 1).toLowerCase())){
        ToastHelper.error('仅支持${typeList.join(',')}格式文件');
        return -1;
      }
    }
    return size;
  }

  // 根据文件路径判断是否是图片
  static isImage(String filePath){
    int ldx = filePath.lastIndexOf('.');
    String ext = filePath.substring(ldx + 1).toLowerCase();
    return MyConfig.imageType.contains(ext);
  }
}