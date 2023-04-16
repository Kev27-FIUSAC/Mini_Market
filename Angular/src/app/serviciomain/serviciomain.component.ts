import { Component, OnInit } from '@angular/core';
import { BDServicioService } from '../bdservicio.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-serviciomain',
  templateUrl: './serviciomain.component.html',
  styleUrls: ['./serviciomain.component.css']
})
export class ServiciomainComponent implements OnInit {

	imagenp = '';

  constructor(private bdservicio: BDServicioService, private router: Router,private http: HttpClient) {
  		 //Verifica si esta logeado
  	 if(this.bdservicio.obtener_login()){
  	 	//Verifica si es usuario cliente
  	 	if(this.bdservicio.get_rol() == 'Servicio Ayuda'){
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

}
