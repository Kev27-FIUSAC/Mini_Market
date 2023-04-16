package com.example.alieshpo;
import org.json.JSONObject;
import org.json.JSONException;

import java.text.SimpleDateFormat;
import java.util.Calendar;

public class JsonClase {

    public static String iniJson(Persona p){
        try{

            JSONObject jsonp = new JSONObject();

            jsonp.put("correo",p.getCorreo());
            jsonp.put("contrasena",p.getContrasena());

            return jsonp.toString();

        }catch(JSONException ex) {
            ex.printStackTrace();
        }

        return null;
    }

    public static String clavejson(Clave c){
        JSONObject json = new JSONObject();
        try {
            json.put("clave",c.getClave());
            return  json.toString();
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return  null;
    }

    public static String productojson(Producto p){
        JSONObject json = new JSONObject();
        try {
            json.put("producto",p.getProducto());
            return json.toString();
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return  null;
    }

    public static String idproducto(int id){
        JSONObject json = new JSONObject();

        try {
            json.put("id",id);
            return json.toString();
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return  null;
    }

    public static String setCarrito(int clave, int producto, int cantidad, double precio){
        JSONObject json = new JSONObject();
        try {
            json.put("clave2",clave);
            json.put("producto",producto);
            json.put("cantidad",cantidad);
            json.put("precio",precio);
            return json.toString();
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return  null;
    }

    public static String newuser( String rol, String nombre, String apellido, String correo, String contrasena, String telefono, String genero, String fecha,String direccion,String clase, double credito){

        Calendar c = Calendar.getInstance();
      //  System.out.println("Current time => " + c.getTime());
        SimpleDateFormat df = new SimpleDateFormat("dd/mm/yyyy");
        String formattedDate = df.format(c.getTime());


        JSONObject json = new JSONObject();
        try{
            json.put("rol",rol);
            json.put("nombre",nombre);
            json.put("apellido",apellido);
            json.put("correo",correo);
            json.put("contrasena",contrasena);
            json.put("telefono",telefono);
            json.put("fotografia",null);
            json.put("genero",genero);
            json.put("fechanacimiento",fecha);
            json.put("fecharegistro",formattedDate);
            json.put("direccion",direccion);
            json.put("creditodisponible",credito);
            json.put("clasecliente",clase);
            json.put("gananciaobtenida",0.00);
            json.put("estado",0);
            return json.toString();
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String jsonupdateuser(int clave, String nombre, String apellido, String correo, String contrasena, String fecha, String sexo, String telefono, String direccion){
        JSONObject json = new JSONObject();

        try {
            json.put("clave",clave);
            json.put("nombre",nombre);
            json.put("apellido",apellido);
            json.put("correo",correo);
            json.put("contrasena",contrasena);
            json.put("fecha",fecha);
            json.put("sexo",sexo);
            json.put("telefono",telefono);
            json.put("direccion",direccion);
           return json.toString();
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return null;
    }

}
