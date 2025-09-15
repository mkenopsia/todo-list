import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/task.dart';
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  runApp(const TodoApp());
}

class TodoApp extends StatelessWidget {
  const TodoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Todo List',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const TodoListScreen(),
    );
  }
}

class TodoListScreen extends StatefulWidget {
  const TodoListScreen({super.key});

  @override
  State<TodoListScreen> createState() => _TodoListScreenState();
}

class _TodoListScreenState extends State<TodoListScreen> {
  final TextEditingController _controller = TextEditingController();
  final Map<String, List<Task>> _tasks = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadTasks();
  }

  Future<void> _loadTasks() async {
    final prefs = await SharedPreferences.getInstance();
    final String? jsonTasks = prefs.getString('tasks');

    if (jsonTasks != null) {
      try {
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
      } catch (e) {
        print('Ошибка при загрузке задач: $e');
      }
    }

    setState(() => _isLoading = false);
  }

  Future<void> _saveTasks() async {
    final prefs = await SharedPreferences.getInstance();

    final Map<String, List<Map<String, dynamic>>> tasksJson = {};

    for (final entry in _tasks.entries) {
      final String dateString = entry.key;
      final List<Map<String, dynamic>> taskMaps = entry.value
          .map((task) => task.toMap())
          .toList();
      tasksJson[dateString] = taskMaps;
    }

    final String jsonString = jsonEncode(tasksJson);

    await prefs.setString('tasks', jsonString);
  }

  void _addTask(String name, String description, String date) {
    if (name.isNotEmpty) {
      setState(() {
        _tasks.putIfAbsent(date, () => []);
        final newTasks = _tasks[date];
        newTasks?.add(
          Task(
            name: name,
            description: description,
            dateTime: DateTime.parse(date),
          ),
        );

        _tasks[date] = newTasks!;
      });

      _saveTasks();
    }
  }

  void _updateTask(String date, int id, String name, String description) {
    setState(() {
      final updatedTasks = _tasks[date]!
          .map(
            (task) => task.id == id
                ? task.copyWith(name: name, description: description)
                : task,
          )
          .toList();
      _tasks[date] = updatedTasks;
    });
    _saveTasks();
  }

  void _toggleTask(String date, int id) {
    setState(() {
      final updatedTasks = _tasks[date]!
          .map(
            (task) => task.id == id
                ? task.copyWith(isCompleted: !task.isCompleted)
                : task,
          )
          .toList();

      _tasks[date] = updatedTasks;
    });

    _saveTasks();
  }

  void _deleteTask(String date, int id) {
    setState(() {
      final updatedTasks = _tasks[date];

      updatedTasks?.removeWhere((task) => task.id == id);

      _tasks[date] = updatedTasks!;
    });

    _saveTasks();
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
                          final tasksForDate = _tasks[date.toString()];

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
                                        value: task.isCompleted,
                                        onChanged: (value) {
                                          _toggleTask(date.toString(), task.id);
                                        },
                                        activeColor: Colors.green,
                                      ),
                                      title: Text(
                                        task.name,
                                        style: TextStyle(
                                          decoration: task.isCompleted
                                              ? TextDecoration.lineThrough
                                              : TextDecoration.none,
                                          color: task.isCompleted
                                              ? Colors.grey
                                              : Colors.black,
                                        ),
                                      ),
                                      subtitle: task.description.isNotEmpty
                                          ? Text(
                                              task.description,
                                              style: TextStyle(
                                                decoration: task.isCompleted
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
                                              date.toString(),
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
                  onPressed: _loadTasksFromJson,
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
                _addTask(name, descController.text.trim(), date.toString());
              } else {
                _updateTask(
                  date.toString(),
                  task.id,
                  name,
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
