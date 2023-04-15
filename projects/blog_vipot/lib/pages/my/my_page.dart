import 'package:blog_vipot/components/helper/dialog_helper.dart';
import 'package:blog_vipot/components/media/media_image_item.dart';
import 'package:blog_vipot/components/user/user_avatar.dart';
import 'package:blog_vipot/components/user/user_name.dart';
import 'package:blog_vipot/notifiers/global_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

import '../../route/route_name.dart';

class MyPage extends StatefulWidget{
  const MyPage({super.key});

  @override
  State<MyPage> createState() => _MyPageState();
}

class _MyPageState extends State<MyPage>{
  final RefreshController refreshController = RefreshController();


  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
    refreshController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Consumer<GlobalNotifier>(
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
              result = RefreshConfiguration.copyAncestor(
                  context: context,
                  child: SmartRefresher(
                    controller: refreshController,
                    enablePullDown: true,
                    onRefresh: ()async{
                      bool res = await model.getUserInfo();
                      if(res){
                        refreshController.refreshCompleted();
                      }else{
                        refreshController.refreshFailed();
                      }
                    },
                    child: CustomScrollView(
                      slivers: [
                        SliverAppBar(
                          // backgroundColor: Theme.of(context).primaryColor,
                          // title: const Text('我的'),
                          floating: true, // 当有下滑手势的时候，就会显示 AppBar
                          pinned: true, // Appbar 折叠后不消失
                          snap: true,
                          //是否显示阴影，直接取值innerBoxIsScrolled，展开不显示阴影，合并后会显示
                          forceElevated: true,
                          expandedHeight: 150,
                          // collapsedHeight: 200,
                          flexibleSpace: FlexibleSpaceBar(
                            collapseMode: CollapseMode.parallax,
                            background: model.myInfo!['profileCardBg'] == null ? Image.asset('lib/assets/images/profile_card_default_bg.jpeg', fit: BoxFit.fitHeight,) : MediaImageItem(
                              url: model.myInfo!['profileCardBg'],
                              // fit: BoxFit.scaleDown,
                            ),
                          ),
                        ),
                        SliverToBoxAdapter(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
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
                                            onPressed: (){
                                              DialogHelper.showIOSAlertDialog(
                                                  context: context,
                                                  message: '确定退出登录？',
                                                  onConfirm: ()async {
                                                    model.logout();
                                                  }
                                              );
                                            },
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
                                        minLeadingWidth: 0,
                                        contentPadding: const EdgeInsets.symmetric(horizontal: 10),
                                        title: const Text('我的收藏', style: TextStyle(fontSize: 14),),
                                        leading: const Icon(Icons.favorite, size: 24,),
                                        trailing: const Icon(Icons.arrow_forward_ios, size: 24),
                                        onTap: (){
                                          // Navigator.of(context).pushNamed(RouteName.customView);
                                        },
                                      ),
                                      ListTile(
                                        minLeadingWidth: 0,
                                        contentPadding: const EdgeInsets.symmetric(horizontal: 10),
                                        title: const Text('我的点赞', style: TextStyle(fontSize: 14)),
                                        leading: const Icon(Icons.thumb_up, size: 24),
                                        trailing: const Icon(Icons.arrow_forward_ios, size: 24),
                                        onTap: (){
                                          // Navigator.of(context).pushNamed(RouteName.customView);
                                        },
                                      ),
                                      ListTile(
                                        minLeadingWidth: 0,
                                        contentPadding: const EdgeInsets.symmetric(horizontal: 10),
                                        title: const Text('我的评论', style: TextStyle(fontSize: 14)),
                                        leading: const Icon(Icons.messenger, size: 24),
                                        trailing: const Icon(Icons.arrow_forward_ios, size: 24),
                                        onTap: (){
                                          // Navigator.of(context).pushNamed(RouteName.customView);
                                        },
                                      ),
                                      ListTile(
                                        minLeadingWidth: 0,
                                        contentPadding: const EdgeInsets.symmetric(horizontal: 10),
                                        title: const Text('我的分组', style: TextStyle(fontSize: 14)),
                                        leading: const Icon(Icons.group, size: 24),
                                        trailing: const Icon(Icons.arrow_forward_ios, size: 24),
                                        onTap: (){
                                          Navigator.of(context).pushNamed(RouteName.groupManage);
                                        },
                                      ),
                                    ],
                                  )
                              )
                            ],
                          ),
                        )
                      ],
                    ),
                  )
              );
            }
            return result;
          }
      ),
    );
  }
}

class CustomListTile extends StatelessWidget{
  final Widget title;
  final Widget leading;
  final Widget trailing;
  final Function() onTap;

  const CustomListTile({super.key, required this.leading, required this.title, required this.trailing, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return RawMaterialButton(
        onPressed: onTap,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          leading,
          Expanded(child: title),
          trailing
        ],
      ),
    );
  }
}