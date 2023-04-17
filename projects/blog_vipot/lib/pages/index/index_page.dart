import 'package:blog_vipot/components/wrapper/tab_view_wrapper.dart';
import 'package:blog_vipot/notifiers/global_notifier.dart';
import 'package:blog_vipot/pages/index/index_tab_page.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:blog_vipot/storage/storage_manager.dart';

class IndexPage extends StatefulWidget{
  const IndexPage({super.key});

  @override
  State<IndexPage> createState() => _IndexPageState();
}

class _IndexPageState extends State<IndexPage>{
  int initTab = 0;
  String groupId = '';
  List<Map<String, dynamic>> tabModelList = [];

  @override
  void initState() {
    super.initState();
    groupId = MyStorageManager.sharedPreferences.getString(MyStorageManager.INDEX_GROUP_ID) ?? '';
  }

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: SafeArea(
        child: Consumer<GlobalNotifier>(
          builder: (_, model, child){
            initTab = model.allGroupList.indexWhere((g){
              return g['id'].toString() == groupId;
            });

            return model.allGroupList.isEmpty ? IndexTabPage(
                key: const ValueKey(''),
                gid: '',
                onModelReady: (indexModel){
                  model.indexNotifier = indexModel;
                }
            ) : TabViewWrapper(
              isScrollable: true,
              initTab: initTab > -1 ? initTab : 0,
              tabList: model.allGroupList.map((g) {
                return g['name'] as String;
              }).toList(),
              onTabChange: (index) async{
                String id = model.allGroupList[index]['id'].toString();
                int idx = tabModelList.indexWhere((m) => m['id'] == id);
                if(idx > -1) model.indexNotifier = tabModelList[idx]['model'];
                MyStorageManager.sharedPreferences.setString(MyStorageManager.INDEX_GROUP_ID, id);
              },
              pageBuilder: (BuildContext context, int index) {
                var group = model.allGroupList[index];

                return IndexTabPage(
                  key: ValueKey(group['id'].toString()),
                  gid: group['id'].toString(),
                  onModelReady: (indexModel){
                    model.indexNotifier = indexModel;
                    tabModelList.add({
                      'id': group['id'].toString(),
                      'model': indexModel
                    });
                  },
                );
              },
            );
          },
        ),
      ),
    );
  }

}