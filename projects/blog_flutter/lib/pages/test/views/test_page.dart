import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:blog_flutter/routes/index.dart';
import '../data/test_controller.dart';

class TestPage extends GetView<TestController> {
  @override
  Widget build(context) {
    // Instantiate your class using Get.put() to make it available for all "child" routes there.

    return Scaffold(
      // Use Obx(()=> to update Text() whenever count is changed.
        appBar: AppBar(
            title: Text('title')),

        // Replace the 8 lines Navigator.push by a simple Get.to(). You don't need context
        body: Column(children: [
          ElevatedButton(
              child: Text('total_confirmed'.tr),
              onPressed: () => Get.toNamed(RouteName.root)),
          ElevatedButton(
              child: Text("fetch"),
              onPressed: () => { }),
          ElevatedButton(
              child: Text("theme"),
              onPressed: () => { Get.changeTheme(Get.isDarkMode? ThemeData.light(): ThemeData.dark()) }),
        ]),
        floatingActionButton:
        FloatingActionButton(child: Icon(Icons.add), onPressed: () => {}));
  }
}
