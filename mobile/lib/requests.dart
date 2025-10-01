import 'dart:convert';
import 'dart:math';
import 'dart:ui';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:cookie_jar/cookie_jar.dart';

import 'package:http/http.dart' as http;

const String BACKEND_POST_TASK_URL = 'http://10.0.2.2:8080/api/task';
const String BACKEND_UPLOAD_LIST_TASK_URL = 'http://10.0.2.2:8080/api/tasks';
const String BACKEND_DELETE_TASK_URL = 'http://10.0.2.2:8080/api/task/';
const String BACKEND_UPDATE_TASK_URL = 'http://10.0.2.2:8080/api/task/';
const String BACKEND_TOGGLE_TASK_STATUS_URL =
    'http://10.0.2.2:8080/api/task/toggleStatus/';
const String BACKEND_GET_TASKS_URL = 'http://10.0.2.2:8080/api/tasks';
const String BACKEND_GET_USER_URL = 'http://10.0.2.2:8080/api/user';
const String BACKEND_LOGIN_URL = 'http://10.0.2.2:8080/api/auth/sign-in';
const String BACKEND_REGISTER_URL = 'http://10.0.2.2:8080/api/auth/sign-up';
const String BACKEND_LOGOUT_URL = 'http://10.0.2.2:8080/api/auth/sign-out';

class Requests {
  static final dio = Dio();
  static VoidCallback? onUnauthorized;

  static void init(void Function() onUnauthorized) {
    onUnauthorized = onUnauthorized;
    final cookieJar = CookieJar();
    dio.interceptors.add(CookieManager(cookieJar));

    dio.interceptors.add(
      InterceptorsWrapper(
        onError: (DioException err, handler) async {
          if (err.response?.statusCode == 401) {
            onUnauthorized.call();
          }
          return handler.next(err);
        },
      ),
    );
  }

  static Future<bool> isAuthenticated() async {
    var response;
    try {
      response = await dio.get(BACKEND_GET_USER_URL);
      return true;
    } catch (e) {
      return false;
    }
  }

  static Future<Response> sendRegisterRequest(
    String username,
    String email,
    String password,
  ) async {
    final response = await dio.post(
      BACKEND_REGISTER_URL,
      data: jsonEncode({
        'username': username,
        'email': email,
        'password': password,
      }),
    );
    return response;
  }

  static Future<Response> sendLoginRequest(
    String identifier,
    String password,
  ) async {
    final response = await dio.post(
      BACKEND_LOGIN_URL,
      data: jsonEncode({'identifier': identifier, 'password': password}),
    );

    return response;
  }

  static Future<Map> getAllTasks() async {
    var response;
    response = await dio.get(BACKEND_GET_TASKS_URL);
    return response.data;
  }

  static Future<Map> createTask(
    String name,
    String description,
    String date,
  ) async {
    var response;
    try {
      response = await dio.post(
        BACKEND_POST_TASK_URL,
        data: {
          'name': name,
          'description': description,
          'isDone': false,
          'date': date,
        },
      );
      return response.data;
    } catch (e) {
      throw Exception(e);
    }
  }

  static Future<Map> deleteTask(int id) async {
    var response;
    try {
      response = await dio.delete('$BACKEND_DELETE_TASK_URL$id');
      return response.data;
    } catch (e) {
      throw Exception(e);
    }
  }

  static Future<Map> updateTask(
    String name,
    String description,
    bool isDone,
    String date,
  ) async {
    var response;
    try {
      response = await dio.patch(
        BACKEND_UPDATE_TASK_URL,
        data: {
          'name': name,
          'description': description,
          'isDone': isDone,
          'date': date,
        },
      );
      return response.data;
    } catch (e) {
      throw Exception(e);
    }
  }

  static Future<Map> toggleTask(int id) async {
    var response;
    try {
      response = await dio.post('$BACKEND_TOGGLE_TASK_STATUS_URL$id');
      return response.data;
    } catch (e) {
      throw Exception(e);
    }
  }
}
