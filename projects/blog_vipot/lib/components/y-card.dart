import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class YCard extends StatelessWidget{
  final Widget child;
  ShapeBorder? shape;
  Color? color;

  YCard({super.key, required this.child, this.shape, this.color});

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: shape,
      color: color,
      child: Container(
        padding: const EdgeInsets.all(12),
        child: child,
      ),
    );
  }
}