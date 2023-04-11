import 'package:blog_vipot/notifiers/my_theme_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class HomeDrawer extends StatefulWidget {
  const HomeDrawer({super.key});

  @override
  State<HomeDrawer> createState() => _HomeDrawerState();
}

class _HomeDrawerState extends State<HomeDrawer> {
  @override
  Widget build(BuildContext context) {
    return Consumer<MyThemeNotifier>(builder: (context, themeModel, child) {
      return Container(
        color: Theme.of(context).scaffoldBackgroundColor,
        width: MediaQuery.of(context).size.width * 0.65,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
                child: ListView(
              children: [
                ListTile(
                  title: const Text('深色模式'),
                  leading: Transform.rotate(
                    angle: 145,
                    child: Icon(
                      themeModel.themeMode == ThemeMode.dark ? Icons.brightness_2 : Icons.brightness_5,
                    ),
                  ),
                  trailing: CupertinoSwitch(
                      activeColor: Theme.of(context).colorScheme.primary,
                      value: themeModel.themeMode == ThemeMode.dark,
                      onChanged: (value) {
                        themeModel.themeMode = value ? ThemeMode.dark : ThemeMode.light;
                      }),
                )
              ],
            ))
          ],
        ),
      );
    });
  }
}
