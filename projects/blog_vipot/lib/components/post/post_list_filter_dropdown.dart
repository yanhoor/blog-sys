import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class PostListFilterDropdown extends StatefulWidget{
  final Function(PostSearchParams) onChange;
  Widget? trigger;
  bool isAll;

  PostListFilterDropdown({super.key, required this.onChange, this.trigger, this.isAll = false});

  @override
  State<PostListFilterDropdown> createState() => _PostListFilterDropdownState();
}

class _PostListFilterDropdownState extends State<PostListFilterDropdown>{
  PostSearchParams searchParams = PostSearchParams();
  int selectedValue = 1;

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<int>(
      child: widget.trigger ?? const Icon(Icons.filter_alt_outlined),
      itemBuilder: (BuildContext context){
        return [
          PopupMenuItem(value: 1,child: FilterItem(value: 1, text: '全部', iconData: Icons.filter_none_rounded, selectedValue: selectedValue,)),
          PopupMenuItem(value: 2,child: FilterItem(value: 2, text: '最热', iconData: Icons.trending_up, selectedValue: selectedValue,)),
          PopupMenuItem(value: 3,child: FilterItem(value: 3, text: '视频', iconData: Icons.video_collection, selectedValue: selectedValue,)),
          PopupMenuItem(value: 4,child: FilterItem(value: 4, text: '音频', iconData: Icons.audiotrack_rounded, selectedValue: selectedValue,)),
          if(widget.isAll) ...[
            PopupMenuItem(value: 5,child: FilterItem(value: 5, text: '图片', iconData: Icons.photo, selectedValue: selectedValue,)),
            PopupMenuItem(value: 6,child: FilterItem(value: 6, text: '关注', iconData: Icons.group_rounded, selectedValue: selectedValue,)),
          ]
        ];
      },
      onSelected: (v){
        setState(() {
          selectedValue = v;
        });
        switch(v){
          case 1:
            setState(() {
              searchParams = PostSearchParams(mediaType: null, sort: 2, isFollowing: null);
            });
            break;
          case 2:
            setState(() {
              searchParams = PostSearchParams(mediaType: null, sort: 3, isFollowing: null);
            });
            break;
          case 3:
            setState(() {
              searchParams = PostSearchParams(mediaType: 'video', sort: null, isFollowing: null);
            });
            break;
          case 4:
            setState(() {
              searchParams = PostSearchParams(mediaType: 'audio', sort: null, isFollowing: null);
            });
            break;
          case 5:
            setState(() {
              searchParams = PostSearchParams(mediaType: 'image', sort: null, isFollowing: null);
            });
            break;
          case 6:
            setState(() {
              searchParams = PostSearchParams(mediaType: null, sort: null, isFollowing: 1);
            });
            break;
        }
        widget.onChange(searchParams);
      },
    );
  }
}

class FilterItem extends StatelessWidget{
  final int value;
  final int selectedValue;
  final String text;
  final IconData iconData;

  const FilterItem({super.key, required this.value, required this.selectedValue, required this.text, required this.iconData});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Icon(iconData, size: 18, color: selectedValue == value ? Theme.of(context).colorScheme.primary : null),
        const SizedBox(width: 12,),
        Text(text, style: TextStyle(color: selectedValue == value ? Theme.of(context).colorScheme.primary : null,))
      ],
    );
  }
}

class PostSearchParams{
  PostSearchParams({ this.mediaType, this.sort, this.isFollowing });

  String? mediaType;
  int? sort;
  int? isFollowing;

  Map<String, dynamic> toMap(){
    return {
      'mediaType': mediaType,
      'sort': sort,
      'isFollowing': isFollowing,
    };
  }
}
