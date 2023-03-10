
import 'package:get/get.dart';

class BaseController extends GetxController{
  final _pageState = PageState.initializing.obs;

  get pageState => _pageState;

  void setInitializing(){
    _pageState.value = PageState.initializing;
  }

  void setLoading(){
    _pageState.value = PageState.loading;
  }

  void setRefreshing(){
    _pageState.value = PageState.refreshing;
  }

  void setBusy(){
    _pageState.value = PageState.busy;
  }

  void setComplete(){
    _pageState.value = PageState.complete;
  }

  void setMore(){
    _pageState.value = PageState.more;
  }

  void setEmpty(){
    _pageState.value = PageState.empty;
  }

  void setError(){
    _pageState.value = PageState.error;
  }

  bool get isInitializing => _pageState.value == PageState.initializing;
  bool get isLoading => _pageState.value == PageState.loading;
  bool get isRefreshing => _pageState.value == PageState.refreshing;
  bool get isBusy => _pageState.value == PageState.busy;
  bool get isComplete => _pageState.value == PageState.complete;
  bool get isMore => _pageState.value == PageState.more;
  bool get isEmpty => _pageState.value == PageState.empty;
  bool get isError => _pageState.value == PageState.error;

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