import 'package:blog_vipot/components/state/state_request_base.dart';
import 'package:flutter/material.dart';

class StateRequestError extends StateRequestBase{
  const StateRequestError({super.key, super.tip = '发生错误，点击重试', super.onPressed, super.size, super.iconData = Icons.report_gmailerrorred_outlined, super.msg});
}