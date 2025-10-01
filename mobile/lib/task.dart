class Task {
  int id;
  String name;
  String description;
  bool isDone;
  DateTime dateTime;

  Task({
    required this.id,
    required this.name,
    this.description = '',
    this.isDone = false,
    required this.dateTime,
  });

  Task copyWith({
    int? id,
    String? name,
    String? description,
    bool? isDone,
    DateTime? dateTime,
  }) {
    return Task(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      isDone: isDone ?? this.isDone,
      dateTime: dateTime ?? this.dateTime,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'isDone': isDone,
      'dateTime': dateTime.toIso8601String(),
    };
  }

  factory Task.fromMap(Map<String, dynamic> map) {
    return Task(
      id: map['id'],
      name: map['name'],
      description: map['description'],
      isDone: map['isDone'] ?? false,
      dateTime: DateTime.parse(map['date']),
    );
  }
}
