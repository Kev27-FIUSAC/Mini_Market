package com.example.alieshpo;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

public class AdmoMain extends AppCompatActivity {

    public String idU;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admo_main);
        idU = getIntent().getExtras().getString("clave");
    }

    public void ir_user(View v){
        Intent pt = new Intent(this,AdmoUser.class);
        pt.putExtra("clave",idU);
        startActivity(pt);
    }
    public void salir(View v){
        Intent putcli = new Intent(this,MainActivity.class);
        startActivity(putcli);
    }
}
