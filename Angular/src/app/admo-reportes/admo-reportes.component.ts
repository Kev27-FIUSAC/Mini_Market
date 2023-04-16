import { Component, OnInit, ViewChild } from '@angular/core';
import { Acceso } from '../acceso';
import { BDServicioService } from '../bdservicio.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

//JSON para obteener la cantidad
export interface Cantidadj {
  cantidad: number;
}

export interface Demo {
	ID: string;
}

//JSON Fecha
export interface Fechajson{
  fecha: string;
}

//JSON AÑO
export interface FechaY{
  numero: number;
}

const DATA_DEMO: Demo[ ] = [
	{ID: "AX "}
];

@Component({
  selector: 'app-admo-reportes',
  templateUrl: './admo-reportes.component.html',
  styleUrls: ['./admo-reportes.component.css']
})
export class AdmoReportesComponent implements OnInit {

	displayedColumns: string[] = ['Clave','Rol','Nombre','Apellidos','Correo','Fecha','Registro','Ubicacion','Genero','Telefono'];
	dataSource = DATA_DEMO;
  displayedColumns2: string[] = ['Codigo','Producto','Cantidad']; //productos con  x cantidad
  displayedColumns3: string[] = ['Nombre','Apellido','Cantidad']; // top 3 de clientes con mas productos
  displayedColumns4: string[] = ['Id','Codigo','Producto','Color','Puntuacion']; // Promedio de puntuacion 5,4,3,2,1
  displayedColumns5: string[] = ['Codigo','Producto','Precio','Categoria','Cantidad']; //Listado de todos los productos indicando en que categoría se encontraban
  displayedColumns6: string[] = ['Clave','Nombre','Apellido','Rol','Genero','Nacimiento'];//Listado de todos los administradores de sexo femenino que hayan debajo de Y año
  displayedColumns7: string[] = ['Id','Producto','Precio','Color','Puntuacion']; //Top 3 de productos con peor puntuacion
  displayedColumns8: string[] = ['Codigo','Producto','Fecha','Total']; // Todos los productos indicando la cantidad de comentarios asignados, publicados en Y fecha
  displayedColumns9: string[] = ['ID','NOMBRE','APELLIDO','GENERO','ROL','GANANCIA']; // Los clientes que más ganancias han generado ordenados a mayor a menor
  dataSource1 = []; // productos con x cantidad
  dataSource2 = []; // top 3 de clientes con mas productos
  dataSource3 = []; // Promedio de puntuacion 5,4,3,2,1
  dataSource4 = []; // Listado de todos los productos indicando en que categoría se encontraban
  dataSource5 = []; // Listado de todos los administradores de sexo femenino que hayan debajo de Y año
  dataSource6 = []; // Top 3 de productos con peor puntuacion
  dataSource7 = []; // Todos los productos indicando la cantidad de comentarios asignados, publicados en Y fecha
  dataSource8 = []; // Listado de todos los servicios de ayuda de sexo masculino que hayan nacido arriba de X año
  dataSource9 = []; // Los clientes que más ganancias han generado ordenados a mayor a menor
  public imagenp:string = "";
  public cantidadp: string = "";
  public mujerafecha: string = "";
  public fechatxt: string = "";
  public hombrefecha: string = "";

  constructor(private bdservicio: BDServicioService, private http: HttpClient, private router: Router,private toastr: ToastrService) { 

     //Verifica si esta logeado
     if(this.bdservicio.obtener_login()){
      //Verifica si es usuario cliente
      if(this.bdservicio.get_rol() == 'Admo'){
        //Cargar datos e imagen
        this.imagenp = this.bdservicio.get_imagen();

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

  public cargar_tabla_usuarios(){
  		let idnum:number = 0;
    	idnum = Number(this.bdservicio.obtener_id());
    	let acces: Acceso = { clave: idnum };
    	this.bdservicio.getTable(acces).subscribe((resp: any) => {
      		console.log(resp.result);
      		this.dataSource = resp.result;
      		
    });

  }

  salir(){
    this.bdservicio.cerrar_sesion();
  }


  
  obtenerhombresfecha(){
    this.dataSource8 = [];
    let json: FechaY = {
      numero: parseInt(this.hombrefecha)
     };
    this.bdservicio.retornarhombresayuda(json).subscribe((resp: any) => {
        if(resp.result.length != 0){
         this.dataSource8 = resp.result;
         this.toastr.success('Reporte preparado','Reportes');
       }else{
         this.toastr.error('No hay hombres con ese año','Error Reporte');
       }
    });
  }


  obtenermujeresyfecha(){
     this.dataSource5 = [];
     let json: FechaY = {
      numero: parseInt(this.mujerafecha)
     };
     console.log(json);
     this.bdservicio.retornarmujeresadmoy(json).subscribe((resp: any) => {
        if(resp.result.length != 0){
         this.dataSource5 = resp.result;
         this.toastr.success('Reporte preparado','Reportes');
       }else{
         this.toastr.error('No hay mujeres con ese año','Error Reporte');
       }
     });

  }

  //obteneravgproductos
  getpuntuacionmayormenor(){
      this.dataSource3 = [];
      this.bdservicio.obteneravgproductos().subscribe((resp: any) =>{
        if(resp.result.length != 0){
         this.dataSource3 = resp.result;
         this.toastr.success('Reporte preparado','Reportes');
       }else{
         this.toastr.error('No hay productos con votacion','Error Reporte');
       }
      });
  }


  get_top3clienteproducto(){
    //obtenertop3clieproduct
    this.dataSource2 = [];
    this.bdservicio.obtenertop3clieproduct().subscribe((resp: any) => {
       if(resp.result.length != 0){
         this.dataSource2 = resp.result;
         this.toastr.success('Reporte preparado','Reportes');
       }else{
         this.toastr.error('No hay catalogos','Error Reporte');
       }
    });
  }


  get_ganaciacliente(){
    this.dataSource9 = [];
    this.bdservicio.obtenerganaciaclientes().subscribe((resp: any) =>{
        if(resp.result.length != 0){
         this.dataSource9 = resp.result;
         this.toastr.success('Reporte preparado','Reportes');
       }else{
         this.toastr.error('No hay ganacias','Error Reporte');
       }
    });
  }


  get_prodcutoscategorias(){
    this.dataSource4 = [];
    this.bdservicio.todosproductoscategoria().subscribe((resp: any) =>{
         if(resp.result.length != 0){
         this.dataSource4 = resp.result;
         this.toastr.success('Reporte preparado','Reportes');
       }else{
         this.toastr.error('No hay ganacias','Error Reporte');
       }
    });
  }

  get_cantidad_p(){
    
    let json: Cantidadj = {
      cantidad: parseInt(this.cantidadp)
    };
    console.log(json);
    this.dataSource1 = [];
    //Obtener datos
    this.bdservicio.obtenercantidadp(json).subscribe((resp: any) => {
        console.log(resp.result.length);
        if(resp.result.length != 0){
            this.toastr.success('Reporte preparado','Reportes');
            this.dataSource1 = resp.result;
        }else{
            this.toastr.error('No hay productos con esa cantidad','Error Reporte');
        }
    });

  }


  obtenercomentariostotalfecha(){
      this.dataSource7 = [];
      let json: Fechajson = {
        fecha: this.fechatxt
      };
      console.log(json);
      this.bdservicio.comentariosproductos(json).subscribe((resp: any) =>{
          if(resp.result.length != 0){
            this.toastr.success('Reporte preparado','Reportes');
            this.dataSource7 = resp.result;
        }else{
            this.toastr.error('No hay productos con esa cantidad','Error Reporte');
        }
      });
  }

  obtenerpeoresproductos(){
    this.dataSource6 = [];
    this.bdservicio.obtener3peorproducto().subscribe((resp: any) => {
         if(resp.result.length != 0){
            this.toastr.success('Reporte preparado','Reportes');
            this.dataSource6 = resp.result;
        }else{
            this.toastr.error('No hay productos con esa cantidad','Error Reporte');
        }
    });
  }

}
