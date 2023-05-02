class ApiUrl{
  static const String BASE_URL = 'https://niubility.website/api';
  // static const String BASE_URL = 'http://localhost:8000/api';
  static const String ASSET_BASE = 'https://static-buck.oss-cn-shenzhen.aliyuncs.com';

  static const String UPLOAD = '/upload';

  static const String USER_REGISTER = '/user/register';
  static const String LOGIN = '/user/login';
  static const String LOGOUT = '/user/logout';
  static const String USER_ID_INFO = '/user';
  static const String USER_INFO = '/user/info';
  static const String USER_MARK_BLOG_LIST = '/user/markBlogList';
  static const String USER_MY_COMMENT_LIST = '/user/myCommentList';
  static const String USER_UPDATE = '/user/update';
  static const String USER_MEDIA_LIST = '/user/getMediaList';
  static const String USER_FRIENDS = '/user/friends';
  static const String USER_FOLLOW = '/user/follow';
  static const String USER_SET_GROUP = '/user/setGroup';

  static const String BLOG_EDIT = '/blog/edit';
  static const String BLOG_DELETE = '/blog/delete';
  static const String BLOG_LIST = '/blog/list';
  static const String BLOG_INFO = '/blog/info';
  static const String BLOG_LIKE = '/blog/like';
  static const String BLOG_COLLECT = '/blog/collect';
  static const String BLOG_ACTION_USER = '/blog/actionUserList';

  static const String COMMENT_LIST = '/comment/list';
  static const String COMMENT_COMMIT = '/comment/commit';
  static const String COMMENT_LIKE = '/comment/like';
  static const String COMMENT_REPLY_LIST = '/comment/replyList';
  static const String COMMENT_DELETE = '/comment/delete';

  static const String GROUP_ALL = '/followGroup/all';
  static const String GROUP_DELETE = '/followGroup/delete';
  static const String GROUP_EDIT = '/followGroup/edit';
  static const String GROUP_SORT = '/followGroup/sort';
  static const String GROUP_CONTAIN_LIST = '/followGroup/containList';

  static const String NOTIFICATION_LIST = '/notification/list';
  static const String NOTIFICATION_COUNT = '/notification/count';
  static const String NOTIFICATION_READ = '/notification/read';
  static const String NOTIFICATION_INFO = '/notification/info';

  static const String STATIS_USER = '/statis/user';
}