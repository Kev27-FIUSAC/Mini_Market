import { Component, OnInit } from '@angular/core';
import { BDServicioService } from '../bdservicio.service';

@Component({
  selector: 'app-root-user',
  templateUrl: './root-user.component.html',
  styleUrls: ['./root-user.component.css']
})
export class RootUserComponent implements OnInit {

  constructor(private bdservicio: BDServicioService) { 
  	this.bdservicio.imprimir_rol();
  }

  ngOnInit() {
  }

}
