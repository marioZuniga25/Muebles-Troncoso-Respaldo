import 'dart:convert';

class Categoria {
  int idCategoria;
  String nombreCategoria;
  String descripcion;

  Categoria({
    required this.idCategoria,
    required this.nombreCategoria,
    required this.descripcion,
    
  });

  factory Categoria.fromJson(Map<String, dynamic> json) {
    return Categoria(
      idCategoria: json['idCategoria'] ?? 0,
      nombreCategoria: json['nombreCategoria'] ?? '',
      descripcion: json['descripcion'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'idCategoria': idCategoria,
      'nombreCategoria': nombreCategoria,
      'descripcion': descripcion,
    };
  }
}

List<Categoria> productosFromJson(String str) {
  final jsonData = json.decode(str);
  return List<Categoria>.from(jsonData.map((x) => Categoria.fromJson(x)));
}

String productosToJson(List<Categoria> data) {
  final dyn = List<dynamic>.from(data.map((x) => x.toJson()));
  return json.encode(dyn);
}
