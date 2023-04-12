import 'package:flutter/material.dart';

class UserName extends StatelessWidget{
  final Map<String, dynamic> user;
  double fontSize;
  UserName({super.key, required this.user, this.fontSize = 16});

  @override
  Widget build(BuildContext context) {
    return Text(user['name'], style: TextStyle(color: Theme.of(context).colorScheme.primary, fontWeight: FontWeight.w600, fontSize: fontSize),);
  }

}