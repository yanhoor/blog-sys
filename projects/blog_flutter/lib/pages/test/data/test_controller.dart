
import 'package:get/get.dart';

class TestController extends GetxController {
  List blogList = [].obs;
  final bool initImmediate;

  TestController({this.initImmediate = true});

  @override
  void onInit() async {
    print('TestController init 11111');
    super.onInit();
    print('TestController init 222222$blogList');
  }
}