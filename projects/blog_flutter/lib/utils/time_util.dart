class TimeUtil{
  // 时间戳转化
  static String formatTime(String time){
    DateTime dt = DateTime.parse(time);
    String year = dt.year.toString();
    String month = dt.month.toString().padLeft(2, '0');
    String day = dt.day.toString().padLeft(2, '0');
    String hour = dt.hour.toString().padLeft(2, '0');
    String minute = dt.minute.toString().padLeft(2, '0');
    String second = dt.second.toString().padLeft(2, '0');
    return '$year-$month-$day $hour:$minute:$second';
  }
}