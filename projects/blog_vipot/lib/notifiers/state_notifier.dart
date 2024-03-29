
import 'package:flutter/cupertino.dart';

class StateNotifier extends ChangeNotifier{
  PageState _pageState = PageState.initializing;
  /// 防止页面销毁后,异步任务才完成,导致报错
  bool _disposed = false;
  String? stateErrorText;

  @override
  void notifyListeners() {
    if (!_disposed) {
      super.notifyListeners();
    }
  }

  @override
  void dispose() {
    _disposed = true;
    debugPrint('--------------StateNotifier dispose -->$runtimeType-------------');
    super.dispose();
  }

  get pageState => _pageState;

  void setInitializing(){
    _pageState = PageState.initializing;
    notifyListeners();
  }

  void setLoading(){
    _pageState = PageState.loading;
    notifyListeners();
  }

  void setRefreshing(){
    _pageState = PageState.refreshing;
    notifyListeners();
  }

  void setBusy(){
    _pageState = PageState.busy;
    notifyListeners();
  }

  void setComplete(){
    _pageState = PageState.complete;
    notifyListeners();
  }

  void setMore(){
    _pageState = PageState.more;
    notifyListeners();
  }

  void setEmpty(){
    _pageState = PageState.empty;
    notifyListeners();
  }

  void setError([String? msg]){
    _pageState = PageState.error;
    stateErrorText = msg;
    notifyListeners();
  }

  bool get isInitializing => _pageState == PageState.initializing;
  bool get isLoading => _pageState == PageState.loading;
  bool get isRefreshing => _pageState == PageState.refreshing;
  bool get isBusy => _pageState == PageState.busy;
  bool get isComplete => _pageState == PageState.complete;
  bool get isMore => _pageState == PageState.more;
  bool get isEmpty => _pageState == PageState.empty;
  bool get isError => _pageState == PageState.error;

}

enum PageState{
  initializing, // 初始化
  refreshing, // 正在刷新
  loading, // 加载更多
  busy, // 正在处理操作
  complete, // 加载完成
  more, // 对于列表还有更多，否则complete
  empty, // 数据为空
  error, // 加载错误
}