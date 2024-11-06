import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class PantallaAutenticada extends StatelessWidget {
  final Widget pantallaPrivada;

  const PantallaAutenticada({Key? key, required this.pantallaPrivada}) : super(key: key);

  Future<bool> verificarSesion() async {
    final prefs = await SharedPreferences.getInstance();
    final idUsuario = prefs.getInt('idUsuario');
    return idUsuario != null;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<bool>(
      future: verificarSesion(),
      builder: (context, datos) {
        if (datos.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        } else if (datos.hasError || !datos.hasData || !datos.data!) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            Navigator.pushReplacementNamed(context, 'login');
          });
          return Container();
        } else {
          return pantallaPrivada;
        }
      },
    );
  }
}
