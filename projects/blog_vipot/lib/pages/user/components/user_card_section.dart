import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:blog_vipot/components/user/user_actions_dropdown.dart';
import 'package:blog_vipot/components/user/user_avatar.dart';
import 'package:blog_vipot/components/y-card.dart';
import 'package:blog_vipot/route/route_name.dart';
import '../user_notifier.dart';

class UserCardSection extends StatefulWidget{
  const UserCardSection({super.key});

  @override
  State<UserCardSection> createState() => _UserCardSectionState();
}

class _UserCardSectionState extends State<UserCardSection>{
  @override
  Widget build(BuildContext context) {
    return Consumer<UserNotifier>(
        builder: (_, model, child){
          return YCard(
              color: Theme.of(context).cardColor.withOpacity(0.9),
              shape: const RoundedRectangleBorder(
                  // borderRadius: BorderRadius.only(
                  //   topLeft: Radius.circular(15),
                  //   topRight: Radius.circular(15),
                  // )
                  borderRadius: BorderRadius.all(Radius.circular(10))
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      UserAvatar(user: model.userInfo, size: 100,),
                      const SizedBox(width: 12,),
                      Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const SizedBox(height: 6,),
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: [
                                  Expanded(
                                      child: Row(
                                        crossAxisAlignment: CrossAxisAlignment.center,
                                        children: [
                                          Text(model.userInfo['name'], style: TextStyle(color: Theme.of(context).colorScheme.primary, fontSize: 24, fontWeight: FontWeight.w600),),
                                          const SizedBox(width: 5,),
                                          if(model.userInfo['gender'] == 1) Container(
                                            padding: const EdgeInsets.all(3),
                                            decoration: const BoxDecoration(
                                                color: Colors.blueAccent,
                                                shape: BoxShape.circle
                                            ),
                                            child: const Icon(Icons.male_outlined, color: Colors.white, size: 16,),
                                          )
                                          else if(model.userInfo['gender'] == 2) Container(
                                            padding: const EdgeInsets.all(3),
                                            decoration: const BoxDecoration(
                                                color: Colors.pinkAccent,
                                                shape: BoxShape.circle
                                            ),
                                            child: const Icon(Icons.female_outlined, color: Colors.white, size: 16,),
                                          )
                                        ],
                                      )
                                  ),
                                  UserActionsDropdown(user: model.userInfo)
                                ],
                              ),
                              const SizedBox(height: 12,),
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.center,
                                mainAxisAlignment: MainAxisAlignment.spaceAround,
                                children: [
                                  GestureDetector(
                                    behavior: HitTestBehavior.opaque,
                                    onTap: (){
                                      if(model.userInfo['followingCount'] == 0) return;

                                      Navigator.of(context).pushNamed(RouteName.userFollowings,
                                          arguments: {'userId': model.userInfo['id'].toString()});
                                    },
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.center,
                                      children: [
                                        Text(model.userInfo['followingCount'].toString(), style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 18),),
                                        const SizedBox(height: 6,),
                                        Text('关注', style: TextStyle(color: Theme.of(context).hintColor),),
                                      ],
                                    ),
                                  ),
                                  GestureDetector(
                                    behavior: HitTestBehavior.opaque,
                                    onTap: (){
                                      if(model.userInfo['followerCount'] == 0) return;

                                      Navigator.of(context).pushNamed(RouteName.userFollowers,
                                          arguments: {'userId': model.userInfo['id'].toString()});
                                    },
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.center,
                                      children: [
                                        Text(model.userInfo['followerCount'].toString(), style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 18),),
                                        const SizedBox(height: 6,),
                                        Text('粉丝', style: TextStyle(color: Theme.of(context).hintColor),),
                                      ],
                                    ),
                                  ),
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.center,
                                    children: [
                                      Text(model.userInfo['likedCount'].toString(), style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 18),),
                                      const SizedBox(height: 6,),
                                      Text('获赞', style: TextStyle(color: Theme.of(context).hintColor),),
                                    ],
                                  )
                                ],
                              )
                            ],
                          )
                      )
                    ],
                  ),
                  const SizedBox(height: 12,),
                  Text.rich(TextSpan(
                      children: [
                        const TextSpan(text: '简介：'),
                        TextSpan(text: model.userInfo['introduce'] ?? '无', style: TextStyle(color: Theme.of(context).hintColor))
                      ]
                  ), maxLines: 3, style: const TextStyle(overflow: TextOverflow.ellipsis),)
                ],
              )
          );
        }
    );
  }
}