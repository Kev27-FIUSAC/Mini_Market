import { Component, OnInit } from '@angular/core';
import { BDServicioService } from '../bdservicio.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export interface Demo{
	value: string;
	viewValue: string;
}

export interface Clave{
	clave: number;
}

export interface Gproducto{
	producto: number
}

@Component({
  selector: 'app-clienteproducto',
  templateUrl: './clienteproducto.component.html',
  styleUrls: ['./clienteproducto.component.css']
})
export class ClienteproductoComponent implements OnInit {

	public imagenpp = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAEsASwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooo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FFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH//2Q=='; 
	demos: Array<Demo> = [];
	public Nombretxt = "";
	public Codigotxt = "";
	public Categoriatxt = "";
	public Preciotxt = "";
	public Cantidadtxt = "";
	public Colortxt = "";
	public archivo2: Array<File>;
	public imagenp: string ="";
	public Descripciontxt: string = "";
	public idproducto = 0;


  constructor(private bdservicio: BDServicioService, private router: Router,private http: HttpClient,private toastr: ToastrService) {

            //Verifica si esta logeado
     if(this.bdservicio.obtener_login()){
      //Verifica si es usuario cliente
      if(this.bdservicio.get_rol() == 'cliente'){
        //Cargar datos e imagen
        this.imagenp = this.bdservicio.get_imagen();
        this.cargar_select();
      }else{
        //Acceso denegado
        this.router.navigate(['/error']);
      }
     }else{
      //No esta logeado, ir a acceder
      this.router.navigate(['/acceder']);
     }

  }

  ngOnInit() {
  }


  cargar_select(){
  		let json: Clave = {
  			clave: parseInt(this.bdservicio.obtener_id())
  		};
  		this.bdservicio.getnombresproductos(json).subscribe((resp: any) => {
  			console.log(resp);
  			if(resp.result.length != 0){
  				for(let a = 0; a < resp.result.length; a++ ){
    			let s: Demo = {
    				value: resp.result[a].correlativo,
    				viewValue: resp.result[a].producto
    			}
    			this.demos.push(s);
    		}
    		  console.log(this.demos);
  			}
  		});
  }


  onFileChange(e){
      this.archivo2 = e.target.files;
      console.log(this.archivo2[0]);

      if (this.archivo2 && this.archivo2[0]) {
        var reader = new FileReader();

        reader.onload =this._handleReaderLoaded.bind(this);

        reader.readAsBinaryString(this.archivo2[0]);
    }


  }

   _handleReaderLoaded(readerEvt) {
     var binaryString = readerEvt.target.result;
     		this.imagenpp = "";
            this.imagenpp = btoa(binaryString);
    }

  salir(){
  	this.bdservicio.cerrar_sesion();
  }


  clickEvent(dato_seleccionado: string){
  	this.idproducto = parseInt(dato_seleccionado);
  	let json: Gproducto = {
  		producto: this.idproducto
  	}
  	this.get_productos(json);
  	//Obtiene los comentarios que estan relacionados con el producto
  }

   public get_productos(dato: any){
  	this.bdservicio.obtener_producto(dato).subscribe((resp: any) =>{
  		console.log(resp.result);
  		var valor = resp.result.PRECIO;
  		this.Codigotxt = resp.result.correlativo;
  		this.Nombretxt = resp.result.producto;
  		this.Categoriatxt = resp.result.categoria;
  		this.imagenpp = resp.result.IMAGEN;
  		this.Preciotxt = valor.toFixed(2);
	    this.Cantidadtxt = resp.result.CANTIDAD;
	    this.Colortxt = resp.result.COLOR;
  	});
  }

  anadirproducto(){
  	var Datos = new FormData();
  	Datos.append("nombre",this.Nombretxt);
  	Datos.append("codigo",this.Codigotxt);
  	Datos.append("categoria",this.Categoriatxt);
  	Datos.append("precio",this.Preciotxt);
  	Datos.append("imagen",this.archivo2[0]);
  	Datos.append("clave",this.bdservicio.obtener_id());
  	Datos.append("cantidad",this.Cantidadtxt);
  	Datos.append("color",this.Colortxt);
  	Datos.append("descripcion",this.Descripciontxt);
  	console.log(Datos);
  	this.bdservicio.set_producto(Datos).subscribe((resp: any) =>{
  		if(resp.result == 'Ok'){
  			this.toastr.success('Producto añadido','Admo Productos');
  		}else{
  			this.toastr.error('No se pudo añadir el producto','Error Admo Producto');
  		}
  	});
  }

  actualizar_imagen(){
  	var Datos = new FormData();
  	Datos.append("prodcuto",this.idproducto.toString());
  	Datos.append("imagen",this.archivo2[0]);
  	//Actualizar foto
  	this.bdservicio.updateimagenproducto(Datos).subscribe((resp: any) => {
  		if(resp.result == 'Ok'){
  			this.toastr.success('Imagen actualizada','Admo Productos');
  		}else{
  			this.toastr.error('No se pudo actualizar imagen','Error Admo Producto');
  		}
  	});
  }

}
