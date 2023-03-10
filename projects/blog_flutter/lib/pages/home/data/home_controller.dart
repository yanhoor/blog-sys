
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:blog_flutter/controller/base_controller.dart';

class HomeController extends BaseController with GetSingleTickerProviderStateMixin {
  final bool initImmediate;
  var currentTab = 0.obs;

  late TabController tabController;
  late PageController pageController;

  HomeController({this.initImmediate = true});

  @override
  void onInit() async {
    print('HomeController init 11111');
    tabController = TabController(length: 5, initialIndex: currentTab.value, vsync: this);
    pageController = PageController(initialPage: currentTab.value);
    super.onInit();
    print('HomeController init 222222');
  }

  @override
  void onClose() {
    tabController.dispose();
    pageController.dispose();
    super.onClose();
  }
}