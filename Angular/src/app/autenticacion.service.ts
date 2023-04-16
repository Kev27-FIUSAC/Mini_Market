import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  token;

  constructor(private http: HttpClient, private router: Router) { }

    cerrar_sesion(){
      localStorage.removeItem('token');
    }

    public obtener_login(): boolean {
      return (localStorage.getItem('token') !== null);
    }

}
