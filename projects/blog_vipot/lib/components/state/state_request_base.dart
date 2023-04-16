import 'package:flutter/material.dart';

class StateRequestBase extends StatelessWidget{
  final double size;
  final Function()? onPressed;
  final String tip;
  final String? msg;
  final IconData iconData;

  const StateRequestBase({super.key, this.size = 52, this.onPressed, required this.tip, required this.iconData, this.msg});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      // height: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Icon(iconData, color: Theme.of(context).primaryColor, size: size,),
          if(msg != null) ...[
            const SizedBox(height: 12,),
            Text(msg!)
          ],
          const SizedBox(height: 12,),
          RawMaterialButton(
            padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 12),
            onPressed: onPressed,
            child: Text(tip),
          )
        ],
      ),
    );
  }
}