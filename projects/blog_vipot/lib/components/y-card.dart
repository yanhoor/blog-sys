import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class YCard extends StatelessWidget{
  final Widget child;

  const YCard({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Container(
        padding: const EdgeInsets.all(12),
        child: child,
      ),
    );
  }
}