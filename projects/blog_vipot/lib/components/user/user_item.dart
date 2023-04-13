import 'package:blog_vipot/components/user/user_avatar.dart';
import 'package:blog_vipot/components/user/user_name.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class UserItem extends StatelessWidget{
  final Map<String, dynamic> user;

  const UserItem({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        UserAvatar(user: user),
        const SizedBox(width: 10,),
        Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                UserName(user: user, fontSize: 14,),
                const SizedBox(height: 2,),
                Text(user['introduce'] ?? '暂无介绍', style: TextStyle(color: Theme.of(context).hintColor, fontSize: 12),),
                const SizedBox(height: 2,),
                Text('粉丝 ${user['followersCount']}', style: TextStyle(color: Theme.of(context).hintColor, fontSize: 12),),
              ],
            )
        )
      ],
    );
  }
}