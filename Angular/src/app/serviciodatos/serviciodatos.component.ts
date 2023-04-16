import { Component, OnInit } from '@angular/core';
import { BDServicioService } from '../bdservicio.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { UserUpdate } from '../user-update';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

export interface Acceso{
	clave: number;
}

@Component({
  selector: 'app-serviciodatos',
  templateUrl: './serviciodatos.component.html',
  styleUrls: ['./serviciodatos.component.css']
})
export class ServiciodatosComponent implements OnInit {

	public imagenp = "";
	public imagenp2 = "";
	public Nombretxt: string = "";
	public Apellidotxt: string = "";
	public Correotxt: string = "";
	public Contrasenatxt: string = "";
	public Telefonotxt: string = "";
	public Fechatxt: string = "";
	public Generotxt: string = "";
	public Direcciontxt: string = "";
  public archivo2: Array<File>;
  	public Puntuacion: number = 0;

  constructor(private bdservicio: BDServicioService, private router: Router, private http: HttpClient,private toastr: ToastrService) {
  		 //Verifica si esta logeado
  	 if(this.bdservicio.obtener_login()){
  	 	//Verifica si es usuario cliente
  	 	if(this.bdservicio.get_rol() == 'Servicio Ayuda'){
  	 		//Cargar datos e imagen
  	 		this.imagenp = this.bdservicio.get_imagen();
  	 		this.imagenp2 = this.imagenp;
  	 		this.cargar_Datos();
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

      public cargar_Datos(){
    		let idnum:number = 0;
    		idnum = Number(this.bdservicio.obtener_id());
    		let acces: Acceso = { clave: idnum }; 
    		console.log(acces);

    		this.bdservicio.get_datos(acces).subscribe((resp: any) => {
      			console.log(resp);
      			this.Nombretxt = resp.result.nombre;
      			this.Apellidotxt = resp.result.apellido;
      			this.Correotxt = resp.result.correo;
      			this.Contrasenatxt = resp.result.password;
      			this.Fechatxt = resp.result.fecha;
      			this.Telefonotxt = resp.result.telefono;
      			this.Generotxt = resp.result.genero;
      			this.Direcciontxt = resp.result.direccion;
    });

    }

    public salir(){
    		this.bdservicio.cerrar_sesion();
    }

}
