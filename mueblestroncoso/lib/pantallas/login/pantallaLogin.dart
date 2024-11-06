import 'package:flutter/material.dart';
import 'package:mueblestroncoso/pantallas/login/pantallaRegistro.dart';
import 'package:mueblestroncoso/services/servicioUsuario.dart';

class PantallaLogin extends StatefulWidget {
  const PantallaLogin({Key? key}) : super(key: key);

  @override
  PantallaLoginState createState() => PantallaLoginState();
}

class PantallaLoginState extends State<PantallaLogin> {
  final correoController = TextEditingController();
  final contraseniaController = TextEditingController();
  final ServicioLogin servicioUsuario = ServicioLogin();

  void irAPantallaRegistro(BuildContext context) {
    Navigator.push(context,MaterialPageRoute(builder: (_) => PantallaRegistro()),);
  }

  void login() async {
    try {
      final usuario = await servicioUsuario.login(
        correoController.text,
        contraseniaController.text,
      );

      if (usuario != null) {
        Navigator.pushReplacementNamed(context, 'home');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('${e}')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        child: Stack(
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
            SingleChildScrollView(
              child: Column(
                children: [
                  SizedBox(height: 100),
                  Container(
                    padding: EdgeInsets.all(20),
                    margin: EdgeInsets.symmetric(horizontal: 30),
                    width: double.infinity,
                    height: 600,
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
                                image: AssetImage('assets/imagenes/prb-logo.png'),
                                fit: BoxFit.cover,
                              ),
                            ),
                          ),
                        ),
                        Text('Inicia Sesión',style: Theme.of(context).textTheme.headlineMedium,),
                        SizedBox(height: 30),
                        Form(
                          child: Column(
                            children: [
                              TextFormField(
                                controller: correoController,
                                keyboardType: TextInputType.emailAddress,
                                autocorrect: false,
                                decoration: InputDecoration(
                                  enabledBorder: UnderlineInputBorder(
                                    borderSide: BorderSide(color: Colors.black),
                                  ),
                                  focusedBorder: UnderlineInputBorder(
                                    borderSide: BorderSide(color: Colors.black, width: 2),
                                  ),
                                  hintText: 'mueblestroncoso@gmail.com',
                                  labelText: 'Correo',
                                  helperText: "Escribe tu correo",
                                  prefixIcon: Icon(Icons.email),
                                ),
                              ),
                              SizedBox(height: 10),
                              TextFormField(
                                controller: contraseniaController,
                                autocorrect: false,
                                obscureText: true,
                                decoration: InputDecoration(
                                  enabledBorder: UnderlineInputBorder(
                                    borderSide: BorderSide(color: Colors.black),
                                  ),
                                  focusedBorder: UnderlineInputBorder(
                                    borderSide: BorderSide(color: Colors.black, width: 2),
                                  ),
                                  hintText: '******',
                                  labelText: 'Contraseña',
                                  helperText: "Escribe tu contraseña",
                                  prefixIcon: Icon(Icons.lock_outline),
                                ),
                              ),
                              SizedBox(height: 10),
                              MaterialButton(
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.zero,
                                ),
                                disabledColor: Colors.grey,
                                onPressed: login,
                                color: Colors.black,
                                child: Container(
                                  padding: EdgeInsets.symmetric(horizontal: 80, vertical: 5),
                                  child: Text("ENTRAR", style: TextStyle(color: Colors.white)),
                                ),
                              ),
                              SizedBox(height: 20),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text('¿No tienes cuenta?',style: TextStyle(fontSize: 13),),
                                  SizedBox(width: 8),
                                  InkWell(
                                    onTap: () {
                                      irAPantallaRegistro(context);
                                    },
                                    child: Text('Regístrate',style: TextStyle(fontSize: 13,color: Colors.black, decoration: TextDecoration.underline,),
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
            ),
          ],
        ),
      ),
    );
  }
}
