import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mueblestroncoso/models/usuarioModel.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ServicioLogin {
  final String apiUrl = 'http://192.168.1.182:5194/api/Usuario';

  Future<Usuario?> login(String correo, String contrasenia) async {
    final response = await http.post(
      Uri.parse('$apiUrl/Login'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'nombreUsuario': '',
        'correo': correo,
        'contrasenia': contrasenia,
      }),
    );
    if (response.statusCode == 200) {
      final jsonResponse = jsonDecode(response.body);
      final usuarioJson = jsonResponse['user'];
      if (usuarioJson != null) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setInt('idUsuario', usuarioJson['idUsuario']);
        await prefs.setString('nombreUsuario', usuarioJson['nombreUsuario']);
        await prefs.setInt('rol', usuarioJson['rol']);
        return Usuario.fromJson(usuarioJson);
      }
    } else if (response.statusCode == 401) {
      throw Exception('Usuario o contraseña incorrectos');
    } else {
      throw Exception('Error al iniciar sesión');
    }
    return null;
  }

  Future<void> cerrarSesion() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('idUsuario');
    await prefs.remove('nombreUsuario');
    await prefs.remove('rol');
  }

  Future<Usuario?> registrarUsuario(String correo, String nombreUsuario, String contrasenia) async {
  final response = await http.post(
    Uri.parse('$apiUrl/registrar'),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode(<String, dynamic>{
      'nombreUsuario': nombreUsuario,
      'correo': correo,
      'contrasenia': contrasenia,
      'rol': 0,
    }),
  );

  if (response.statusCode == 200) {
    final jsonResponse = jsonDecode(response.body);
    final usuarioJson = jsonResponse['user'];
    if (usuarioJson != null) {
      return Usuario.fromJson(usuarioJson);
    }
  } else {
    throw Exception('Error al registrar usuario');
  }
  return null;
}

}
