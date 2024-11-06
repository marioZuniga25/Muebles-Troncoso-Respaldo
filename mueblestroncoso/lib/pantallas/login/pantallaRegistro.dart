import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mueblestroncoso/services/servicioUsuario.dart';

class PantallaRegistro extends StatefulWidget {
  const PantallaRegistro({Key? key}) : super(key: key);

  @override
  PantallaRegistroState createState() => PantallaRegistroState();
}

class PantallaRegistroState extends State<PantallaRegistro> {
  final correoController = TextEditingController();
  final usuarioController = TextEditingController();
  final contraseniaController = TextEditingController();
  final confirmarContraseniaController = TextEditingController();
  final ServicioLogin servicioUsuario = ServicioLogin();

  void registrarUsuario() async {
  if (correoController.text.isEmpty ||
      usuarioController.text.isEmpty ||
      contraseniaController.text.isEmpty ||
      confirmarContraseniaController.text.isEmpty) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Por favor, complete el formulario'), backgroundColor: Colors.red,),
    );
    return;
  }
  if (contraseniaController.text != confirmarContraseniaController.text) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Las contraseñas no coinciden'),backgroundColor: Colors.red,),
    );
    return;
  }

  try {
    final usuario = await servicioUsuario.registrarUsuario(
      correoController.text,
      usuarioController.text,
      contraseniaController.text,
    );

    if (usuario == null) {      
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Se ha registrado tu cuenta exitosamente!'), backgroundColor: Colors.green,),
    );
    }
  } catch (e) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Error al vrear la cuenta'), backgroundColor: Colors.red,),
    );
  }
}



  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
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
                    height: 800,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(25),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black12,
                          blurRadius: 15,
                          offset: Offset(0, 5),
                        )                      
                      ]
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
                        Text('Registrate', style:  Theme.of(context).textTheme.headlineMedium),
                        SizedBox(height: 30),
                        Container(
                          child: Form(
                            child: Column(
                              children: [
                                TextFormField(
                                  controller: correoController,
                                  autocorrect: false,
                                  decoration: InputDecoration(
                                    enabledBorder: UnderlineInputBorder(
                                      borderSide: BorderSide(color: Colors.black)
                                    ),
                                    focusedBorder: UnderlineInputBorder(
                                      borderSide: BorderSide(
                                        color: Colors.black, width: 2
                                      )
                                    ),
                                    hintText: 'mueblestroncoso@gmail.com',
                                    labelText: 'Correo',
                                    helperText: "Escribe tu correo",
                                    prefixIcon: Icon(Icons.email),                                  
                                  ),
                                ),
                                SizedBox(height: 10),
                                TextFormField(
                                  controller: usuarioController,
                                  autocorrect: false,
                                  decoration: InputDecoration(
                                    enabledBorder: UnderlineInputBorder(
                                      borderSide: BorderSide(color: Colors.black)
                                    ),
                                    focusedBorder: UnderlineInputBorder(
                                      borderSide: BorderSide(
                                        color: Colors.black, width: 2
                                      )
                                    ),
                                    hintText: 'Usuario53#!',
                                    labelText: 'Usuario',
                                    helperText: "Escribe tu usuario",
                                    prefixIcon: Icon(Icons.people),
                                  )
                                ),
                                SizedBox(height: 10),
                                TextFormField(
                                  controller: contraseniaController,
                                  autocorrect: false,
                                  obscureText: true,
                                  decoration: InputDecoration(
                                    enabledBorder: UnderlineInputBorder(
                                      borderSide: BorderSide(color: Colors.black)
                                    ),
                                    focusedBorder: UnderlineInputBorder(
                                      borderSide: BorderSide(
                                        color: Colors.black, width: 2
                                      )
                                    ),
                                    hintText: '******',
                                    labelText: 'Contraseña',
                                    helperText: "Escribe tu contraseña",
                                    prefixIcon: Icon(Icons.lock_outline),
                                  )
                                ),
                                SizedBox(height: 10),
                                TextFormField(
                                  controller: confirmarContraseniaController,
                                  autocorrect: false,
                                  obscureText: true,
                                  decoration: InputDecoration(
                                    enabledBorder: UnderlineInputBorder(
                                      borderSide: BorderSide(color: Colors.black)
                                    ),
                                    focusedBorder: UnderlineInputBorder(
                                      borderSide: BorderSide(
                                        color: Colors.black, width: 2
                                      )
                                    ),
                                    hintText: '******',
                                    labelText: 'Confirmar Contraseña',
                                    helperText: "Confirma tu contraseña",
                                    prefixIcon: Icon(Icons.lock_outline),
                                  )
                                ),
                                SizedBox(height: 10),
                                MaterialButton(
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.zero,
                                  ),
                                  disabledColor: Colors.grey, 
                                  onPressed: registrarUsuario,
                                  color: Colors.black,
                                  child: Container(
                                    padding: EdgeInsets.symmetric(horizontal: 80, vertical: 5),
                                    child: Text("REGISTRAR", style: TextStyle(color: Colors.white),),
                                  ),
                                ), 
                                SizedBox(height: 20),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text('¿Ya tienes cuenta?',style: TextStyle(fontSize: 13),),
                                    SizedBox(width: 8),
                                    InkWell(
                                      onTap: () {
                                        Navigator.pop(context);
                                      },
                                      child: Text('Identificate',style: TextStyle(fontSize: 13,color: Colors.black, decoration: TextDecoration.underline,),),
                                    ),
                                  ],
                                ),                      
                              ],
                            ),
                          ),
                        )                    
                      ],
                    )
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