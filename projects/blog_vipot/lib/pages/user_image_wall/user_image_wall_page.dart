import 'package:blog_vipot/components/media/media_image_item.dart';
import 'package:blog_vipot/components/no_shadow_scroll_behavior.dart';
import 'package:blog_vipot/components/skeleton/skeleton_media_list.dart';
import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:blog_vipot/pages/user_image_wall/user_image_wall_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:blog_vipot/components/state/state_request_empty.dart';
import 'package:blog_vipot/components/state/state_request_error.dart';
import 'package:blog_vipot/route/route_name.dart';

class UserImageWallPage extends StatefulWidget{
  final String userId;

  const UserImageWallPage({super.key, required this.userId});

  @override
  State<UserImageWallPage> createState() => _UserImageWallPageState();
}

class _UserImageWallPageState extends State<UserImageWallPage>{
  @override
  Widget build(BuildContext context) {
    return ProviderWidget<UserImageWallNotifier>(
        model: UserImageWallNotifier(userId: widget.userId),
        onModelReady: (model){
          model.initData();
          model.initScrollController(controller: ScrollController());
        },
        builder: (_, model, child){
          Widget content;
          if (model.isInitializing) {
            content = const SkeletonMediaList();
          } else if (model.isEmpty) {
            content = StateRequestEmpty(size: 60, onPressed: model.initData,);
          } else if (model.isError) {
            content = StateRequestError(size: 60, onPressed: model.initData, msg: model.stateErrorText,);
          } else {
            content = GridView.count(
              // shrinkWrap: true,
              crossAxisCount: 3,
              // physics: const NeverScrollableScrollPhysics(),
              childAspectRatio: 1,
              crossAxisSpacing: 4,
              mainAxisSpacing: 4,
              children: model.pageList.map((media) => RawMaterialButton(
                onPressed: (){
                  int idx = model.pageList.indexOf(media);

                  Navigator.of(context).pushNamed(RouteName.mediaDetail, arguments: { 'mediaList': model.pageList, 'initIndex': idx});
                },
                child: MediaImageItem(url: media['file']['url'], width: double.infinity, height: double.infinity),
              )).toList(),
            );
          }

          return Scaffold(
            appBar: AppBar(
              centerTitle: true,
              title: Text('全部照片(${model.imageTotal})'),
            ),
            body: SafeArea(
              bottom: false,
              child: ScrollConfiguration(
                behavior: NoShadowScrollBehavior(),
                child: RefreshConfiguration.copyAncestor(
                    context: context,
                    child: SmartRefresher(
                      controller: model.refreshController,
                      enablePullDown: true,
                      enablePullUp: true,
                      onRefresh: model.refreshData,
                      onLoading: model.handleLoadMore,
                      child: content,
                    )
                ),
              ),
            ),
          );
        }
    );
  }
}