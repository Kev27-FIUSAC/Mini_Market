import { Component, OnInit } from '@angular/core';
import * as angular from 'angular';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { BDServicioService } from '../bdservicio.service';
import { Acceso } from '../acceso';

@Component({
  selector: 'app-root-perfil',
  templateUrl: './root-perfil.component.html',
  styleUrls: ['./root-perfil.component.css']
})
export class RootPerfilComponent implements OnInit {

	public UserNametxt : string;
  public Correotxt: string;
  public Paswoordtxt: string;
  public Fechatxt: string;

  constructor(private bdservicio: BDServicioService, private http: HttpClient, private router: Router) { 
  		//UserNametxt
  		/*var approot = angular.module('rootApp',[]);
  		approot.controller('rootUsertxt',function($scope){
  			$scope.UserNametxt = "root";
  		}); */
  		
      console.log(this.bdservicio.obtener_id());
      this.cargar_datos( );

  }

  ngOnInit() {
  }

  cargar_datos() {
    let idnum:number = 0;
    idnum = Number(this.bdservicio.obtener_id());
    let acces: Acceso = { clave: idnum }; 
    console.log(acces);
    this.bdservicio.get_datos(acces).subscribe((resp: any) => {
      console.log(resp);
      this.UserNametxt = resp.result.nombre;
      this.Correotxt = resp.result.correo;
      this.Paswoordtxt = resp.result.password;
      this.Fechatxt = resp.result.fecha;
    });
    
  }
  
}
