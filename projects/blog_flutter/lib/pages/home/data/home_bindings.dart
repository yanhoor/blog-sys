import 'package:get/get.dart';
import 'package:blog_flutter/pages/home/data/home_controller.dart';

class HomeBinding extends Binding {
  @override
  List<Bind> dependencies() {
    return [
      Bind.put(HomeController(initImmediate: false)),
    ];
  }
}