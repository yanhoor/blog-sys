import 'package:blog_vipot/notifiers/state_notifier.dart';
import 'package:flutter/cupertino.dart';

class PageControlNotifier extends StateNotifier{
  ScrollController? scrollController;
  BuildContext? pageContext;
  late double scrollHeight;
  late Function(double offset) scrollCallBack; // 页面滚动时的回调函数，可在onModelReady注册

  initScrollController({ required ScrollController controller, double height = 200, bool initListener = false }){
    scrollController = controller;
    scrollHeight = height;
    if(initListener) scrollController?.addListener(_scrollHandler);
  }

  scrollToOffset([double offset = 0]){
    scrollController?.animateTo(offset, duration: const Duration(milliseconds: 300), curve: Curves.easeOutCubic);
  }

  double get offsetTop => scrollController!.offset;

  _scrollHandler(){
    scrollCallBack.call(scrollController!.offset);
  }

  setPageContext(BuildContext context){
    pageContext = context;
  }

  @override
  void dispose() {
    super.dispose();
    scrollController?.removeListener(_scrollHandler);
    scrollController?.dispose();
  }
}