

class Task {
  int id;
  String name;
  String description;
  bool isCompleted;
  DateTime dateTime;

  Task({
    required this.name,
    this.description = '',
    this.isCompleted = false,
    required this.dateTime,
  }) : id = DateTime.now().millisecondsSinceEpoch;

  Task copyWith({
    String? name,
    String? description,
    bool? isCompleted,
    DateTime? dateTime,
  }) {
    return Task(
      name: name ?? this.name,
      description: description ?? this.description,
      isCompleted: isCompleted ?? this.isCompleted,
      dateTime: dateTime ?? this.dateTime,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'description': description,
      'isCompleted': isCompleted,
      'dateTime': dateTime.toIso8601String(),
    };
  }

  factory Task.fromMap(Map<String, dynamic> map) {
    return Task(
      name: map['name'],
      description: map['description'],
      isCompleted: map['isCompleted'],
      dateTime: DateTime.parse(map['dateTime']),
    );
  }
}
