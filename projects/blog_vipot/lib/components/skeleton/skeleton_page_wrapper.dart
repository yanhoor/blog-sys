import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class SkeletonPageWrapper extends StatelessWidget{
  final Widget child;

  const SkeletonPageWrapper({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return SingleChildScrollView(
      child: Shimmer.fromColors(
        period: const Duration(seconds: 5),
        baseColor: (isDark ? Colors.grey[700] : Colors.grey[350])!,
        highlightColor: (isDark ? Colors.grey[500] : Colors.grey[200])!,
        child: child,
      ),
    );
  }
}