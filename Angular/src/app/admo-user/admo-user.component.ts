import { Component, OnInit } from '@angular/core';
import { Acceso } from '../acceso';
import { BDServicioService } from '../bdservicio.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { UserUpdate } from '../user-update'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admo-user',
  templateUrl: './admo-user.component.html',
  styleUrls: ['./admo-user.component.css']
})
export class AdmoUserComponent implements OnInit {

	public UserNametxt: string;
	public Nametxt: string;
	public Apellidostxt: string;
	public Paswoordtxt: string;
	public Correotxt: string;
	public Telefonotxt: string;
	public Generotxt: string;
	public Fechatxt: string;
	public Direcciontxt: string;
	public Roltitle: string;
  imagenp: string = "";
  imagenp2: string = "";
  public archivo2: Array<File>;

  constructor(private bdservicio: BDServicioService, private http: HttpClient, private router: Router,private toastr: ToastrService) { 


      //Verifica si esta logeado
     if(this.bdservicio.obtener_login()){
      //Verifica si es usuario cliente
      if(this.bdservicio.get_rol() == 'Admo'){
        //Cargar datos e imagen
        this.imagenp = this.bdservicio.get_imagen();
        this.imagenp2 = this.imagenp;
        this.cargar_datos( );
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

  cargar_datos() {
    let idnum:number = 0;
    idnum = Number(this.bdservicio.obtener_id());
    let acces: Acceso = { clave: idnum }; 
    console.log(acces);
    this.bdservicio.get_datos(acces).subscribe((resp: any) => {
      console.log(resp);
      this.Nametxt = resp.result.nombre;
      this.Apellidostxt = resp.result.apellido;
      this.Correotxt = resp.result.correo;
      this.Paswoordtxt = resp.result.password;
      this.Fechatxt = resp.result.fecha;
      this.Telefonotxt = resp.result.telefono;
      this.Generotxt = resp.result.genero;
      this.Direcciontxt = resp.result.direccion;
      this.Roltitle = resp.result.rol;
    });
    
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

 /*id: number;
	nombre: string;
	rol: string;
	apellidos: string;
	password: string;
	correo: string;
	fecha: string;
	sexo: string;
	telefono:string;
	direccion: string;*/
  public actualizar_Datos(){
  		let json: UserUpdate = {
				clave: Number(this.bdservicio.obtener_id()),
				rol: this.bdservicio.get_rol(),  
  				nombre: this.Nametxt,
  				apellido: this.Apellidostxt,
				contrasena: this.Paswoordtxt,
				correo: this.Correotxt,
				fecha_nacimiento: this.Fechatxt,
        fotografia: '',
				genero: this.Generotxt,
				telefono: this.Telefonotxt,
				direccion: this.Direcciontxt
  		}
  		console.log(json);
  		this.bdservicio.update_usuarios(json).subscribe((resp: any) => {
  			console.log(resp);
        if(resp.result == 'Ok'){
          this.toastr.success('Datos actualizados correctamente', 'Mis datos');
        }else{
          this.toastr.error('No se pudo actualizar los datos','Mis Datos');
        }
  		});
  }

  public actualizar_foto(){

  }

}
