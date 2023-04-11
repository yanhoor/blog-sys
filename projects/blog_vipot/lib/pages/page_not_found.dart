import 'package:flutter/material.dart';

class PageNotFoundPage extends StatelessWidget{
  final String? routeName;

  const PageNotFoundPage({super.key, this.routeName});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Text(
          routeName != null ? '该路由不存在： $routeName' : '页面不存在',
          style: const TextStyle(
              color: Colors.white,
              fontSize: 36
          ),
        ),
      ),
    );
  }
}
