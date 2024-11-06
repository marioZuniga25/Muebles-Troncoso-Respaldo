import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:mueblestroncoso/services/servicioUsuario.dart';
import 'package:shared_preferences/shared_preferences.dart';

class PantallaInformacion extends StatefulWidget {
  const PantallaInformacion({Key? key}) : super(key: key);

  @override
  PantallaInformacionState createState() => PantallaInformacionState();
}

class PantallaInformacionState extends State<PantallaInformacion> {
  final ServicioLogin servicioUsuario = ServicioLogin();

  @override
  void initState() {
    super.initState();
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

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 4,
      child: Scaffold(
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
                    child: Text('¿Quiénes somos?',style: TextStyle(color: Colors.black),),
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
                            Text( nombreUsuario,style: TextStyle( color: Colors.black,fontSize: 14,),),
                            Text(rol,style: TextStyle(color: Colors.grey,fontSize: 10,),),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              );
            },
          ),
          bottom: TabBar(
            indicatorColor: Colors.black,
            labelColor: Colors.black,
            unselectedLabelColor: Colors.black,
            labelStyle: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            unselectedLabelStyle: TextStyle(fontSize: 16),
            tabs: [
              Tab(text: 'Historia', icon: Icon(Icons.timeline)),
              Tab(text: 'Misión', icon: Icon(Icons.flag)),
              Tab(text: 'Visión', icon: Icon(Icons.visibility)),
              Tab(text: 'Valores', icon: Icon(Icons.gavel)),
            ],
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
                          child: Text(
                            nombreUsuario.substring(0, 1).toUpperCase(),
                            style: TextStyle(color: Colors.white),
                          ),
                        ),
                        SizedBox(width: 16),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              nombreUsuario,
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.black,
                              ),
                            ),
                            Text(
                              rol,
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
                      leading: Icon(Icons.shop, color: Colors.black),
                      title: Text("Principal"),
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.pop(context);
                      }),
                  ListTile(
                    leading: Icon(Icons.info, color: Colors.black),
                    title: Text("¿Quiénes somos?"),
                    onTap: () {
                      Navigator.pop(context);
                    },
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
            );
          },
        ),
        body: Stack(
          children: [
            Container(
              width: double.infinity,
              height: double.infinity,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: AssetImage('assets/imagenes/banner.jpg'),
                  fit: BoxFit.cover,
                ),
              ),
            ),           
            TabBarView(
              children: [
                SingleChildScrollView(
                    child: Column(
                      children: [
                        SizedBox(height: 100),
                        Container(
                          padding: EdgeInsets.all(20),
                          margin: EdgeInsets.symmetric(horizontal: 30),
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(25),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black12,
                                blurRadius: 15,
                                offset: Offset(0, 5),
                              ),
                            ],
                          ),
                          child: Column(
                            children: [
                              SizedBox(height: 10),
                              SafeArea(
                                child: Container(
                                  width: 150,
                                  height: 150,
                                  decoration: BoxDecoration(
                                    image: DecorationImage(
                                      image: AssetImage(
                                          'assets/imagenes/prb-logo.png'),
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                              ),
                              Text(
                                'Historia',
                                style: Theme.of(context).textTheme.headlineMedium,
                              ),
                              SizedBox(height: 30),
                              Text(
                                'Desde su fundación hace más de 30 años, Mueblería Troncoso ha estado comprometida con ofrecer muebles de alta calidad y diseño innovador. Con un enfoque en la sostenibilidad y la integridad, nos esforzamos por brindar productos duraderos y personalizados que embellecen cada hogar. Valoramos el servicio al cliente y la responsabilidad social, contribuyendo activamente a nuestras comunidades. En Troncoso, cada pieza refleja nuestra pasión por la excelencia y el respeto por el medio ambiente.',
                                style: TextStyle(
                                  fontSize: 20,
                                  color: Colors.black),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                SingleChildScrollView(
                    child: Column(
                      children: [
                        SizedBox(height: 100),
                        Container(
                          padding: EdgeInsets.all(20),
                          margin: EdgeInsets.symmetric(horizontal: 30),
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(25),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black12,
                                blurRadius: 15,
                                offset: Offset(0, 5),
                              ),
                            ],
                          ),
                          child: Column(
                            children: [
                              SizedBox(height: 10),
                              SafeArea(
                                child: Container(
                                  width: 150,
                                  height: 150,
                                  decoration: BoxDecoration(
                                    image: DecorationImage(
                                      image: AssetImage(
                                          'assets/imagenes/prb-logo.png'),
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                              ),
                              Text(
                                'Misión',
                                style: Theme.of(context).textTheme.headlineMedium,
                              ),
                              SizedBox(height: 30),
                              Text(
                                'Diseñar, fabricar y comercializar muebles que satisfagan las necesidades y expectativas de nuestros clientes, proporcionando soluciones personalizadas y de alta calidad. Nos esforzamos por ser líderes en el mercado, ofreciendo productos innovadores y duraderos que se adapten a diversos estilos de vida y preferencias, todo ello con un servicio excepcional.',
                                style: TextStyle(
                                  fontSize: 20,
                                  color: Colors.black),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                SingleChildScrollView(
                    child: Column(
                      children: [
                        SizedBox(height: 100),
                        Container(
                          padding: EdgeInsets.all(20),
                          margin: EdgeInsets.symmetric(horizontal: 30),
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(25),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black12,
                                blurRadius: 15,
                                offset: Offset(0, 5),
                              ),
                            ],
                          ),
                          child: Column(
                            children: [
                              SizedBox(height: 10),
                              SafeArea(
                                child: Container(
                                  width: 150,
                                  height: 150,
                                  decoration: BoxDecoration(
                                    image: DecorationImage(
                                      image: AssetImage(
                                          'assets/imagenes/prb-logo.png'),
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                              ),
                              Text(
                                'Visión',
                                style: Theme.of(context).textTheme.headlineMedium,
                              ),
                              SizedBox(height: 30),
                              Text(
                                'Ser reconocidos como una empresa líder en el sector del mobiliario a nivel nacional, destacándonos por la calidad de nuestros productos, la innovación en nuestros diseños y el compromiso con la satisfacción del cliente. Aspiramos a crecer de manera sostenible, expandiendo nuestra presencia en nuevos mercados y contribuyendo al bienestar de las comunidades donde operamos.',
                                style: TextStyle(
                                  fontSize: 20,
                                  color: Colors.black),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                SingleChildScrollView(
                    child: Column(
                      children: [
                        SizedBox(height: 100),
                        Container(
                          padding: EdgeInsets.all(20),
                          margin: EdgeInsets.symmetric(horizontal: 30),
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(25),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black12,
                                blurRadius: 15,
                                offset: Offset(0, 5),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              SizedBox(height: 10),
                              SafeArea(
                                child: Container(
                                  width: 150,
                                  height: 150,
                                  decoration: BoxDecoration(
                                    image: DecorationImage(
                                      image: AssetImage(
                                          'assets/imagenes/prb-logo.png'),
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                              ),
                              Text(
                                'Valores',
                                style: Theme.of(context).textTheme.headlineMedium,
                              ),
                              SizedBox(height: 30),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text.rich(
                                    TextSpan(
                                      children: [
                                        TextSpan(
                                          text: 'Calidad: ',
                                          style: TextStyle(
                                              fontWeight: FontWeight.bold),
                                        ),
                                        TextSpan(
                                            text:
                                                'Nos comprometemos a ofrecer productos de la más alta calidad, utilizando materiales duraderos y técnicas de fabricación avanzadas.'),
                                      ],
                                    ),
                                  ),
                                  SizedBox(height: 10),
                                  Text.rich(
                                    TextSpan(
                                      children: [
                                        TextSpan(
                                          text: 'Innovación: ',
                                          style: TextStyle(
                                              fontWeight: FontWeight.bold),
                                        ),
                                        TextSpan(
                                            text:
                                                'Fomentamos la creatividad y la innovación en todos los aspectos de nuestro negocio para ofrecer diseños únicos y funcionales.'),
                                      ],
                                    ),
                                  ),
                                  SizedBox(height: 10),
                                  Text.rich(
                                    TextSpan(
                                      children: [
                                        TextSpan(
                                          text: 'Sostenibilidad: ',
                                          style: TextStyle(
                                              fontWeight: FontWeight.bold),
                                        ),
                                        TextSpan(
                                            text:
                                                'Nos preocupamos por el medio ambiente y adoptamos prácticas sostenibles en todos nuestros procesos, desde la selección de materiales hasta la producción y distribución.'),
                                      ],
                                    ),
                                  ),
                                  SizedBox(height: 10),
                                  Text.rich(
                                    TextSpan(
                                      children: [
                                        TextSpan(
                                          text: 'Integridad: ',
                                          style: TextStyle(
                                              fontWeight: FontWeight.bold),
                                        ),
                                        TextSpan(
                                            text:
                                                'Actuamos con honestidad y transparencia, asegurando la confianza de nuestros clientes, empleados y socios en todas nuestras relaciones comerciales.'),
                                      ],
                                    ),
                                  ),
                                  SizedBox(height: 10),
                                  Text.rich(
                                    TextSpan(
                                      children: [
                                        TextSpan(
                                          text: 'Servicio al Cliente: ',
                                          style: TextStyle(
                                              fontWeight: FontWeight.bold),
                                        ),
                                        TextSpan(
                                            text:
                                                'Nos esforzamos por superar las expectativas de nuestros clientes, ofreciendo un servicio personalizado y soluciones a medida.'),
                                      ],
                                    ),
                                  ),
                                  SizedBox(height: 10),
                                  Text.rich(
                                    TextSpan(
                                      children: [
                                        TextSpan(
                                          text: 'Trabajo en Equipo: ',
                                          style: TextStyle(
                                              fontWeight: FontWeight.bold),
                                        ),
                                        TextSpan(
                                            text:
                                                'Valoramos el talento y la diversidad de nuestro equipo, fomentando un ambiente de colaboración y respeto mutuo.'),
                                      ],
                                    ),
                                  ),
                                  SizedBox(height: 10),
                                  Text.rich(
                                    TextSpan(
                                      children: [
                                        TextSpan(
                                          text: 'Responsabilidad Social: ',
                                          style: TextStyle(
                                              fontWeight: FontWeight.bold),
                                        ),
                                        TextSpan(
                                            text:
                                                'Contribuimos al desarrollo de las comunidades donde operamos, apoyando iniciativas sociales y culturales.'),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }
}
