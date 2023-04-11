import 'package:blog_vipot/notifiers/state_notifier.dart';
import 'package:blog_vipot/pages/index/index_notifier.dart';

class HomeNotifier extends StateNotifier{
  int currentTab = 0;
  late IndexNotifier _indexNotifier;

  set indexNotifier(IndexNotifier n){
    _indexNotifier = n;
  }

  IndexNotifier get indexNotifier => _indexNotifier;

  setCurrentTab(int v){
    currentTab = v;
    notifyListeners();
  }
}