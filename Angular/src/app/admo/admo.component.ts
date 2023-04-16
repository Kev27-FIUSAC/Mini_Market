import { Component, OnInit } from '@angular/core';
import { BDServicioService } from '../bdservicio.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PaginaDatos } from '../pagina-datos';
import { Pagina } from '../pagina';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admo',
  templateUrl: './admo.component.html',
  styleUrls: ['./admo.component.css']
})
export class AdmoComponent implements OnInit {

  public misiontxt: string;
  public visiontxt: string;
  public serviciotxt: string;
  public nosotrostxt: string;
  nombreadmo;
  public imagenp:string = "";

  constructor(private bdservicio: BDServicioService, private router: Router, private http: HttpClient,private toastr: ToastrService) { 

       //Verifica si esta logeado
     if(this.bdservicio.obtener_login()){
      //Verifica si es usuario cliente
      if(this.bdservicio.get_rol() == 'Admo'){
        //Cargar datos e imagen
        this.obtener_pagina();
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

  obtener_pagina(){

    let codigo: Pagina ={
      id: 1
    };

    console.log(codigo);
    this.bdservicio.get_pagina(codigo).subscribe((resp: any) => {
      console.log(resp);
      this.misiontxt = resp.result.mision;
      this.visiontxt = resp.result.vision;
      this.serviciotxt = resp.result.servicio;
      this.nosotrostxt = resp.result.nostros;
    });
  }

  public modificar_pagina(){
      let acceso: PaginaDatos = { 
        mision: this.misiontxt, 
        vision: this.visiontxt,
        servicio: this.serviciotxt,
        nosotro: this.nosotrostxt 
      };
      console.log(acceso);
      this.bdservicio.modificar_pagina(acceso).subscribe((resp: any) => {
          if(resp.result == 'Ok'){
               this.toastr.success('Pagina Actualizada','Administracion Alie-Sell');
          }else{
               this.toastr.error('No se puede actualizar la pagina','Error');
          }
      });
  }

  public cerrar_sesion(){
      this.bdservicio.cerrar_sesion();
      this.router.navigate(['/inicio']);
  }

}
