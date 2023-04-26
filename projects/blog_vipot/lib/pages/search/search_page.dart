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
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 5),
                        child: TextField(
                            textInputAction: TextInputAction.search,
                            controller: model.textEditingController,
                            keyboardType: TextInputType.text,
                            maxLength: 30,
                            decoration: InputDecoration(
                              counter: const Offstage(),
                              prefixIcon: Icon(
                                CupertinoIcons.search,
                                color: Theme.of(context).colorScheme.primary,
                              ),
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
                              model.addHistoryItem();
                              Navigator.of(context).pushNamed(RouteName.searchResult,
                                  arguments: {'keyword': model.keyword});
                              model.textEditingController.text = '';
                            },
                            onChanged: (val){
                              model.keyword = val.trim();
                            }
                        ),
                      ),
                      if(model.historyList.isNotEmpty) Expanded(child: SingleChildScrollView(
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
                                          Navigator.of(context).pushNamed(RouteName.searchResult,
                                              arguments: {'keyword': item});
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
                      ))
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