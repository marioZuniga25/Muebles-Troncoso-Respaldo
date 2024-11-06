import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mueblestroncoso/models/catalogoModel.dart';

class ServicioProducto {
  final String apiUrl = 'http://192.168.1.182:5194/api/Producto';

  Future<List<Producto>> obtenerProductos() async {
    try {
      final response = await http.get(Uri.parse('$apiUrl/ListadoProductos'));
      if (response.statusCode == 200) {
        final List<dynamic> listaJson = json.decode(response.body);
        return listaJson.map((json) => Producto.fromJson(json)).toList();
      } else {
        throw Exception('Error al cargar los productos');
      }
    } catch (e) {
      throw Exception('Error al cargar los productos');
    }
  }

  Future<List<Producto>> buscarProductos(String term) async {
    try {
      final response = await http.get(Uri.parse('$apiUrl/FiltrarProductos?term=$term'));
      if (response.statusCode == 200) {
        final List<dynamic> listaJson = json.decode(response.body);
        return listaJson.map((json) => Producto.fromJson(json)).toList();
      } else {
        throw Exception('Error al buscar productos');
      }
    } catch (e) {
      throw Exception('Error al buscar productos');
    }
  }

  Future<Producto> verDetalleProducto(int id) async {
  final response = await http.get(Uri.parse('$apiUrl/$id'));

  if (response.statusCode == 200) {
    return Producto.fromJson(json.decode(response.body));
  } else {
    throw Exception('Error al obtener producto');
  }
}
  
  Future<List<Producto>> productosPorCategoria(int idCategoria) async {
    try {
      final response = await http.get(Uri.parse('$apiUrl/ProductoPorCategoria/$idCategoria'));

      if (response.statusCode == 200) {
        final List<dynamic> listaJson = json.decode(response.body);
        return listaJson.map((json) => Producto.fromJson(json)).toList();
      } else {
        return await obtenerProductos();
      }
    } catch (e) {
      return await obtenerProductos();
    }
  }

}
