import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class DialogHelper {
  static showIOSAlertDialog({required BuildContext context, required String message, required Future Function() onConfirm, Function? onCancel}) async{
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
                textStyle: const TextStyle(color: Colors.red),
                child: const Text('取消')
            ),
            CupertinoDialogAction(
                onPressed: (){
                  Navigator.of(dialogContext).pop(true);
                  onConfirm();
                },
                child: const Text('确定')
            ),
          ],
        );
      },
    );
  }
}
