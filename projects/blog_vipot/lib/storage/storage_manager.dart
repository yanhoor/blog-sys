import 'package:shared_preferences/shared_preferences.dart';

class MyStorageManager{
  static late SharedPreferences sharedPreferences;

  static String TOKEN = 'token';
  static String INDEX_GROUP_ID = 'index_group_id';
  static String REMEMBER_PASSWORD = 'remember-password';
  static String LOGIN_MOBILE = 'login-mobile';
  static String LOGIN_PASSWORD = 'login-password';

  static init() async {
    sharedPreferences = await SharedPreferences.getInstance();
  }
}