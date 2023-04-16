import { Component, OnInit } from '@angular/core';
import { BDServicioService } from '../bdservicio.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { Papa } from 'ngx-papaparse';
import { Productocsv } from '../productocsv';
import { ToastrService } from 'ngx-toastr';

export interface FileCarga{
  archivo: File;
  clave: number;
}

@Component({
  selector: 'app-clientecarga',
  templateUrl: './clientecarga.component.html',
  styleUrls: ['./clientecarga.component.css']
})
export class ClientecargaComponent implements OnInit {

	public imagenp = "";
  public archivo: string[] = [];
  public archivo2: Array<File>;

  constructor(private bdservicio: BDServicioService, private router: Router,private http: HttpClient, private papa: Papa,private toastr: ToastrService) { 
      
     //Verifica si esta logeado
     if(this.bdservicio.obtener_login()){
      //Verifica si es usuario cliente
      if(this.bdservicio.get_rol() == 'cliente'){
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


  onFileChange(e){
      this.archivo2 = e.target.files;
      console.log(this.archivo2[0]);
  }

  handleFileSelect(evt){
      var files = evt.target.files;
      var file = files[0];
    
      console.log(file);

      let lectura = new FileReader();
      lectura.readAsText(file);

      lectura.onload = () => {
        let dato = lectura.result;
        let array = (<string>dato).split(/\r\n|\n/);
        this.archivo = array;

      }
      console.log(this.archivo);
  }

  public salir(){
      this.bdservicio.cerrar_sesion();
  }

  public cargar_datos(){
    var Datos = new FormData();
    Datos.append("clave",this.bdservicio.obtener_id());

   /* for(let i = 0; i < this.archivo2.length; i++){
      Datos.append("uploads[]",this.archivo2[i],this.archivo2[i].name);
    } */
    Datos.append("Archivo",this.archivo2[0]);
    console.log(Datos);
    this.bdservicio.subirarchivo(Datos).subscribe((resp: any) =>{
            if(resp.result == 'Ok'){
              console.log("Fin");
              this.toastr.success('Datos cargados','Carga de productos');
            }else{
              this.toastr.error('No se pudo','Error de carga');
            }
      });
  /*  console.log(this.archivo);

    for( let a=1; a < this.archivo.length - 1; a++){
       //let linea = (<string>this.archivo[a]).split(',');
       console.log((<string>this.archivo[a]));
       this.papa.parse((<string>this.archivo[a]),{
          complete: (result) => {
          //  console.log("resultado: ",result.data);
          this.enviar_datos(result.data);
          }
       });

     /*  let carga: Productocsv = {
          codigo: linea[0].trim(),
          nombre: linea[1].trim(),
          precio: linea[2].trim(),
          categoria: linea[3].trim(),
          imagen: linea[4].trim(),
          color: linea[5].trim(),
          cantidad: linea[6].trim()
       }; 
      // console.log(carga);
    } */

 //   this.toastr.success('Carga finalizada con exito', 'Carga de productos');

  }

  public enviar_datos(dato: string[]){
       "use strict";
       console.log(dato);
       let carga: Productocsv = {
          id: parseInt(this.bdservicio.obtener_id()),
          codigo: parseInt(dato[0][0]),
          nombre: dato[0][1],
          precio: parseFloat(dato[0][2]),
          categoria: dato[0][3],
          imagen: dato[0][4],
          colorp: dato[0][5],
          cantidad: parseInt(dato[0][6])
       }; 
       console.log(carga);
       this.bdservicio.insertar_producto2(carga); 
  }

}
