import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:blog_vipot/pages/group_manage/group_manage_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:reorderables/reorderables.dart';

import '../../components/state/state_request_empty.dart';
import '../../components/state/state_request_error.dart';

class GroupManagePage extends StatefulWidget{
  const GroupManagePage({super.key});

  @override
  State<GroupManagePage> createState() => _GroupManagePageState();
}

class _GroupManagePageState extends State<GroupManagePage>{
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: ProviderWidget<GroupManageNotifier>(
          model: GroupManageNotifier(),
          onModelReady: (model){
            model.pageContext = context;
            model.initData();
            model.initScrollController(controller: ScrollController());
          },
          builder: (context, model, child){
            Widget content;

            if (model.isInitializing) {
              content = Container();
            } else if (model.isError) {
              content = StateRequestError(size: 60, onPressed: model.initData);
            }else{
              content = Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 12,),
                  Container(
                    margin: const EdgeInsets.symmetric(horizontal: 5),
                    child: Text('*长按拖动排序，点击选择修改或删除', style: TextStyle(color: Theme.of(context).hintColor),),
                  ),
                  const SizedBox(height: 12,),
                  Card(
                    child: ReorderableColumn(
                      onReorder: model.onReorder,
                      children: model.pageList.map((group){
                        return ListTile(
                          key: ValueKey(group['id']),
                          tileColor: model.selectedGroup != null && model.selectedGroup!['id'] == group['id'] ? Theme.of(context).colorScheme.primary : null,
                          minLeadingWidth: 0,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 10),
                          title: Text(
                              '${group['name']}${group['memberCount'] > 0
                                  ? '(${group['memberCount']})'
                                  : ''}'
                          ),
                          onTap: (){
                            model.selectedGroup = group;
                          },
                        );
                      }).toList(),
                    ),
                  ),
                  Card(
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(model.editForm['id'].toString().isNotEmpty ? '修改分组' : '新增分组'),
                          const SizedBox(height: 12,),
                          TextField(
                            maxLines: 1,
                            maxLength: 8,
                            controller: model.editingController,
                            keyboardType: TextInputType.text,
                            decoration: const InputDecoration(
                              fillColor: Colors.red,
                              labelText: '分组名称',
                              // hintText: '有什么新鲜事想分享给大家？',
                              border: OutlineInputBorder(),
                            ),
                            onChanged: (val){
                              model.editForm['name'] = val.trim();
                            },
                          ),
                          if(model.editForm['id'].toString().isNotEmpty) ...[
                            const SizedBox(height: 12,),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                onPressed: model.handleDeleteGroup,
                                style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.red
                                ),
                                child: const Text('删除该分组'),
                              ),
                            ),
                            const SizedBox(height: 12,),
                            SizedBox(
                              width: double.infinity,
                              child: OutlinedButton(
                                onPressed: () {
                                  model.selectedGroup = null;
                                },
                                child: const Text('取消'),
                              ),
                            ),
                          ],
                          const SizedBox(height: 12,),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: model.handleEditGroup,
                              child: const Text('保存'),
                            ),
                          )
                        ],
                      ),
                    ),
                  )
                ],
              );
            }

            return RefreshConfiguration.copyAncestor(
              context: context,
              child: SmartRefresher(
                controller: model.refreshController,
                enablePullDown: true,
                onRefresh: () async{
                  bool res = await model.getData();
                  res ? model.refreshController.refreshCompleted() : model.refreshController.refreshFailed();
                },
                child: SingleChildScrollView(
                  controller: model.scrollController,
                  child: content,
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}