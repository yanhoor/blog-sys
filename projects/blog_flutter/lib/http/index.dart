import 'dart:convert';

import 'package:dio/dio.dart';
import 'api_url.dart';

class Http{
  late Dio dio;

  Http(){
    dio = Dio(BaseOptions(
      baseUrl: ApiUrl.BASE_URL,
      connectTimeout: const Duration(milliseconds: 20000),
      receiveTimeout: const Duration(milliseconds: 20000),
    ));
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (RequestOptions options, RequestInterceptorHandler handler) {
          // Do something before request is sent.
          // If you want to resolve the request with custom data,
          // you can resolve a `Response` using `handler.resolve(response)`.
          // If you want to reject the request with a error message,
          // you can reject with a `DioError` using `handler.reject(dioError)`.
          // options.headers['mobile_login_token'] = '---------------';
          return handler.next(options);
        },
        onResponse: (Response response, ResponseInterceptorHandler handler) {
          // Do something with response data.
          // If you want to reject the request with a error message,
          // you can reject a `DioError` object eg: `handler.reject(dioError)`.
          return handler.next(response);
        },
        onError: (DioError e, ErrorInterceptorHandler handler) {
          // Do something with response error
          // If you want to resolve the request with some custom data
          // you can resolve a `Response` object eg: `handler.resolve(response)`.
          return handler.next(e);//continue
        },
      ),
    );
  }

  Future fetch(url, { Map<String, dynamic>? params, String? method = 'post' }) async{
    Response response;
    method = method?.toLowerCase();
    try{
      // print('+++++++fetch params+++++++${jsonEncode(params)}');
      response = await dio.request(url, data: params, options: Options(method: method));
    }on DioError catch(e){
      print('+++++++fetch error+++++++${jsonEncode(e)}');
      return Future.error(e);
    }
    
    var data = response.data;
    return Future.value(data);
  }
}

final Http $http = Http();