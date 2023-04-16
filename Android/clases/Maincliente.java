package com.example.alieshpo;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

public class Maincliente extends AppCompatActivity {

    public String idU;
    public int carrito;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maincliente);
        idU = getIntent().getExtras().getString("clave");
        carrito = getIntent().getExtras().getInt("carro");
        Toast.makeText(getApplicationContext(),"Datos correctos cliente, id:"+idU,Toast.LENGTH_LONG).show();
    }

    public void ir_tienda(View v){
        Intent putcli = new Intent(this,tienda.class);
        putcli.putExtra("clave",idU);
        putcli.putExtra("carro",carrito);
        startActivity(putcli);
    }

    public void salir(View v){
        Intent putcli = new Intent(this,MainActivity.class);
        startActivity(putcli);
    }
}
