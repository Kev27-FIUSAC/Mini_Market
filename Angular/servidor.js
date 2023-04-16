var express = require('express');
var cors = require('cors');
var app = express();
var morgan = require('morgan');
var multipart = require('connect-multiparty');
var nodemailer = require('nodemailer');
var bodyparser = require('body-parser');
var oracledb = require('oracledb');
var nodemailer = require('nodemailer');
var sesion = require(__dirname+'/src/sesion.js');
var insert = require(__dirname+'/src/insertu.js');
var perfil = require(__dirname+'/src/userdate.js');
var insertproduct = require(__dirname+'/src/producto.js');
var getproductos = require(__dirname+'/src/idnomproduct.js');
var Buffer = require('buffer').Buffer;
var path = require('path');
var fs = require('fs');
oracledb.fetchAsString = [oracledb.CLOB];

var aplicacion;

var multiPartMiddleware = multipart({
    uploadDir: __dirname+'/src/carga'
});

oracledb.autoCommit = true;
app.use(cors());
app.use(morgan('combined'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin','*');
    next();
});

aplicacion = express.Router();


var datos = new Object();
datos["nombre"] = -1;
datos["apellido"] = -1;
datos["password"] = -1;
datos["correo"] = -1;
datos["telefono"] = -1;
datos["genero"] = -1;
datos["fecha"] = -1;
datos["direccion"] = -1;

var configuracion = {
    "user": "PROYECTO2",
    "password": "p2123",
    "connectString": "(DESCRIPTION=(LOAD_BALANCE = ON)(FAILOVER=ON)(ADDRESS =(PROTOCOL=TCP)(HOST=localhost)(PORT=1521))(ADDRESS=(PROTOCOL=TCP) (HOST=localhost)(PORT=1521))(CONNECT_DATE=(SERVICE_NAME=XE)(FAILOVER_MODE=(TYPE=SELECT)(METHOD=BASIC))))"
};

aplicacion.post('/acceso',sesion.post);
aplicacion.post('/newuser',insert.post);
aplicacion.post('/setproducto',insertproduct.post);
aplicacion.post('/getproductos', getproductos.post);

app.get('/',(req,res) => {
    res.send([{message: 'Hola mundo'}]);
});

/* Demo de base64 */
app.get('/demobase64',(req,res) => {
    "use strict";
    fs.readFile(path.join(__dirname,'/src/','img/pop.png'),function(error,data){
        if(error){
            res.set('Content-Type','application/json');
            res.status(401).send(JSON.stringify({
                status: 401,
                mensaje: error
            }));
            return;
        }else{
            let buf = Buffer.from(data);
            let base64 = buf.toString('base64');
            res.set('Content-Type','application/json');
            res.status(200).send(JSON.stringify({
                result: base64
            }));
            return;
        }
    });
});

app.use('/alie',aplicacion);

app.get('/datos',function(req,res){
    "use strict";

    oracledb.getConnection(configuracion, function(err, connection){
        if(err){
            //Error 
             console.log(datos.nombre);
            res.set('Content-Type','application/json');
            res.status(401).send(JSON.stringify(datos));
            return;
        }
        console.log(req.body);
        connection.execute('SELECT nombre as "nombre",'+
        '    apellidos as "apellido",'+
        '    contrasena as "password",'+
        '    correo as "correo",',+
        '    telefono as "telefono",'+
        '    genero as "genero",'+
        '    fecha as "fecha",'+
        '    direccion as "direccion"'+
        '    FROM usuario'+
        '    WHERE nombre = :nombre',
        {
            nombre: req.body.nombre  
        },
        {
            outFormat: oracledb.OBJECT
        },
        function(error,result) {
            if(error){

            }else{
                if(result.rows.length != 0){
                    datos = result.rows[0];
                }
                res.contentType('application/json').status(200).json({                          
                    result: datos
                });
            }
        });
     /*   connection.execute('SELECT nombre as "nombre",'+
                           '    apellidos as "apellido",'+
                           '    contrasena as "password",'+
                           '    correo as "correo",',+
                           '    telefono as "telefono",'+
                           '    genero as "genero",'+
                           '    fecha as "fecha",'+
                           '    direccion as "direccion"'+
                           '    FROM usuario'+
                           '    WHERE nombre = :nombre',
                           {
                               nombre: req.body.nombre
                           },
                           {
                                outFormat: oracledb.OBJECT
                           },
                           function(err,result){
                                if(err){
                                    res.set('Content-Type','application/json');
                                    res.status(500).send(JSON.stringify(datos));

                                }else{
                                    if(result.rows.length != 0){
                                        datos = result.rows[0];
                                    }
                                 //   res.header('Access-Control-Allow-Origin','*');
                                 //   res.header('Access-Control-Allow-Headers','Content-Type');
                                    res.contentType('application/json').status(200).json({                          
                                        result: datos
                                    });

                                }
                                connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });
                           }); */
    });


});

/* Nuevo usuario, admo 
    begin   insertaruser(:rol,:nombre,:apellido,:contrasena,:correo,:telefono,:genero,:fotografia,:fechanacimiento,:fecharegistro,:direccion,:creditodisponible,:gananciaobtenida,:clasecliente,:estado);   end;'
*/
app.post('/setUseradmo',function(req,res){
    console.log("------SET USER ADMO----");
    console.log(req.body);
    "use strict"
    oracledb.getConnection(configuracion, function(err, connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }
        connection.execute(' begin   insertaruser(:rol,:nombre,:apellido,:contrasena,:correo,:telefono,:genero,:fotografia,:fechanacimiento,:fecharegistro,:direccion,:creditodisponible,:gananciaobtenida,:clasecliente,:estado);   end;',
            {
                rol: req.body.rol,
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                contrasena: req.body.contrasena,
                correo: req.body.correo,
                telefono: req.body.telefono,
                genero: req.body.genero,
                fotografia: req.body.fotografia,
                fechanacimiento: req.body.fechanacimiento,
                fecharegistro: req.body.fecharegistro,
                direccion: req.body.direccion,
                creditodisponible: req.body.creditodisponible,
                gananciaobtenida: req.body.gananciaobtenida,
                clasecliente: req.body.clasecliente,
                estado: req.body.estado
            },
            {
                outFormat: oracledb.OBJECT
            },
            function(err,result){
                if(err){
                    res.set('Content-Type','application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "Error en insertar bitacora",
                        detailed_message: err.message
                    }));
                }else{

                    //Enviar correo de confirmacion 
                    var transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: 'alie.sells22020mia@gmail.com',
                            pass: 'nuevoss2020kvmaD@'
                        }
                    });
                    var mailoptions = {
                        from: 'alie.sells22020mia@gmail.com',
                        to: req.body.correo,
                        subject: 'Bienvenido a Alie-Sell',
                        text: 'Completar registro',
                        html: '<center><h1>Bienvenido a Alie-Sell</h1><<p>para completar su registro debe de validar su cuenta, por favor presione el link para completar el registro</p><a href="http://localhost:4200/validar/'+req.body.correo+'">Validar Cuenta</a></center>'
                    };

                    transporter.sendMail(mailoptions,function(error,info){
                        console.log('Respuesta del correo');
                        if(error){
                            console.log('Error ', error);
                        }else{
                            console.log('Correo enviado: ',info.response);
                        }
                    });

                    res.header('Access-Control-Allow-Origin','*');
                    res.header('Access-Control-Allow-Headers','Content-Type');
                    res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                    res.contentType('application/json').status(200).json({
                        result: 'Ok'
                    });

                }
                connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });

            });
    });
});

/* Bitacora de actualizar */
app.post('/setBitacora',function(req,res){
        "use strict"
    oracledb.getConnection(configuracion, function(err, connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }
        console.log(req.body);
        connection.execute('INSERT INTO bitacora VALUES(0,:clave,:fecha,:accion)',
            {
                clave: req.body.clave,
                fecha: req.body.fecha, 
                accion: req.body.accion
            },
            {
                outFormat: oracledb.OBJECT
            },
            function(err,result){
                if(err){
                    res.set('Content-Type','application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "Error en insertar bitacora",
                        detailed_message: err.message
                    }));
                }else{
                    res.header('Access-Control-Allow-Origin','*');
                    res.header('Access-Control-Allow-Headers','Content-Type');
                    res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                    res.contentType('application/json').status(200).json({
                        result: 'Ok'
                    });

                }
                connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });

            });
    });
});
/*  Bitacora, tabla  */
app.post('/getBitacora',function(req,res){
            "use strict"
    oracledb.getConnection(configuracion, function(err, connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }
        console.log(req.body);
        connection.execute('SELECT b.idbitacora as "correlativo", u.clave as "clave", CONCAT(CONCAT(u.nombre,\' \'),u.apellido) as "cliente", TO_CHAR(b.fecha,\'DD/MM/YYYY\') as "fecha", b.accion as "accion"'+
            ' from bitacora b'+
            ' INNER JOIN usuario u'+
            ' ON u.clave = b.codigo'+
            ' ORDER BY b.fecha',
            {

            },
            {
                outFormat: oracledb.OBJECT
            },
            function(err,result){
                if(err){
                    res.set('Content-Type','application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "Error en insertar bitacora",
                        detailed_message: err.message
                    }));
                }else{
                    res.header('Access-Control-Allow-Origin','*');
                    res.header('Access-Control-Allow-Headers','Content-Type');
                    res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                    res.contentType('application/json').status(200).json({
                        result: result.rows
                    });

                }
                connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });

            });
    });
});


/*Validar una cuenta */
app.post('/validate',function(req,res){
        "use strict";
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
                    res.set('Content-Type','application/json');
                    res.status(400).send(JSON.stringify({
                        status: 400,
                        message: "Error de conexion",
                        detailed_message:err.message
                    }));
            return;
        }else{
            connection.execute('UPDATE usuario set estado = 1 where correo = :correo',
            {
                correo: req.body.correo
            },
            {
                outFormat: oracledb.OBJECT
            },
            function(err,result){
                if(err){
                    res.set('Content-Type','application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "Error en obtener producto",
                        detailed_message: err.message
                    }));
                }else{
                    res.header('Access-Control-Allow-Origin','*');
                    res.header('Access-Control-Allow-Headers','Content-Type');
                    res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                    res.contentType('application/json').status(200).json({
                        result: 'Ok'
                    });
                }
                 //Release the connection
                connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });
            });
        }
    });
});


/* Elimina un usuario en la base de datos */
app.post('/deleteuser',function(req,res){
    "use strict"
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }
        console.log(req.body);
        connection.execute('DELETE FROM usuario WHERE clave = :id',
            {
                id: req.body.clave
            },
            {
                outFormat: oracledb.OBJECT
            },
            function(error,result){
                if(error){
                    res.set('Content-Type','application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "Error en obtener la tabla",
                        detailed_message: err.message
                    }));
                }else{
                    res.header('Access-Control-Allow-Origin','*');
                    res.header('Access-Control-Allow-Headers','Content-Type');
                    res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                    res.contentType('application/json').status(200).json({
                        result: 'Si'
                    });
                }
                connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });
            });
    });
});

/*insertar producto individual */
app.post('/setProductoI',multiPartMiddleware,function(req,res){
    "use strict";
    req.body.imagen = req.files.imagen.path;
    req.body.clave = parseInt(req.body.clave);
    req.body.cantidad = parseInt(req.body.cantidad);
    req.body.codigo = parseInt(req.body.codigo);
    req.body.precio = parseFloat(req.body.precio);
    console.log(req.body);

        oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('begin insertarmanualproducto(:clave,:codigo,:nombre,:precio,:categoria,:imagen,:color,:cantidad,:descripcion); end;',
            {
                clave: req.body.clave,
                codigo: req.body.codigo,
                nombre: req.body.nombre,
                categoria: req.body.categoria,
                precio: req.body.precio,
                cantidad: req.body.cantidad,
                color: req.body.color,
                imagen: req.body.imagen,
                descripcion: req.body.descripcion
            },
            {
                outFormat: oracledb.OBJECT
            },
            function(error,result){
                if(error){
                    res.set('Content-Type','application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "Error, no se puede insertar usuario",
                        detailed_message: err.message
                    }));
                }else{

                    res.header('Access-Control-Allow-Origin','*');
                    res.header('Access-Control-Allow-Headers','Content-Type');
                    res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                    res.contentType('application/json').status(200).json({
                        result: 'Ok'
                    });
                }
                connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });
            });
        }
    });
});

/* inserta un nuevo usuario en la base de datos */
app.post('/insertarUser',multiPartMiddleware,function(req,res){
    "use strict";
    req.body.fotografia = req.files.fotografia.path;
    req.body.estado = parseInt(req.body.estado);
    req.body.creditodisponible = parseFloat(req.body.creditodisponible);
    console.log(req.body);

    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('begin insertaruser(:rol,:nombre,:apellido,:contrasena,:correo,:telefono,:genero,:fotografia,:fechanacimiento,:fecharegistro,:direccion,:creditodisponible,:gananciaobtenida,:clasecliente,:estado); end;',
            {
                rol: req.body.rol,
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                contrasena: req.body.contrasena,
                correo: req.body.correo,
                telefono: req.body.telefono,
                genero: req.body.genero,
                fotografia: req.body.fotografia,
                fechanacimiento: req.body.fechanacimiento,
                fecharegistro: req.body.fecharegistro,
                direccion: req.body.direccion,
                creditodisponible: req.body.creditodisponible,
                gananciaobtenida: 0,
                clasecliente: req.body.clasecliente,
                estado: req.body.estado
            },
            {
                outFormat: oracledb.OBJECT
            },
            function(error,result){
                if(error){
                    res.set('Content-Type','application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "Error, no se puede insertar usuario",
                        detailed_message: err.message
                    }));
                }else{
                    //Enviar correo de confirmacion
                    var transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: 'alie.sells22020mia@gmail.com',
                            pass: 'nuevoss2020kvmaD@'
                        }
                    });
                    var mailoptions = {
                        from: 'alie.sells22020mia@gmail.com',
                        to: req.body.correo,
                        subject: 'Bienvenido a Alie-Sell',
                        text: 'Completar registro',
                        html: '<p> Bienvenido a Alie-Sell<br/>para completar su registro debe de validar su cuenta, por favor presione el link para completar el registro</p><a href="http://localhost:4200/validar/'+req.body.correo+'">VALIDAR CUENTA</a>'
                    };

                    transporter.sendMail(mailoptions,function(error,info){
                        console.log('Respuesta del correo');
                        if(error){
                            console.log('Error ', error);
                        }else{
                            console.log('Correo enviado: ',info.response);
                        }
                    });

                    res.header('Access-Control-Allow-Origin','*');
                    res.header('Access-Control-Allow-Headers','Content-Type');
                    res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                    res.contentType('application/json').status(200).json({
                        result: 'Ok'
                    });
                }
                connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });
            });
        }
    });

  /*  oracledb.getConnection(configuracion,function(err, connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }
        const{rol,nombre,apellido,contrasena,correo,telefono,fotografia,genero,fechanacimiento,fecharegistro,direccion,creditodisponible,gananciaobtenida,clasecliente,estado} = req.body;
        //console.log(req.body);
        // INSERT INTO usuario VALUES(0,'rol',nombre','apellido',contrasena','correo','telefono','genero','fecha_nacimiento','fecha_registro','direccion','credito_disponible','ganancia_obtenida',clase_cliente','estado');
      //  connection.execute('INSERT INTO usuario VALUES(0,:rol,:nombre,:apellido,:contrasena,:correo,:telefono,:genero,:fecha,:fechar,:direccion,:cd,:go,:cl,:estado)',
            connection.execute('BEGIN insertaruser(:rol,:nombre,:apellido,:contrasena,:correo,:telefono,:fotografia,:genero,:fechanacimiento,:fecharegistro,:direccion,:creditodisponible,:gananciaobtenida,:clasecliente,:estado) END;',
            {
               /* rol: req.body.rol,
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                contrasena: req.body.contrasena,
                correo: req.body.correo,
                telefono: req.body.telefono,
                fotografia: req.body.fotografia,
                genero: req.body.genero,
                fecha: req.body.fechanacimiento,
                fechar: req.body.fecharegistro,
                direccion: req.body.direccion,
                cd: req.body.creditodisponible,
                go: req.body.gananciaobtenida,
                cl: req.body.clasecliente,
                estado: req.body.estado 
                rol,nombre,apellido,contrasena,correo,telefono,fotografia,genero,fechanacimiento,fecharegistro,direccion,creditodisponible,gananciaobtenida,clasecliente,estado
            },
            {
                outFormat: oracledb.OBJECT
            },
            function(err,result){
                if(err){
                    res.set('Content-Type','application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "Error, no se puede insertar usuario",
                        detailed_message: err.message
                    }));
                }else{
                    res.header('Access-Control-Allow-Origin','*');
                    res.header('Access-Control-Allow-Headers','Content-Type');
                    res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                    res.contentType('application/json').status(200).json({
                        result: 'Ok'
                    });
                    //Enviar correo de confirmacion
                    //Enviar correo de confirmacion 
                    var transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: 'alie.sells22020mia@gmail.com',
                            pass: 'aliess22020kvmAd@'
                        }
                    });
                    var mailoptions = {
                        from: 'alie.sells22020mia@gmail.com',
                        to: correo,
                        subject: 'Bienvenido a Alie-Sell',
                        text: 'Completar registro',
                        html: '<p> Bienvenido a Alie-Sell<br/>para completar su registro debe de validar su cuenta, por favor presione el link para completar el registro</p>'
                    };

                    transporter.sendMail(mailoptions,function(error,info){
                        console.log('Respuesta del correo');
                        if(error){
                            console.log('Error ', error);
                        }else{
                            console.log('Correo enviado: ',info.response);
                        }
                    });
                }
                connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });

            });
    }); */
});

/*Actualiza la foto de perfil del usuario*/
app.post('/updatepictureuser',multiPartMiddleware,function(req,res){
    req.body.foto = req.files.foto.path;
    req.body.clave = parseInt(req.body.clave);
        "use strict"
    oracledb.getConnection(configuracion, function(err, connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }
        console.log(req.body);
        connection.execute('UPDATE usuario SET fotografia = :foto'+
            ' WHERE clave = :clave',
            {
                clave: req.body.clave,
                foto: req.body.foto
            },
            {
                outFormat: oracledb.OBJECT
            },
            function(err,result){
                if(err){
                    res.set('Content-Type','application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "Error en obtener actualizar la foto",
                        detailed_message: err.message
                    }));
                }else{
                    res.header('Access-Control-Allow-Origin','*');
                    res.header('Access-Control-Allow-Headers','Content-Type');
                    res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                    res.contentType('application/json').status(200).json({
                        result: 'Ok'
                    });

                }
                connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });

            });
    });

});

/*Actualiza los datos de un usuario */
app.post('/update_user',function(req,res){
    "use strict"
    oracledb.getConnection(configuracion, function(err, connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }
        console.log(req.body);
        connection.execute('UPDATE usuario SET nombre = :nombre, apellido = :apellido , contrasena = :contrasena, correo = :correo, fecha_nacimiento = :fecha, genero = :sexo, telefono = :telefono, direccion = :direccion WHERE clave = :clave',
            {
                clave: req.body.clave,
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                contrasena: req.body.contrasena,
                correo: req.body.correo,
                fecha: req.body.fecha, 
                sexo: req.body.sexo,
                telefono: req.body.telefono,
                direccion: req.body.direccion,
            },
            {
                outFormat: oracledb.OBJECT
            },
            function(err,result){
                if(err){
                    res.set('Content-Type','application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "Error en obtener la tabla",
                        detailed_message: err.message
                    }));
                }else{
                    res.header('Access-Control-Allow-Origin','*');
                    res.header('Access-Control-Allow-Headers','Content-Type');
                    res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                    res.contentType('application/json').status(200).json({
                        result: 'Ok'
                    });

                }
                connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });

            });
    });
});

app.post('/update_page',function(req,res){
    "use strict";
    oracledb.getConnection(configuracion, function(err, connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }
        console.log(req.body);
        connection.execute('UPDATE pagina SET mision = :mision, vision = :vision, servicio = :servicio, nosotros = :nosotro WHERE id = 1',
            {
                mision: req.body.mision,
                vision: req.body.vision,
                servicio: req.body.servicio,
                nosotro: req.body.nosotro
            },
            {
                outFormat: oracledb.OBJECT
            },
            function(err, result){
                if(err){
                    res.set('Content-Type','application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "Error en obtener la tabla",
                        detailed_message: err.message
                    }));
                }else{
                    res.header('Access-Control-Allow-Origin','*');
                    res.header('Access-Control-Allow-Headers','Content-Type');
                    res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                    res.contentType('application/json').status(200).json({
                        result: 'Ok'
                    });
                }
                connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });
            });
    });
});

/* Obtiene la informacion de la pagina web: mision, vision, servicio, nosotros */
app.post('/get_pagina',function(req,res){
    "use strict";
    oracledb.getConnection(configuracion, function(err, connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }
        console.log(req.body);
        connection.execute('SELECT eslogan as "eslogan", mision as "mision", vision as "vision", servicio as "servicio", nosotros as "nostros" FROM pagina WHERE  id = :idp',{idp: req.body.id},{
            outFormat: oracledb.OBJECT
        },function(err,result){
            if(err){
                res.set('Content-Type','application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: "Error en obtener la tabla pais",
                    detailed_message: err.message
                }));
            }else{
                res.header('Access-Control-Allow-Origin','*');
                res.header('Access-Control-Allow-Headers','Content-Type');
                res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                console.log(result.rows[0]);
                res.contentType('application/json').status(200).json({
                    result: result.rows[0]
                });
              //  res.send(JSON.stringify(result.rows));
            }
            //Release the connection
            connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });
        });
    });
});

/* Obtiene el listado de los usuarios del sistema excepto el amdministrador actual */
app.post('/get_usuarios',function(req,res){
     "use strict";
     oracledb.getConnection(configuracion, function(err, connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }
        console.log(req.body);
        connection.execute('SELECT clave as "value", correo as "viewValue" FROM usuario WHERE clave NOT IN(:clave)',
        {
            clave: req.body.clave
        },
        {
            outFormat: oracledb.OBJECT
        },
        function(err,result){
            if(err){
                res.set('Content-Type','application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: "Error en obtener la tabla",
                    detailed_message: err.message
                }));
            }else{
                res.header('Access-Control-Allow-Origin','*');
                res.header('Access-Control-Allow-Headers','Content-Type');
                res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                console.log(result.rows);
                res.contentType('application/json').status(200).json({
                    result: result.rows
                });
            }
            //Release the connection
            connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });
        });
     });
});

/*Obtener los usuarios para insertarlos en el reporte */
app.post('/getUserTable',function(req,res){
    "use strict";
    oracledb.getConnection(configuracion,function(err, connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }
        console.log(req.body);
        connection.execute('SELECT clave as "ID", rol as "Rol", nombre as "Nombre", apellido as "Apellidos", correo as "Correo", fecha as "Fecha", direccion as "Ubicacion", genero as "Genero", telefono as "Telefono" FROM usuario WHERE clave NOT IN(:idp)',{
            idp: req.body.idp
        },
        {
            outFormat: oracledb.OBJECT
        },
        function(err,result){
            if(err){
                res.set('Content-Type','application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: "Error en obtener la Tabla",
                    detailed_message: err.message
                }));
            }else{
                res.header('Access-Control-Allow-Origin','*');
                res.header('Access-Control-Allow-Headers','Content-Type');
                res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                console.log(result.rows);
                res.contentType('application/json').status(200).json({
                    result: result.rows
                });
            }
            //Release the connection
            connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });
        });
    });
});

/* Insertar un nuevo producto atra vez de la carga*/
app.post('/insertar_producto',function(req,res){
    "use strict";
    oracledb.getConnection(configuracion, function(err, connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }
    connection.execute('begin  insertarproducto(:id,:codigo,:nombre,:precio,:categoria,:imagen,:color,:cantidad);  end;',
    {
        id: req.body.id,
        codigo: req.body.codigo,
        nombre: req.body.nombre,
        precio: req.body.precio,
        categoria: req.body.categoria,
        imagen: req.body.imagen,
        color: req.body.colorp,
        cantidad: req.body.cantidad
    },
    {
        outFormat: oracledb.OBJECT
    },
    function(err,result){
        if(err){
            console.log('No');
                res.set('Content-Type','application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: "Error en isnertar producto",
                    detailed_message: err.message
                }));
                return;
        }else{
                    console.log('Ok');
                    res.header('Access-Control-Allow-Origin','*');
                    res.header('Access-Control-Allow-Headers','Content-Type');
                    res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                    res.contentType('application/json').status(200).json({
                        result: 'Ok'
                    });
                    return;
        }
         //Release the connection
         /*   connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                }); */

    });
    });
});

/* Obtiene los datos del usuario actual */
app.post('/demo',function(req,res){
    "use strict";
    oracledb.getConnection(configuracion, function(err, connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }
        console.log(req.body);
        connection.execute('SELECT nombre as "nombre", apellido as "apellido", contrasena as "password", correo as "correo", TO_CHAR(fecha_nacimiento,\'DD/MM/YYYY\') as "fecha", direccion as "direccion", genero as "genero", telefono as "telefono", rol as "rol", ganacia_obtenida as "ganancia" FROM usuario WHERE clave = :idp',{idp: req.body.clave},{
            outFormat: oracledb.OBJECT
        },function(err,result){
            if(err){
                res.set('Content-Type','application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: "Error en obtener datos usuario",
                    detailed_message: err.message
                }));
            }else{
                res.header('Access-Control-Allow-Origin','*');
                res.header('Access-Control-Allow-Headers','Content-Type');
                res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                console.log(result.rows[0]);
                res.contentType('application/json').status(200).json({
                    result: result.rows[0]
                });
              //  res.send(JSON.stringify(result.rows));
            }
            //Release the connection
            connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });
        });


    });
});

/* Retorna los datos del producto seleccionado */
app.post('/getdatosproducto',function(req,res){
        "use strict";
        oracledb.getConnection(configuracion, function(err,connection){
                if(err){
                    //Error
                    res.set('Content-Type','application/json');
                    res.status(400).send(JSON.stringify({
                        status: 400,
                        message: "Error de conexion",
                        detailed_message:err.message
                    }));
                    return;
                }else{
                    connection.execute('SELECT p.nombre as "producto", CONCAT(CONCAT(u.nombre,\' \'),u.apellido) as "dueño", u.clave as "coduser",dc.color, dc.precio, dc.imagen, dc.cantidad, c.nombre as "categoria",dc.iddetallecatalogo as "correlativo"'+
                    ' FROM producto p, usuario u, detalle_catalogo dc, categoria c  '+
                    ' WHERE dc.iddetallecatalogo = :idp'+
                    ' AND' +
                    ' dc.idcategoria = c.id_categoria'+
                    ' AND'+
                    ' p.idproducto = dc.idproducto'+
                    ' AND '+ 
                    ' dc.clave = u.clave',
                    {
                        idp: req.body.producto
                    },
                    {
                        outFormat: oracledb.OBJECT
                    },
                     function(err,result){
                            if(err){
                                res.set('Content-Type','application/json');
                                res.status(500).send(JSON.stringify({
                                    status: 500,
                                    message: "Error en obtener producto",
                                    detailed_message: err.message
                                }));
                            }else{


                                console.log(result.rows[0]);
                                result.rows[0].PRECIO = Math.round(result.rows[0].PRECIO*100)/100;

                               
                                fs.readFile(path.join(result.rows[0].IMAGEN),function(error,data){
                                        if(error){
                                            res.set('Content-Type','application/json');
                                            res.status(401).send(JSON.stringify({
                                                status: 401,
                                                message: "Error en obtener imagen",
                                                detailed_message: error.message
                                            }));
                                        }else{
                                            let buf = Buffer.from(data);
                                            let base64 = buf.toString('base64');
                                            result.rows[0].IMAGEN = base64;
                                            res.status(200).json({                          
                                                result: result.rows[0]
                                            });
                                        }
                                });

                                 //Release the connection
                            connection.release(
                                function(err){
                                    if(err){
                                        console.error(err.message);
                                    }else{
                                        console.log("POST /sendTablespace: Connection released");
                                    }
                                });

                            }
                           
                    });
                }
        });
});


/* Obtener los productos del cliente correspondiente */
/* SELECT p.nombre as "producto" , dc.iddetallecatalogo as "correlativo"
FROM producto p, detalle_catalogo dc
WHERE
p.idproducto = dc.idproducto
and
dc.clave = :clave; */
app.post('/getmisproductos',function(req,res){
        "use strict";
    oracledb.getConnection(configuracion, function(err, connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }
        console.log(req.body);
        connection.execute('SELECT p.nombre as "producto" , dc.iddetallecatalogo as "correlativo"'+
            ' FROM producto p, detalle_catalogo dc'+
            ' WHERE'+
            ' p.idproducto = dc.idproducto'+
            ' AND'+
            ' dc.clave = :clave',
            {
                clave: req.body.clave
            },
            {
                outFormat: oracledb.OBJECT
            },function(err,result){
            if(err){
                res.set('Content-Type','application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: "Error en obtener datos usuario",
                    detailed_message: err.message
                }));
            }else{
                res.header('Access-Control-Allow-Origin','*');
                res.header('Access-Control-Allow-Headers','Content-Type');
                res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                console.log(result.rows);
                res.contentType('application/json').status(200).json({
                    result: result.rows
                });
              //  res.send(JSON.stringify(result.rows));
            }
            //Release the connection
            connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });
        });
    });
});

/* crud productos, obtiene el producto */
/* SELECT p.nombre as "producto", dc.codigoproducto as "codigo", dc.cantidad as "cantidad", dc.imagen as "imagen", dc.color as "color", dc.precio as "precio", p.descripcion as "descripcion"
FROM producto p, detalle_catalogo dc, categoria c
Where
p.idproducto = dc.idproducto
and
dc.idcategoria = c.id_categoria
and dc.iddetallecatalogo = :producto; */
app.post('/crudobtenerproducto',function(req,res){
            "use strict";
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
                    res.set('Content-Type','application/json');
                    res.status(400).send(JSON.stringify({
                        status: 400,
                        message: "Error de conexion",
                        detailed_message:err.message
                    }));
            return;
        }else{
            connection.execute('SELECT p.nombre as "producto", dc.codigoproducto as "codigo", dc.cantidad as "cantidad", dc.imagen as "imagen", dc.color as "color", dc.precio as "precio", p.descripcion as "descripcion"'+
             ' FROM producto p, detalle_catalogo dc, categoria c',
            {
                producto: req.body.producto
            },
            {
                outFormat: oracledb.OBJECT
            },
            function(err,result){
                if(err){
                    res.set('Content-Type','application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "Error en obtener producto",
                        detailed_message: err.message
                    }));
                }else{
                    res.header('Access-Control-Allow-Origin','*');
                    res.header('Access-Control-Allow-Headers','Content-Type');
                    res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                    res.contentType('application/json').status(200).json({
                        result: result.rows[0]
                    });
                }
                 //Release the connection
                connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });
            });
        }
    });
});

/* actualiza la imagen del producto */
app.post('/actualizarimagenproducto', multiPartMiddleware, (req,res) => {
    req.body.imagen = req.files.imagen.path;
    req.body.catalogo = parseInt(req.body.prodcuto);
    console.log(req.body);
                "use strict";
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
                    res.set('Content-Type','application/json');
                    res.status(400).send(JSON.stringify({
                        status: 400,
                        message: "Error de conexion",
                        detailed_message:err.message
                    }));
            return;
        }else{
            connection.execute('UPDATE detalle_catalogo '+
             ' set imagen = :imagen'+
             ' where iddetallecatalogo = :catalogo',
            {
                catalogo: req.body.catalogo,
                imagen: req.body.imagen
            },
            {
                outFormat: oracledb.OBJECT
            },
            function(err,result){
                if(err){
                    res.set('Content-Type','application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "Error en actualiza imagen",
                        detailed_message: err.message
                    }));
                }else{
                    res.header('Access-Control-Allow-Origin','*');
                    res.header('Access-Control-Allow-Headers','Content-Type');
                    res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                    res.contentType('application/json').status(200).json({
                        result: 'Ok'
                    });
                }
                 //Release the connection
                connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });
            });
        }
    });
});

/*Subir archivo y realizar carga */
app.post('/subirproductos', multiPartMiddleware, (req,res) => {
   // console.log(req.files.file.path);
    console.log(req.files.Archivo.path);
    req.body.clave = parseInt(req.body.clave);
    console.log(req.body);

    /* Enviar la ruta y clave del usuario */
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
                    res.set('Content-Type','application/json');
                    res.status(400).send(JSON.stringify({
                        status: 400,
                        message: "Error de conexion",
                        detailed_message:err.message
                    }));
                    return;
        }else{
            connection.execute('begin ejecutarinsertarproducto(:path,:id); end;',
            {
                id: req.body.clave,
                path: req.files.Archivo.path
            }
            ,
            {
                outFormat: oracledb.OBJECT
            },
            function(err,result){
                if(err){
                    res.set('Content-Type','application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "Error en obtener producto",
                        detailed_message: err.message
                    }));
                }else{
                    console.log('Todos han sido subidos');
                    res.header('Access-Control-Allow-Origin','*');
                    res.header('Access-Control-Allow-Headers','Content-Type');
                    res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                    res.contentType('application/json').status(200).json({
                        result: 'Ok'
                    });
                }
                //Release the connection
                connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });
            }
            );
        }
    }); 


    /*res.json({
        'mensaje': 'Se subio el archivo correctamente'
    }); */
});

/* Obtiene el id y total del carrito del usuario*/
app.post('/getcarrito1',function(req,res){
        "use strict";
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
                    res.set('Content-Type','application/json');
                    res.status(400).send(JSON.stringify({
                        status: 400,
                        message: "Error de conexion",
                        detailed_message:err.message
                    }));
            return;
        }else{
            connection.execute('SELECT idcarrito as "id", total as "total" FROM carrito WHERE clave = :clave',
            {
                clave: req.body.clave
            },
            {
                outFormat: oracledb.OBJECT
            },
            function(err,result){
                if(err){
                    res.set('Content-Type','application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "Error en obtener producto",
                        detailed_message: err.message
                    }));
                }else{
                    res.header('Access-Control-Allow-Origin','*');
                    res.header('Access-Control-Allow-Headers','Content-Type');
                    res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                    res.contentType('application/json').status(200).json({
                        result: result.rows[0]
                    });
                }
                 //Release the connection
                connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });
            });
        }
    });
});

/* Informacion general del carrito y los productos en ellos, detalle_Carrito */
app.post('/getdetallescarro',function(req,res){
    "use strict";
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
             //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('SELECT dc.codigoproducto as "codigo", u.clave as "clave", u.correo as "correo" , CONCAT(CONCAT(u.nombre,\' \'),u.apellido) as "propietario", p.nombre as "producto", car.cantidad as "cantidad", car.precio as "precio", dc.iddetallecatalogo as "idcatalogo"'+
            ' FROM producto p, detalle_catalogo dc, detalle_carrito car, carrito c, usuario u'+
            ' WHERE '+
            ' c.idcarrito = :id'+
            ' AND'+
            ' c.idcarrito = car.idcarrito'+
            ' AND'+
            ' car.dcatalogo = dc.iddetallecatalogo'+
            ' AND'+
            ' p.idproducto = dc.idproducto'+
            ' AND'+
            ' u.clave = dc.clave',
            {
                id: req.body.id
            },
            {
                outFormat: oracledb.OBJECT
            },
            function(err,result){
                if(err){
                    res.set('Content-Type','application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "Error en obtener producto",
                        detailed_message: err.message
                    }));
                }else{
                    console.log(result);
                    res.header('Access-Control-Allow-Origin','*');
                    res.header('Access-Control-Allow-Headers','Content-Type');
                    res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                    res.contentType('application/json').status(200).json({
                        result: result.rows
                    });
                }
                 //Release the connection
                connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });
            });
        }
    });
});

/* Insertar producto al carrito */
app.post('/insertarcarrito',function(req,res){
    "use strict";
    console.log('--------------Insertar carrito -----------------');
    console.log(req.body);
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
             //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('begin anadircarrito(0,0,:clave,:producto,:cantidad,:precio); end;',
            {
                clave: req.body.clave2,
                producto: req.body.producto,
                cantidad: req.body.cantidad,
                precio: req.body.precio
            },
            {
                outFormat: oracledb.OBJECT
            },
            function(error,result){
                if(error){
                    res.set('Content-Type','application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "Error en obtener producto",
                        detailed_message: error.message
                    }));
                }else{
                    res.header('Access-Control-Allow-Origin','*');
                    res.header('Access-Control-Allow-Headers','Content-Type');
                    res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                    res.contentType('application/json').status(200).json({
                        result: 'Ok'
                    });
                }
                 //Release the connection
                connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });
            });
        }
    });
});


/* Busqueda personalizada */
app.post('/buscarproducto',function(req,res){
        console.log('--------- busqueda');
    console.log(req.body);
    "use strict";
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
              //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('SELECT dc.iddetallecatalogo as "id", p.nombre as "producto", CONCAT(CONCAT(u.nombre,\' \'),u.apellido) as "dueño", u.clave as "coduser",dc.color, dc.precio, dc.imagen, dc.cantidad, c.nombre as "categoria"'+
                ' FROM producto p, detalle_catalogo dc, usuario u, categoria c'+
                ' WHERE p.nombre = REGEXP_SUBSTR(:busqueda,\'[^-]+\',1,1)'+
                ' AND dc.color = REGEXP_SUBSTR(:busqueda,\'[^-]+\',1,2)'+
                ' and dc.clave = u.clave'+
                ' and dc.idcategoria = c.id_categoria'+
                ' and p.idproducto = dc.idproducto',{busqueda: req.body.busqueda },{  outFormat: oracledb.OBJECT } ,
                function(error,result){
                    if(error){
                        res.set('Content-Type','application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: "Error en obtener producto",
                            detailed_message: error.message,
                            result: 'No'
                        }));
                    }else{
                        res.header('Access-Control-Allow-Origin','*');
                        res.header('Access-Control-Allow-Headers','Content-Type');
                        res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                        console.log(result.rows);
                        if(result.rows.length != 0){
                            //IMAGEN BASE 64
                            console.log(result.rows[0]);
                                result.rows[0].PRECIO = Math.round(result.rows[0].PRECIO*100)/100;
                                fs.readFile(path.join(result.rows[0].IMAGEN),function(error,data){
                                        if(error){
                                            res.set('Content-Type','application/json');
                                            res.status(401).send(JSON.stringify({
                                                status: 401,
                                                message: "Error en obtener imagen",
                                                detailed_message: error.message
                                            }));
                                        }else{
                                            let buf = Buffer.from(data);
                                            let base64 = buf.toString('base64');
                                            result.rows[0].IMAGEN = base64;
                                            res.contentType('application/json').status(200).json({
                                                result: result.rows[0]
                                            });
                                        }
                                });
                        }else{
                            res.contentType('application/json').status(200).json({
                                result: 'No'
                            });
                        }
                    }
                     //Release the connection
                connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });
                });
        }
    });
});


/* obtiene el nombre y correlativo carrito */
app.post('/selectnamecarrito',function(req,res){
    console.log('--------- Carrito select nombre y correlativo detalle');
    console.log(req.body);
    "use strict";
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
              //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('SELECT d.correlativo as "correlativo", p.nombre as "producto"'+
                ' FROM producto p, detalle_carrito d, detalle_catalogo dc'+
                ' WHERE'+
                ' d.idcarrito = :id'+
                ' AND'+
                ' dc.iddetallecatalogo = d.dcatalogo'+
                ' AND'+
                ' dc.idproducto = p.idproducto',
                {
                    id: req.body.id
                },
                {
                    outFormat: oracledb.OBJECT
                }
                ,
                function(error,result){
                    if(error){
                        res.set('Content-Type','application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: "Error en obtener producto",
                            detailed_message: error.message
                        }));
                    }else{
                        res.header('Access-Control-Allow-Origin','*');
                        res.header('Access-Control-Allow-Headers','Content-Type');
                        res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                        console.log(result.rows);
                        res.contentType('application/json').status(200).json({
                            result: result.rows
                        });
                    }
                     //Release the connection
                connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("POST /sendTablespace: Connection released");
                    }
                });
                });
        }
    });
});

/* Obtiene el producto seleccionado del carrito */
app.post('/obtenerdetallecarrito',function(req,res){
    "use strict";
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
             //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return; 
        }else{
            connection.execute('SELECT p.nombre as "producto", d.cantidad as "cantidad", d.precio as "valor", d.correlativo as "correlativo"'+
                ' FROM producto p, detalle_carrito d, detalle_catalogo dc '+
                ' WHERE'+
                ' d.correlativo = :id '+
                ' AND '+
                ' d.dcatalogo = dc.iddetallecatalogo'+
                ' AND'+
                ' dc.idproducto = p.idproducto',
                {
                    id: req.body.id
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(error,result){
                    if(error){
                        res.set('Content-Type','application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: "Error en obtener producto",
                            detailed_message: error.message
                        }));
                    }else{
                        console.log(result.rows);
                        res.header('Access-Control-Allow-Origin','*');
                        res.header('Access-Control-Allow-Headers','Content-Type');
                        res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                        res.contentType('application/json').status(200).json({
                            result: result.rows[0]
                        });
                    }
                    //Release the connection
                    connection.release(
                        function(err){
                            if(err){
                                console.error(err.message);
                            }else{
                                console.log("POST /sendTablespace: Connection released");
                            }
                    });
                });
        }
    });
});

/* Obtener el promedio, actualizado */
app.post('/getpromedio',function(req,res){
    "use stric";
    console.log('----get promedio ----');
    console.log(req.body);
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
             //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return; 
        }else{
            connection.execute('SELECT AVG(p.ponderacion) as "promedio"'+
            ' FROM comentario_puntuacion p, detalle_catalogo d'+
            ' WHERE'+
            ' d.iddetallecatalogo = :id'+
            ' AND'+
            ' p.iddetallecatalogo = d.iddetallecatalogo',
            {
                id: req.body.id
            },
            {
                outFormat: oracledb.OBJECT
            },
            function(error,result){
                if(error){
                    res.set('Content-Type','application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "Error en obtener promedio",
                        detailed_message: error.message
                    }));
                }else{
                    console.log(result.rows[0]);
                    res.header('Access-Control-Allow-Origin','*');
                    res.header('Access-Control-Allow-Headers','Content-Type');
                    res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                    res.contentType('application/json').status(200).json({
                        result: result.rows[0]
                    });
                }
                //Release the connection
                    connection.release(
                        function(err){
                            if(err){
                                console.error(err.message);
                            }else{
                                console.log("POST /sendTablespace: Connection released");
                            }
                });
            });
        }
    });
});

/* Inserta el promedio  -- Ya no usar */
app.post('/insertarpromedio',function(req,res){
    "use strict";
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('INSERT INTO puntuacion values(0,:correlativo,:puntuacion)',
            {
                correlativo: req.body.correlativo,
                puntuacion: req.body.puntuacion
            },
            {
                outFormat: oracledb.OBJECT
            },
            function(error,result){
                if(error){
                    res.set('Content-Type','application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "Error en obtener insertar puntuacion",
                        detailed_message: error.message
                    }));
                }else{
                    res.header('Access-Control-Allow-Origin','*');
                    res.header('Access-Control-Allow-Headers','Content-Type');
                    res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                    res.contentType('application/json').status(200).json({
                        result: 'Ok'
                    });
                }
                //Release the connection
                    connection.release(
                        function(err){
                            if(err){
                                console.error(err.message);
                            }else{
                                console.log("POST /sendTablespace: Connection released");
                            }
                });
            });
        }
    });
});

/*Eliminar producto del carrito */
app.post('/deletedelcarrito',function(req,res){
    "use strict";
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){

        }else{
            connection.execute('begin  eliminarcarrito(:correlativo,:carrito); end;',
                {
                    correlativo: req.body.correlativo,
                    carrito: req.body.carrito
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(error,result){
                    if(error){
                        res.set('Content-Type','application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: "Error en obtener insertar puntuacion",
                            detailed_message: error.message
                    }));
                    }else{
                        res.header('Access-Control-Allow-Origin','*');
                        res.header('Access-Control-Allow-Headers','Content-Type');
                        res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                        res.contentType('application/json').status(200).json({
                            result: 'Ok'
                        });
                    }
                    //Release the connection
                    connection.release(
                        function(err){
                            if(err){
                                console.error(err.message);
                            }else{
                                console.log("POST /sendTablespace: Connection released");
                            }
                    });
                });
        }
    });
});

/* Obtener el total del carrito del usuario */
app.post('/getvalorcarrito',function(req,res){
    "use strict";
    console.log(req.body);
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('SELECT total FROM carrito WHERE clave = :clave',
                {
                    clave: req.body.id
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(error,result){
                    if(error){
                        res.set('Content-Type','application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: "Error en obtener insertar puntuacion",
                            detailed_message: error.message
                        }));
                    }else{
                        console.log(result.rows[0]);
                        res.header('Access-Control-Allow-Origin','*');
                        res.header('Access-Control-Allow-Headers','Content-Type');
                        res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                        res.contentType('application/json').status(200).json({
                            result: result.rows[0]
                        });
                    }
                    //Release the connection
                    connection.release(
                        function(err){
                            if(err){
                                console.error(err.message);
                            }else{
                                console.log("POST /sendTablespace: Connection released");
                            }
                    });
                });
        }
    });
});

/*Comentarios, actualizado getComentarios */
app.post('/getComentarios',function(req,res){
                    "use strict";
    console.log(req.body);
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('SELECT TO_CHAR(c.fecha,\'DD/MM/YYYY\') as "fecha", u.nombre as "usuario" , c.comentario as "comentario",c.ponderacion as "ponderacion"'+
                ' FROM usuario u, detalle_catalogo dc, comentario_puntuacion  c'+
                ' WHERE u.clave = c.clave'+
                ' AND dc.iddetallecatalogo = c.iddetallecatalogo'+
                ' and dc.iddetallecatalogo = :producto'+
                ' ORDER BY(c.fecha)',
                {
                    producto: req.body.producto
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(error,result){
                    if(error){
                        res.set('Content-Type','application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: "Error en obtener Comentarios",
                            detailed_message: error.message
                        }));
                    }else{
                        console.log(result.rows);
                        res.header('Access-Control-Allow-Origin','*');
                        res.header('Access-Control-Allow-Headers','Content-Type');
                        res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                        res.contentType('application/json').status(200).json({
                            result: result.rows
                        });
                    }
                    //Release the connection
                    connection.release(
                        function(err){
                            if(err){
                                console.error(err.message);
                            }else{
                                console.log("POST /sendTablespace: Connection released");
                            }
                    });
                });
        }
    });
});

/* actualizada */
app.post('/setComentario',function(req,res){
    "use strict";
    console.log(req.body);
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('INSERT INTO comentario_puntuacion(clave,iddetallecatalogo,fecha,comentario,ponderacion) VALUES(:clave,:producto,:fecha,:comentario,:ponderacion)',
                {
                    clave: req.body.clave,
                    producto: req.body.producto,
                    comentario: req.body.comentario,
                    fecha: req.body.fecha,
                    ponderacion: req.body.ponderacion
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(error,result){
                    if(error){
                        res.set('Content-Type','application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: "Error en obtener Comentarios",
                            detailed_message: error.message
                        }));
                    }else{
                        res.header('Access-Control-Allow-Origin','*');
                        res.header('Access-Control-Allow-Headers','Content-Type');
                        res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                        res.contentType('application/json').status(200).json({
                            result: 'Ok'
                        });
                    }
                    //Release the connection
                    connection.release(
                        function(err){
                            if(err){
                                console.error(err.message);
                            }else{
                                console.log("POST /sendTablespace: Connection released");
                            }
                    });
                });
        }
    });
});

/*_______________________________________________________ Seccion de Compra ________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________ */
 //Enviar correo de confirmacion
app.post('/enviarcorreo',function(req,res){
                    var transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: 'alie.sells22020mia@gmail.com',
                            pass: 'nuevoss2020kvmaD@'
                        }
                    });
                    var mailoptions = {
                        from: 'alie.sells22020mia@gmail.com',
                        to: req.body.correo,
                        subject: 'Producto vendido',
                        text: 'Completar registro',
                        html: '<h1>Alie-Sell</h1><p>Productos adquiridos<br/>Producto: '+req.body.producto+'<br/>Abono acreditado: '+req.body.valor+'</p>'
                    };

                    transporter.sendMail(mailoptions,function(error,info){
                        console.log('Respuesta del correo');
                        if(error){
                            console.log('Error ', error);
                            res.set('Content-Type','application/json');
                            res.status(500).send(JSON.stringify({
                                status: 500,
                                essage: "Error en obtener Comentarios",
                                detailed_message: error.message
                            }));

                        }else{
                            console.log('Correo enviado: ',info.response);
                            res.header('Access-Control-Allow-Origin','*');
                            res.header('Access-Control-Allow-Headers','Content-Type');
                            res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                            res.contentType('application/json').status(200).json({
                            result: 'Ok'
                        });
                        }
                    });
});

//Realiza abonos
app.post('/updateabono',function(req,res){
        "use strict";
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('BEGIN  actualizarganancia(:clave,:valor);  END;',
                { 
                   clave: req.body.clave,
                   valor: req.body.valor
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(error,result){
                    if(error){
                        res.set('Content-Type','application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: "Error en añadir abono al vendedor",
                            detailed_message: error.message
                        }));
                    }else{
                        res.header('Access-Control-Allow-Origin','*');
                        res.header('Access-Control-Allow-Headers','Content-Type');
                        res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                        res.contentType('application/json').status(200).json({
                            result: 'Ok'
                        });
                    }
                    //Release the connection
                    connection.release(
                        function(err){
                            if(err){
                                console.error(err.message);
                            }else{
                                console.log("POST /sendTablespace: Connection released");
                            }
                    });
                });
        }
    });
});

//Realiza descuento al producto, la cantidad descontarcantidadproducto
app.post('/quitarcantidadproducto',function(req,res){
            "use strict";
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('BEGIN  descontarcantidadproducto(:idetalle,:cantidad);  END;',
                { 
                   idetalle: req.body.idetalle,
                   cantidad: req.body.cantidad
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(error,result){
                    if(error){
                        res.set('Content-Type','application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: "Error en añadir abono al vendedor",
                            detailed_message: error.message
                        }));
                    }else{
                        res.header('Access-Control-Allow-Origin','*');
                        res.header('Access-Control-Allow-Headers','Content-Type');
                        res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                        res.contentType('application/json').status(200).json({
                            result: 'Ok'
                        });
                    }
                    //Release the connection
                    connection.release(
                        function(err){
                            if(err){
                                console.error(err.message);
                            }else{
                                console.log("POST /sendTablespace: Connection released");
                            }
                    });
                });
        }
    });
});

//Descontar cretido al usuario finalizarproceso(claveu in int, clavecarrito in int, valor in number, fecha in date)
app.post('/finalizarprocesocompra',function(req,res){
                "use strict";
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('BEGIN  finalizarproceso(:clave,:carrito,:valor,:fecha);  END;',
                { 
                   clave: req.body.clave,
                   carrito: req.body.carrito,
                   valor: req.body.valor,
                   fecha: req.body.fecha
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(error,result){
                    if(error){
                        res.set('Content-Type','application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: "Error en añadir abono al vendedor",
                            detailed_message: error.message
                        }));
                    }else{
                        res.header('Access-Control-Allow-Origin','*');
                        res.header('Access-Control-Allow-Headers','Content-Type');
                        res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                        res.contentType('application/json').status(200).json({
                            result: 'Ok'
                        });
                    }
                    //Release the connection
                    connection.release(
                        function(err){
                            if(err){
                                console.error(err.message);
                            }else{
                                console.log("POST /sendTablespace: Connection released");
                            }
                    });
                });
        }
    });
});

/*---------------------------------------------------------- FACTURAS ----------------------------------------------------------------------------------------------------------------------------------*/
app.post('/listafacturas',function(req,res){
                    "use strict";
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('SELECT f.no_factura as "value"'+
                ' FROM factura f'+
                ' INNER JOIN usuario  u'+
                ' on f.clave = u.clave'+
                ' where'+
                ' u.clave = :clave',
                { 
                   clave: req.body.clave,
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(error,result){
                    if(error){
                        res.set('Content-Type','application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: "Error en añadir abono al vendedor",
                            detailed_message: error.message
                        }));
                    }else{
                        res.header('Access-Control-Allow-Origin','*');
                        res.header('Access-Control-Allow-Headers','Content-Type');
                        res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                        res.contentType('application/json').status(200).json({
                            result: result.rows
                        });
                    }
                    //Release the connection
                    connection.release(
                        function(err){
                            if(err){
                                console.error(err.message);
                            }else{
                                console.log("POST /sendTablespace: Connection released");
                            }
                    });
                });
        }
    });
});

app.post('/getfactura',function(req,res){
                            "use strict";
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('SELECT TO_CHAR(fecha,\'DD/MM/YYYY\') as "fecha", total as "total"'+
                            ' FROM factura'+
                            ' where no_factura = :factura',
                { 
                   factura: req.body.factura,
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(error,result){
                    if(error){
                        res.set('Content-Type','application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: "Error en obtener factura",
                            detailed_message: error.message
                        }));
                    }else{
                        res.header('Access-Control-Allow-Origin','*');
                        res.header('Access-Control-Allow-Headers','Content-Type');
                        res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                        res.contentType('application/json').status(200).json({
                            result: result.rows[0]
                        });
                    }
                    //Release the connection
                    connection.release(
                        function(err){
                            if(err){
                                console.error(err.message);
                            }else{
                                console.log("POST /sendTablespace: Connection released");
                            }
                    });
                });
        }
    });
});

app.post('/detallesfactura',function(req,res){
                        "use strict";
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute(' SELECT fc.correlativo as "correlativo", p.nombre as "producto", fc.cantidad as "cantidad", fc.valor as "valor"'+
                            ' FROM detalle_catalogo dc, producto p, detalle_factura fc'+
                            ' WHERE dc.iddetallecatalogo = fc.iddetallecatalogo'+
                            ' and p.idproducto = dc.idproducto'+
                            ' and fc.no_factura = :factura',
                { 
                   factura: req.body.factura,
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(error,result){
                    if(error){
                        res.set('Content-Type','application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: "Error en obtener detalle_factura",
                            detailed_message: error.message
                        }));
                    }else{
                        res.header('Access-Control-Allow-Origin','*');
                        res.header('Access-Control-Allow-Headers','Content-Type');
                        res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                        res.contentType('application/json').status(200).json({
                            result: result.rows
                        });
                    }
                    //Release the connection
                    connection.release(
                        function(err){
                            if(err){
                                console.error(err.message);
                            }else{
                                console.log("POST /sendTablespace: Connection released");
                            }
                    });
                });
        }
    });
});

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------Seccion de reportes -----------------------------------------------------------------*/

//Listado de todos los de Servicio de Ayuda que hayan nacido arriba de Y año
app.post('/gethombreservicio',function(req,res){
    "use strict";
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('SELECT clave as "clave", nombre as "nombre", apellido as "apellido", rol as "rol", genero as "genero", TO_CHAR(fecha_nacimiento,\'DD/MM/YYYY\') as "nacimiento"'+
                ' FROM usuario '+
                ' WHERE EXTRACT(YEAR FROM fecha_nacimiento) >= :numero'+
                ' AND genero = \'Masculino\''+
                ' AND rol = \'Servicio Ayuda\''+
                ' ORDER BY fecha_nacimiento',
                { 
                   numero: req.body.numero
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(error,result){
                    if(error){
                        res.set('Content-Type','application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: "Error en obtener cantidad de comentarios",
                            detailed_message: error.message
                        }));
                    }else{
                        console.log(result.rows);
                        res.header('Access-Control-Allow-Origin','*');
                        res.header('Access-Control-Allow-Headers','Content-Type');
                        res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                        res.contentType('application/json').status(200).json({
                            result: result.rows
                        });
                    }
                    //Release the connection
                    connection.release(
                        function(err){
                            if(err){
                                console.error(err.message);
                            }else{
                                console.log("POST /sendTablespace: Connection released");
                            }
                    });
                });
        }
    });
});


//Listado de todas las administradoras que hayan nacido debajo de Y año
app.post('/getmujeresadmoyano',function(req,res){
                "use strict";
    console.log(req.body);
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('SELECT clave as "clave", nombre as "nombre", apellido as "apellido", rol as "rol", genero as "genero", TO_CHAR(fecha_nacimiento,\'DD/MM/YYYY\') as "nacimiento"'+
                ' FROM usuario'+
                ' WHERE EXTRACT(YEAR FROM fecha_nacimiento) < :numero'+
                ' AND genero = \'Femenino\''+
                ' AND rol = \'Admo\''+
                ' ORDER BY fecha_nacimiento',
                {
                    numero: req.body.numero
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(error,result){
                    if(error){
                        res.set('Content-Type','application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: "Error en obtener puntuaciones de  productos",
                            detailed_message: error.message
                        }));
                    }else{
                        console.log(result.rows);
                        res.header('Access-Control-Allow-Origin','*');
                        res.header('Access-Control-Allow-Headers','Content-Type');
                        res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                        res.contentType('application/json').status(200).json({
                            result: result.rows
                        });
                    }
                    //Release the connection
                    connection.release(
                        function(err){
                            if(err){
                                console.error(err.message);
                            }else{
                                console.log("POST /sendTablespace: Connection released");
                            }
                    });
                });
        }
    });
});

//Ganancia obtenida mayor a menor
app.post('/ganaciaobtenidareporte',function(req,res){
                "use strict";
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('SELECT clave as "id", nombre as "nombre", apellido as "apellido", rol as "rol", genero "genero", ganacia_obtenida as "ganancia"'+
                ' from usuario'+
                ' where rol = \'cliente\''+
                ' and ganacia_obtenida > 0'+
                ' ORDER BY ganacia_obtenida DESC',
                {
                    
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(error,result){
                    if(error){
                        res.set('Content-Type','application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: "Error en obtener ganacia",
                            detailed_message: error.message
                        }));
                    }else{
                        console.log(result.rows);
                        res.header('Access-Control-Allow-Origin','*');
                        res.header('Access-Control-Allow-Headers','Content-Type');
                        res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                        res.contentType('application/json').status(200).json({
                            result: result.rows
                        });
                    }
                    //Release the connection
                    connection.release(
                        function(err){
                            if(err){
                                console.error(err.message);
                            }else{
                                console.log("POST /sendTablespace: Connection released");
                            }
                    });
                });
        }
    });
});

//Promedio de puntuaciones 5,4,3,2,1, actualizado
app.post('/getpuntuaciongeneral',function(req,res){
            "use strict";
    console.log(req.body);
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('SELECT pr.iddetallecatalogo as "id", dc.codigoproducto as "codigo" ,p.nombre as "producto", dc.color as "color",AVG(pr.ponderacion) as "puntuacion"'+
                ' FROM producto p, detalle_catalogo dc, comentario_puntuacion pr'+
                ' WHERE'+
                ' dc.idproducto = p.idproducto'+
                ' AND'+
                ' dc.iddetallecatalogo = pr.iddetallecatalogo'+
                ' GROUP BY dc.codigoproducto, pr.iddetallecatalogo, p.nombre, dc.color'+
                ' ORDER BY  AVG(pr.ponderacion) DESC',
                {
                    
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(error,result){
                    if(error){
                        res.set('Content-Type','application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: "Error en obtener puntuaciones de  productos",
                            detailed_message: error.message
                        }));
                    }else{
                        console.log(result.rows);
                        res.header('Access-Control-Allow-Origin','*');
                        res.header('Access-Control-Allow-Headers','Content-Type');
                        res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                        res.contentType('application/json').status(200).json({
                            result: result.rows
                        });
                    }
                    //Release the connection
                    connection.release(
                        function(err){
                            if(err){
                                console.error(err.message);
                            }else{
                                console.log("POST /sendTablespace: Connection released");
                            }
                    });
                });
        }
    });
});


// Top 3 con los clientes que tengan mas productos
app.post('/tpo3clienteproducto',function(req,res){
        "use strict";
    console.log(req.body);
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('SELECT * FROM(SELECT u.nombre as "nombre", u.apellido as "apellido", COUNT(dc.clave) as "cantidad"'+
                ' FROM usuario u'+
                ' INNER JOIN detalle_catalogo dc'+
                ' on u.clave = dc.clave'+
                ' GROUP BY u.nombre, u.apellido, dc.clave'+
                ' ORDER BY COUNT(dc.clave) DESC)'+
                ' WHERE ROWNUM <= 3',
                {
                    
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(error,result){
                    if(error){
                        res.set('Content-Type','application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: "Error en obtener top 3 clientes con mas productos",
                            detailed_message: error.message
                        }));
                    }else{
                        console.log(result.rows);
                        res.header('Access-Control-Allow-Origin','*');
                        res.header('Access-Control-Allow-Headers','Content-Type');
                        res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                        res.contentType('application/json').status(200).json({
                            result: result.rows
                        });
                    }
                    //Release the connection
                    connection.release(
                        function(err){
                            if(err){
                                console.error(err.message);
                            }else{
                                console.log("POST /sendTablespace: Connection released");
                            }
                    });
                });
        }
    });
});

/* TODOS los productos ordenados por categorias */
app.post('/allproductoscategorias',function(req,res){
            "use strict";
    console.log(req.body);
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('SELECT dc.codigoproducto as "codigo", p.nombre as "producto", dc.precio as "precio", c.nombre as "categoria", dc.cantidad as "cantidad"'+
                ' FROM producto p, detalle_catalogo dc, categoria c'+
                ' WHERE p.idproducto = dc.idproducto'+
                ' and dc.idcategoria = c.id_categoria'+
                ' ORDER BY c.nombre',
                {
                    
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(error,result){
                    if(error){
                        res.set('Content-Type','application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: "Error en obtener todos los productos",
                            detailed_message: error.message
                        }));
                    }else{
                        res.header('Access-Control-Allow-Origin','*');
                        res.header('Access-Control-Allow-Headers','Content-Type');
                        res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                        res.contentType('application/json').status(200).json({
                            result: result.rows
                        });
                    }
                    //Release the connection
                    connection.release(
                        function(err){
                            if(err){
                                console.error(err.message);
                            }else{
                                console.log("POST /sendTablespace: Connection released");
                            }
                    });
                });
        }
    });
});

/* Los productos indicado la cantidad de comentarios asignados publicado en Y fecha, actualizada */
app.post('/numcomentariosyfecha',function(req,res){
            "use strict";
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('SELECT dc.codigoproducto as "codigo", p.nombre as "producto", TO_CHAR(c.fecha,\'DD/MM/YYYY\') as "fecha", COUNT(c.iddetallecatalogo) as "total"'+
                ' FROM comentario_puntuacion c, detalle_catalogo dc, producto p'+
                ' WHERE'+
                ' p.idproducto = dc.idproducto'+
                ' AND c.iddetallecatalogo = dc.iddetallecatalogo'+
                ' GROUP BY c.fecha, c.iddetallecatalogo, p.nombre, dc.codigoproducto'+
                ' HAVING c.fecha = :fecha',
                {
                    fecha: req.body.fecha
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(error,result){
                    if(error){
                        res.set('Content-Type','application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: "Error en obtener cantidad de comentarios",
                            detailed_message: error.message
                        }));
                    }else{
                        console.log(result.rows);
                        res.header('Access-Control-Allow-Origin','*');
                        res.header('Access-Control-Allow-Headers','Content-Type');
                        res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                        res.contentType('application/json').status(200).json({
                            result: result.rows
                        });
                    }
                    //Release the connection
                    connection.release(
                        function(err){
                            if(err){
                                console.error(err.message);
                            }else{
                                console.log("POST /sendTablespace: Connection released");
                            }
                    });
                });
        }
    });
});


//Obtener la cantidad x de los productos
app.post('/getcantidad1',function(req,res){
        "use strict";
    console.log(req.body);
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('SELECT dc.codigoproducto as "codigo", p.nombre as "producto", dc.cantidad as "cantidad"'+
                ' FROM detalle_catalogo dc'+
                ' INNER JOIN producto p'+
                ' on p.idproducto = dc.idproducto'+
                ' WHERE'+
                ' dc.cantidad = :cantidad',
                {
                    cantidad: req.body.cantidad
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(error,result){
                    if(error){
                        res.set('Content-Type','application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: "Error en obtener insertar puntuacion",
                            detailed_message: error.message
                        }));
                    }else{
                        console.log(result.rows);
                        res.header('Access-Control-Allow-Origin','*');
                        res.header('Access-Control-Allow-Headers','Content-Type');
                        res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                        res.contentType('application/json').status(200).json({
                            result: result.rows
                        });
                    }
                    //Release the connection
                    connection.release(
                        function(err){
                            if(err){
                                console.error(err.message);
                            }else{
                                console.log("POST /sendTablespace: Connection released");
                            }
                    });
                });
        }
    });
})

/* Peor top 3 productos votados, actualizado */
app.post('/peorproductosvotados',function(req,res){
            "use strict";
    console.log(req.body);
    oracledb.getConnection(configuracion,function(err,connection){
        if(err){
            //Error
            res.set('Content-Type','application/json');
            res.status(400).send(JSON.stringify({
                status: 400,
                message: "Error de conexion",
                detailed_message:err.message
            }));
            return;
        }else{
            connection.execute('SELECT * FROM( SELECT dc.iddetallecatalogo as "id", p.nombre as "producto", dc.precio as "precio", dc.color as "color", AVG(pr.ponderacion) as "puntuacion"'+
                ' FROM producto p, detalle_catalogo dc, comentario_puntuacion pr'+
                ' WHERE'+
                ' p.idproducto = dc.idproducto'+
                ' AND'+
                ' dc.iddetallecatalogo = pr.iddetallecatalogo'+
                ' GROUP BY dc.iddetallecatalogo, p.nombre, dc.precio, dc.color'+
                ' HAVING AVG(pr.ponderacion) <= 3.5'+
                ' ORDER BY AVG(pr.ponderacion)'+
                ') WHERE ROWNUM <= 3',
                {

                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(error,result){
                    if(error){
                        res.set('Content-Type','application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: "Error en obtener los 3 peores productos",
                            detailed_message: error.message
                        }));
                    }else{
                        console.log(result.rows);
                        res.header('Access-Control-Allow-Origin','*');
                        res.header('Access-Control-Allow-Headers','Content-Type');
                        res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                        res.contentType('application/json').status(200).json({
                            result: result.rows
                        });
                    }
                    //Release the connection
                    connection.release(
                        function(err){
                            if(err){
                                console.error(err.message);
                            }else{
                                console.log("POST /sendTablespace: Connection released");
                            }
                    });
                });
        }
    });
});

/*---------------------__________________________________---------------------------______________________--------------------------____________________________________-----------------------------______________________________________-------------------------------__________________________________---------------------------------_________________________________-----------------------------__________________________________--------------------------------------------___________________________________-------------------------------------___________________________--- */

app.listen(4201,'10.42.0.1',function(){
    console.log("El Servidor esta listo para escuchar, puerto 4201");
});