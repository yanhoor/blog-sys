import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class PostSearchInput extends StatefulWidget{
  Function()? onTapClose;
  Function(String value)? onSubmitted;
  Function(String value)? onChanged;
  final String? initKeyword;

  PostSearchInput({super.key, this.onTapClose, this.onSubmitted, this.onChanged, this.initKeyword});

  @override
  State<PostSearchInput> createState() => _PostSearchInputState();
}

class _PostSearchInputState extends State<PostSearchInput>{
  late TextEditingController searchEditingController;
  String keyword = '';

  @override
  void initState() {
    super.initState();
    searchEditingController = TextEditingController(text: widget.initKeyword ?? '');
  }

  @override
  void dispose() {
    super.dispose();
    searchEditingController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return SizedBox(
      height: 42,
      child: TextField(
        // autofocus: true,
          textAlignVertical: TextAlignVertical.center,
          textInputAction: TextInputAction.search,
          controller: searchEditingController,
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
            suffix: keyword.isNotEmpty ? GestureDetector(
              onTap: (){
                setState(() {
                  keyword = '';
                });
                searchEditingController.text = '';
                widget.onChanged?.call(keyword);
              },
              child: const Text('清除'),
            ) : null,
            suffixIcon: widget.onTapClose == null ? null : GestureDetector(
              onTap: widget.onTapClose,
              child: const Icon(Icons.close),
            ),
            fillColor: isDark ? Colors.black.withOpacity(0.7) : Colors.white.withOpacity(0.9),
            filled: true,
            hintText: '请输入搜索内容',
            contentPadding: EdgeInsets.zero,// 填充
            border: const OutlineInputBorder(
              borderSide: BorderSide.none,
              borderRadius: BorderRadius.all(Radius.circular(50)),
            ),
          ),
          onSubmitted: widget.onSubmitted,
          onChanged: (v){
            v = v.trim();
            setState(() {
              keyword = v;
            });
            widget.onChanged?.call(keyword);
          }
      ),
    );
  }
}