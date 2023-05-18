export enum PageState {
  initializing, // 初始化
  refreshing, // 正在刷新
  loading, // 加载更多
  busy, // 正在处理操作
  finish, // 加载完成
  more, // 对于列表还有更多，否则 finish
  empty, // 数据为空
  error, // 加载错误
}
