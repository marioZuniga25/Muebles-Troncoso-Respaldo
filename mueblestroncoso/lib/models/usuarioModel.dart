import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class Usuario {
  final int idUsuario;
  final String nombreUsuario;
  final String correo;
  final String contrasenia;
  final int rol;

  Usuario({
    required this.idUsuario,
    required this.nombreUsuario,
    required this.correo,
    required this.contrasenia,
    required this.rol,
  });

  factory Usuario.fromJson(Map<String, dynamic> json) {
    return Usuario(
      idUsuario: json['idUsuario'],
      nombreUsuario: json['nombreUsuario'],
      correo: json['correo'],
      contrasenia: json['contrasenia'],
      rol: json['rol'],
    );
  }
}
