package com.example.alieshpo;

public class DatosProducto {
    public String producto,dueno,categoria,precio,cantidad,color,imagen;
    public int codeuser;

    public DatosProducto(String producto,String dueno, String categoria, String precio, String cantidad, String color, String imagen,int codeuser){
        this.producto = producto;
        this.dueno = dueno;
        this.categoria = categoria;
        this.precio = precio;
        this.cantidad = cantidad;
        this.color = color;
        this.imagen = imagen;
        this.codeuser = codeuser;
    }

}
