
import 'base_page_controller.dart';
import 'package:get/get.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

abstract class BaseListFetchController extends BasePageController{
  RefreshController refreshController = RefreshController(initialRefresh: false);

  List pageList = [].obs;
  int currentPage = 1;
  int pageSize = 20;

  @override
  void onInit() async {
    print('BaseListFetchController init 11111');
    super.onInit();
    initData();
    print('BaseListFetchController init 222222');
  }

  @override
  onClose(){
    print('BaseListFetchController close');
  }

  initData(){
    setInitializing();
    refreshData();
  }

  refreshData() async{
    currentPage = 1;
    pageList.clear();
    setRefreshing();
    var list = await getData();
    if(list.isEmpty && !isError) setEmpty();
    pageList.addAll(list);
    // update();
    refreshController.refreshCompleted();
  }

  handleLoadMore() async{
    if(isComplete) return;

    currentPage ++;
    setLoading();
    var list = await getData();
    pageList.addAll(list);
    // update();
  }

  Future<List> getData() async{
    try{
      print('=======$pageState=======');
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
      return [];
    }
  }

  Future<List> getPageList();
}