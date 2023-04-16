package com.example.alieshpo;

import android.content.Intent;
import android.os.AsyncTask;
import android.support.design.widget.Snackbar;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class AdmoUser extends AppCompatActivity {

    public String idU;
    private User ucliente = null;
    public List<String> viewvalue = null;
    public List<Integer> value = null;
    public Spinner correos;
    public String claseCliente = "ninguna";
    public double creditoDisponible = 0.00;
    private int idCliente=0;
    public EditText roltxt,nombretxt,apellidotxt,contrasenatxt,fechatxt,telefonotxt,generotxt,correotxt,direcciontxt;
    private SwipeRefreshLayout actualizar;
    Snackbar mySnackbar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admo_user);
        idU = getIntent().getExtras().getString("clave");
        viewvalue = new ArrayList<>();
        value = new ArrayList<>();
        correos = findViewById(R.id.spinnercorreos);
        roltxt = findViewById(R.id.rol1txt);
        nombretxt = findViewById(R.id.nombre2txt);
        apellidotxt = findViewById(R.id.apellido1txt);
        contrasenatxt = findViewById(R.id.password1txt);
        telefonotxt = findViewById(R.id.telefono1txt);
        fechatxt = findViewById(R.id.fecha1txt);
        generotxt = findViewById(R.id.genero1txt);
        correotxt = findViewById(R.id.correo1txt);
        direcciontxt = findViewById(R.id.direccion1txt);
      //  actualizar = findViewById(R.id.actualizarfresh);
        cargar_select();
  /*      actualizar.setOnRefreshListener(
                new SwipeRefreshLayout.OnRefreshListener() {
                    @Override
                    public void onRefresh() {
                        viewvalue.clear();
                        value.clear();
                        cargar_select();
                        Vaciar();
                    }
                }
        ); */
    }


    public void vaciar_texto(View v){
        Vaciar();
    }

    public void actualizar_usuario(View v){
        new AdmoUser.HTTPAsyncTask4().execute("http://10.42.0.1:4201/update_user"); //Endpoint
    }

    public void delete_user(View v){
        new AdmoUser.HTTPAsyncTask5().execute("http://10.42.0.1:4201/deleteuser");//Endpoint
    }

    public void refresh(View v){
        Intent pt = new Intent(this,AdmoUser.class);
        pt.putExtra("clave",idU);
        startActivity(pt);
    }



    public void regresar(View v){
        Intent pt = new Intent(this,AdmoMain.class);
        pt.putExtra("clave",idU);
        startActivity(pt);
    }

    private void Vaciar(){
        roltxt.setText("");
        fechatxt.setText("");
        nombretxt.setText("");
        apellidotxt.setText("");
        correotxt.setText("");
        contrasenatxt.setText("");
        generotxt.setText("");
        direcciontxt.setText("");
        telefonotxt.setText("");
    }

    public String post_correo(String url)  throws IOException, JSONException {
        JSONObject resp = null;
        StringEntity json = null;
        HttpResponse response;
        HttpClient cliente = new DefaultHttpClient();
        HttpPost envio = new HttpPost(url);
        Clave c = new Clave(Integer.parseInt(idU));
        String sjson = JsonClase.clavejson(c);
        json = new StringEntity(sjson);
        envio.addHeader("Content-Type","application/json");
        envio.setEntity(json);
        response = cliente.execute(envio); //Realizar peticion
        String re = EntityUtils.toString(response.getEntity());
        resp = new JSONObject(re);
        JSONArray r = resp.getJSONArray("result");
        return r.toString(); //Retornar el arryobjtect

    }

    public String post_usuario(String url)   throws IOException, JSONException {
        ucliente = null;
        JSONObject resp = null;
        StringEntity json = null;
        HttpResponse response;
        HttpClient cliente = new DefaultHttpClient();
        HttpPost envio = new HttpPost(url);
        Clave c = new Clave(idCliente);
        String js = JsonClase.clavejson(c);
        envio.addHeader("Content-Type","application/json");
        json = new StringEntity(js);
        envio.setEntity(json);
        response = cliente.execute(envio); //Realizar peticion
        String re = EntityUtils.toString(response.getEntity());
        resp = new JSONObject(re);
        JSONObject result = resp.getJSONObject("result");
        ucliente = new User(result.getString("rol"),result.getString("nombre"),result.getString("apellido"),result.getString("correo"),result.getString("password"),result.getString("fecha"),result.getString("genero"),result.getString("telefono"),result.getString("direccion"));
        return "Si";

    }

    public String post_setUsuario(String url) throws  IOException, JSONException{
        JSONObject resp = null;
        StringEntity json = null;
        HttpResponse response;
        HttpClient cliente = new DefaultHttpClient();
        HttpPost envio = new HttpPost(url);
        String rol = roltxt.getText().toString();
        String nombre = nombretxt.getText().toString();
        String apellido = apellidotxt.getText().toString();
        String correo = correotxt.getText().toString();
        String contrasena = contrasenatxt.getText().toString();
        String telefono = telefonotxt.getText().toString();
        String genero = generotxt.getText().toString();
        String fecha = fechatxt.getText().toString();
        String direccion = direcciontxt.getText().toString();
        String js = JsonClase.newuser(rol,nombre,apellido,correo,contrasena,telefono,genero,fecha,direccion,claseCliente,creditoDisponible);
        json = new StringEntity(js);
        envio.addHeader("Content-Type","application/json");
        envio.setEntity(json);
        response = cliente.execute(envio); //Realizar peticion
        String re = EntityUtils.toString(response.getEntity());
        resp = new JSONObject(re);
        if(resp.getString("result").equals("Ok")){
            return "Si";
        }else{
            return "No";
        }
    }

    public String post_Updateuser(String url) throws  IOException, JSONException{
        //Retornar la respuesta
        JSONObject resp = null;
        StringEntity json = null;
        HttpResponse response;
        HttpClient cliente = new DefaultHttpClient();
        HttpPost envio = new HttpPost(url);
        String nombre = nombretxt.getText().toString();
        String apellido = apellidotxt.getText().toString();
        String correo = correotxt.getText().toString();
        String contrasena = contrasenatxt.getText().toString();
        String telefono = telefonotxt.getText().toString();
        String genero = generotxt.getText().toString();
        String fecha = fechatxt.getText().toString();
        String direccion = direcciontxt.getText().toString();
        String js = JsonClase.jsonupdateuser(idCliente,nombre,apellido,correo,contrasena,fecha,genero,telefono,direccion);
        json = new StringEntity(js);
        envio.addHeader("Content-Type","application/json");
        envio.setEntity(json);
        response = cliente.execute(envio); //Realizar peticion
        String re = EntityUtils.toString(response.getEntity());
        resp = new JSONObject(re);
        if(resp.getString("result").equals("Ok")){
            return "Si";
        }else{
            return "No";
        }
    }

    public String post_deleteuser(String url) throws  IOException, JSONException{
        Clave c = new Clave(idCliente);
        JSONObject resp = null;
        StringEntity json = null;
        HttpResponse response;
        HttpClient cliente = new DefaultHttpClient();
        HttpPost envio = new HttpPost(url);
        String js = JsonClase.clavejson(c);
        json = new StringEntity(js);
        envio.addHeader("Content-Type","application/json");
        envio.setEntity(json);
        response = cliente.execute(envio); //Realizar peticion
        String re = EntityUtils.toString(response.getEntity());
        resp = new JSONObject(re);
        if(resp.getString("result").equals("Si")){
            return "Si";
        }else{
            return "No";
        }
    }

    public void cargar_select(){
        new AdmoUser.HTTPAsyncTask().execute("http://10.42.0.1:4201/get_usuarios"); //Endpoint
    }

    public void obtenerUser(){
        new AdmoUser.HTTPAsyncTask3().execute("http://10.42.0.1:4201/demo");//Endpoint
    }

    public void anadir_user(View v){
        //Primero rol
        int bandera=1;
        switch (roltxt.getText().toString()){
            case "cliente":
                int valorDado = (int) Math.floor(Math.random()*5+1);
             //   Toast.makeText(this,"Cliente: "+valorDado,Toast.LENGTH_LONG).show();

                switch (valorDado){
                    case 1:
                        claseCliente = "Diamante";
                        creditoDisponible = 50000.00;
                        break;
                    case 2:
                        claseCliente = "Platino";
                        creditoDisponible = 25000.00;
                        break;
                    case 3:
                        claseCliente = "Oro";
                        creditoDisponible = 10000.00;
                        break;
                    case 4:
                        claseCliente = "Plata";
                        creditoDisponible = 5000.00;
                        break;
                    case 5:
                        claseCliente = "Bronce";
                        creditoDisponible = 1000.00;
                }
                break;
            case "Admo":
            case"Servicio Ayuda":
                bandera = 1;
                break;
            default:
                bandera = 0;
                break;
        }

        switch (bandera){
            case 1:
                new AdmoUser.HTTPAsyncTask2().execute("http://10.42.0.1:4201/setUseradmo");
                break;
            case 0:
                Toast.makeText(this,"Rol invalido",Toast.LENGTH_LONG).show();
                break;
        }

    }

    /* POST, obtiene lista de correo  y claves */
    public class HTTPAsyncTask extends AsyncTask<String, Void, String> {

        /**
         * Override this method to perform a computation on a background thread. The
         * specified parameters are the parameters passed to {@link #execute}
         * by the caller of this task.
         * <p>
         * This will normally run on a background thread. But to better
         * support testing frameworks, it is recommended that this also tolerates
         * direct execution on the foreground thread, as part of the {@link #execute} call.
         * <p>
         * This method can call {@link #publishProgress} to publish updates
         * on the UI thread.
         *
         * @param strings The parameters of the task.
         * @return A result, defined by the subclass of this task.
         * @see #onPreExecute()
         * @see #onPostExecute
         * @see #publishProgress
         */
        @Override
        protected String doInBackground(String... strings) {
            String r = "";

            try {
                r = post_correo(strings[0]);
            } catch (IOException e) {
                e.printStackTrace();
            } catch (JSONException e) {
                e.printStackTrace();
            }

            return r;
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);

            try{
                JSONArray array = new JSONArray(result);

                try{
                    for(int a=0; a < array.length();a++){
                        JSONObject objeto = array.getJSONObject(a);
                        viewvalue.add(objeto.getString("viewValue"));
                        value.add(objeto.getInt("value"));
                    }

                    ArrayAdapter<String> adapter = new ArrayAdapter<String>(getApplicationContext(), android.R.layout.simple_spinner_dropdown_item,viewvalue);
                    adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                    correos.setAdapter(adapter);
                    correos.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener(){
                        /**
                         * <p>Callback method to be invoked when an item in this view has been
                         * selected. This callback is invoked only when the newly selected
                         * position is different from the previously selected position or if
                         * there was no selected item.</p>
                         * <p>
                         * Implementers can call getItemAtPosition(position) if they need to access the
                         * data associated with the selected item.
                         *
                         * @param parent   The AdapterView where the selection happened
                         * @param view     The view within the AdapterView that was clicked
                         * @param position The position of the view in the adapter
                         * @param id       The row id of the item that is selected
                         */
                        @Override
                        public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                            idCliente = value.get(position);
                            System.out.println("Cliente "+idCliente);
                            obtenerUser();
                        }

                        /**
                         * Callback method to be invoked when the selection disappears from this
                         * view. The selection can disappear for instance when touch is activated
                         * or when the adapter becomes empty.
                         *
                         * @param parent The AdapterView that now contains no selected item.
                         */
                        @Override
                        public void onNothingSelected(AdapterView<?> parent) {

                        }
                    });

                } catch (JSONException e) {
                    e.printStackTrace();
                }

            } catch (JSONException e) {
                e.printStackTrace();
            }

        }

    }

    public class HTTPAsyncTask2 extends AsyncTask<String, Void, String> {

        /**
         * Override this method to perform a computation on a background thread. The
         * specified parameters are the parameters passed to {@link #execute}
         * by the caller of this task.
         * <p>
         * This will normally run on a background thread. But to better
         * support testing frameworks, it is recommended that this also tolerates
         * direct execution on the foreground thread, as part of the {@link #execute} call.
         * <p>
         * This method can call {@link #publishProgress} to publish updates
         * on the UI thread.
         *
         * @param strings The parameters of the task.
         * @return A result, defined by the subclass of this task.
         * @see #onPreExecute()
         * @see #onPostExecute
         * @see #publishProgress
         */
        @Override
        protected String doInBackground(String... strings) {
            String d = "";

            try {
                d = post_setUsuario(strings[0]);
            } catch (JSONException | IOException e) {
                e.printStackTrace();
            }
            return d;
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);
            if(result.equals("Si")){
                mySnackbar = Snackbar.make(findViewById(R.id.myCoordinatorLayout2),"Se envio correo de validacion al usuario recien creado",Snackbar.LENGTH_LONG);
                mySnackbar.show();
                Vaciar();
            }else{
                Toast.makeText(getApplicationContext(),"No" , Toast.LENGTH_LONG).show();
            }
        }

    }

    /* POST OBTIENE EL CLIENTE */
    public class HTTPAsyncTask3 extends AsyncTask<String, Void, String> {

        /**
         * Override this method to perform a computation on a background thread. The
         * specified parameters are the parameters passed to {@link #execute}
         * by the caller of this task.
         * <p>
         * This will normally run on a background thread. But to better
         * support testing frameworks, it is recommended that this also tolerates
         * direct execution on the foreground thread, as part of the {@link #execute} call.
         * <p>
         * This method can call {@link #publishProgress} to publish updates
         * on the UI thread.
         *
         * @param strings The parameters of the task.
         * @return A result, defined by the subclass of this task.
         * @see #onPreExecute()
         * @see #onPostExecute
         * @see #publishProgress
         */
        @Override
        protected String doInBackground(String... strings) {
            String s = "No";

            try {
                s = post_usuario(strings[0]);
            } catch (IOException e) {
                e.printStackTrace();
            } catch (JSONException e) {
                e.printStackTrace();
            }

            return s;
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);
            if(result.equals("Si")){
             //   Toast.makeText(getApplicationContext(),"Correo envidado para que el usuario valide la cuenta recien creada" , Toast.LENGTH_LONG).show();
                roltxt.setText(ucliente.rol);
                nombretxt.setText(ucliente.nombre);
                apellidotxt.setText(ucliente.apellido);
                correotxt.setText(ucliente.correo);
                contrasenatxt.setText(ucliente.contrasena);
                fechatxt.setText(ucliente.fecha);
                generotxt.setText(ucliente.genero);
                direcciontxt.setText(ucliente.direccion);
                telefonotxt.setText(ucliente.telefono);
            }else{
                Toast.makeText(getApplicationContext(),"No" , Toast.LENGTH_LONG).show();
            }
        }

    }

    //POST: UPDATE USER
    public class HTTPAsyncTask4 extends AsyncTask<String, Void, String>{

        @Override
        protected String doInBackground(String... strings) {
            String s = "No";

            try {
                s = post_Updateuser(strings[0]);
            } catch (IOException e) {
                e.printStackTrace();
            } catch (JSONException e) {
                e.printStackTrace();
            }
            return s;
        }

        protected void onPostExecute(String result) {
            super.onPostExecute(result);
            if (result.equals("Si")) {
              //  Toast.makeText(getApplicationContext(),"Se actualizo los datos del usuario" , Toast.LENGTH_LONG).show();
                mySnackbar = Snackbar.make(findViewById(R.id.myCoordinatorLayout2),"Se actualizo los datos del usuario",Snackbar.LENGTH_LONG);
                mySnackbar.show();
            }else{
                Toast.makeText(getApplicationContext(),"No" , Toast.LENGTH_LONG).show();
            }
        }

    }

    //POST: ELIMINAR USUARIO
    public class HTTPAsyncTask5 extends AsyncTask<String, Void, String>{

        @Override
        protected String doInBackground(String... strings) {
            String s = "No";

            try {
                s = post_deleteuser(strings[0]);
            } catch (IOException e) {
                e.printStackTrace();
            } catch (JSONException e) {
                e.printStackTrace();
            }

            return s;
        }

        protected void onPostExecute(String result) {
            super.onPostExecute(result);

            if (result.equals("Si")) {
                mySnackbar = Snackbar.make(findViewById(R.id.myCoordinatorLayout2),"Se Elimino el usuario correctamente",Snackbar.LENGTH_LONG);
                mySnackbar.show();
                Vaciar();
            }else{
                Toast.makeText(getApplicationContext(),"No" , Toast.LENGTH_LONG).show();
            }

        }

    }

}
