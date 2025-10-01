import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:http/http.dart' as http;

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/requests.dart';
import 'package:mobile/task.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'auth_screen.dart';

const String BACKEND_GET_USER_URL = 'http://10.0.2.2:8080/api/user';

void main() {
  runApp(const TodoApp());
}

class TodoApp extends StatefulWidget {
  const TodoApp({super.key});

  @override
  State<TodoApp> createState() => _TodoAppState();
}

class _TodoAppState extends State<TodoApp> {
  bool? _isAuthenticated;

  @override
  void initState() {
    super.initState();
    Requests.init(_handleLogout);
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    setState(() async {
      _isAuthenticated = await Requests.isAuthenticated();
    });
  }

  void _handleAuthSuccess() {
    setState(() {
      _isAuthenticated = true;
    });
  }

  void _handleLogout() {
    setState(() {
      _isAuthenticated = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isAuthenticated == null) {
      return const MaterialApp(
        home: Scaffold(body: Center(child: CircularProgressIndicator())),
      );
    }

    return MaterialApp(
      title: 'Todo List',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: _isAuthenticated!
          ? TodoListScreen(onLogout: _handleLogout)
          : AuthScreen(onAuthSuccess: _handleAuthSuccess),
    );
  }
}

class TodoListScreen extends StatefulWidget {
  const TodoListScreen({super.key, required this.onLogout});

  final VoidCallback onLogout;

  @override
  State<TodoListScreen> createState() => _TodoListScreenState();
}

class _TodoListScreenState extends State<TodoListScreen> {
  final Map<String, List<Task>> _tasks = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadTasks();
  }

  Future<void> _loadTasks() async {
    final Map decoded = await Requests.getAllTasks();

    try {
      final Map<String, List<Task>> loadedTasks = {};

      for (final entry in decoded.entries) {
        final String key = entry.key;
        final List<dynamic> taskList = entry.value as List<dynamic>;
        final List<Task> tasks = taskList
            .map((item) => Task.fromMap(item as Map<String, dynamic>))
            .toList();
        loadedTasks[key] = tasks;
      }

      setState(() {
        _tasks.clear();
        _tasks.addAll(loadedTasks);
      });
    } catch (e) {
      print('Ошибка при загрузке задач: $e');
    }

    setState(() => _isLoading = false);
  }

  // Future<void> _saveTasks() async {
  //   final prefs = await SharedPreferences.getInstance();
  //
  //   final Map<String, List<Map<String, dynamic>>> tasksJson = {};
  //
  //   for (final entry in _tasks.entries) {
  //     final String dateString = entry.key;
  //     final List<Map<String, dynamic>> taskMaps = entry.value
  //         .map((task) => task.toMap())
  //         .toList();
  //     tasksJson[dateString] = taskMaps;
  //   }
  //
  //   final String jsonString = jsonEncode(tasksJson);
  //
  //   await prefs.setString('tasks', jsonString);
  // }

  Future<void> _addTask(String name, String description, String date) async {
    if (name.isNotEmpty) {
      var response = await Requests.createTask(name, description, date);
      setState(() {
        _tasks.putIfAbsent(date, () => []);
        final newTasks = _tasks[date];
        newTasks?.add(Task.fromMap(response as Map<String, dynamic>));

        _tasks[date] = newTasks!;
      });
    }
  }

  void _updateTask(
    String date,
    int id,
    String name,
    bool isDone,
    String description,
  ) {
    setState(() {
      var response =
          Requests.updateTask(name, description, isDone, date)
              as Map<String, dynamic>;
      final updatedTasks = _tasks[date]!
          .map(
            (task) => task.id == id
                ? task.copyWith(
                    name: response['name'],
                    description: response['description'],
                  )
                : task,
          )
          .toList();
      _tasks[date] = updatedTasks;
    });
    // _saveTasks();
  }

  void _toggleTask(String date, int id) {
    setState(() {
      Requests.toggleTask(id);
      final updatedTasks = _tasks[date]!
          .map(
            (task) =>
                task.id == id ? task.copyWith(isDone: !task.isDone) : task,
          )
          .toList();

      _tasks[date] = updatedTasks;
    });

    // _saveTasks();
  }

  void _deleteTask(String date, int id) {
    setState(() {
      Requests.deleteTask(id);
      final updatedTasks = _tasks[date];
      updatedTasks?.removeWhere((task) => task.id == id);
      _tasks[date] = updatedTasks!;
    });

    // _saveTasks();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Todo List')),
      body: Stack(
        fit: StackFit.expand,
        children: [
          _isLoading
              ? const Center(child: CircularProgressIndicator())
              : SingleChildScrollView(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ..._getDatesInRange().map((date) {
                          final tasksForDate = _tasks[_formatDate(date)];

                          return Padding(
                            key: Key(date.toString()),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 8,
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  _formatDate(date),
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.blue,
                                  ),
                                ),

                                if (tasksForDate != null &&
                                    tasksForDate.isNotEmpty)
                                  ...tasksForDate.map(
                                    (task) => ListTile(
                                      leading: Checkbox(
                                        value: task.isDone,
                                        onChanged: (value) {
                                          _toggleTask(_formatDate(date), task.id);
                                        },
                                        activeColor: Colors.green,
                                      ),
                                      title: Text(
                                        task.name,
                                        style: TextStyle(
                                          decoration: task.isDone
                                              ? TextDecoration.lineThrough
                                              : TextDecoration.none,
                                          color: task.isDone
                                              ? Colors.grey
                                              : Colors.black,
                                        ),
                                      ),
                                      subtitle: task.description.isNotEmpty
                                          ? Text(
                                              task.description,
                                              style: TextStyle(
                                                decoration: task.isDone
                                                    ? TextDecoration.lineThrough
                                                    : TextDecoration.none,
                                                color: Colors.grey,
                                                fontSize: 14,
                                              ),
                                            )
                                          : null,
                                      trailing: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          IconButton(
                                            icon: const Icon(Icons.edit),
                                            onPressed: () =>
                                                _showEditModal(date, task),
                                            splashRadius: 16,
                                          ),
                                          IconButton(
                                            icon: const Icon(Icons.delete),
                                            onPressed: () => _deleteTask(
                                              _formatDate(date),
                                              task.id,
                                            ),
                                            splashRadius: 16,
                                          ),
                                        ],
                                      ),
                                    ),
                                  )
                                else
                                  const Padding(
                                    padding: EdgeInsets.only(top: 8),
                                    child: Text(
                                      'Нет задач 😪',
                                      style: TextStyle(color: Colors.grey),
                                    ),
                                  ),

                                Padding(
                                  padding: const EdgeInsets.only(top: 12),
                                  child: ElevatedButton.icon(
                                    onPressed: () => _showEditModal(date),
                                    icon: const Icon(Icons.add),
                                    label: const Text('Добавить'),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.blue[100],
                                      foregroundColor: Colors.blue,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(20),
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          );
                        }),
                      ],
                    ),
                  ),
                ),

          Positioned(
            bottom: 24,
            right: 10,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                FloatingActionButton(
                  onPressed: _downloadTasks,
                  backgroundColor: Colors.blue,
                  elevation: 6,
                  child: const Icon(Icons.download, size: 20),
                ),
                const SizedBox(height: 8),
                FloatingActionButton(
                  onPressed: _loadTasks,
                  backgroundColor: Colors.green,
                  elevation: 6,
                  child: const Icon(Icons.sync, size: 20),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showEditModal(DateTime date, [Task? task]) {
    final TextEditingController nameController = TextEditingController(
      text: task?.name ?? '',
    );
    final TextEditingController descController = TextEditingController(
      text: task?.description ?? '',
    );

    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) => AlertDialog(
        title: Text(task == null ? 'Добавить задачу' : 'Редактировать задачу'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              controller: nameController,
              decoration: const InputDecoration(
                labelText: 'Название',
                border: OutlineInputBorder(),
              ),
              maxLines: 1,
            ),
            const SizedBox(height: 12),
            TextField(
              controller: descController,
              decoration: const InputDecoration(
                labelText: 'Описание (необязательно)',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Отмена'),
          ),
          TextButton(
            onPressed: () {
              final name = nameController.text.trim();
              if (name.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Введите название задачи!')),
                );
                return;
              }

              if (task == null) {
                _addTask(name, descController.text.trim(), _formatDate(date));
              } else {
                _updateTask(
                  _formatDate(date),
                  task.id,
                  name,
                  task.isDone,
                  descController.text.trim(),
                );
              }
              Navigator.pop(context);
            },
            child: const Text('Сохранить'),
          ),
        ],
      ),
    );
  }

  List<DateTime> _getDatesInRange() {
    final today = DateTime.now();
    final endOfYear = DateTime(today.year + 1, today.month, today.day);

    final dates = <DateTime>[];
    var currentDate = DateTime(today.year, today.month, today.day);

    while (currentDate.isBefore(endOfYear) ||
        currentDate.isAtSameMomentAs(endOfYear)) {
      dates.add(DateTime(currentDate.year, currentDate.month, currentDate.day));
      currentDate = DateTime(
        currentDate.year,
        currentDate.month,
        currentDate.day + 1,
      );
    }

    return dates;
  }

  String _formatDate(DateTime date) {
    final DateFormat formatter = DateFormat('yyyy-MM-dd');
    return formatter.format(date);
  }

  Future<void> _downloadTasks() async {
    try {
      final Map<String, List<Map<String, dynamic>>> tasksJson = {};

      for (final entry in _tasks.entries) {
        final String dateString = entry.key;
        final List<Map<String, dynamic>> taskMaps = entry.value
            .map((task) => task.toMap())
            .toList();
        tasksJson[dateString] = taskMaps;
      }

      final String jsonString = jsonEncode(tasksJson);

      final Uint8List fileBytes = Uint8List.fromList(utf8.encode(jsonString));

      final String? filePath = await FilePicker.platform.saveFile(
        dialogTitle: 'Выберите папку для сохранения файла',
        fileName: 'tasks_export.json',
        allowedExtensions: ['json'],
        bytes: fileBytes,
      );

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Файл сохранён: $filePath'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Ошибка сохранения: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _loadTasksFromJson() async {
    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['json'],
      );

      if (result == null) return;

      final file = File(result.files.single.path!);

      final jsonTasks = await file.readAsString();

      final Map<String, dynamic> decoded = jsonDecode(jsonTasks);
      final Map<String, List<Task>> loadedTasks = {};

      for (final entry in decoded.entries) {
        final String key = entry.key;
        final List<dynamic> taskList = entry.value as List<dynamic>;
        final List<Task> tasks = taskList
            .map((item) => Task.fromMap(item as Map<String, dynamic>))
            .toList();
        loadedTasks[key] = tasks;
      }

      setState(() {
        _tasks.clear();
        _tasks.addAll(loadedTasks);
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Успешно загружено ${loadedTasks.length} дат'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Ошибка загрузки: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }
}
