var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var bodyparser = require('body-parser');
var conexion = require(__dirname+'/conexion.js');

var datos = new Object();
datos["nombre"] = -1;
datos["apellidos"] = -1;
datos["password"] = -1;
datos["correo"] = -1;
datos["telefono"] = -1;
datos["genero"] = -1;
datos["fecha"] = -1;
datos["direccion"] = -1;

function post(req,res,next){
    oracledb.getConnection(
            function(err,connection){
                 if(err){
                return next(err);
            }
            console.log("id_usuario: "+req.body.id_usuario);
            connection.execute(
                ' SELECT nombre as "nombre",'+
                ' apellidos as "apellidos",' +
                ' contrasena as "password",'+
                ' correo as "correo",'+
                ' telefono as "telefono",'+
                ' genero as "genero",'+
                ' fecha as "fecha",'+
                ' direccion as "direccion"'+
                ' FROM usuario'+
                ' WHERE clave = :id',
                {
                    id: req.body.id
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(err,results){
                    if(err){
                        res.set('Content-Type','application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: "Error en obtener la tabla pais",
                    detailed_message: err.message
                }));
                    }else{
                        console.log(results.rows.length);
                        if(results.rows.length != 0){
                            datos = results.rows[0];
                        }

                        res.header('Access-Control-Allow-Origin','*');
                		res.header('Access-Control-Allow-Headers','Content-Type');
                		res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                		res.contentType('application/json').status(200);
                		res.send(JSON.stringify(datos));

                    }
                    //Release the connection
            connection.release(
                function(err){
                    if(err){
                        console.error(err.message);
                    }else{
                        console.log("GET /sendTablespace: Connection released");
                    }
                });
                });

    });
}

module.exports.post = post;