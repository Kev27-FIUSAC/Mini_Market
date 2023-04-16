import { Component, OnInit } from '@angular/core';
import { BDServicioService } from '../bdservicio.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';

export interface Data{
	value: string;
}

export interface Clave{
	clave: number;
}

export interface Factura{
	factura: number;
}


@Component({
  selector: 'app-factura-cliente',
  templateUrl: './factura-cliente.component.html',
  styleUrls: ['./factura-cliente.component.css']
})

export class FacturaClienteComponent implements OnInit {

	public NoFactura: number = 0;
	public Fechalb: string = "";
	public Totallb: string = "";
	displayedColumns: string[] = ['Correlativo','Producto','Cantidad','Valor'];
	dataSource = [];
	demos: Array<Data> = [];
	public fotografia: string = "";
	public idFact: number = 0;

  constructor(private bdservicio: BDServicioService, private router: Router,private http: HttpClient) {
  	 //Verifica si esta logeado
  	 if(this.bdservicio.obtener_login()){
  	 	//Verifica si es usuario cliente
  	 	if(this.bdservicio.get_rol() == 'cliente'){
  	 		//Cargar datos e imagen
  	 		this.fotografia = this.bdservicio.get_imagen();
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
  	}
  	console.log(json);
  	this.bdservicio.obtenermisfacturas(json).subscribe((resp: any) =>{

  		for(let a = 0; a < resp.result.length; a++ ){
    			let s: Data = {
    				value: resp.result[a].value
    			}
    			this.demos.push(s);
    		}
  	});

  }


  clickEvent(dato_seleccionado: string){
  	this.dataSource = [];
  	this.idFact = parseInt(dato_seleccionado);
  	this.NoFactura = this.idFact;
  	let json: Factura = {
  		factura: this.idFact
  	}
  	this.obtenerfact(json);
  	this.obtenerdetallefact(json);
  }


  public obtenerfact(idf: any){
  	console.log(idf);
  	this.bdservicio.obtenerfactura(idf).subscribe((resp: any) => {
  		this.Fechalb = resp.result.fecha;
  		this.Totallb = resp.result.total;
  	})
  }

  public obtenerdetallefact(idf: any){
  	console.log(idf);
  	this.bdservicio.obtenerdetallefactura(idf).subscribe((resp: any) =>{

  		if(resp.result.length != 0){
  			this.dataSource = resp.result;
  		}

  	});
  }

  public salir(){
  	this.bdservicio.cerrar_sesion();
  }

}
