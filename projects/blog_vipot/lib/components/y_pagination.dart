import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class YPagination extends StatelessWidget{
  final int amount; // 总数
  final int current; // 当前第几页
  final Color? activeColor; // 激活的颜色
  final Color? color;

  YPagination({
    super.key,
    required this.amount,
    required this.current,
    this.activeColor,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: List.generate(amount, (index){
        if(index == current){
          return Container(
            decoration: BoxDecoration(
                color: activeColor ?? Theme.of(context).colorScheme.primary,
                borderRadius: const BorderRadius.horizontal(left: Radius.circular(10), right: Radius.circular(10))
            ),
            width: 30,
            height: 10,
            margin: const EdgeInsets.only(right: 5),
          );
        }
        return Container(
          width: 10,
          height: 10,
          margin: const EdgeInsets.only(right: 5),
          decoration: BoxDecoration(
              color: color ?? Colors.grey[300],
              borderRadius: const BorderRadius.all(Radius.circular(5))
          ),
        );
      }),
    );
  }
}
