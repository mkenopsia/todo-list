import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:mobile/requests.dart';

const String BACKEND_LOGIN_URL = 'http://10.0.2.2:8080/api/auth/sign-in';
const String BACKEND_REGISTER_URL = 'http://10.0.2.2:8080/api/auth/sign-up';
const String BACKEND_LOGOUT_URL = 'http://10.0.2.2:8080/api/auth/sign-out';

class AuthScreen extends StatefulWidget {
  final VoidCallback onAuthSuccess;

  const AuthScreen({super.key, required this.onAuthSuccess});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final _usernameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  bool _isLogin = true;

  Future<void> _submit() async {
    if (_emailController.text.isEmpty || _passwordController.text.isEmpty) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Заполните все поля')));
      return;
    }

    setState(() => _isLoading = true);

    try {
      final url = _isLogin
          ? Uri.parse(BACKEND_LOGIN_URL)
          : Uri.parse(BACKEND_REGISTER_URL);

      var response;
      if (_isLoading) {
        response = await Requests.sendLoginRequest(
          _emailController.text.trim(),
          _passwordController.text.trim(),
        );
      } else {
        response = await Requests.sendRegisterRequest(
          _usernameController.text.trim(),
          _emailController.text.trim(),
          _passwordController.text.trim(),
        );
      }

      if (response.statusCode == 200) {
        widget.onAuthSuccess();
      } else {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Ошибка')));
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Ошибка подключения: $e')));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(_isLogin ? 'Вход' : 'Регистрация')),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            if(!_isLogin)
              TextField(
                controller: _usernameController,
                decoration: const InputDecoration(labelText: 'Имя'),
                keyboardType: TextInputType.text,
              ),
            TextField(
              controller: _emailController,
              decoration: InputDecoration(labelText: _isLogin ? 'Email/Имя' : 'Email'),
              keyboardType: TextInputType.emailAddress,
            ),
            TextField(
              controller: _passwordController,
              decoration: const InputDecoration(labelText: 'Пароль'),
              obscureText: true,
            ),
            const SizedBox(height: 20),
            if (_isLoading)
              const CircularProgressIndicator()
            else
              ElevatedButton(
                onPressed: _submit,
                child: Text(_isLogin ? 'Войти' : 'Зарегистрироваться'),
              ),
            TextButton(
              onPressed: () => setState(() => _isLogin = !_isLogin),
              child: Text(
                _isLogin
                    ? 'Нет аккаунта? Регистрация'
                    : 'Уже есть аккаунт? Войти',
              ),
            ),
          ],
        ),
      ),
    );
  }
}
