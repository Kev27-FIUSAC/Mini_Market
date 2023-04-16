import { Component, OnInit } from '@angular/core';
import { BDServicioService } from '../bdservicio.service';
import { HttpClient } from '@angular/common/http';
import { Registro } from '../registro';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  public name;
  public apll;
  public contrasena;
  public email;
  public telefono;
  public fotografia:string = "";
  public genero;
  public dates;
  public fecharegistro;
  public ubicacion;
  public archivo2: Array<File>;

  constructor(private bdservicio: BDServicioService, private router: Router, private http: HttpClient, private toastr: ToastrService) { }

  ngOnInit() {
  }


  handleFileSelect(evt){
      var files = evt.target.files;
      var file = files[0];
    
    if (files && file) {
        var reader = new FileReader();

        reader.onload =this._handleReaderLoaded.bind(this);

        reader.readAsBinaryString(file);
    }
  }

  _handleReaderLoaded(readerEvt) {
     var binaryString = readerEvt.target.result;
            this.fotografia= btoa(binaryString);
            console.log(btoa(binaryString));

            //Convertir a blob
            var img = this.imagentoblob(btoa(binaryString));
            var rest = new FormData();
            rest.append("source",img);
            console.log(rest);

    }


  private imagentoblob(imagen){
     var byte = atob(imagen);
     var ab = new ArrayBuffer(byte.length);
     var ia = new Uint8Array(ab);

     for(var i=0; i < byte.length; i++){
       ia[i] = byte.charCodeAt(i);
     }

     return new Blob([ab],{type: 'image/png'});

  }

  onFileChange(e){
      this.archivo2 = e.target.files;
      console.log(this.archivo2[0]);
  }

  registrar(){

    var fec = new Date();
    this.fecharegistro = fec.getDate()+"/"+(fec.getMonth()+1)+"/"+fec.getFullYear();
    var y = (<HTMLInputElement>document.getElementById("generoHombre")).checked;
    var sexo;
    if(y){
      console.log("Es hombre");
      sexo = "Masculino";
    }else{
      console.log("Es mujer");
      sexo = "Femenino";
    }

    var rando = Math.floor(Math.random() * (6-1)+1);
    console.log(rando);
    var claser: string = "";
    var gananciar: number = 0.00;

    if(rando == 1){
      console.log('Diamante');
      claser = 'Diamante';
      gananciar = 50000.00;
    }else if(rando == 2){
      console.log('Platino');
      claser = 'Platino';
      gananciar = 25000.00;
    }else if(rando == 3){
      console.log('Oro');
      claser = 'Oro';
      gananciar = 10000.00;
    }else if(rando == 4){
      console.log('Plata');
      claser = 'Plata';
      gananciar = 5000.00;
    }else if(rando == 5){
      console.log('Bronce');
      claser = 'Bronce';
      gananciar = 1000.00;
    }

    /*
      id_usuario: Int32Array;
    nombre: string;
    apellidos: string;
    contrasena: string;
    correo: string;
    telefono: string;
    genero: string;
    fecha: string;
    fecha_registro: string;
    direccion: string;
    id_particion: Int32Array;
    rol: string;
    */

    /*Formulario*/
    var Datos = new FormData();
    Datos.append("rol","cliente");
    Datos.append("nombre",this.name);
    Datos.append("apellido",this.apll);
    Datos.append("contrasena",this.contrasena);
    Datos.append("correo",this.email);
    Datos.append("telefono",this.telefono);
    Datos.append("fotografia",this.archivo2[0]);
    Datos.append("genero",sexo);
    Datos.append("fechanacimiento",this.dates);
    Datos.append("fecharegistro",this.fecharegistro);
    Datos.append("direccion",this.ubicacion);
    Datos.append("creditodisponible",gananciar.toString());
    Datos.append("gananciaobtenida","0");
    Datos.append("clasecliente",claser);
    Datos.append("estado","0");

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
    this.bdservicio.set_user(Datos).subscribe((resp: any) => {
        if(resp.result == 'Ok'){
            this.toastr.success('Para completar el registro, vaya a su correo y valide la cuenta', 'Registro Completado');
        }else{
          this.toastr.error('No se pudo completar el registro','Error de registro');
        }
    }); 
  }

  public acceder(){
      this.router.navigate(['/acceder']);
  }

}
