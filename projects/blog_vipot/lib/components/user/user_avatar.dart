import 'package:flutter/material.dart';
import '../media/media_image_item.dart';

class UserAvatar extends StatelessWidget{
  final Map<String, dynamic> user;
  final double size;
  const UserAvatar({super.key, required this.user, this.size = 40});

  @override
  Widget build(BuildContext context) {
    var avatar = user['avatar'];
    return SizedBox(
      width: size,
      height: size,
      child: avatar == null || (avatar as String).isEmpty
          ? Container(
        // padding: EdgeInsets.all(8),
        decoration: BoxDecoration(
            border: Border.all(color: Theme.of(context).hintColor),
            shape: BoxShape.circle
        ),
        child: const Icon(Icons.person),
      )
          : ClipRRect(
        borderRadius: BorderRadius.circular(size),
        child: MediaImageItem(url: user['avatar'],),
      ),
    );
  }

}