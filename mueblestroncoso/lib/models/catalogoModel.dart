import 'dart:convert';

class Producto {
  int idProducto;
  String nombreProducto;
  String descripcion;
  double precio;
  int stock;
  String nombreCategoria;
  int idInventario;
  int idCategoria;
  String imagen;

  Producto({
    required this.idProducto,
    required this.nombreProducto,
    required this.descripcion,
    required this.precio,
    required this.stock,
    required this.nombreCategoria,
    required this.idInventario,
    required this.idCategoria,
    required this.imagen,
  });

  factory Producto.fromJson(Map<String, dynamic> json) {
    return Producto(
      idProducto: json['idProducto'] ?? 0,
      nombreProducto: json['nombreProducto'] ?? '',
      descripcion: json['descripcion'] ?? '',
      precio: (json['precio'] ?? 0.0).toDouble(),
      stock: json['stock'] ?? 0,
      nombreCategoria: json['nombreCategoria'] ?? '',
      idInventario: json['idInventario'] ?? 0,
      idCategoria: json['idCategoria'] ?? 0,
      imagen: json['imagen'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'idProducto': idProducto,
      'nombreProducto': nombreProducto,
      'descripcion': descripcion,
      'precio': precio,
      'stock': stock,
      'nombreCategoria': nombreCategoria,
      'idInventario': idInventario,
      'idCategoria': idCategoria,
      'imagen': imagen,
    };
  }
}

List<Producto> productosFromJson(String str) {
  final jsonData = json.decode(str);
  return List<Producto>.from(jsonData.map((x) => Producto.fromJson(x)));
}

String productosToJson(List<Producto> data) {
  final dyn = List<dynamic>.from(data.map((x) => x.toJson()));
  return json.encode(dyn);
}
