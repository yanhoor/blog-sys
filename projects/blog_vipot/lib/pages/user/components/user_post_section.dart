import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:blog_vipot/components/custom/custom_icon_button.dart';
import 'package:blog_vipot/components/post/post_item.dart';
import 'package:blog_vipot/components/state/state_request_empty.dart';
import '../user_notifier.dart';

class UserPostSection extends StatefulWidget{
  const UserPostSection({super.key});

  @override
  State<UserPostSection> createState() => _UserPostSectionState();
}

class _UserPostSectionState extends State<UserPostSection>{
  @override
  Widget build(BuildContext context) {
    return Consumer<UserNotifier>(
        builder: (_, model, child){
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 5),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text.rich(TextSpan(
                        children: [
                          const TextSpan(text: '全部博客 '),
                          TextSpan(text: model.postTotal.toString(), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 18)),
                        ]
                    ), textAlign: TextAlign.center,),
                    Row(
                      children: [
                        PopupMenuButton<int>(
                          child: const Icon(Icons.filter_alt_outlined),
                          itemBuilder: (BuildContext context){
                            return [
                              PopupMenuItem(value: 1,child: Row(
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: const [
                                  Icon(Icons.filter_none_rounded, size: 18,),
                                  SizedBox(width: 12,),
                                  Text('全部')
                                ],
                              ),),
                              PopupMenuItem(value: 2,child: Row(
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: const [
                                  Icon(Icons.trending_up, size: 18,),
                                  SizedBox(width: 12,),
                                  Text('最热')
                                ],
                              ),),
                              PopupMenuItem(value: 3,child: Row(
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: const [
                                  Icon(Icons.video_collection, size: 18,),
                                  SizedBox(width: 12,),
                                  Text('视频')
                                ],
                              ),),
                              PopupMenuItem(value: 4,child: Row(
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: const [
                                  Icon(Icons.audiotrack_rounded, size: 18,),
                                  SizedBox(width: 12,),
                                  Text('音频')
                                ],
                              ),),
                            ];
                          },
                          onSelected: (v){
                            switch(v){
                              case 1:
                                model.mediaType = '';
                                model.sort = '2';
                                break;
                              case 2:
                                model.mediaType = '';
                                model.sort = '3';
                                break;
                              case 3:
                                model.mediaType = 'video';
                                model.sort = '';
                                break;
                              case 4:
                                model.mediaType = 'audio';
                                model.sort = '';
                                break;
                            }
                            model.refreshController.requestRefresh();
                          },
                        ),
                        const SizedBox(width: 6,),
                        CustomIconButton(
                          onPressed: (){
                            model.showSearch = !model.showSearch;
                          },
                          icon: const Icon(Icons.search_rounded),
                        )
                      ],
                    )
                  ],
                ),
              ),
              if(model.pageList.isNotEmpty) ...[
                const SizedBox(height: 6,),
                ListView.builder(
                    shrinkWrap: true,
                    // primary: false,
                    padding: const EdgeInsets.all(0),
                    physics: const NeverScrollableScrollPhysics(), // 禁止滑动
                    itemCount: model.pageList.length,
                    itemBuilder: (context, index) {
                      Map<String, dynamic> post = model.pageList[index];
                      return PostItem(
                        key: Key(post['id'].toString()),
                        post: post,
                        scrollController: model.scrollController!,
                        onUpdatePost: (v){
                          post = v;
                          model.notifyListeners();
                        },
                        onDelete: (){
                          model.pageList.removeWhere((p) => p['id'] == post['id']);
                          model.notifyListeners();
                        },
                      );
                    }
                )
              ]
              else StateRequestEmpty(
                onPressed: (){
                  model.refreshController.requestRefresh();
                },
              ),
            ],
          );
        }
    );
  }
}