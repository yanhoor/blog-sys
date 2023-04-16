import 'package:flutter/cupertino.dart';

class StateTag extends StatelessWidget{
  final String text;
  final String? type;
  late Color backgroundColor;
  late Color textColor;
  late Color borderColor;

  StateTag({super.key, required this.text, this.type = 'success'}){
    switch(type){
      case 'error':
        backgroundColor = const Color(0xffffefe6);
        textColor = const Color(0xffed3f13);
        borderColor = const Color(0xffffcfb8);
        break;
      case 'warning':
        backgroundColor = const Color(0xfffff9e6);
        textColor = const Color(0xffff9900);
        borderColor = const Color(0xffffe7a3);
        break;
      case 'info':
        backgroundColor = const Color(0xfff0faff);
        textColor = const Color(0xffd4eeff);
        borderColor = const Color(0xff2e8bf0);
        break;
      default:
        backgroundColor = const Color(0xffedfff3);
        textColor = const Color(0xff19bf6c);
        borderColor = const Color(0xffbbf2cf);
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
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
      child: Text(text, style: TextStyle(color: textColor)),
    );
  }
}