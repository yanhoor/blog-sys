import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class YCard extends StatelessWidget{
  final Widget child;
  ShapeBorder? shape;
  Color? color;
  EdgeInsetsGeometry? padding;

  YCard({super.key, required this.child, this.shape, this.color, this.padding = const EdgeInsets.all(12)});

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: shape,
      color: color,
      child: Container(
        padding: padding,
        child: child,
      ),
    );
  }
}