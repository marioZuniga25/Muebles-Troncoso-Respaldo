import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mueblestroncoso/services/servicioCatalogo.dart';
import 'package:mueblestroncoso/models/catalogoModel.dart';

class PantallaDetalleCatalogo extends StatefulWidget {
  final int idProducto;

  const PantallaDetalleCatalogo({Key? key, required this.idProducto})
      : super(key: key);

  @override
  PantallaDetalleCatalogoState createState() => PantallaDetalleCatalogoState();
}

class PantallaDetalleCatalogoState extends State<PantallaDetalleCatalogo> {
  final ServicioProducto servicioProducto = ServicioProducto();
  late Future<Producto> producto;

  @override
  void initState() {
    super.initState();
    producto = obtenerProducto();
  }

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

  Future<Producto> obtenerProducto() async {
    try {
      final producto =
          await servicioProducto.verDetalleProducto(widget.idProducto);
      return producto;
    } catch (e) {
      rethrow;
    }
  }

  Image base64ToImage(String base64String,
      {double width = 100, double height = 100}) {
    try {
      final cleanedBase64String = base64String.replaceFirst(
          RegExp(r'^data:image\/[a-zA-Z]+;base64,'), '');
      final bytes = base64Decode(cleanedBase64String);
      return Image.memory(
        Uint8List.fromList(bytes),
        fit: BoxFit.cover,
      );
    } catch (e) {
      return Image.asset('assets/imagenes/error.png');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.white,
          leading: IconButton(
            icon: Icon(Icons.arrow_back),
            onPressed: () {
              Navigator.of(context).pop();
            },
          ),
          title: FutureBuilder<Map<String, dynamic>?>(
            future: obtenerUsuario(),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return CircularProgressIndicator();
              } else if (snapshot.hasError) {
                return Text('Error');
              } else if (!snapshot.hasData || snapshot.data == null) {
                return Text('Detalle del producto');
              }
              String nombreUsuario = snapshot.data!['nombreUsuario'];
              String rol = snapshot.data!['rol'];
              return Stack(
                children: [
                  Align(
                    child: Text(
                      'Detalle del producto',
                      style: TextStyle(color: Colors.black),
                    ),
                  ),
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Container(
                      padding: EdgeInsets.only(left: 16),
                      child: Image.asset(
                        'assets/imagenes/logo_blanco_sinfondo.png',
                        width: 40,
                        height: 40,
                      ),
                    ),
                  ),
                  Align(
                    alignment: Alignment.centerRight,
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        CircleAvatar(
                          backgroundColor: Colors.black,
                          child: Text(
                            nombreUsuario.substring(0, 1).toUpperCase(),
                            style: TextStyle(
                              color: Colors.white,
                            ),
                          ),
                        ),
                        SizedBox(width: 8),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              nombreUsuario,
                              style: TextStyle(
                                color: Colors.black,
                                fontSize: 14,
                              ),
                            ),
                            Text(
                              rol,
                              style: TextStyle(
                                color: Colors.grey,
                                fontSize: 10,
                              ),
                            ),
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
        body: SingleChildScrollView(
          child: Column(
            children: [
              FutureBuilder<Producto>(
                future: producto,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return Center(child: CircularProgressIndicator());
                  } else if (snapshot.hasError) {
                    return Center(
                        child: Text(
                            'Error al cargar los detalles del producto: ${snapshot.error}'));
                  } else if (!snapshot.hasData) {
                    return Center(child: Text('Producto no encontrado.'));
                  } else {
                    final producto = snapshot.data!;
                    return LayoutBuilder(
                      builder: (context, constraints) {
                        final isLargeScreen = constraints.maxWidth > 600;
                        return SingleChildScrollView(
                          child: Container(
                            color: Color(0xFFEDECF2),
                            width: double.infinity,
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Container(
                                color: Colors.white,
                                padding: const EdgeInsets.all(20),
                                child: isLargeScreen
                                    ? Row(
                                        children: [
                                          Expanded(
                                            flex: 1,
                                            child: Container(
                                              height: 700,
                                              width: 700,
                                              padding: const EdgeInsets.all(20),
                                              child: base64ToImage(
                                                  producto.imagen),
                                            ),
                                          ),
                                          SizedBox(width: 16),
                                          Expanded(
                                            flex: 1,
                                            child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  producto.nombreProducto,
                                                  style: TextStyle(
                                                      fontSize: 24,
                                                      fontWeight:
                                                          FontWeight.bold),
                                                ),
                                                SizedBox(height: 16),
                                                Text(
                                                  "\$${producto.precio} MXN",
                                                  style: TextStyle(
                                                      fontSize: 20,
                                                      fontWeight:
                                                          FontWeight.bold),
                                                ),
                                                SizedBox(height: 16),
                                                Text(
                                                  "Cantidad: ${producto.stock} Disponibles",
                                                  style:
                                                      TextStyle(fontSize: 16),
                                                ),
                                                SizedBox(height: 16),
                                                Text(
                                                  "DESCRIPCIÓN",
                                                  style: TextStyle(
                                                      fontSize: 18,
                                                      fontWeight:
                                                          FontWeight.bold),
                                                ),
                                                SizedBox(height: 8),
                                                Container(
                                                  color: Colors.grey[300],
                                                  padding:
                                                      const EdgeInsets.all(20),
                                                  child: Text(
                                                    producto.descripcion,
                                                    style:
                                                        TextStyle(fontSize: 16),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      )
                                    : Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.center,
                                        children: [
                                          Container(
                                            width: double.infinity,
                                            height: 300,
                                            padding: const EdgeInsets.all(20),
                                            child:
                                                base64ToImage(producto.imagen),
                                          ),
                                          SizedBox(height: 16),
                                          Text(
                                            producto.nombreProducto,
                                            style: TextStyle(
                                                fontSize: 24,
                                                fontWeight: FontWeight.bold),
                                            textAlign: TextAlign.center,
                                          ),
                                          SizedBox(height: 16),
                                          Text(
                                            "\$${producto.precio} MXN",
                                            style: TextStyle(
                                                fontSize: 20,
                                                fontWeight: FontWeight.bold),
                                            textAlign: TextAlign.center,
                                          ),
                                          SizedBox(height: 16),
                                          Text(
                                            "Cantidad: ${producto.stock} Disponibles",
                                            style: TextStyle(fontSize: 16),
                                            textAlign: TextAlign.center,
                                          ),
                                          SizedBox(height: 16),
                                          Text(
                                            "DESCRIPCIÓN",
                                            style: TextStyle(
                                                fontSize: 18,
                                                fontWeight: FontWeight.bold),
                                            textAlign: TextAlign.center,
                                          ),
                                          SizedBox(height: 8),
                                          Container(
                                            color: Colors.grey[300],
                                            padding: const EdgeInsets.all(20),
                                            child: Text(
                                              producto.descripcion,
                                              style: TextStyle(fontSize: 16),
                                              textAlign: TextAlign.center,
                                            ),
                                          ),
                                        ],
                                      ),
                              ),
                            ),
                          ),
                        );
                      },
                    );
                  }
                },
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
                            Text(
                              'DIRECCIÓN',
                              style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold),
                              textAlign: TextAlign.center,
                            ),
                            Text(
                              'URL',
                              style: TextStyle(color: Colors.white),
                              textAlign: TextAlign.center,
                            ),
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
                            Text(
                              'CONTACTO',
                              style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold),
                              textAlign: TextAlign.center,
                            ),
                            Text(
                              'Tel. 479 145 1392',
                              style: TextStyle(color: Colors.white),
                              textAlign: TextAlign.center,
                            ),
                            Text(
                              'contacto muebles-troncoso.com',
                              style: TextStyle(color: Colors.white),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              )
            ],
          ),
        ));
  }
}
