

import 'package:flutter/cupertino.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

class PressRipple extends StatefulWidget {
  final Widget child;
  final VoidCallback onLongPress;
  final VoidCallback onLongPressEnd;

  const PressRipple({
    super.key,
    required this.child,
    required this.onLongPress,
    required this.onLongPressEnd,
  });

  @override
  _PressRippleState createState() => _PressRippleState();
}

class _PressRippleState extends State<PressRipple> {
  late InteractiveInkFeature _inkFeature;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onLongPress: widget.onLongPress,
      onLongPressEnd: (d){
        _inkFeature.dispose();
        widget.onLongPressEnd();
      },
      onLongPressStart: (d){
        _inkFeature = InkRipple(
          customBorder: const CircleBorder(),
          position: d.localPosition,
          color: Colors.red,
          controller: Material.of(context),
          referenceBox: context.findRenderObject() as RenderBox,
          textDirection: TextDirection.ltr,
          containedInkWell: true,
        );
      },
      // onTapUp: (d){
      //   _inkFeature.dispose();
      // },
      child: widget.child,
    );
  }
}
