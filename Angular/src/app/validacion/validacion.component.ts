import { Component, OnInit } from '@angular/core';
import { BDServicioService } from '../bdservicio.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export interface Claveu{
	correo: string
}

@Component({
  selector: 'app-validacion',
  templateUrl: './validacion.component.html',
  styleUrls: ['./validacion.component.css']
})
export class ValidacionComponent implements OnInit {

  

  constructor(private bdservicio: BDServicioService,private ruta: ActivatedRoute, private router: Router,private http: HttpClient,private toastr: ToastrService) {



  }

  ngOnInit() {
  	let json: Claveu = {
  		correo: this.ruta.snapshot.paramMap.get('correo')
  	};
  	console.log(json);
  	this.bdservicio.activateacount(json).subscribe((resp: any) =>{
            if(resp.result == 'Ok'){
              this.toastr.success('Cuenta Activada','Alie-Sell');
              console.log('Si');
            }else{
              this.toastr.error('No se pudo activar la cuenta','Error de validacion');
            }
      });
  }

  ir_sesion(){
  		this.router.navigate(['/acceder']);
  }

}
