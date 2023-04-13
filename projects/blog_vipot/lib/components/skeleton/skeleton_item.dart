// 单个蒙版形状
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class SkeletonItem extends Container {
  SkeletonItem(
      {super.key,
      bool isCircle = false,
      bool isDark = false,
      required double width,
      required double height,
      EdgeInsetsGeometry? margin,
      BoxDecoration decoration = const BoxDecoration()})
      : super(
            height: height,
            width: width,
            margin: margin,
            decoration: decoration.copyWith(
              color: isDark ? Colors.grey[700] : Colors.grey[400],
              shape: isCircle ? BoxShape.circle : BoxShape.rectangle,
            ));
}
