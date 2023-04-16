package com.example.alieshpo;

import android.content.Intent;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
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

public class MainActivity extends AppCompatActivity {

    EditText correo,contrasena;
    private boolean bandera = false;
    private int RolU = -1;
    public String idu;
    private int Carrito = -1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        correo = findViewById(R.id.correotxt);
        contrasena = findViewById(R.id.contrasenatxt);

    }

    public void acceder(View v){
        new HTTPAsyncTask().execute("http://10.42.0.1:4201/alie/acceso");

        if(bandera){
           /* Intent putt = new Intent(this,navegacion.class);
            putt.putExtra("id", Di0);
            putt.putExtra("name",Name0);
            startActivity(putt); */
            switch (RolU){
                case 1:
                //    Intent pt = new Intent(this,AdmoMain.class);
                 //   pt.putExtra("clave",idu);
                 //   startActivity(pt);
                    break;
                case 2:
                /*    Intent putadmo = new Intent(this,AdmoPrincipal.class);
                    putadmo.putExtra("id",Di0);
                    putadmo.putExtra("name",Name0);
                    startActivity(putadmo); */
         //           Toast.makeText(getApplicationContext(),"Datos correctos cliente, id:"+idu,Toast.LENGTH_LONG).show();
         //           Intent putcli = new Intent(this,Maincliente.class);
        //            putcli.putExtra("clave",idu);
        //            startActivity(putcli);
                    break;
                case 3:
                    break;

            }
        }
    }

    public void ir_bienvenida(View v){
        Intent putt = new Intent(this,bienvenida.class);
        startActivity(putt);
      /*  Intent putt = new Intent(this,bienvenida.class);
        startActivity(putt); */
    }

    public void ir_registro(View v){
        Intent putt = new Intent(this,Registro.class);
        startActivity(putt);

    }


    private String logear(String url) throws IOException, JSONException {
        JSONObject resultado;
        JSONArray arreglo;
        HttpResponse response;
        HttpClient cliente = new DefaultHttpClient();
        HttpPost envio = new HttpPost(url);
        String correo = this.correo.getText().toString();
        String contrasena = this.contrasena.getText().toString();
        Persona n = new Persona(correo,contrasena);
        String sjn = JsonClase.iniJson(n);
        StringEntity json = new StringEntity(sjn);
        envio.addHeader("Content-Type","application/json");
        envio.setEntity(json);
        response = cliente.execute(envio); //Ejectua la peticion.
        String re = EntityUtils.toString(response.getEntity()); //Obtiene el resultado del servidor

        try{
            resultado = new JSONObject(re); //obtiene el json
            JSONObject result = resultado.getJSONObject("result");
            idu = result.getString("id");

            /* json a retornar */
            if(!idu.equals("-1")){
                Carrito = result.getInt("carrito");
                return  result.getString("rol");
            }else{
                return "No";
            }
        }catch (JSONException e){
            e.printStackTrace();
        }
        return null;
    }

    //AnsyncTask realiza la peticion POST, para iniciar sesion
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

            try {
                try {
                    String ms = logear(strings[0]);

                    return ms;
                } catch (JSONException e) {
                    e.printStackTrace();
                    return "Error!";
                }
            } catch (IOException e) {
                return "Unable to retrieve web page. URL may be invalid.";
            }
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);
            // ******* En esta parte se obtiene el resultado del servidor *****
            if(!result.equals("No")){
                if(result.equals("Admo")){
                      RolU = 1;
                    Intent pt = new Intent(getApplicationContext(),AdmoMain.class);
                    pt.putExtra("clave",idu);
                    startActivity(pt);
                }else if(result.equals("cliente")){
                    RolU = 2;
                    Intent putcli = new Intent(getApplicationContext(),Maincliente.class);
                    putcli.putExtra("clave",idu);
                    putcli.putExtra("carro",Carrito);
                    startActivity(putcli);
                }
                 bandera = true;
            }else{
                Toast.makeText(getApplicationContext(),"Datos invalidos",Toast.LENGTH_LONG).show();
                  bandera = false;
                  RolU = -1;
            }
        }
    }

}
