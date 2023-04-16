import 'package:blog_vipot/notifiers/base_fetch_notifier.dart';

abstract class BaseListFetchNotifier extends BaseFetchNotifier{
  List pageList = [];
  int currentPage = 1;
  int pageSize = 20;

  @override
  void onInit() async {
    super.onInit();
    initData();
  }

  @override
  initData(){
    setInitializing();
    refreshData(refresh: false);
  }

  @override
  refreshData({bool refresh = true}) async{
    currentPage = 1;
    if(refresh) setRefreshing();
    List list = [];
    try{
      await getOtherData();
      list = await getData();
    }catch(e){
      setError(e.toString());
      notifyListeners();
      return;
    }
    if(list.isEmpty && !isError) setEmpty();
    pageList.clear();
    pageList.addAll(list);
    refreshTime = DateTime.now().millisecondsSinceEpoch;
    refreshController.refreshCompleted();
    notifyListeners();
  }

  handleLoadMore() async{
    if(isComplete) return;

    currentPage ++;
    setLoading();
    var list = await getData();
    pageList.addAll(list);
    notifyListeners();
    // update();
  }

  @override
  Future<List> getData() async{
    try{
      // print('=======$pageState=======');
      var list = await getPageList();
      if(list.length < pageSize){
        refreshController.loadNoData();
        setComplete();
      }else{
        refreshController.loadComplete();
        setMore();
      }
      return list;
    }catch(e){
      refreshController.loadFailed();
      setError(e.toString());
      // print('=============${e.toString()}');
      return [];
    }
  }

  Future<List> getPageList();

  // 返回 true 表示成功，否则返回 Future.error(msg)
  Future<bool> getOtherData(){
    return Future.value(true);
  }
}