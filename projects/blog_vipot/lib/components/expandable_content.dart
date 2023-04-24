import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

class ExpandableContent extends StatefulWidget{
  final int maxLength;
  final int maxLines;
  final String content;
  final String expandedBtnText;
  final Function()? onTapExpanded;
  final Function()? onTap;
  bool isSelectable;
  TextStyle? style;
  ScrollController? scrollController;
  ExpandableContent({
    super.key,
    this.maxLength = 180,
    this.maxLines = 3,
    required this.content,
    this.scrollController,
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
  late TapGestureRecognizer _tapGestureRecognizer;

  @override
  void initState() {
    super.initState();
    _tapGestureRecognizer = TapGestureRecognizer()
      ..onTap = () {
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
      };

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
    _tapGestureRecognizer.dispose();
  }

  @override
  Widget build(BuildContext context) {
    TextSpan textSpan = TextSpan(
        children: [
          TextSpan(text: isExpanded ? widget.content : briefContent, style: widget.style),
          if(showAction) TextSpan(text: isExpanded ? '${multiLines ? '\n' : ''}收起' : widget.expandedBtnText, style: TextStyle(color: Theme.of(context).colorScheme.primary), recognizer: _tapGestureRecognizer),
        ]
    );

    return SizedBox(
      width: double.infinity,
      child: widget.isSelectable
          ? SelectableText.rich(
        textSpan,
        onTap: widget.onTap,
        // scrollPhysics: const NeverScrollableScrollPhysics(),
      )
          : GestureDetector(
        onTap: widget.onTap,
        child: Text.rich(textSpan),
      ),
    );
  }
}