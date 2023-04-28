import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

import '../route/route_name.dart';

class ExpandableContent extends StatefulWidget{
  final int maxLength;
  final int maxLines;
  final String content;
  String? imageUrl;
  final String expandedBtnText;
  final Function()? onTapExpanded;
  final Function()? onTap;
  Widget? prefix;
  bool isSelectable;
  TextStyle? style;
  ScrollController? scrollController;
  ExpandableContent({
    super.key,
    this.maxLength = 180,
    this.maxLines = 3,
    required this.content,
    this.imageUrl,
    this.scrollController,
    this.prefix,
    this.style,
    this.expandedBtnText = '展开',
    this.onTapExpanded,
    this.onTap,
    this.isSelectable = true
  });

  @override
  State<ExpandableContent> createState() => _ExpandableContentState();
}

class _ExpandableContentState extends State<ExpandableContent>{
  bool showAction = false;
  bool isExpanded = false;
  bool multiLines = false;
  double scrollOffset = 0;
  late String briefContent;
  List<String> lineList = [];

  @override
  void initState() {
    super.initState();

    lineList = widget.content.split('\n');
    if(lineList.length > widget.maxLines){
      briefContent = '${lineList.take( widget.maxLines).toList().join('\n')}\n...\n';
      showAction = true;
      multiLines = true;
    }else if(widget.maxLength < widget.content.length){
      briefContent = '${widget.content.substring(0, widget.maxLength - 1)}...';
      showAction = true;
    }else{
      briefContent = widget.content;
    }
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {

    TextSpan textSpan = TextSpan(
        children: [
          // 前置内容
          if(widget.prefix != null) WidgetSpan(
              child: SelectionContainer.disabled(
                  child: widget.prefix!
              )
          ),

          // 正文
          // TextSpan(text: isExpanded ? widget.content : briefContent, style: widget.style, recognizer: tapContentRecognizer),

          // 正文
          WidgetSpan(
              child: GestureDetector(
                onTap: widget.onTap,
                child: Text(isExpanded ? widget.content : briefContent, style: widget.style),
              )
          ),

          // 查看图片
          if(widget.imageUrl != null) WidgetSpan(child: SelectionContainer.disabled(
              child: GestureDetector(
                onTap: (){
                  Navigator.of(context).pushNamed(RouteName.imagePreview, arguments: { 'imageList': [widget.imageUrl], 'initPage': 0});
                },
                child: Text(' 查看图片 ', style: TextStyle(color: Theme.of(context).colorScheme.primary, fontSize: widget.style?.fontSize)),
              )
          )),

          // 展开/收起
          if(showAction) WidgetSpan(child: GestureDetector(
            onTap: () {
              if(widget.onTapExpanded != null){
                widget.onTapExpanded!();
                return;
              }

              setState(() {
                isExpanded = !isExpanded;
                if(widget.scrollController == null) return;

                if(isExpanded){
                  // scrollOffset = Scrollable.of(context).position.pixels;
                  // print('=====PrimaryScrollController=======${PrimaryScrollController.of(context).offset}');
                  scrollOffset = widget.scrollController!.offset;
                  print('=========scrollOffset=========$scrollOffset');
                }else{
                  widget.scrollController!.animateTo(scrollOffset, duration: const Duration(milliseconds: 300), curve: Curves.easeOutCubic);
                }
              });
            },
            child: Text(isExpanded ? '${multiLines ? '\n' : ''}收起' : widget.expandedBtnText, style: TextStyle(color: Theme.of(context).colorScheme.primary)),
          )),
        ]
    );

    return SizedBox(
      width: double.infinity,
      child: SelectionArea(
        child: GestureDetector(
          onTap: widget.onTap,
          child: Text.rich(textSpan),
        ),
      ),
    );
  }
}