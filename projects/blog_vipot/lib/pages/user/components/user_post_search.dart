import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../user_notifier.dart';

class UserPostSearch extends StatefulWidget{
  const UserPostSearch({super.key});

  @override
  State<UserPostSearch> createState() => _UserPostSearchState();
}

class _UserPostSearchState extends State<UserPostSearch>{
  @override
  Widget build(BuildContext context) {
    return Consumer<UserNotifier>(
        builder: (_, model, child){
          return Positioned(
              left: 0,
              bottom: 0,
              child: SafeArea(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 40),
                  width: MediaQuery.of(context).size.width,
                  height: 42,
                  child: TextField(
                    // autofocus: true,
                      textAlignVertical: TextAlignVertical.center,
                      textInputAction: TextInputAction.search,
                      controller: model.searchEditingController,
                      keyboardType: TextInputType.text,
                      // maxLength: 30,
                      maxLines: 1,
                      style: const TextStyle(fontSize: 16),
                      decoration: InputDecoration(
                        isDense: true,
                        // counter: const Offstage(),
                        prefixIcon: Icon(
                          CupertinoIcons.search,
                          color: Theme.of(context).colorScheme.primary,
                        ),
                        suffix: model.keyword.isNotEmpty ? GestureDetector(
                          onTap: (){
                            model.keyword = '';
                            model.searchEditingController.text = '';
                          },
                          child: const Text('清除'),
                        ) : null,
                        suffixIcon: GestureDetector(
                          onTap: (){
                            model.showSearch = false;
                          },
                          child: const Icon(Icons.close),
                        ),
                        fillColor: Colors.white.withOpacity(0.9),
                        filled: true,
                        hintText: '请输入搜索内容',
                        contentPadding: EdgeInsets.zero,// 填充
                        border: const OutlineInputBorder(
                          borderSide: BorderSide.none,
                          borderRadius: BorderRadius.all(Radius.circular(50)),
                        ),
                      ),
                      onSubmitted: (v){
                        // Navigator.of(dialogContext).pop();
                        model.refreshController.requestRefresh();
                      },
                      onChanged: (val){
                        model.keyword = val.trim();
                      }
                  ),
                ),
              )
          );
        }
    );
  }
}