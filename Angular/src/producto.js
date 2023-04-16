var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var bodyparser = require('body-parser');
var conexion = require(__dirname+'/conexion.js');

const set_producto = async(req,res) => {
	"use strict";
	console.log(req.body);

	try{

		const id = req.body.id;
		const codigo = req.body.codigo;
		const nombre = req.body.nombre;
		const precio = req.body.precio;
		const categoria = req.body.categoria;
		const imagen = req.body.imagen;
		const color = req.body.colorp;
		const cantidad = req.body.cantidad;

		const conect = await oracledb.getConnection(conexion.database);

		const response =  await conect.execute(
				'begin 	insertarproducto(:id,:codigo,:nombre,:precio,:categoria,:imagen,:color,:cantidad); 	end;',
				{
					id,codigo,nombre,precio,categoria,imagen,color,cantidad
				}
			);

		


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
                        message: "Error, no se puede el producto",
                        detailed_message: e.message
                    }));
	}
}

module.exports.post = set_producto;