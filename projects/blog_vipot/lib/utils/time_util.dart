import 'package:intl/intl.dart';

class TimeUtil{
  // 字符串转本地时间
  static String toLocalTime(String time, { String format = 'yyyy-MM-dd hh:mm' }){
    DateTime dt = DateTime.parse(time).toLocal();
    return '${dt.year}-${dt.month.toString().padLeft(2, '0')}-${dt.day.toString().padLeft(2, '0')} ${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
  }
  // 时间戳转化
  static String formatTime(String time){
    DateTime dt = DateTime.parse(time).toLocal();
    DateTime now = DateTime.now();
    Duration diff = now.difference(dt);

    if(diff.inSeconds <= 30){
      return '刚刚';
    }

    if(diff.inSeconds < 60){
      return '${diff.inSeconds}秒前';
    }

    if(diff.inMinutes < 60){
      return '${diff.inMinutes}分钟前';
    }

    if(diff.inHours < 24){
      return '${diff.inHours}小时前';
    }

    if(diff.inHours < 48){
      return '昨天 ${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    }

    if(diff.inHours < 72){
      return '前天 ${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    }

    if(diff.inDays > 365){
      return toLocalTime(time);
    }

    return '${dt.month.toString().padLeft(2, '0')}-${dt.day.toString().padLeft(2, '0')} ${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';

    // String year = dt.year.toString();
    // String month = dt.month.toString().padLeft(2, '0');
    // String day = dt.day.toString().padLeft(2, '0');
    // String hour = dt.hour.toString().padLeft(2, '0');
    // String minute = dt.minute.toString().padLeft(2, '0');
    // String second = dt.second.toString().padLeft(2, '0');
    // return '$year-$month-$day $hour:$minute:$second';
  }

  static String formatDuration(Duration duration){
    String result = '';
    String d = '${duration.inDays.toString().padLeft(2, '0')}天';
    if(duration.inDays > 0) result += d;
    String h = '${(duration.inHours % 24).floor().toString().padLeft(2, '0')}小时';
    if(duration.inHours > 0) result += h;
    String m = '${(duration.inMinutes % 60).floor().toString().padLeft(2, '0')}分钟';
    if(duration.inMinutes > 0) result += m;
    String s = '${(duration.inSeconds % 60).floor().toString().padLeft(2, '0')}秒';
    if(duration.inSeconds > 0) result += s;

    return result;
  }
}