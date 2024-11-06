import 'package:flutter/material.dart';
import 'package:mueblestroncoso/pantallas/catalogo/principalCatalogo.dart';
import 'package:mueblestroncoso/pantallas/infoEmpresa/quienesSomos.dart';
import 'package:mueblestroncoso/services/servicioUsuario.dart';
import 'package:shared_preferences/shared_preferences.dart';

class PantallaHome extends StatefulWidget {
  const PantallaHome({Key? key}) : super(key: key);

  @override
  PantallaHomeState createState() => PantallaHomeState();
}

class PantallaHomeState extends State<PantallaHome> {
  final ServicioLogin servicioUsuario = ServicioLogin();

  Future<Map<String, dynamic>?> obtenerUsuario() async {
  final SharedPreferences prefs = await SharedPreferences.getInstance();
  int? idUsuario = prefs.getInt('idUsuario');
  String? nombreUsuario = prefs.getString('nombreUsuario');
  int? rol = prefs.getInt('rol');
  if (idUsuario != null && nombreUsuario != null && rol != null) {
    String rolTexto;
    switch (rol) {
      case 0:
        rolTexto = 'Cliente';
        break;
       case 1:
          rolTexto = 'Administrador';
          break;
      default:
        rolTexto = 'Rol Desconocido';
    }
    return {
      'idUsuario': idUsuario,
      'nombreUsuario': nombreUsuario,
      'rol': rolTexto,
    };
  } else {
    return null;
  }
}


  void irAPantallaCatalogo(BuildContext context) {
    Navigator.push(context,MaterialPageRoute(builder: (_) => PantallaCatalogo()),);
  }

  void irAPantallaInfo(BuildContext context) {
    Navigator.push(context,MaterialPageRoute(builder: (_) => PantallaInformacion()),);
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: FutureBuilder<Map<String, dynamic>?>(
          future: obtenerUsuario(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return CircularProgressIndicator();
            } else if (snapshot.hasError) {
              return Text('Error');
            } else if (!snapshot.hasData || snapshot.data == null) {
              return Text('Principal');
            }
            String nombreUsuario = snapshot.data!['nombreUsuario'];
            String rol = snapshot.data!['rol'];
            return Stack(
              children: [
                Align(child: Text('Principal',style: TextStyle(color: Colors.black),),),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Container(
                    padding: EdgeInsets.only(left: 16),
                    child: Image.asset('assets/imagenes/logo_blanco_sinfondo.png',width: 40,height: 40,),
                  ),
                ),
                Align(
                  alignment: Alignment.centerRight,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      CircleAvatar(
                        backgroundColor: Colors.black,
                        child: Text(nombreUsuario.substring(0, 1).toUpperCase(),style: TextStyle(color: Colors.white,),),
                      ),
                      SizedBox(width: 8),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(nombreUsuario, style: TextStyle(color: Colors.black, fontSize: 14,),),
                          Text(rol,style: TextStyle(color: Colors.grey, fontSize: 10,),),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            );
          },
        ),
      ),
      drawer: FutureBuilder<Map<String, dynamic>?>(
        future: obtenerUsuario(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Drawer(
              child: Center(child: CircularProgressIndicator()),
            );
          } else if (snapshot.hasError) {
            return Drawer(
              child: Center(child: Text('Error al cargar datos del usuario')),
            );
          } else if (!snapshot.hasData || snapshot.data == null) {
            return Drawer(
              child: Center(child: Text('No hay datos del usuario')),
            );
          }
          String nombreUsuario = snapshot.data!['nombreUsuario'];
          String rol = snapshot.data!['rol'];
          return Drawer(
            backgroundColor: Colors.white,
            child: ListView(
              padding: EdgeInsets.all(8),
              children: <Widget>[
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                  child: Row(
                    children: [
                      CircleAvatar(
                        backgroundColor: Colors.black,
                        child: Text(nombreUsuario.substring(0, 1).toUpperCase(),style: TextStyle(color: Colors.white),),),
                      SizedBox(width: 16),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(nombreUsuario,style: TextStyle(fontSize: 16,fontWeight: FontWeight.bold,color: Colors.black,),),
                          Text(rol,style: TextStyle(fontSize: 14,color: Colors.grey,),),
                        ],
                      ),
                    ],
                  ),
                ),
                Divider(),
                ListTile(
                  leading: Icon(Icons.shop, color: Colors.black),
                  title: Text("Catálogo"),
                  onTap: () {
                    Navigator.pop(context);
                    irAPantallaCatalogo(context);
                  },
                ),
                ListTile(
                  leading: Icon(Icons.info, color: Colors.black),
                  title: Text("¿Quiénes somos?"),
                  onTap: () {
                    Navigator.pop(context);
                    irAPantallaInfo(context);
                  },
                ),
                ListTile(
                  leading: Icon(Icons.logout, color: Colors.black),
                  title: Text("Cerrar Sesión"),
                  onTap: () async {
                    await servicioUsuario.cerrarSesion();
                    Navigator.pushNamedAndRemoveUntil(context, 'login', (route) => false);
                  },
                ),
              ],
            ),
          );
        },
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
            width: MediaQuery.of(context).size.width,
            height: MediaQuery.of(context).size.height,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: AssetImage('assets/imagenes/banner.jpg'),
                  fit: BoxFit.cover,
                ),
              ),
            ),
          Container(
            color: Colors.black,
            padding: EdgeInsets.all(10),
            height: 80,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                Flexible(
                  child: Image.asset(
                    'assets/imagenes/logo_negro.jpeg',
                    width: double.infinity,
                    height: double.infinity,
                    fit: BoxFit.contain,
                  ),
                ),
                Flexible(
                  child: FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Text('DIRECCIÓN',style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),textAlign: TextAlign.center,),
                        Text('URL',style: TextStyle(color: Colors.white),textAlign: TextAlign.center,),
                      ],
                    ),
                  ),
                ),
                Flexible(
                  child: FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Text('CONTACTO',style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),textAlign: TextAlign.center,),
                        Text('Tel. 479 145 1392',style: TextStyle(color: Colors.white),textAlign: TextAlign.center,),
                        Text('contacto muebles-troncoso.com',style: TextStyle(color: Colors.white),textAlign: TextAlign.center,),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          )
          ],
        ),
      ),
    );
  }
}
