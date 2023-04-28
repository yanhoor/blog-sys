import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class CommentFilterDropdown extends StatelessWidget{
  bool enabled;
  final int value;
  final Function(int value) onSelected;
  Widget? trigger;

  CommentFilterDropdown({super.key, this.enabled = true, required this.onSelected, required this.value, this.trigger});

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<int>(
      enabled: enabled,
      // constraints: BoxConstraints.tight(Size.zero),
      itemBuilder: (_){
        return [
          PopupMenuItem(
            value: 1,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: const [
                Icon(Icons.timer_outlined, size: 18),
                SizedBox(width: 12,),
                Text('按时间')
              ],
            ),
          ),
          PopupMenuItem(
            value: 2,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: const [
                Icon(Icons.thermostat_outlined, size: 18),
                SizedBox(width: 12,),
                Text('按热度')
              ],
            ),
          )
        ];
      },
      onSelected: onSelected,
      child: trigger ?? Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: [
          if(value == 1) const Icon(Icons.timer_outlined, size: 18,),
          if(value == 2) const Icon(Icons.thermostat_outlined, size: 18,),
          const SizedBox(width: 4,),
          Text(value == 1 ? '按时间' : '按热度')
        ],
      ),
    );
  }
}