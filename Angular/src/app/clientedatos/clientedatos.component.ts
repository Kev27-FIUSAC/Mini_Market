import { Component, OnInit } from '@angular/core';
import { BDServicioService } from '../bdservicio.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Acceso } from '../acceso';
import { UserUpdate } from '../user-update';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

export interface Bitacora{
  clave: number;
  fecha: string;
  accion: string;
}

@Component({
  selector: 'app-clientedatos',
  templateUrl: './clientedatos.component.html',
  styleUrls: ['./clientedatos.component.css']
})
export class ClientedatosComponent implements OnInit {

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
  public Ganacia: number = 0;
  public archivo2: Array<File>;

  constructor(private bdservicio: BDServicioService, private router: Router, private http: HttpClient,private toastr: ToastrService) { 
  	
       //Verifica si esta logeado
     if(this.bdservicio.obtener_login()){
      //Verifica si es usuario cliente
      if(this.bdservicio.get_rol() == 'cliente'){
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
        this.imagenp2 = "";
        this.imagenp2 = btoa(binaryString);
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
            this.Ganacia = resp.result.ganancia;
    });

    }

    public actualizar_datos(){
    		let datos: UserUpdate = {
    				clave: Number(this.bdservicio.obtener_id()),
    				rol: '',
    				nombre: this.Nombretxt,
					apellido: this.Apellidotxt,
					contrasena: this.Contrasenatxt,
					correo: this.Correotxt,
					telefono: this.Telefonotxt,
					genero: this.Generotxt,
					fotografia: null,
					fecha_nacimiento: this.Fechatxt,
					direccion: this.Direcciontxt
    		}

    		this.bdservicio.update_usuarios(datos).subscribe((resp: any) => {
  			console.log(resp);
  				 	if(resp.result == 'Ok'){
  				 		  this.toastr.success('Datos actualizados correctamente', 'Mis Datos');
  				 	}else{
  				 		  this.toastr.error('No se pudo actualizar los datos','Error');
  				 	}
  			});

        var fec = new Date();
        let json: Bitacora = {
        clave: parseInt(this.bdservicio.obtener_id()),
        fecha: fec.getDate()+"/"+(fec.getMonth()+1)+"/"+fec.getFullYear(),
        accion: 'Actualizo datos del perfil'
      };
      console.log('UPDATE Bitacora');
      console.log(json);
      this.bdservicio.anadirbitacora(json).subscribe((resp: any) =>{
         if(resp.result = 'Ok'){
          console.log('Ejecutado');
         }
      });

    }

    public actualizar_foto(){
      var Datos = new FormData();
      Datos.append("clave",this.bdservicio.obtener_id());
      Datos.append("foto",this.archivo2[0]);

      this.bdservicio.nuevafotoperfil(Datos).subscribe((resp: any) =>{
          if(resp.result == 'Ok'){
              this.toastr.success('Fotografia Actualizada', 'Mis Datos');
              this.bdservicio.actualizar_imagen(this.imagenp2);
          }else{
              this.toastr.error('No se pudo actualizar la foto','Error');
          }
      });

      var fec = new Date();
   // this.fecharegistro = fec.getDate()+"/"+(fec.getMonth()+1)+"/"+fec.getFullYear();

      let json: Bitacora = {
        clave: parseInt(this.bdservicio.obtener_id()),
        fecha: fec.getDate()+"/"+(fec.getMonth()+1)+"/"+fec.getFullYear(),
        accion: 'Actualizo la foto de perfil'
      };
      console.log('UPDATE IMAGE Bitacora');
      console.log(json);
      this.bdservicio.anadirbitacora(json).subscribe((resp: any) =>{
         if(resp.result = 'Ok'){
          console.log('Ejecutado');
         }
      });

    }

    public salir(){
    		this.bdservicio.cerrar_sesion();
    }

}
