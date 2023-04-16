import { Component, OnInit } from '@angular/core';
import { BDServicioService } from '../bdservicio.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.css']
})
export class BitacoraComponent implements OnInit {

	imagenp = "";
	displayedColumns: string[] = ['Correlativo','Clave','Cliente','Fecha','Accion'];
	dataSource1 = []; // productos con x cantidad

  constructor(private bdservicio: BDServicioService, private router: Router, private http: HttpClient,private toastr: ToastrService) { 
  		 //Verifica si esta logeado
     if(this.bdservicio.obtener_login()){
      //Verifica si es usuario cliente
      if(this.bdservicio.get_rol() == 'Admo'){
        //Cargar datos e imagen
    	this.imagenp = this.bdservicio.get_imagen();
    	this.cargarbitacora();

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

  cargarbitacora(){
  	this.bdservicio.getbitacora().subscribe((resp: any) =>{
  		if(resp.result.length != 0){
  			this.dataSource1 = resp.result;
  		}
  	});
  }

    salir(){
    this.bdservicio.cerrar_sesion();
  }

}
