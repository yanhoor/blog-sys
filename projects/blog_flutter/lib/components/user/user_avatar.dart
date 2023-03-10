import 'package:flutter/material.dart';
import 'package:blog_flutter/components/media/media_image_item.dart';

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
      child: ClipRRect(
        borderRadius: BorderRadius.circular(size),
        child: avatar == null || (avatar as String).isEmpty ? const Icon(Icons.person) : MediaImageItem(url: user['avatar'],),
      ),
    );
  }

}