import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mueblestroncoso/models/categoriaModel.dart';

class ServicioCategoria {
  final String apiUrl = 'http://192.168.1.182:5194/api/Categorias';

  Future<List<Categoria>> obtenerCategorias() async {
    try {
      final response = await http.get(Uri.parse('$apiUrl'));

      if (response.statusCode == 200) {
        final List<dynamic> listaJson = json.decode(response.body);
        return listaJson.map((json) => Categoria.fromJson(json)).toList();
      } else {
        throw Exception('Error al cargar las categorias');
      }
    } catch (e) {
      print('Error: $e');
      throw Exception('Error al cargar las categorias');
    }
  }

}
