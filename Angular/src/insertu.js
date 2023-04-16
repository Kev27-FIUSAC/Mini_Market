var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var morgan = require('morgan');
var multipart = require('connect-multiparty');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var bodyparser = require('body-parser');
var conexion = require(__dirname+'/conexion.js');
var Buffer = require('buffer').Buffer;
var path = require('path');
var fs = require('fs');

const insertaru = async(req,res) =>{
	try{
		   const{rol,nombre,apellido,contrasena,correo,telefono,fotografia,genero,fechanacimiento,fecharegistro,direccion,creditodisponible,gananciaobtenida,clasecliente,estado} = req.body;

		   const conect = await oracledb.getConnection(conexion.database);
		   const response = await conect.execute(
		   			'begin 	insertaruser(:rol,:nombre,:apellido,:contrasena,:correo,:telefono,:genero,:fotografia,:fechanacimiento,:fecharegistro,:direccion,:creditodisponible,:gananciaobtenida,:clasecliente,:estado); 	end;',
		   			{
		   				rol,nombre,apellido,contrasena,correo,telefono,fotografia,genero,fechanacimiento,fecharegistro,direccion,creditodisponible,gananciaobtenida,clasecliente,estado
		   			}
		   	);

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
                        to: correo,
                        subject: 'Bienvenido a Alie-Sell',
                        text: 'Completar registro',
                        html: '<p> Bienvenido a Alie-Sell<br/>para completar su registro debe de validar su cuenta, por favor presione el link para completar el registro</p><a href="http://localhost:4200/validar/'+correo+'">Validar Cuenta</a>'
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
                  return  res.contentType('application/json').status(200).json({
                        result: 'Ok'
                    });

	}catch(e){
		res.set('Content-Type','application/json');
        return res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "Error, no se puede insertar usuario",
                        detailed_message: e.message
                    }));
	}
}

module.exports.post = insertaru;