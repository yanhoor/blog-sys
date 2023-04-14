import 'package:blog_vipot/notifiers/base_fetch_notifier.dart';

abstract class BaseListFetchNotifier extends BaseFetchNotifier{
  List pageList = [];
  int currentPage = 1;
  int pageSize = 20;

  @override
  void onInit() async {
    // print('BaseListFetchController init 11111');
    super.onInit();
    initData();
    // print('BaseListFetchController init 222222');
  }

  @override
  initData(){
    setInitializing();
    refreshData(refresh: false);
  }

  @override
  refreshData({bool refresh = true}) async{
    currentPage = 1;
    pageList.clear();
    if(refresh) setRefreshing();
    List list = [];
    try{
      await getOtherData();
      list = await getData();
    }catch(e){
      setError();
    }
    if(list.isEmpty && !isError) setEmpty();
    pageList.addAll(list);
    // update();
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
      setError();
      // print('=============${e.toString()}');
      return [];
    }
  }

  Future<List> getPageList();
  Future<dynamic> getOtherData(){
    return Future.value(true);
  }
}