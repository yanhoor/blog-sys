import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'en_us.dart';
import 'zh_cn.dart';

class TranslationService extends Translations {
  static Locale? get locale => Get.deviceLocale;
  static const fallbackLocale = Locale('en', 'US');

  @override
  Map<String, Map<String, String>> get keys => {
    'en_US': en_US,
    'zh_CN': zh_CN,
  };
}