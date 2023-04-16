import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:blog_vipot/pages/notification/notification_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:blog_vipot/components/state/state_request_empty.dart';
import 'package:blog_vipot/components/state/state_request_error.dart';

class NotificationTabPageBase extends StatefulWidget{
  final NotificationNotifier model;
  final Widget Function(BuildContext context, int index, Map<String, dynamic> item, NotificationNotifier model) itemBuilder;

  const NotificationTabPageBase({super.key, required this.model, required this.itemBuilder});

  @override
  State<NotificationTabPageBase> createState() => _NotificationTabPageBaseState();
}

class _NotificationTabPageBaseState extends State<NotificationTabPageBase>{

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: ProviderWidget<NotificationNotifier>(
          model: widget.model,
          onModelReady: (model){
            model.pageContext = context;
            model.initData();
            model.initScrollController(controller: ScrollController());
          },
          builder: (_, model, child){
            Widget content;
            if (model.isInitializing) {
              content = Container();
            } else if (model.isEmpty) {
              content = StateRequestEmpty(size: 60, onPressed: model.initData,);
            } else if (model.isError) {
              content = StateRequestError(size: 60, onPressed: model.initData);
            } else {
              content = ListView.builder(
                  shrinkWrap: true,
                  padding: const EdgeInsets.all(0),
                  physics: const NeverScrollableScrollPhysics(), // 禁止滑动
                  itemCount: model.pageList.length,
                  itemBuilder: (context, index) {
                    Map<String, dynamic> item = model.pageList[index];
                    return widget.itemBuilder(context, index, item, model);
                  });
            }

            return RefreshConfiguration.copyAncestor(
                context: context,
                child: SmartRefresher(
                  controller: model.refreshController,
                  enablePullDown: true,
                  enablePullUp: true,
                  onRefresh: model.refreshData,
                  onLoading: model.handleLoadMore,
                  child: SingleChildScrollView(
                    controller: model.scrollController,
                    child: content,
                  ),
                ));
          },
        ),
      ),
    );
  }
}