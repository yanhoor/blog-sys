import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

class ExpandableContent extends StatefulWidget{
  final int maxLength;
  final int maxLines;
  final String content;
  final ScrollController scrollController;
  const ExpandableContent({super.key, this.maxLength = 180, this.maxLines = 3, required this.content, required this.scrollController});

  @override
  _ExpandableContentState createState() => _ExpandableContentState();
}

class _ExpandableContentState extends State<ExpandableContent>{
  bool showAction = false;
  bool isExpanded = false;
  double scrollOffset = 0;
  late String briefContent;
  List<String> lineList = [];
  late TapGestureRecognizer _tapGestureRecognizer;

  @override
  void initState() {
    super.initState();
    _tapGestureRecognizer = TapGestureRecognizer()
      ..onTap = () {
        setState(() {
          isExpanded = !isExpanded;
          if(isExpanded){
            scrollOffset = widget.scrollController.offset;
          }else{
            widget.scrollController.animateTo(scrollOffset, duration: const Duration(milliseconds: 300), curve: Curves.easeOutCubic);
          }
        });
      };
    lineList = widget.content.split('\n');
    if(lineList.length > widget.maxLines){
      briefContent = '${lineList.take( widget.maxLines).toList().join('\n')}\n...\n';
      showAction = true;
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
    _tapGestureRecognizer.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Text.rich(
      TextSpan(
          children: [
            TextSpan(text: isExpanded ? widget.content : briefContent),
            if(showAction) TextSpan(text: isExpanded ? '收起' : '展开', style: TextStyle(color: Theme.of(context).colorScheme.primary), recognizer: _tapGestureRecognizer),
          ]
      ),
    );
  }
}