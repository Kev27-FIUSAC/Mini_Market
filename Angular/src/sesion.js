var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var morgan = require('morgan');
var bodyparser = require('body-parser');
var conexion = require(__dirname+'/conexion.js');
var Buffer = require('buffer').Buffer;
var path = require('path');
var fs = require('fs');
oracledb.fetchAsString = [oracledb.CLOB];

var resultado = new Object();
resultado["id"] = -1;
resultado["password"] = -1;
resultado["rol"] = -1;
resultado["token"] = -1;
resultado["foto"] = -1;


const jwkey = 'Alie001';

function post(req,res,next){
    oracledb.getConnection(conexion.database,
        function(err,connection){
            
            if(err){
                return next(err);
            }
            console.log(req.body);
            connection.execute(
                'SELECT u.clave as "id",'+
                '   u.correo as "correo",'+
                '   u.contrasena as "password",'+
                '   u.rol as "rol",'+
                '   u.fotografia as "foto",'+
                '   c.idcarrito as "carrito",'+
                '   u.credito_disponible as "credito"'+
                '   FROM usuario u, carrito c'+
                '   WHERE u.correo = :username'+
                '   AND u.clave = c.clave',
                {
                    username: req.body.correo
                    
                },
                {
                    outFormat: oracledb.OBJECT
                },
                function(err,results){
                    if(err){
                        connection.release(function(err){
                            if(err){
                                console.error(err.message);
                            }
                        });
                        return next(err);
                    }
                    console.log(results.rows.length);
                    console.log(results);
                    if(results.rows.length != 0){
                        resultado = results.rows[0];
                        



                        resultado.foto = results.rows[0].foto;
                    }else{
                        resultado.id = -1;
                        resultado.password = "-1";
                        resultado.rol = "0";
                        resultado.foto = null;
                    }
                    
                    
                    bcrypt.genSalt(10,function(err,salt) 
                    {
                        bcrypt.hash(resultado.password,salt,function(err,hash){
                            if(err){
                                return next(err);
                            }
                            console.log(hash);
                            
                

                    bcrypt.compare(req.body.contrasena, hash,function(err, pwMatch){
                        var carga;
                        if(err){
                            return next(err);
                        }
                        if(!pwMatch){
                            console.log(req.body.contrasena);
                            console.log(resultado.password);
                            resultado.id = -1;
                            resultado.password = "0";
                            resultado.rol = "0";
                            resultado.foto = null;
                            res.status(401).send({
                                result: resultado
                            });
                            return;
                        }
                        var llave = jwt.sign(resultado.id,jwkey);
                        carga = {
                            sub: resultado.id,
                            role: resultado.rol
                        };
                        resultado.token = llave;

                        if(resultado.foto != null){


                        fs.readFile(resultado.foto,function(error,data){
                            if(error){
                                console.log(error.message);
                                res.set('Content-Type','application/json');
                                res.status(401).send(JSON.stringify({
                                status: 401,
                                message: "Error en obtener imagen",
                                detailed_message: error.message
                                }));
                            }else{
                                let buf = Buffer.from(data);
                                let base64 = buf.toString('base64');
                                resultado.foto = base64;

                                console.log('CLAVE: '+resultado.id);
                                console.log('ROL: '+resultado.rol);
                                console.log('CARRITO: '+resultado.carrito);
                                res.status(200).json({                          
                                    result: resultado
                                });
                            }
                        });

                        }else{
                            res.header('Access-Control-Allow-Origin','*');
                            res.header('Access-Control-Allow-Headers','Content-Type');
                            res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                            console.log('CLAVE: '+resultado.id);
                                console.log('ROL: '+resultado.rol);
                                console.log('CARRITO: '+resultado.carrito);
                            res.contentType('application/json').status(200).json({
                                result: resultado
                            });
                        }

                    });
                });
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
            );

        });
}

module.exports.post = post;
