import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class CustomIconButton extends StatelessWidget{
  final Function() onPressed;
  final Icon icon;

  const CustomIconButton({super.key, required this.onPressed, required this.icon});

  @override
  Widget build(BuildContext context) {
    return IconButton(
        padding: EdgeInsets.zero,
        constraints: const BoxConstraints(
            minHeight: 0
        ),
        onPressed: onPressed,
        icon: icon
    );
  }
}