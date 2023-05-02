import 'package:blog_vipot/components/no_shadow_scroll_behavior.dart';
import 'package:blog_vipot/components/post/post_search_input.dart';
import 'package:blog_vipot/components/skeleton/skeleton_user_page.dart';
import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:blog_vipot/pages/user/components/user_card_section.dart';
import 'package:blog_vipot/pages/user/components/user_image_section.dart';
import 'package:blog_vipot/pages/user/components/user_post_section.dart';
import 'package:blog_vipot/pages/user/user_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:blog_vipot/components/media/media_image_item.dart';
import 'package:blog_vipot/components/state/state_request_error.dart';

import '../../components/post/post_list_filter_dropdown.dart';

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
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return AnnotatedRegion<SystemUiOverlayStyle>(
        value: isDark ? SystemUiOverlayStyle.light : SystemUiOverlayStyle.dark,
        child: Scaffold(
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
                            child: ScrollConfiguration(
                              behavior: NoShadowScrollBehavior(),
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
                              ),
                            )
                        ),
                      ],
                    ),
                    if(model.showSearch) Positioned(
                        left: 0,
                        bottom: 0,
                        child: SafeArea(
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 20),
                            width: MediaQuery.of(context).size.width,
                            child: Row(
                              children: [
                                Expanded(
                                    child: PostSearchInput(
                                        onTapClose: (){
                                          model.showSearch = false;
                                        },
                                        onSubmitted: (v){
                                          model.keyword = v.trim();
                                          model.refreshController.requestRefresh();
                                        },
                                        onChanged: (val){
                                          model.keyword = val.trim();
                                        }
                                    )
                                ),
                                const SizedBox(width: 12,),
                                PostListFilterDropdown(
                                  onChange: (params){
                                    model.mediaType = params.mediaType;
                                    model.sort = params.sort;
                                    model.refreshController.requestRefresh();
                                  },
                                  trigger: ClipOval(
                                    child: Material(
                                      color: isDark ? Colors.black.withOpacity(0.7) : Colors.white.withOpacity(0.9), // But
                                      child: const SizedBox(width: 42, height: 42, child: Icon(Icons.menu)),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        )
                    )
                  ],
                );
              }

              return content;
            },
          ),
        )
    );
  }
}