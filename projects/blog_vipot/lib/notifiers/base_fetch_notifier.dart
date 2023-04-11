
import 'package:pull_to_refresh/pull_to_refresh.dart';

import 'page_control_notifier.dart';

abstract class BaseFetchNotifier extends PageControlNotifier{
  RefreshController refreshController = RefreshController(initialRefresh: false);

  void onInit() async {
    // print('BaseFetchController init');
    initData();
    // print('BaseFetchController init');
  }

  initData(){
    setInitializing();
    refreshData();
  }

  refreshData() async{
    try{
      await getData();
      setComplete();
    }catch(e){
      setError();
    }
    refreshController.refreshCompleted();
    notifyListeners();
  }

  Future getData();
}