import 'package:blog_flutter/controller/base_list_fetch_controller.dart';
import 'package:blog_flutter/http/index.dart';
import 'package:blog_flutter/http/api_url.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class IndexController extends BaseListFetchController{

  @override
  void onInit() async {
    print('IndexController init 11111');
    super.onInit();
    print('IndexController init 222222');
  }

  @override
  onClose(){
    print('IndexController close 11111');
  }

  @override
  Future<List> getPageList() async{
    return await getBlogList();
  }

  Future<List> getBlogList() async{
    List list = [];
    var res = await $http.fetch(ApiUrl.BLOG_LIST, params: { 'page': currentPage, 'pageSize': pageSize });
    list.addAll(res['result']['list']);
    print('------------');
    return list;
  }
}