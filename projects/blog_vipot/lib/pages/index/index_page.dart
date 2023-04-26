import 'package:blog_vipot/components/wrapper/tab_view_wrapper.dart';
import 'package:blog_vipot/notifiers/global_notifier.dart';
import 'package:blog_vipot/pages/index/index_tab_page.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:blog_vipot/storage/storage_manager.dart';

class IndexPage extends StatefulWidget{
  const IndexPage({super.key});

  @override
  State<IndexPage> createState() => _IndexPageState();
}

class _IndexPageState extends State<IndexPage> with AutomaticKeepAliveClientMixin{
  int initTab = 0;
  String groupId = '';
  List<Map<String, dynamic>> tabModelList = [];

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    groupId = MyStorageManager.sharedPreferences.getString(MyStorageManager.INDEX_GROUP_ID) ?? '';
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: isDark ? SystemUiOverlayStyle.light : SystemUiOverlayStyle.dark,
        child: Scaffold(
          body: SafeArea(
            child: Consumer<GlobalNotifier>(
              builder: (_, model, child){
                initTab = model.indexGroupList.indexWhere((g){
                  return g['id'].toString() == groupId;
                });

                return model.indexGroupList.isEmpty ? IndexTabPage(
                    key: const PageStorageKey(''),
                    gid: '',
                    onModelReady: (indexModel){
                      model.indexNotifier = indexModel;
                    }
                ) : TabViewWrapper(
                  key: ValueKey<int>(model.groupRefreshTime), // 在新增分组后重建
                  isScrollable: true,
                  initTab: initTab > -1 ? initTab : 0,
                  tabList: model.indexGroupList.map((g) {
                    return g['name'] as String;
                  }).toList(),
                  onTabChange: (index) async{
                    String id = model.indexGroupList[index]['id'].toString();
                    int idx = tabModelList.indexWhere((m) => m['id'] == id);
                    if(idx > -1) model.indexNotifier = tabModelList[idx]['model'];
                    MyStorageManager.sharedPreferences.setString(MyStorageManager.INDEX_GROUP_ID, id);
                  },
                  pageBuilder: (BuildContext context, int index) {
                    var group = model.indexGroupList[index];

                    return IndexTabPage(
                      key: PageStorageKey(group['id'].toString()), // PageStorageKey 保存滚动位置
                      gid: group['id'].toString(),
                      onModelReady: (indexModel){
                        model.indexNotifier = indexModel;
                        tabModelList.removeWhere((m) => m['id'] == group['id'].toString());
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
        ),
    );
  }

}