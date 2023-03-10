import 'package:get/get.dart';
import 'test_controller.dart';

class TestBinding extends Binding {
  @override
  List<Bind> dependencies() {
    return [
      Bind.lazyPut(() => TestController(initImmediate: false)),
    ];
  }
}