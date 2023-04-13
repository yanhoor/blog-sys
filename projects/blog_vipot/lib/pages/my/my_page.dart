import 'package:blog_vipot/components/user/user_avatar.dart';
import 'package:blog_vipot/components/user/user_name.dart';
import 'package:blog_vipot/notifiers/global_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../route/route_name.dart';

class MyPage extends StatefulWidget{
  const MyPage({super.key});

  @override
  State<MyPage> createState() => _MyPageState();
}

class _MyPageState extends State<MyPage>{

  @override
  Widget build(BuildContext context) {
    return Consumer<GlobalNotifier>(
        builder: (context, model, child){
          Widget result;
          if(model.myInfo == null){
            result = ElevatedButton(
                onPressed: (){
                  Navigator.of(context).pushNamed(RouteName.login);
                },
                child: const Text('去登录')
            );
          }else{
            Map<String, dynamic> myInfo = model.myInfo!;
            result = ListView(
              shrinkWrap: true,
              children: [
                Card(
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5)),
                  child: Column(
                    children: [
                      RawMaterialButton(
                        padding: const EdgeInsets.all(12),
                        onPressed: (){},
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            UserAvatar(user: myInfo, size: 52,),
                            const SizedBox(width: 8,),
                            Expanded(child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                UserName(user: myInfo),
                                const SizedBox(height: 4,),
                                Row(
                                  children: [
                                    Text('${myInfo['followerCount']} 粉丝', style: TextStyle(color: Theme.of(context).hintColor),),
                                    const SizedBox(width: 4,),
                                    Text('${myInfo['followingCount']} 关注', style: TextStyle(color: Theme.of(context).hintColor)),
                                  ],
                                ),
                              ],
                            )),
                            const Icon(Icons.arrow_forward_ios)
                          ],
                        ),
                      ),
                      Container(
                        decoration: BoxDecoration(
                            border: Border(top: BorderSide(color: Theme.of(context).highlightColor))
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        // margin: const EdgeInsets.only(top: 12),
                        child: Row(
                          children: [
                            Expanded(child: RawMaterialButton(
                              onPressed: (){},
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: const [
                                  Icon(Icons.edit),
                                  SizedBox(width: 4,),
                                  Text('编辑资料')
                                ],
                              ),
                            )),
                            Expanded(child: RawMaterialButton(
                              onPressed: (){},
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: const [
                                  Icon(Icons.logout),
                                  SizedBox(width: 4,),
                                  Text('退出登录')
                                ],
                              ),
                            ))
                          ],
                        ),
                      )
                    ],
                  ),
                ),
                const SizedBox(height: 4,),
                Card(
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5)),
                  child: Column(
                    children: [
                      ListTile(
                        title: const Text('我的收藏'),
                        leading: const Icon(Icons.favorite),
                        trailing: const Icon(Icons.arrow_forward_ios),
                        onTap: (){
                          // Navigator.of(context).pushNamed(RouteName.customView);
                        },
                      ),
                      ListTile(
                        title: const Text('我的点赞'),
                        leading: const Icon(Icons.thumb_up),
                        trailing: const Icon(Icons.arrow_forward_ios),
                        onTap: (){
                          // Navigator.of(context).pushNamed(RouteName.customView);
                        },
                      ),
                      ListTile(
                        title: const Text('我的评论'),
                        leading: const Icon(Icons.messenger),
                        trailing: const Icon(Icons.arrow_forward_ios),
                        onTap: (){
                          // Navigator.of(context).pushNamed(RouteName.customView);
                        },
                      ),
                      ListTile(
                        title: const Text('我的分组'),
                        leading: const Icon(Icons.group),
                        trailing: const Icon(Icons.arrow_forward_ios),
                        onTap: (){
                          // Navigator.of(context).pushNamed(RouteName.customView);
                        },
                      ),
                    ],
                  )
                )
              ],
            );
          }
          return result;
        }
    );
  }
}