import 'package:blog_vipot/components/state/state_request_base.dart';
import 'package:flutter/material.dart';

class StateUnknownMedia extends StateRequestBase{
  const StateUnknownMedia({super.key, super.tip = '未知的媒体类型', super.onPressed, super.size, super.iconData = Icons.broken_image_outlined, super.msg});
}