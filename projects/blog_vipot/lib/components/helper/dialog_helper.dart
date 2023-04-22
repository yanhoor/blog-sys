import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class DialogHelper {
  static showIOSAlertDialog({
    required BuildContext context,
    required String message,
    required Future Function() onConfirm,
    Function? onCancel,
    Color cancelBtnColor = Colors.black54,
    String confirmBtnText = '确定',
    Color? confirmBtnColor,
  }) async{
    confirmBtnColor = confirmBtnColor ?? Theme.of(context).primaryColor;

    return await showCupertinoDialog(
      context: context,
      builder: (dialogContext) {
        return CupertinoAlertDialog(
          content: Text(message),
          actions: <Widget>[
            CupertinoDialogAction(
                onPressed: () {
                  onCancel == null ? Navigator.of(dialogContext).pop(false) : onCancel();
                },
                textStyle: TextStyle(color: cancelBtnColor),
                child: const Text('取消')
            ),
            CupertinoDialogAction(
                onPressed: (){
                  Navigator.of(dialogContext).pop(true);
                  onConfirm();
                },
                textStyle: TextStyle(color: confirmBtnColor),
                child: Text(confirmBtnText)
            ),
          ],
        );
      },
    );
  }
}
