import 'package:blog_vipot/components/skeleton/skeleton_user_page.dart';
import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:blog_vipot/pages/user/components/user_card_section.dart';
import 'package:blog_vipot/pages/user/components/user_image_section.dart';
import 'package:blog_vipot/pages/user/components/user_post_section.dart';
import 'package:blog_vipot/pages/user/user_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:blog_vipot/components/media/media_image_item.dart';
import 'package:blog_vipot/components/state/state_request_error.dart';
import 'components/user_post_search.dart';

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
          Widget content;
          if (model.isInitializing) {
            content = const SkeletonUserPage();
          } else if (model.isError) {
            content = SafeArea(
              child: StateRequestError(msg: model.stateErrorText, size: 60, onPressed: model.initData),
            );
          }else{
            content = Stack(
              children: [
                Column(
                  children: [
                    Expanded(
                        child: RefreshConfiguration.copyAncestor(
                          context: context,
                          child:  SmartRefresher(
                            controller: model.refreshController,
                            enablePullDown: true,
                            enablePullUp: true,
                            onRefresh: model.refreshData,
                            onLoading: model.handleLoadMore,
                            child: SingleChildScrollView(
                              controller: model.scrollController,
                                child: Stack(
                                  children: [
                                    SizedBox(
                                      width: MediaQuery.of(context).size.width,
                                      height: MediaQuery.of(context).size.width * 9/16,
                                      child: model.userInfo['profileCardBg'] == null
                                          ? Image.asset('lib/assets/images/profile_card_default_bg.jpeg', fit: BoxFit.cover,)
                                          : MediaImageItem(
                                        url: model.userInfo['profileCardBg'],
                                        // fit: BoxFit.scaleDown,
                                      ),
                                    ),
                                    Container(
                                      padding: EdgeInsets.only(top: MediaQuery.of(context).size.width * 9/16 - 35),
                                      child: ListView(
                                        padding: EdgeInsets.zero,
                                        shrinkWrap: true,
                                        primary: false,
                                        physics: const NeverScrollableScrollPhysics(),
                                        children: [
                                          const UserCardSection(),
                                          const SizedBox(height: 12,),
                                          if(model.mediaList.isNotEmpty) const UserImageSection(),
                                          const SizedBox(height: 12,),
                                          const UserPostSection()
                                        ],
                                      ),
                                    )
                                  ],
                                )
                            ),
                          ),
                        )
                    ),
                  ],
                ),
                if(model.showSearch) const UserPostSearch()
              ],
            );
          }

          return content;
        },
      ),
    );
  }
}