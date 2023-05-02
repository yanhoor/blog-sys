import 'package:blog_vipot/components/post/post_list_filter_dropdown.dart';
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
                    CustomIconButton(
                      onPressed: (){
                        model.showSearch = !model.showSearch;
                      },
                      icon: const Icon(Icons.search_rounded),
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