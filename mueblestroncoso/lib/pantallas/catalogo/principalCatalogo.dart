import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:mueblestroncoso/models/categoriaModel.dart';
import 'package:mueblestroncoso/services/servicioCategoria.dart';
import 'package:mueblestroncoso/services/servicioUsuario.dart';
import 'package:mueblestroncoso/services/servicioCatalogo.dart';
import 'package:mueblestroncoso/models/catalogoModel.dart';
import 'package:mueblestroncoso/pantallas/catalogo/pantallaDetalleCatalogo.dart';
import 'package:mueblestroncoso/pantallas/infoEmpresa/quienesSomos.dart';
import 'package:shared_preferences/shared_preferences.dart';

class PantallaCatalogo extends StatefulWidget {
  const PantallaCatalogo({Key? key}) : super(key: key);

  @override
  PantallaCatalogoState createState() => PantallaCatalogoState();
}

class PantallaCatalogoState extends State<PantallaCatalogo> {
  final ServicioLogin servicioUsuario = ServicioLogin();
  final ServicioProducto servicioProducto = ServicioProducto();
  final ServicioCategoria servicioCategoria = ServicioCategoria();
  late TextEditingController buscarController;
  late List<Producto> productos = [];
  late List<Categoria> categorias = [];
  bool esLeido = true;
  Map<String, dynamic>? datosUsuario;

  @override
  void initState() {
    super.initState();
    buscarController = TextEditingController();
    buscarController.addListener(busqueda);
    mostrarProductos();
    cargarUsuario();
    mostrarCategorias();
  }

  @override
  void dispose() {
    buscarController.removeListener(busqueda);
    buscarController.dispose();
    super.dispose();
  }

  Future<void> cargarUsuario() async {
    datosUsuario = await obtenerUsuario();
    setState(() {});
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

  void mostrarProductos() async {
    setState(() {
      esLeido = true;
    });

    try {
      List<Producto> lsitaProductos = await servicioProducto.obtenerProductos();
      setState(() {
        productos = lsitaProductos;
        esLeido = false;
      });
    } catch (e) {
      setState(() {
        esLeido = false;
      });
      print('Error al cargar productos: $e');
    }
  }

  Future<List<Producto>> cargarProductosPorCategoria(int idCategoria) async {
    try {
      List<Producto> listaProductos =
          await servicioProducto.productosPorCategoria(idCategoria);
      return listaProductos;
    } catch (e) {
      print('Error al cargar productos por categoría: $e');
      return [];
    } finally {
      setState(() {
        esLeido = false;
      });
    }
  }

  void mostrarCategorias() async {
    try {
      List<Categoria> listaResultados =
          await servicioCategoria.obtenerCategorias();
      setState(() {
        categorias = listaResultados;
        print(categorias);
      });
    } catch (e) {
      print('Error al cargar categorias: $e');
    }
  }

  void busqueda() async {
    final searchTerm = buscarController.text;
    if (searchTerm.isNotEmpty) {
      try {
        final filteredProductos =
            await servicioProducto.buscarProductos(searchTerm);
        setState(() {
          productos = filteredProductos;
        });
      } catch (e) {
        print('Error al buscar productos: $e');
      }
    }
  }

  Image base64ToImage(String base64String,
      {double width = 300, double height = 300}) {
    try {
      final cleanedBase64String = base64String.replaceFirst(
          RegExp(r'^data:image\/[a-zA-Z]+;base64,'), '');
      final bytes = base64Decode(cleanedBase64String);
      return Image.memory(
        Uint8List.fromList(bytes),
        width: width,
        height: height,
        fit: BoxFit.cover,
      );
    } catch (e) {
      return Image.asset('assets/imagenes/error.png',
          width: width, height: height);
    }
  }

  void irAPantallaDetalle(int idProducto) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => PantallaDetalleCatalogo(idProducto: idProducto),
      ),
    );
  }
  void irAPantallaInfo(BuildContext context) {
    Navigator.push(context,MaterialPageRoute(builder: (_) => PantallaInformacion()),);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: datosUsuario == null
            ? CircularProgressIndicator()
            : Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Image.asset(
                    'assets/imagenes/logo_blanco_sinfondo.png',
                    width: 40,
                    height: 40,
                  ),
                  Text(
                    'Catálogo',
                    style: TextStyle(color: Colors.black),
                  ),
                  Row(
                    children: [
                      CircleAvatar(
                        backgroundColor: Colors.black,
                        child: Text(
                          datosUsuario!['nombreUsuario']
                              .substring(0, 1)
                              .toUpperCase(),
                          style: TextStyle(color: Colors.white),
                        ),
                      ),
                      SizedBox(width: 8),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            datosUsuario!['nombreUsuario'],
                            style: TextStyle(
                              color: Colors.black,
                              fontSize: 14,
                            ),
                          ),
                          Text(
                            datosUsuario!['rol'],
                            style: TextStyle(
                              color: Colors.grey,
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
      ),
      drawer: datosUsuario == null
          ? Drawer(child: Center(child: CircularProgressIndicator()))
          : Drawer(
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
                          child: Text(
                            datosUsuario!['nombreUsuario']
                                .substring(0, 1)
                                .toUpperCase(),
                            style: TextStyle(color: Colors.white),
                          ),
                        ),
                        SizedBox(width: 16),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              datosUsuario!['nombreUsuario'],
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.black,
                              ),
                            ),
                            Text(
                              datosUsuario!['rol'],
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  Divider(),
                  ListTile(
                    leading: Icon(Icons.home, color: Colors.black),
                    title: Text("Principal"),
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.pop(context);
                    },
                  ),
                  ListTile(
                    leading: Icon(Icons.info, color: Colors.black),
                    title: Text("¿Quiénes somos?"),
                    onTap: () {
                      Navigator.pop(context);
                      irAPantallaInfo(context);
                    }
                  ),
                  ListTile(
                    leading: Icon(Icons.logout, color: Colors.black),
                    title: Text("Cerrar Sesión"),
                    onTap: () async {
                      await servicioUsuario.cerrarSesion();
                      Navigator.pushNamedAndRemoveUntil(
                          context, 'login', (route) => false);
                    },
                  ),
                ],
              ),
            ),
      body: esLeido
          ? Center(child: CircularProgressIndicator())
          : LayoutBuilder(
              builder: (context, constraints) {
                double aspectRatio = constraints.maxWidth > 600 ? 0.7 : 0.75;
                int crossAxisCount = constraints.maxWidth > 600 ? 3 : 2;
                return ListView(
                  children: [
                    Container(
                      padding: EdgeInsets.only(top: 15),
                      decoration: BoxDecoration(
                        color: Color(0xFFEDECF2),
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(35),
                          topRight: Radius.circular(35),
                        ),
                      ),
                      child: Column(
                        children: [
                          Container(
                            margin: EdgeInsets.symmetric(horizontal: 15),
                            padding: EdgeInsets.symmetric(horizontal: 15),
                            height: 50,
                            decoration: BoxDecoration(
                              color: Colors.white54,
                              borderRadius: BorderRadius.circular(30),
                            ),
                            child: Row(
                              children: [
                                Expanded(
                                  child: TextField(
                                    controller: buscarController,
                                    decoration: InputDecoration(
                                      enabledBorder: UnderlineInputBorder(
                                        borderSide:
                                            BorderSide(color: Colors.black),
                                      ),
                                      focusedBorder: UnderlineInputBorder(
                                        borderSide: BorderSide(
                                            color: Colors.black, width: 2),
                                      ),
                                      border: InputBorder.none,
                                      hintText: "¿Qué estás buscando?",
                                    ),
                                  ),
                                ),
                                Icon(
                                  Icons.search,
                                  size: 27,
                                ),
                              ],
                            ),
                          ),
                          Container(
                            margin: EdgeInsets.symmetric(
                              vertical: 20,
                              horizontal: 10,
                            ),
                            child: Text(
                              "Categorias",
                              style: TextStyle(
                                  fontSize: 25,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black),
                            ),
                          ),
                          SingleChildScrollView(
                            scrollDirection: Axis.horizontal,
                            child: Row(
                              children:
                                  List.generate(categorias.length, (index) {
                                final categoria = categorias[index];
                                return InkWell(
                                  onTap: () async {
                                    List<Producto> listaProductos =
                                        await cargarProductosPorCategoria(
                                            categoria.idCategoria);
                                    if (listaProductos.isEmpty) {
                                      listaProductos = await servicioProducto
                                          .obtenerProductos();
                                    }

                                    setState(() {
                                      productos = listaProductos;
                                    });
                                  },
                                  child: Container(
                                    margin:
                                        EdgeInsets.symmetric(horizontal: 10),
                                    padding: EdgeInsets.symmetric(
                                        vertical: 5, horizontal: 10),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                    child: Row(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.center,
                                      children: [
                                        CircleAvatar(
                                          backgroundColor: Colors.black,
                                          child: Text(
                                            categoria.nombreCategoria
                                                .substring(0, 1)
                                                .toUpperCase(),
                                            style:
                                                TextStyle(color: Colors.white),
                                          ),
                                        ),
                                        SizedBox(width: 10),
                                        Text(
                                          categoria.nombreCategoria,
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 16,
                                            color: Colors.black,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              }),
                            ),
                          ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                alignment: Alignment.centerLeft,
                                margin: EdgeInsets.symmetric(
                                    vertical: 20, horizontal: 10),
                                child: Text("NUESTROS PRODUCTOS",style: TextStyle(
                                    fontSize: 25,
                                    fontWeight: FontWeight.bold,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                              ),
                            ],
                          ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              InkWell(
                                onTap: () {
                                  mostrarProductos();
                                },
                                child: Text( 'Ver todos',style: TextStyle(
                                    fontSize: 13,
                                    color: Colors.black,
                                    decoration: TextDecoration.underline,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          GridView.builder(
                            shrinkWrap: true,
                            physics: NeverScrollableScrollPhysics(),
                            gridDelegate:
                                SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: crossAxisCount,
                              crossAxisSpacing: 10,
                              mainAxisSpacing: 10,
                              childAspectRatio: aspectRatio,
                            ),
                            itemCount: productos.length,
                            itemBuilder: (context, index) {
                              final producto = productos[index];
                              return Container(
                                padding: EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(15),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisSize: MainAxisSize.min,
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Container(
                                          padding: EdgeInsets.all(4),
                                          decoration: BoxDecoration(
                                            color: Colors.black,
                                            borderRadius:
                                                BorderRadius.circular(15),
                                          ),
                                          child: Text(
                                            "Cantidad: ${producto.stock} Disponibles",
                                            style: TextStyle(
                                                fontSize: 8,
                                                color: Colors.white,
                                                fontWeight: FontWeight.bold),
                                          ),
                                        ),
                                        //Icon(Icons.favorite_border, color: Colors.red),
                                      ],
                                    ),
                                    Expanded(
                                      child: InkWell(
                                        onTap: () {
                                          irAPantallaDetalle(
                                              producto.idProducto);
                                        },
                                        child: Center(
                                          child: base64ToImage(producto.imagen),
                                        ),
                                      ),
                                    ),
                                    SizedBox(height: 6),
                                    Text(
                                      producto.nombreProducto,
                                      style: TextStyle(
                                          fontSize: 16,
                                          color: Colors.black,
                                          fontWeight: FontWeight.bold),
                                    ),
                                    SizedBox(height: 6),
                                    Text(
                                      "\$${producto.precio}",
                                      style: TextStyle(
                                          fontSize: 14,
                                          color: Colors.red,
                                          fontWeight: FontWeight.bold),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                          SizedBox(
                            height: 20,
                          ),
                        ],
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
                );
              },
            ),
    );
  }
}
