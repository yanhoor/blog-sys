import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class StateButtonBusy extends StatelessWidget{

  final double size;
  final Color color;

  const StateButtonBusy({super.key,  this.size = 24, this.color = Colors.white});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
        width: size,
        height: size,
        child: CircularProgressIndicator(
          strokeWidth: 2,
          valueColor: AlwaysStoppedAnimation(color),
        )
    );
  }
}