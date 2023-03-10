import 'package:get/get.dart';
import 'index_controller.dart';

class IndexBinding extends Binding {
  @override
  List<Bind> dependencies() {
    return [
      Bind.lazyPut<IndexController>(()=>IndexController()),
    ];
  }
}