import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:blog_vipot/components/post/post_list.dart';
import 'index_notifier.dart';

class IndexTabPage extends StatefulWidget{
  final String gid;
  final Function(IndexNotifier model) onModelReady;

  IndexTabPage({super.key, required this.gid, required this.onModelReady}){
    // print('--------IndexTabPage--------$key');
  }

  @override
  State<IndexTabPage> createState() => _IndexTabPageState();
}

class _IndexTabPageState extends State<IndexTabPage> with AutomaticKeepAliveClientMixin{

  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return ProviderWidget<IndexNotifier>(
      key: ValueKey(widget.gid),
      model: IndexNotifier(groupId: widget.gid),
      onModelReady: (model){
        model.initData();
        model.initScrollController(controller: ScrollController());
        widget.onModelReady(model);
      },
      builder: (_, model, child){

        return SafeArea(
          child: PostList(model: model,),
        );
      },
    );
  }

}