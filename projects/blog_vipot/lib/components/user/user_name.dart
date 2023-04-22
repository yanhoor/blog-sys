import 'package:flutter/material.dart';
import 'package:blog_vipot/route/route_name.dart';

class UserName extends StatelessWidget{
  final Map<String, dynamic> user;
  double fontSize;
  bool showAt;

  UserName({super.key, required this.user, this.fontSize = 16, this.showAt = false});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: (){
        Object? arguments = ModalRoute.of(context)?.settings.arguments;
        String? routeName = ModalRoute.of(context)?.settings.name;

        if(routeName == RouteName.user && arguments != null && (arguments as Map)['userId'].toString() == user['id'].toString()) return;

        Navigator.of(context).pushNamed(RouteName.user,
            arguments: {'userId': user['id']});
      },
      child: Text((showAt ? '@' : '') + user['name'],
        style: TextStyle(color: Theme.of(context).colorScheme.primary,
            fontWeight: FontWeight.w600,
            fontSize: fontSize
        ),
      ),
    );
  }

}