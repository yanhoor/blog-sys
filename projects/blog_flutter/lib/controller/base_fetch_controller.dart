
import 'base_page_controller.dart';

abstract class BaseFetchController extends BasePageController{

  @override
  void onInit() async {
    print('BaseFetchController init');
    super.onInit();
    initData();
    print('BaseFetchController init');
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
  }

  Future getData();
}