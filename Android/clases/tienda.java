package com.example.alieshpo;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Base64;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;
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

public class tienda extends AppCompatActivity {

    public String idU;
    private int Carrito = -1;
    private double subTotal = 0.00;
    private int Productoid= 0,codeuser=0;
    private Spinner listaproducto;
    private List<String> ProductosL;
    private List<Integer> Iddetalles;
    private TextView producto,dueno,categoria,precio,cantidad,color,promedio,subtotallb;
    private CheckBox chek;
    private EditText cantidad2;
    private ImageView foto;
    private DatosProducto dproducto = null;
    //Snackbar mySnackbar = Snackbar.make(view, stringId, duration);
    Snackbar mySnackbar;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_tienda);
        idU = getIntent().getExtras().getString("clave");
        Carrito = getIntent().getExtras().getInt("carro");
      //  Toast.makeText(getApplicationContext(),"Datos correctos cliente, id:"+idU,Toast.LENGTH_LONG).show();

        listaproducto = findViewById(R.id.productospinner1);
        subtotallb = findViewById(R.id.subtotal1lb);
        producto = findViewById(R.id.producto1lb);
        dueno = findViewById(R.id.dueno1lb);
        categoria = findViewById(R.id.categoria1lb);
        precio = findViewById(R.id.precio1lb);
        cantidad = findViewById(R.id.cantidad1lb);
        color = findViewById(R.id.color1lb);
        foto = findViewById(R.id.productoview);
        promedio =findViewById(R.id.promedio1lb);
        chek = findViewById(R.id.checkBox1);
        cantidad2 = findViewById(R.id.cantidad1txt);
        ProductosL = new ArrayList<>();
        Iddetalles = new ArrayList<>();
        solicitar_datos();
        cantidad2.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable s) {

                subTotal = (Integer.parseInt(s.toString())*1.00) * Double.parseDouble(precio.getText().toString());
                subtotallb.setText(String.valueOf(subTotal));
            }
        });

    }

    public void anadirCarrito(View v){
         if(chek.isChecked()){
         //    float p = (float) ((Integer.parseInt(cantidad2.getText().toString())*1.00) * Float.parseFloat(precio.getText().toString()));
        //     String js = JsonClase.setCarrito(Carrito,Productoid,Integer.parseInt(cantidad2.getText().toString()),subTotal);
        //     Toast.makeText(this,js , Toast.LENGTH_LONG).show();
             new tienda.HTTPAsyncTask4().execute("http://10.42.0.1:4201/insertarcarrito"); //Endpoint
         }else{
             Toast.makeText(this,"No a seleccionado el producto" , Toast.LENGTH_LONG).show();
         }
    }

    private void solicitar_datos(){
        new tienda.HTTPAsyncTask().execute("http://10.42.0.1:4201/alie/getproductos"); //Endpoint
    }

    private void obtener_producto(){
        new tienda.HTTPAsyncTask2().execute("http://10.42.0.1:4201/getdatosproducto"); //Endpoint
    }

    private void get_promedio(){
        new tienda.HTTPAsyncTask3().execute("http://10.42.0.1:4201/getpromedio"); //Endpoint
    }

    private void obtener_datos(){
        obtener_producto();
        get_promedio();
    }

    private String post_listaproductos(String url) throws IOException, JSONException{
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

    private String post_obtenerpromedio(String url) throws IOException, JSONException{
        JSONObject resp = null;
        StringEntity json = null;
        HttpResponse response;
        HttpClient cliente = new DefaultHttpClient();
        HttpPost envio = new HttpPost(url);
        String js = JsonClase.idproducto(Productoid);
        json = new StringEntity(js);
        envio.addHeader("Content-Type","application/json");
        envio.setEntity(json);
        response = cliente.execute(envio); //Realizar peticion
        String re = EntityUtils.toString(response.getEntity());
        resp = new JSONObject(re);
        JSONObject result = resp.getJSONObject("result");
        if( result.getString("promedio") != null){
            return  result.getString("promedio");
        }else{
            return null;
        }
    }


    private String post_getproducto(String url) throws IOException, JSONException {
        dproducto = null;
        JSONObject resp = null;
        StringEntity json = null;
        HttpResponse response;
        HttpClient cliente = new DefaultHttpClient();
        HttpPost envio = new HttpPost(url);
        Producto p = new Producto(Productoid);
        String sjson = JsonClase.productojson(p);
        json = new StringEntity(sjson);
        envio.addHeader("Content-Type","application/json");
        envio.setEntity(json);
        response = cliente.execute(envio); //Realizar peticion
        String re = EntityUtils.toString(response.getEntity());
        resp = new JSONObject(re);
        JSONObject result = resp.getJSONObject("result");
        dproducto = new DatosProducto(result.getString("producto"),result.getString("dueño"),result.getString("categoria"),result.getString("PRECIO"),result.getString("CANTIDAD"),result.getString("COLOR"),result.getString("IMAGEN"),result.getInt("coduser"));
        return "Si";
    }

    private String post_anadircarrito(String url)  throws IOException, JSONException{
        JSONObject resp = null;
        StringEntity json = null;
        HttpResponse response;
        HttpClient cliente = new DefaultHttpClient();
        HttpPost envio = new HttpPost(url);
     //   float p = (float) ((Integer.parseInt(cantidad2.getText().toString())*1.00) * Float.parseFloat(precio.getText().toString()));
        String js = JsonClase.setCarrito(Carrito,Productoid,Integer.parseInt(cantidad2.getText().toString()),subTotal);
        json = new StringEntity(js);
        envio.addHeader("Content-Type","application/json");
        envio.setEntity(json);
        response = cliente.execute(envio); //Realizar peticion
        String re = EntityUtils.toString(response.getEntity());
        resp = new JSONObject(re);
        String result = resp.getString("result");

        if(result.equals("Ok")){
            return "Si";
        }else{
            return "No";
        }

    }

    public void regresar(View v){
        ProductosL.clear();
        Iddetalles.clear();
        Intent putcli = new Intent(this,Maincliente.class);
        putcli.putExtra("clave",idU);
        startActivity(putcli);
    }

    //--- llena los datos a los spinners
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
            String datos = "";

            try {
                datos = post_listaproductos(strings[0]);
            } catch (IOException e) {
                e.printStackTrace();
            } catch (JSONException e) {
                e.printStackTrace();
            }
            return datos;
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);

            try{
                JSONArray array = new JSONArray(result);
                try{
                    for(int a=0; a < array.length();a++){
                        JSONArray objeto = array.getJSONArray(a);
                        ProductosL.add(objeto.getString(1));
                        Iddetalles.add(objeto.getInt(0));
                    }

                    ArrayAdapter<String> adapter = new ArrayAdapter<String>(getApplicationContext(), android.R.layout.simple_spinner_dropdown_item,ProductosL);
                    adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                    listaproducto.setAdapter(adapter);
                    listaproducto.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener(){

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
                            Productoid = Iddetalles.get(position);
                            subtotallb.setText("0");
                            obtener_datos();
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
                    Toast.makeText(getApplicationContext(),e.getMessage(),Toast.LENGTH_LONG).show();
                }
            } catch (JSONException e) {
                e.printStackTrace();
                Toast.makeText(getApplicationContext(),e.getMessage(),Toast.LENGTH_LONG).show();
            }

        }

    }

    //-------- obtiene los datos del producto
    public class HTTPAsyncTask2 extends AsyncTask<String, Void, String>{

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
            String d="No";

            try {
                d = post_getproducto(strings[0]);
            } catch (IOException e) {
                e.printStackTrace();
            } catch (JSONException e) {
                e.printStackTrace();
            }

            return d;
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);

            if(result.equals("Si")){
        //        Toast.makeText(getApplicationContext(),"Producto listo" , Toast.LENGTH_LONG).show();

                producto.setText(dproducto.producto);
                dueno.setText(dproducto.dueno);
                categoria.setText(dproducto.categoria);
                precio.setText(dproducto.precio);
                cantidad.setText(dproducto.cantidad);
                color.setText(dproducto.color);
                codeuser = dproducto.codeuser;
                byte[]  imageBytes = Base64.decode(dproducto.imagen, Base64.DEFAULT);
                Bitmap decodedImage = BitmapFactory.decodeByteArray(imageBytes, 0,imageBytes.length);
                foto.setImageBitmap(decodedImage); //Inserta la imagen, pueden investigar como añadirle zoom.
          //      String js = JsonClase.idproducto(Productoid);
          //      Toast.makeText(getApplicationContext(),js , Toast.LENGTH_LONG).show();
            }else{
                Toast.makeText(getApplicationContext(),"No" , Toast.LENGTH_LONG).show();
            }
        }

    }

    //-----Obtiene el promedio
    public class HTTPAsyncTask3 extends AsyncTask<String, Void, String>{

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
            String s = null;

            try {
                s = post_obtenerpromedio(strings[0]);
            } catch (IOException e) {
                e.printStackTrace();
            } catch (JSONException e) {
                e.printStackTrace();
            }

            return  s;
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);

            if(result != null){
                promedio.setText(result);
            }else{
                promedio.setText("0");
            }

        }
    }

    //---------- Añadir a carrito
    public class HTTPAsyncTask4 extends AsyncTask<String, Void, String>{

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
                r = post_anadircarrito(strings[0]);
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
              //  Toast.makeText(getApplicationContext(),"El producto "+producto.getText().toString()+" a sido insertado al carrito" , Toast.LENGTH_LONG).show();
                mySnackbar = Snackbar.make(findViewById(R.id.myCoordinatorLayout),"El producto "+producto.getText().toString()+" a sido insertado al carrito",Snackbar.LENGTH_LONG);
                mySnackbar.show();
                subtotallb.setText("0");
            }else{
                Toast.makeText(getApplicationContext(),"No" , Toast.LENGTH_LONG).show();
            }

        }

    }

}
