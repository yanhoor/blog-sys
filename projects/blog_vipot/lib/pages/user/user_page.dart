import 'package:blog_vipot/components/skeleton/skeleton_user_page.dart';
import 'package:blog_vipot/components/state/state_request_empty.dart';
import 'package:blog_vipot/components/user/user_avatar.dart';
import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:blog_vipot/components/y-card.dart';
import 'package:blog_vipot/pages/user/user_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:blog_vipot/components/custom/custom_icon_button.dart';
import 'package:blog_vipot/components/media/media_image_item.dart';
import 'package:blog_vipot/components/post/post_item.dart';
import 'package:blog_vipot/components/state/state_request_error.dart';
import 'package:blog_vipot/route/route_name.dart';

class UserPage extends StatefulWidget{
  final String userId;

  const UserPage({super.key, required this.userId});

  @override
  State<UserPage> createState() => _UserPageState();
}

class _UserPageState extends State<UserPage> with AutomaticKeepAliveClientMixin{

  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return Scaffold(
      body: ProviderWidget<UserNotifier>(
        model: UserNotifier(userId: widget.userId),
        onModelReady: (model){
          model.initData();
          model.initScrollController(controller: ScrollController());
        },
        builder: (_, model, child){
          List<Widget> slivers;
          if (model.isInitializing) {
            slivers = [
              const SliverToBoxAdapter(
                child: SkeletonUserPage(),
              )
            ];
          } else if (model.isError) {
            slivers = [
              SliverToBoxAdapter(
                child: SafeArea(
                  child: StateRequestError(msg: model.stateErrorText, size: 60, onPressed: model.initData),
                ),
              )
            ];
          }else{
            slivers = [
              SliverAppBar(
                leading: Container(),
                // backgroundColor: Theme.of(context).colorScheme.primary,
                // title: const Text('我的'),
                // floating: true, // 当有下滑手势的时候，就会显示 AppBar
                pinned: true, // Appbar 折叠后不消失
                // snap: true,
                //是否显示阴影，直接取值innerBoxIsScrolled，展开不显示阴影，合并后会显示
                forceElevated: true,
                expandedHeight: 200,
                // collapsedHeight: 200,
                flexibleSpace: FlexibleSpaceBar(
                  // title: UserAvatar(user: model.userInfo, size: 100,),
                  // centerTitle: false,
                  collapseMode: CollapseMode.parallax,
                  background: model.userInfo['profileCardBg'] == null ? Image.asset('lib/assets/images/profile_card_default_bg.jpeg', fit: BoxFit.cover,) : MediaImageItem(
                    url: model.userInfo['profileCardBg'],
                    // fit: BoxFit.scaleDown,
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: ListView(
                  padding: EdgeInsets.zero,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  children: [
                    YCard(
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
                    ),
                    const SizedBox(height: 12,),
                    if(model.mediaList.isNotEmpty) ...[
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 5),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text.rich(TextSpan(
                                children: [
                                  const TextSpan(text: '相册 '),
                                  TextSpan(text: model.imageTotal.toString(), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 18)),
                                ]
                            ), textAlign: TextAlign.center,),
                            GestureDetector(
                              onTap: (){
                                Navigator.of(context).pushNamed(RouteName.userImageWall,
                                    arguments: {'userId': model.userInfo['id']});
                              },
                              child: const Text('全部'),
                            )
                          ],
                        ),
                      ),
                      const SizedBox(height: 6,),
                      SizedBox(
                        width: MediaQuery.of(context).size.width,
                        height: MediaQuery.of(context).size.width / 5,
                        child: ListView.builder(
                          shrinkWrap: true,
                          scrollDirection: Axis.horizontal,
                          itemCount: model.mediaList.length,
                          itemBuilder: (_, index){
                            var media = model.mediaList[index];
                            return SizedBox(
                              width: MediaQuery.of(context).size.width / 5,
                              child: RawMaterialButton(
                                onPressed: (){
                                  Navigator.of(context).pushNamed(RouteName.mediaDetail, arguments: { 'mediaList': model.mediaList, 'initIndex': index});

                                  // Navigator.of(context).pushNamed(RouteName.imagePreview, arguments: { 'imageList': model.mediaList.map((f) => f['file']['url']).toList(), 'initPage': index});
                                },
                                child: MediaImageItem(url: media['file']['url']),
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                    if(model.pageList.isNotEmpty) ...[
                      const SizedBox(height: 12,),
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 5),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text.rich(TextSpan(
                                children: [
                                  const TextSpan(text: '全部博客 '),
                                  TextSpan(text: model.postTotal.toString(), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 18)),
                                ]
                            ), textAlign: TextAlign.center,),
                            CustomIconButton(
                              onPressed: (){},
                              icon: const Icon(Icons.search_rounded),
                            )
                          ],
                        ),
                      ),
                      const SizedBox(height: 6,),
                      ListView.builder(
                          shrinkWrap: true,
                          // primary: false,
                          padding: const EdgeInsets.all(0),
                          physics: const NeverScrollableScrollPhysics(), // 禁止滑动
                          itemCount: model.pageList.length,
                          itemBuilder: (context, index) {
                            Map<String, dynamic> post = model.pageList[index];
                            return PostItem(
                              key: Key(post['id'].toString()),
                              post: post,
                              scrollController: model.scrollController!,
                              onUpdatePost: (v){
                                post = v;
                                model.notifyListeners();
                              },
                            );
                          }
                      )
                    ]
                    else StateRequestEmpty(
                      onPressed: (){
                        model.refreshController.requestRefresh();
                      },
                    ),
                  ],
                ),
              )
            ];
          }

          return RefreshConfiguration.copyAncestor(
            context: context,
            child:  SmartRefresher(
              controller: model.refreshController,
              enablePullDown: true,
              enablePullUp: true,
              onRefresh: model.refreshData,
              onLoading: model.handleLoadMore,
              child: CustomScrollView(
                controller: model.scrollController,
                slivers: slivers,
              ),
            ),
          );
        },
      ),
    );
  }
}