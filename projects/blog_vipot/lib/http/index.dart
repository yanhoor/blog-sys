export 'api_url.dart';
import 'package:blog_vipot/storage/storage_manager.dart';
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
          // Do something before request is sent
          String? token = MyStorageManager.sharedPreferences.getString(MyStorageManager.TOKEN);
          if(token != null) options.headers['Authorization'] = 'Bearer $token';
               // print("请求url：${options.path}");
//                print("请求方式：${options.method}");
//                print('请求头: ' + options.headers.toString());
//                print('请求参数: ' + options.data?.toString());
//                print('GET请求参数: ' + options.queryParameters?.toString());
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

  Future fetch(
      url,
      { Map<String, dynamic>? params,
        String? method = 'post',
        Function(int sent, int total)? onSendProgress,
        bool isFormData = false
      }) async{
    Response response;
    method = method?.toLowerCase();
    try{
      // print('+++++++fetch params+++++++${jsonEncode(params)}');
      FormData? formData;
      if(isFormData && params != null){
        formData = FormData.fromMap(params);
      }
      response = await dio.request(
          url,
          data: formData ?? params,
          onSendProgress: onSendProgress,
          options: Options(method: method)
      );
      print('+++++++fetch success+++++++$url');
    }on DioError catch(e){
      print('+++++++fetch error+++++++${e.message}');
      return Future.error(e);
    }
    
    var data = response.data;
    return Future.value(data);
  }
}

final Http $http = Http();