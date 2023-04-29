import 'package:blog_vipot/components/no_shadow_scroll_behavior.dart';
import 'package:blog_vipot/components/wrapper/provider_wrapper.dart';
import 'package:blog_vipot/pages/search/search_notifier.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'package:blog_vipot/route/route_name.dart';
import 'package:flutter/services.dart';

class SearchPage extends StatefulWidget{
  const SearchPage({super.key});

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage>{

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return AnnotatedRegion<SystemUiOverlayStyle>(
        value: isDark ? SystemUiOverlayStyle.light : SystemUiOverlayStyle.dark,
        child: Scaffold(
          body: SafeArea(
            child: ProviderWidget<SearchNotifier>(
              model: SearchNotifier(),
              onModelReady: (model){},
              builder: (_, model, child){
                return Container(
                  margin: const EdgeInsets.symmetric(horizontal: 5),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 12,),
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 5),
                        height: 38,
                        child: TextField(
                            textAlignVertical: TextAlignVertical.center,
                            textInputAction: TextInputAction.search,
                            controller: model.textEditingController,
                            keyboardType: TextInputType.text,
                            style: const TextStyle(fontSize: 14),
                            // maxLength: 30,
                            maxLines: 1,
                            decoration: InputDecoration(
                              isDense: true,
                              prefixIcon: Icon(
                                CupertinoIcons.search,
                                color: Theme.of(context).colorScheme.primary,
                              ),
                              suffix: model.keyword.isNotEmpty ? GestureDetector(
                                onTap: (){
                                  model.keyword = '';
                                  model.textEditingController.text = '';
                                },
                                child: const Text('清除'),
                              ) : null,
                              fillColor: Colors.red,
                              // filled: true,
                              hintText: '请输入搜索内容',
                              // constraints: const BoxConstraints(
                              //   minHeight: 0
                              // ),
                              contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 12), // 填充
                              border: const OutlineInputBorder(
                                borderRadius: BorderRadius.all(Radius.circular(50)),
                              ),
                            ),
                            onSubmitted: (v){
                              if(v.isEmpty) return;

                              model.addHistoryItem();
                              Navigator.of(context).pushNamed(RouteName.searchResult, arguments: {'keyword': model.keyword}).then((v) {
                                model.getHistoryListFromStorage();
                              });
                              model.textEditingController.text = '';
                            },
                            onChanged: (val){
                              model.keyword = val.trim();
                            }
                        ),
                      ),
                      if(model.historyList.isNotEmpty) Expanded(
                          child: ScrollConfiguration(
                            behavior: NoShadowScrollBehavior(),
                            child: SingleChildScrollView(
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const SizedBox(height: 12,),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    crossAxisAlignment: CrossAxisAlignment.center,
                                    children: [
                                      const Text('搜索历史'),
                                      TextButton(
                                          onPressed: (){
                                            model.clearHistory();
                                          },
                                          child: const Text('全部清空')
                                      )
                                    ],
                                  ),
                                  Flexible(
                                      fit: FlexFit.loose,
                                      child: Card(
                                        margin: const EdgeInsets.all(0),
                                        child: ListView.separated(
                                          shrinkWrap: true,
                                          physics: const NeverScrollableScrollPhysics(),
                                          separatorBuilder: (_, index){
                                            return const Divider(thickness: 0, height: 0,);
                                          },
                                          itemCount: model.historyList.length,
                                          itemBuilder: (_, index){
                                            String item = model.historyList[index];
                                            return GestureDetector(
                                              behavior: HitTestBehavior.opaque,
                                              onTap: (){
                                                model.addHistoryItem(item);
                                                Navigator.of(context).pushNamed(RouteName.searchResult, arguments: {'keyword': item}).then((v) {
                                                  model.getHistoryListFromStorage();
                                                });
                                              },
                                              child: Padding(
                                                padding: const EdgeInsets.all(12),
                                                // color: Colors.red,
                                                child: Row(
                                                  crossAxisAlignment: CrossAxisAlignment.center,
                                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                                  children: [
                                                    Expanded(child: Text(item, maxLines: 1, overflow: TextOverflow.ellipsis,)),
                                                    const SizedBox(width: 6,),
                                                    GestureDetector(
                                                      onTap: (){
                                                        model.removeHistoryItem(item);
                                                      },
                                                      child: Icon(Icons.close_outlined, color: Theme.of(context).hintColor, size: 18,),
                                                    )
                                                  ],
                                                ),
                                              ),
                                            );
                                          },
                                        ),
                                      )
                                  )
                                ],
                              ),
                            ),
                          )
                      )
                    ],
                  ),
                );
              },
            ),
          ),
        )
    );
  }
}