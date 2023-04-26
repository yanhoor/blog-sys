import 'package:blog_vipot/components/post/post_list.dart';
import 'package:blog_vipot/pages/search_result/search_result_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:flutter/services.dart';

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
                return PostList(model: model);
              },
            ),
          ),
        )
    );
  }
}