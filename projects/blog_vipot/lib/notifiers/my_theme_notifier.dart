import 'package:flutter/material.dart';

class MyThemeNotifier extends ChangeNotifier {
  ThemeMode _themeMode = ThemeMode.system;

  static ThemeData lightTheme = ThemeData.from(
      colorScheme: const ColorScheme.light(
          background: Color(0xfff3f3f3)
      )
  );
  static ThemeData darkTheme = ThemeData.dark();

  ThemeMode get themeMode => _themeMode;

  set themeMode(ThemeMode value) {
    _themeMode = value;
    notifyListeners();
  }
}