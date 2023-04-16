package com.example.alieshpo;

import android.content.Intent;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

public class bienvenida extends AppCompatActivity {

    private TextView eslogan,mision,vision,nosotros,servicio;
    private Pagina DatosPagina = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_bienvenida);
        eslogan = findViewById(R.id.esloganlb);
        mision = findViewById(R.id.misionlb);
        vision = findViewById(R.id.visionlb);
        nosotros = findViewById(R.id.nosotroslb);
        servicio = findViewById(R.id.serviciolb);
        cargar();
    }

    private void cargar(){
        new bienvenida.HTTPAsyncTask().execute("http://10.42.0.1:4201/get_pagina"); //Endpoint
    }

    public void ir_acceso(View v){
        Intent putt = new Intent(this,MainActivity.class);
        startActivity(putt);
    }

    public String post_pagina(String url) throws IOException, JSONException {
        JSONObject resp = null;
        StringEntity json = null;
        HttpResponse response;
        HttpClient cliente = new DefaultHttpClient();
        HttpPost envio = new HttpPost(url);
        String js = JsonClase.idproducto(1);
        json = new StringEntity(js);
        envio.addHeader("Content-Type","application/json");
        envio.setEntity(json);
        response = cliente.execute(envio); //Realizar peticion
        String re = EntityUtils.toString(response.getEntity());
        resp = new JSONObject(re);
        JSONObject result = resp.getJSONObject("result");
        DatosPagina = new Pagina(result.getString("eslogan"),result.getString("mision"),result.getString("vision"),result.getString("servicio"),result.getString("nostros"));
        return "Si";
    }


    //POST: Obtener los datos de la pagina
    public class HTTPAsyncTask extends AsyncTask<String, Void, String> {

        @Override
        protected String doInBackground(String... strings) {
            String r = "No";

            try {
                r =  post_pagina(strings[0]);
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
            if(result.equals("Si")){
                eslogan.setText(DatosPagina.eslogan);
                mision.setText(DatosPagina.mision);
                vision.setText(DatosPagina.vision);
                servicio.setText(DatosPagina.servicio);
                nosotros.setText(DatosPagina.nostros);
            }
        }

    }

}
