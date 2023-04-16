import { Component, OnInit } from '@angular/core';
import { Acceso } from '../acceso';
import { BDServicioService } from '../bdservicio.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export interface Demo{
	value: string;
	viewValue: string;
}

export interface NewUser{
   rol: string;
   nombre: string;
   apellido: string;
   correo: string;
   contrasena: string;
   telefono: string;
   genero: string;
   fotografia: string;
   fechanacimiento: string;
   fecharegistro;
   direccion: string;
   creditodisponible:number;
   gananciaobtenida:number;
   clasecliente: string;
   estado: number;
 }

 export interface UpdateUser{
   clave: number;
   nombre: string;
   apellido: string;
   correo: string;
   contrasena: string;
   telefono: string;
   sexo: string;
   fecha: string;
   direccion: string;
 }

@Component({
  selector: 'app-admo-users',
  templateUrl: './admo-users.component.html',
  styleUrls: ['./admo-users.component.css']
})
export class AdmoUsersComponent implements OnInit {

	public Nametxt: string;
	public Apellidostxt: string;
	public Paswoordtxt: string;
	public Correotxt: string;
	public Telefonotxt: string;
	public Generotxt: string;
	public Fechatxt: string;
	public Direcciontxt: string;
	public Roltxt: string;
   public SelectUser: string;
   demos: any;
   public id_user: string;
   public imagenp:string = "";
   imagenp2: string = "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";
  /* demos: Demo[] = [
   		{value: 'username1', viewValue: 'User1'}
   ]; */

  constructor(private bdservicio: BDServicioService, private http: HttpClient, private router: Router,private toastr: ToastrService) { 
  	

       //Verifica si esta logeado
     if(this.bdservicio.obtener_login()){
      //Verifica si es usuario cliente
      if(this.bdservicio.get_rol() == 'Admo'){
        //Cargar datos e imagen
        this.cargar_username();
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

  public cargar_username(){
  		let idnum:number = 0;
    	idnum = Number(this.bdservicio.obtener_id());
    	let acces: Acceso = { clave: idnum }; 
    	this.bdservicio.get_usernames(acces).subscribe((resp: any) =>{
    		console.log(resp.result.length);
    		
    		this.demos = resp.result;
    		console.log(this.demos);
    	});
  }

  clickEvent(dato_seleccionado: string){
  	console.log(dato_seleccionado);
  	this.id_user = dato_seleccionado;
  	this.cargar_datos(dato_seleccionado);

  }

  cargar_datos(id: string) {
    let idnum:number = 0;
    idnum = Number(id);
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
      this.Roltxt = resp.result.rol;
    });
    
  }

  public crear_user(){
  		console.log(this.id_user);
      var fec = new Date();
   // this.fecharegistro = fec.getDate()+"/"+(fec.getMonth()+1)+"/"+fec.getFullYear();
   
      /* Unicamente cambia los datos del usuario*/
      //Si es cliente generar la clase y la ganancia
      var clienteclas="";
      var creditop=0.00;

      if(this.Roltxt == 'cliente'){
        var rando = Math.floor(Math.random() * (6-1)+1);
        if(rando == 1){
          clienteclas = 'Diamante';
          creditop = 50000.00;
        }else if(rando == 2){
          clienteclas = 'Platino';
          creditop = 25000.00;
        }else if(rando == 3){
          clienteclas = 'Oro';
          creditop = 10000.00;
        }else if(rando == 4){
          clienteclas = 'Plata';
          creditop = 5000.00;
        }else if(rando == 5){
          clienteclas = 'Bronce';
          creditop = 1000.00;
        }


      }else{
        clienteclas = 'ninguno';
      }

      //rol,nombre,apellido,contrasena,correo,telefono,fotografia,genero,fechanacimiento,fecharegistro,direccion,creditodisponible,gananciaobtenida,clasecliente,estado

      let registro: NewUser = {
        rol: this.Roltxt,
        nombre: this.Nametxt,
        apellido: this.Apellidostxt,
        correo: this.Correotxt,
        contrasena: this.Paswoordtxt,
        telefono: this.Telefonotxt,
        fotografia: null,
        genero: this.Generotxt,
        fechanacimiento: this.Fechatxt,
        fecharegistro: fec.getDate()+"/"+(fec.getMonth()+1)+"/"+fec.getFullYear(),
        direccion: this.Direcciontxt,
        creditodisponible: creditop,
        gananciaobtenida: 0,
        clasecliente: clienteclas,
        estado: 0
      }
      console.log(registro);

       /*let registro: Registro = { clave: 0,
    rol: 'cliente',
    nombre: this.name,
    apellido: this.apll,
    contrasena: this.contrasena,
    correo: this.email,
    telefono: this.telefono,
    fotografia: this.fotografia,
    genero: sexo,
    fechanacimiento: this.dates,
    fecharegistro: this.fecharegistro,
    direccion: this.ubicacion,
    creditodisponible: gananciar,
    gananciaobtenida: 0,
    clasecliente: claser,
    estado: 0
    };
    console.log(registro); */
    this.bdservicio.set_user2(registro).subscribe((resp: any) => {
        if(resp.result == 'Ok'){
          console.log('Usuario registrado');
            this.toastr.success('correo del usuario enviado', 'Admo User Completado');
        }else{
          this.toastr.error('No se pudo completar el registro','Error Admo User');
        }
    }); 

  }

  public update_usuario(){
    let json: UpdateUser = {
      clave: parseInt(this.id_user),
      nombre: this.Nametxt,
      apellido: this.Apellidostxt,
      correo: this.Correotxt,
      contrasena: this.Paswoordtxt,
      telefono: this.Telefonotxt,
      sexo: this.Generotxt,
      fecha: this.Fechatxt,
      direccion: this.Direcciontxt
    };
    console.log(json);
    this.bdservicio.update_usuarios(json).subscribe((resp: any) => {
        console.log(resp);
            if(resp.result == 'Ok'){
                this.toastr.success('Datos actualizados correctamente', 'Admo User');
            }else{
                this.toastr.error('No se pudo actualizar los datos','Admo User');
            }
        });
  }

  public eliminar_user(){
  		let idnum:number = 0;
    	idnum = Number(this.id_user);
    	let acces: Acceso = { clave: idnum };
    	this.bdservicio.delete_user(acces).subscribe((resp: any) =>{
        if(resp.result == 'Si'){
          this.toastr.success('Se elimino el usuario correctamente', 'Admo User');
        }else{
          this.toastr.error('No se pudo actualizar eliminar el usuario','Admo User');
        }

    	}); 
  }

}