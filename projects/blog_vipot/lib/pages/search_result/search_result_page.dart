import 'package:blog_vipot/components/post/post_list.dart';
import 'package:blog_vipot/components/post/post_list_filter_dropdown.dart';
import 'package:blog_vipot/pages/search_result/search_result_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:flutter/services.dart';

import '../../components/post/post_search_input.dart';

class SearchResultPage extends StatefulWidget{
  final String keyword;

  const SearchResultPage({super.key, required this.keyword});

  @override
  State<SearchResultPage> createState() => _SearchResultPageState();
}

class _SearchResultPageState extends State<SearchResultPage>{
  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return AnnotatedRegion<SystemUiOverlayStyle>(
        value: isDark ? SystemUiOverlayStyle.light : SystemUiOverlayStyle.dark,
        child: Scaffold(
          body: SafeArea(
            bottom: false,
            child: ProviderWidget<SearchResultNotifier>(
              model: SearchResultNotifier(keyword: widget.keyword),
              onModelReady: (model){
                model.initData();
                model.initScrollController(controller: ScrollController());
              },
              builder: (_, model, child){
                return Stack(
                  children: [
                    PostList(model: model),
                    Positioned(
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
                                        initKeyword: model.keyword,
                                        onTapClose: (){
                                          Navigator.of(context).pop();
                                        },
                                        onSubmitted: (v){
                                          if(v.isEmpty) return;

                                          model.setKeyword(v);
                                          model.refreshController.requestRefresh();
                                        }
                                    )
                                ),
                                const SizedBox(width: 12,),
                                PostListFilterDropdown(
                                  isAll: true,
                                  onChange: (params){
                                    model.searchParams = params;
                                    model.refreshController.requestRefresh();
                                  },
                                  trigger: ClipOval(
                                    child: Material(
                                      color: isDark ? Colors.black.withOpacity(0.7) : Colors.white.withOpacity(0.9), // But
                                      child: const SizedBox(width: 42, height: 42, child: Icon(Icons.menu)),
                                    ),
                                  ) ,
                                ),
                                // ElevatedButton(
                                //   onPressed: () {},
                                //   child: Icon(Icons.menu),
                                //   style: ButtonStyle(
                                //     shape: MaterialStateProperty.all(CircleBorder()),
                                //     padding: MaterialStateProperty.all(EdgeInsets.all(20)),
                                //     backgroundColor: MaterialStateProperty.all(Colors.blue), // <-- Button color
                                //     overlayColor: MaterialStateProperty.resolveWith<Color?>((states) {
                                //       if (states.contains(MaterialState.pressed)) return Colors.red; // <-- Splash color
                                //     }),
                                //   ),
                                // )
                              ],
                            ),
                          ),
                        )
                    )
                  ],
                );
              },
            ),
          ),
        )
    );
  }
}