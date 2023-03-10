import 'package:blog_flutter/theme/theme_controller.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class HomeDrawer extends GetView<ThemeController>{
  HomeDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Theme.of(context).colorScheme.background,
      width: Get.width * 0.65,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
              child: ListView(
                children: [
                  ObxValue((data) {
                    return ListTile(
                      title: const Text('深色模式'),
                      leading: Transform.rotate(
                        angle: 145,
                        child: Icon(
                          data.value
                              ? Icons.brightness_5
                              : Icons.brightness_2,
                          color: Theme.of(context).colorScheme.primary,
                        ),
                      ),
                      trailing: CupertinoSwitch(
                          activeColor: Theme.of(context).colorScheme.primary,
                          value: data.value,
                          onChanged: (value) {
                            // Get.changeThemeMode(Get.isDarkMode ? ThemeMode.light : ThemeMode.dark);
                            // controller.toggleTheme();
                            controller.toggleThemeMode();
                          }),
                    );
                  }, controller.isDarkMode)
                ],
              )
          )
        ],
      ),
    );
  }
}