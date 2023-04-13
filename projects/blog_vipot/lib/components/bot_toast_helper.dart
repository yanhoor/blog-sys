import 'package:bot_toast/bot_toast.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class ToastHelper{

  static showText(String msg){
    error(msg);
  }

  static raw(String msg){
    BotToast.showText(
        text: msg,
        contentColor: Colors.black87,
        contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
        textStyle: const TextStyle(
            color: Colors.white
        ),
        borderRadius: const BorderRadius.all(Radius.circular(5))
    );
  }

  static showCustomText({required ToastBuilder toastBuilder}){
    BotToast.showCustomText(
      align: const Alignment(0, -0.95),
        toastBuilder: toastBuilder,
        duration: const Duration(milliseconds: 3000)
    );
  }

  static info(String msg){
    showCustomText(
        toastBuilder: (_) => ToastWidget(
          msg: msg,
          backgroundColor: const Color(0xfff0faff),
          borderColor: const Color(0xffd4eeff),
          textColor: const Color(0xff2e8bf0),
          iconData: CupertinoIcons.info_circle_fill,
        )
    );
  }

  static warning(String msg){
    showCustomText(
        toastBuilder: (_) => ToastWidget(
          msg: msg,
          backgroundColor: const Color(0xfffff9e6),
          borderColor: const Color(0xffffe7a3),
          textColor: const Color(0xffff9900),
          iconData: Icons.error,
        )
    );
  }

  static error(String msg){
    showCustomText(
        toastBuilder: (_) => ToastWidget(
          msg: msg,
          backgroundColor: const Color(0xffffefe6),
          borderColor: const Color(0xffffcfb8),
          textColor: const Color(0xffed3f13),
          iconData: CupertinoIcons.clear_thick_circled,
        )
    );
  }

  static success(String msg){
    showCustomText(
        toastBuilder: (_) => ToastWidget(
          msg: msg,
          backgroundColor: const Color(0xffedfff3),
          borderColor: const Color(0xffbbf2cf),
          textColor: const Color(0xff19bf6c),
          iconData: CupertinoIcons.checkmark_circle_fill,
        )
    );
  }

  static showSnackBar({required BuildContext context, required String msg}){
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg)),
    );
  }

}

class ToastWidget extends StatelessWidget{
  final String msg;
  final Color textColor;
  final Color backgroundColor;
  final Color borderColor;
  final IconData iconData;

  const ToastWidget({
    super.key,
    required this.msg,
    required this.textColor,
    required this.backgroundColor,
    required this.borderColor,
    required this.iconData,
  });

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      margin: const EdgeInsets.symmetric(horizontal: 10),
      decoration: BoxDecoration(
          color: backgroundColor,
          border: Border.all(
              color: borderColor
          ),
          borderRadius: const BorderRadius.all(Radius.circular(5))
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(iconData, color: textColor, size: 16,),
          const SizedBox(width: 2,),
          Flexible(fit: FlexFit.loose,child: Text(msg, style: TextStyle(color: textColor),))
        ],
      ),
    );
  }
}
