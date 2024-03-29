import 'package:flutter/material.dart';

class UserName extends StatelessWidget{
  final Map<String, dynamic> user;
  const UserName({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return Text(user['name'], style: TextStyle(color: Theme.of(context).colorScheme.primary, fontWeight: FontWeight.w600, fontSize: 16),);
  }

}