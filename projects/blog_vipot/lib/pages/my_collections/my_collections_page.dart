import 'package:blog_vipot/components/post/post_list.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';

import 'my_collections_notifier.dart';

class MyCollectionsPage extends StatefulWidget{

  const MyCollectionsPage({super.key});

  @override
  State<MyCollectionsPage> createState() => _MyCollectionsPageState();
}

class _MyCollectionsPageState extends State<MyCollectionsPage>{
  @override
  Widget build(BuildContext context) {
    return ProviderWidget<MyCollectionsNotifier>(
      model: MyCollectionsNotifier(),
      onModelReady: (model){
        model.initData();
        model.initScrollController(controller: ScrollController());
      },
      builder: (_, model, child){
        return Scaffold(
          appBar: AppBar(
            title: Text(model.total > 0 ? '我的收藏(${model.total})' : '我的收藏'),
          ),
          body: SafeArea(
            bottom: false,
            child: PostList(model: model),
          ),
        );
      },
    );
  }
}