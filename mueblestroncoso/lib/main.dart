import 'package:flutter/material.dart';
import 'package:mueblestroncoso/pantallas/catalogo/principalCatalogo.dart';
import 'package:mueblestroncoso/pantallas/home.dart';
import 'package:mueblestroncoso/pantallas/login/pantallaLogin.dart';
import 'package:mueblestroncoso/pantallas/login/pantallaAutenticada.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Muebles Troncoso',
      debugShowCheckedModeBanner: false,
      routes: {
        'login': (context) => PantallaLogin(),
        'principalCatalogo': (context) => PantallaAutenticada(
          pantallaPrivada: PantallaCatalogo(
          ),
        ),
        'home': (context) => PantallaAutenticada(
          pantallaPrivada: PantallaHome(            
          ),
        ),
      },
      initialRoute: 'login',
    );
  }
}