import 'package:flutter/cupertino.dart';
import 'base_controller.dart';

class BasePageController extends BaseController{
  final ScrollController scrollController = ScrollController();
  final ScrollController scrollController2 = ScrollController();

  @override
  void onInit() async {
    print('BasePageController init');
    super.onInit();
    initScrollController();
  }

  @override
  onClose(){
    print('BasePageController close');
    scrollController.removeListener(_scrollHandler);
    scrollController.dispose();
  }

  scrollToOffset([double offset = 0]){
    scrollController.animateTo(offset, duration: const Duration(milliseconds: 300), curve: Curves.easeOutCubic);
  }

  double get offsetTop => scrollController.offset;

  initScrollController(){
    scrollController.addListener(_scrollHandler);
  }

  _scrollHandler(){
    // print('++++++++++++${scrollController.offset}');
  }
}