import 'package:blog_vipot/components/post/post_list.dart';
import 'package:blog_vipot/pages/my_like/my_like_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';

class MyLikePage extends StatefulWidget{

  const MyLikePage({super.key});

  @override
  State<MyLikePage> createState() => _MyLikePageState();
}

class _MyLikePageState extends State<MyLikePage>{
  @override
  Widget build(BuildContext context) {
    return ProviderWidget<MyLikeNotifier>(
      model: MyLikeNotifier(),
      onModelReady: (model){
        model.initData();
        model.initScrollController(controller: ScrollController());
      },
      builder: (_, model, child){
        return Scaffold(
          appBar: AppBar(
            centerTitle: true,
            title: Text(model.total > 0 ? '我的点赞(${model.total})' : '我的点赞'),
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