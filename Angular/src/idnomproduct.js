var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var bodyparser = require('body-parser');
var conexion = require(__dirname+'/conexion.js');

const get_idnamep = async(req,res) => {
	"use strict";

	try{
		console.log(req.body);
		const id = req.body.clave;
		const conect = await oracledb.getConnection(conexion.database);
		const response =  await conect.execute(
				'SELECT dc.iddetallecatalogo as "id"'+
				', p.nombre as "producto"'+
				' FROM producto p, detalle_catalogo dc, usuario u'+
				' WHERE'+
				' p.idproducto = dc.idproducto'+
				' AND '+
				' u.clave <> :id '+
				' AND u.clave = dc.clave ',
				{
					id
				}
		);

		console.log(response.rows);
		res.header('Access-Control-Allow-Origin','*');
                    res.header('Access-Control-Allow-Headers','Content-Type');
                    res.header('Access-Control-Allow-Mathods','GET,PUT,POST,DELETE,OPTIONS');
                  return  res.contentType('application/json').status(200).json({
                        result: response.rows
        });
	}catch(e){
		res.set('Content-Type','application/json');
        return res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "Error, no se puede obtener productos",
                        detailed_message: e.message
                    }));
	}
}

module.exports.post = get_idnamep;