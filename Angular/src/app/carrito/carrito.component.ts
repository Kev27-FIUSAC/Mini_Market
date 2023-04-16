import { Component, OnInit } from '@angular/core';
import { BDServicioService } from '../bdservicio.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export interface Data{
	value: string;
	viewValue: string;
}

export interface User{
	clave: number;
}

export interface Delete{
	correlativo: number;
	carrito: number;
}

export interface Correojson{
	correo: string;
	producto: string;
	valor: number;
}

export interface Abonojson{
	clave: number;
	valor: number;
}

export interface Descontarproducto{
	idetalle: number;
	cantidad: number;
}

export interface Finalizarprocess{
	clave: number;
	carrito: number;
	valor: number;
	fecha: string;
}

export interface PruebaDatos{
	codigo: number,
	propietario: string,
	producto: string,
	correo: string,
	cantidad: number,
	precio: number,
	clave: number,
	idcatalogo: number
}

export interface DetCarrito{
	id: number;
}

const PRUEBA: PruebaDatos[] = [
	{codigo: 0, producto: '', correo: '', idcatalogo:0, clave: 0, cantidad: 0, precio: 0, propietario: ''}
]

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  
  public fecharegistro;
  public Idcarrito: number = 0;
  public Total: number = 0;
  public fotografia: string = "";
  displayedColumns: string[] = ['codigo','propietario','producto','cantidad','precio'];
  dataSource = PRUEBA;
  demos: Array<Data> = [];
  public Productoslb: string = "";
  public Cantidadlb: string = "";
  public Valorbl: string = "";
  public iddetallcarro: number = 0;


  constructor(private bdservicio: BDServicioService, private router: Router,private http: HttpClient,private toastr: ToastrService) { 
  	
       //Verifica si esta logeado
     if(this.bdservicio.obtener_login()){
      //Verifica si es usuario cliente
      if(this.bdservicio.get_rol() == 'cliente'){
        //Cargar datos e imagen
        this.fotografia = this.bdservicio.get_imagen();
        var fec = new Date();
        this.fecharegistro = fec.getDate()+"/"+(fec.getMonth()+1)+"/"+fec.getFullYear();
        this.obtener_carrito1();
        this.solicitar_productos();
        this.obtener_detalle();

      }else{
        //Acceso denegado
        this.router.navigate(['/error']);
      }
     }else{
      //No esta logeado, ir a acceder
      this.router.navigate(['/acceder']);
     }

  //  console.log(this.bdservicio.getcarro());
  	
  }

  ngOnInit() {
  	
  	
  }

  salir(){
  	 this.bdservicio.cerrar_sesion();
  }

  public obtener_carrito1(){
  		let json: User={
  			clave: Number(this.bdservicio.obtener_id())
  		};
  		console.log(json);
  		this.bdservicio.solicitar_carrito(json).subscribe((resp: any) =>{
  			this.Idcarrito = resp.result.id;
  			this.Total = resp.result.total;
  		});
  }

  public obtener_detalle(){
  		let pid: DetCarrito ={
  			id: Number(this.bdservicio.getcarro())
  		};
  		console.log(pid);
  		this.bdservicio.get_carrito(pid).subscribe((resp: any) =>{
  			this.dataSource = resp.result;
  		});
  }


  public realizar_compra(){
  	   for(let a=0; a < this.dataSource.length; a++){
  	   		console.log('------Enviar correo------');
  	   		console.log(this.dataSource[a]);
  	   		
  	   		let json1: Correojson ={
  	   			correo: this.dataSource[a].correo,
  	   			producto: this.dataSource[a].producto,
  	   			valor: this.dataSource[a].precio
  	   		}
  	   		console.log(json1);
  	   		this.bdservicio.enviarcorreo(json1).subscribe((resp: any) =>{
  	   			if(resp.result == 'Ok'){
  	   				this.toastr.success('Correo Enviado','Correo');
  	   			}else{
  	   				this.toastr.error('No se envio correo '+this.dataSource[a].correo,'Error correo');
  	   			}
  	   		}); 

  	   		console.log('------Realizar abono------');
  	   		let json2: Abonojson = {
  	   			clave: this.dataSource[a].clave,
  	   			valor: this.dataSource[a].precio
  	   		};
  	   		console.log(json2)
  	  		this.bdservicio.abonarcredito(json2).subscribe((resp: any) =>{
  	   			if(resp.result == 'Ok'){
  	   				this.toastr.success('Ganancia acreditada','Abono vendedor');
  	   			}else{
  	   				this.toastr.error('No se pudo hacer el abono');
  	   			}
  	   		}); 
  	   			
  	   		console.log('--------Descontar producto-----');
  	   		let json3: Descontarproducto = {
  	 			idetalle: this.dataSource[a].idcatalogo,
  	   			cantidad: this.dataSource[a].cantidad
  	   		};
  	   		console.log(json3);

  	   		this.bdservicio.descontarcantidadproduct(json3).subscribe((resp: any) =>{
  	   			if(resp.result == 'Ok'){
  	   				this.toastr.success('Producto descontado','Producto vendedor');
  	   			}else{
  	   				this.toastr.error('No se pudo hacer');
  	   			}
  	   		}); 

  	   		//correo final

  	   }

  	   /* Finaliza el proceso */
  	   console.log('--------Finalizar proceso------');
  	   		//clave,carrito,valor carrito,fecha
  	   		let json4: Finalizarprocess = {
  	   			clave: parseInt(this.bdservicio.obtener_id()),
  	   			carrito: this.Idcarrito,
  	   			valor: this.Total,
  	   			fecha: this.fecharegistro
  	   		};
  	   		console.log(json4);
  	   		this.bdservicio.finzalizarproceso(json4).subscribe((resp: any) => {

  	   			if(resp.result == 'Ok'){
  	   				this.toastr.success('Compra realizada','Producto vendedor');
  	   				this.dataSource = [];
  	   				this.Total = 0;
  	   			}
  	   		}); 

  }

  public solicitar_productos(){
  	 
  	 console.log(this.bdservicio.getcarro());
  	  let json: DetCarrito = {
  	  	 id: parseInt(this.bdservicio.getcarro())
  	  };
  	  console.log(json);
  	  this.bdservicio.getcarritonombre(json).subscribe((resp: any) =>{
  			console.log(resp.result);

  			for(let a = 0; a < resp.result.length; a++ ){
    			let s: Data = {
    				value: resp.result[a].correlativo,
    				viewValue: resp.result[a].producto
    			}
    			this.demos.push(s);
    		}

    		console.log(this.demos);
  		});
  }

  clickEvent(dato_seleccionado: string){
  	
  	this.iddetallcarro = parseInt(dato_seleccionado);
  	let json: DetCarrito = {
  		id: this.iddetallcarro
  	};
  	
  	this.bdservicio.detallecarrito(json).subscribe((resp: any) =>{
  		var p = resp.result.valor;
  		this.Productoslb = resp.result.producto;
  		this.Cantidadlb = resp.result.cantidad;
  		this.Valorbl = p.toFixed(2);
  	});

  }


  public deletecarrop(){
  	//obtener carrito,correlativo a eliminar 
  	let json: Delete = {
  		correlativo: this.iddetallcarro,
  		carrito: parseInt(this.bdservicio.getcarro())
  	}
  	console.log(json);
  	this.bdservicio.deletepcarrito(json).subscribe((resp: any) =>{
  		if(resp.result == 'Ok'){
  			this.toastr.success('Producto eliminado del carrito','Mi Carrito');
  		}else{
  			this.toastr.error('No se pudo eliminar del carrito','Error Carrito');
  		}
  	});
  }

}
