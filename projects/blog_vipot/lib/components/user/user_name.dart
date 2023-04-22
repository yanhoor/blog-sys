import 'package:flutter/material.dart';

class UserName extends StatelessWidget{
  final Map<String, dynamic> user;
  double fontSize;
  bool showAt;
  UserName({super.key, required this.user, this.fontSize = 16, this.showAt = false});

  @override
  Widget build(BuildContext context) {
    return Text((showAt ? '@' : '') + user['name'], style: TextStyle(color: Theme.of(context).colorScheme.primary, fontWeight: FontWeight.w600, fontSize: fontSize),);
  }

}