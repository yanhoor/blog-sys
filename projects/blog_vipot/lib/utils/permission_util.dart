import 'package:permission_handler/permission_handler.dart';

import '../components/bot_toast_helper.dart';

class PermissionUtil{
  // 检查权限并申请
  static Future<bool> requestPermission({required List<Permission> permissionList, required String denyTip}) async{
    Map<Permission, PermissionStatus> statuses = await permissionList.request();
    print('当前权限组状态-------------------->$statuses');
    List<PermissionStatus> resultList = statuses.values.toList();
    if (resultList.contains(PermissionStatus.permanentlyDenied)) {
      ToastHelper.error(denyTip);
      Future.delayed(const Duration(milliseconds: 800)).then((_){
        openAppSettings().then((result) {
          if(!result){
            ToastHelper.error('请进入设置授权');
          }
        });
      });
    }else if(resultList.every((s) => s.isGranted || s.isLimited)){
      return Future.value(true);
    }else if(resultList.contains(PermissionStatus.denied)){
      ToastHelper.error(denyTip);
      Future.delayed(const Duration(milliseconds: 800)).then((_){
        openAppSettings().then((result) {
          if(!result){
            ToastHelper.error('请进入设置授权');
          }
        });
      });
    }
    return Future.value(false);
  }
}