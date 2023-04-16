package com.example.alieshpo;


import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.TableLayout;
import android.widget.TableRow;

import java.util.ArrayList;

public class AdmoRe2 extends AppCompatActivity {

    private TableLayout tabla; // Layout donde se pintará la tabla
    private ArrayList<TableRow> filas; // Array de las filas de la tabla
    private int FILAS, COLUMNAS; // Filas y columnas de nuestra tabla

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admo_re2);
    }
}
