import 'package:blog_vipot/storage/storage_manager.dart';
import 'package:flutter/material.dart';

class SearchNotifier extends ChangeNotifier{
  String _keyword = '';
  List<String> historyList = [];
  TextEditingController textEditingController = TextEditingController();

  SearchNotifier(){
    List<String> list = MyStorageManager.sharedPreferences.getStringList(MyStorageManager.SEARCH_HISTORY) ?? [];
    historyList.addAll(list);
    notifyListeners();
  }

  addHistoryItem([String? v]){
    String val = v ?? keyword;
    if(val.isEmpty) return;

    historyList.remove(val);
    historyList.insert(0, val);
    saveHistory();
    notifyListeners();
  }

  removeHistoryItem(String v){
    historyList.remove(v);
    saveHistory();
    notifyListeners();
  }

  clearHistory(){
    historyList.clear();
    saveHistory();
    notifyListeners();
  }

  saveHistory(){
    MyStorageManager.sharedPreferences.setStringList(MyStorageManager.SEARCH_HISTORY, historyList);
  }

  String get keyword => _keyword;

  set keyword(String value) {
    _keyword = value;
    notifyListeners();
  }
}