import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:blog_flutter/routes/index.dart';

class Other extends StatelessWidget {
  // You can ask Get to find a Controller that is being used by another page and redirect you to it.
  // final CounterController c = Get.find();

  @override
  Widget build(context){
    // Access the updated count variable
    return Scaffold(body: Center(child: ElevatedButton(
        child: Text("Go to Other"), onPressed: () => Get.toNamed(RouteName.other))));
  }
}