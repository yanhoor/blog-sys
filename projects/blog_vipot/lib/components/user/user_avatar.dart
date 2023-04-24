import 'package:flutter/material.dart';
import 'package:blog_vipot/route/route_name.dart';
import '../media/media_image_item.dart';

class UserAvatar extends StatelessWidget{
  final Map<String, dynamic> user;
  final double size;
  const UserAvatar({super.key, required this.user, this.size = 40});

  @override
  Widget build(BuildContext context) {
    var avatar = user['avatar'];
    return GestureDetector(
      onTap: (){
        Object? arguments = ModalRoute.of(context)?.settings.arguments;
        String? routeName = ModalRoute.of(context)?.settings.name;

        if(routeName == RouteName.user && arguments != null && (arguments as Map)['userId'].toString() == user['id'].toString()) return;

        Navigator.of(context).pushNamed(RouteName.user,
            arguments: {'userId': user['id']});
      },
      child: SizedBox(
        width: size,
        height: size,
        child: avatar == null || (avatar as String).isEmpty
            ? Container(
          // padding: EdgeInsets.all(8),
          decoration: BoxDecoration(
              border: Border.all(color: Theme.of(context).hintColor),
              shape: BoxShape.circle
          ),
          child: Icon(Icons.no_accounts, size: size * 0.8,),
        )
            : ClipRRect(
          borderRadius: BorderRadius.circular(size),
          child: MediaImageItem(url: user['avatar'],),
        ),
      ),
    );
  }

}