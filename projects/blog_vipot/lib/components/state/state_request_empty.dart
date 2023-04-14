import 'package:blog_vipot/components/state/state_request_base.dart';
import 'package:flutter/material.dart';

class StateRequestEmpty extends StateRequestBase{
  const StateRequestEmpty({super.key, super.tip = '暂无内容，点击刷新', super.onPressed, super.size, super.iconData = Icons.upcoming_outlined});
}