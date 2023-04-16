import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class BDServicioService {

  llave;
  idU = 0;
  rol;
  imagenuser = "";
  idcarrito = 0;
  credito = 0.00;
  
  constructor(private http: HttpClient, private router: Router,private toastr: ToastrService) { }

  iniciar_sesion(acces: any): Observable<any> {
    const js = JSON.stringify(acces);
    var id;
    let parametros = js;
    console.log(parametros);
    let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.post('http://10.42.01:4201/alie/acceso', parametros, { headers: cabezera}).subscribe((resp: any) => {
          
          if(resp.result.rol == 'root'){
              this.router.navigate(['/rootUser']);
          }else if(resp.result.rol == 'Admo'){
            this.router.navigate(['/administrador']);
          }else if(resp.result.rol == 'cliente'){
            this.router.navigate(['/cliente']);
          }else if(resp.result.rol == 'Servicio Ayuda'){
            this.router.navigate(['/servicio/principal']);
          }

        localStorage.setItem('llave',resp.result.token);
        localStorage.setItem('idU',resp.result.id);
        localStorage.setItem('rol',resp.result.rol);
        localStorage.setItem('imagenuser',resp.result.foto);
        localStorage.setItem('idcarrito',resp.result.carrito);
        localStorage.setItem('credito',resp.result.credito);

    },
      error => {
        //Aca por si sale mal, mostrar mensaje de datos incorrectos 
        console.log("Error en la consulta ");
        this.toastr.error('Error con los credenciales','Error Acceso');
      });
    return id;
  }

  public modificar_pagina(acces: any): Observable<any>{
    let para = JSON.stringify(acces);
    let cabezera = new HttpHeaders().set('Content-Type','application/json');
    return this.http.post('http://10.42.01:4201/update_page', para, { headers: cabezera });
  }

  public set_user(acces: any): Observable<any>{
    return this.http.post('http://10.42.01:4201/insertarUser', acces);
  }

  public set_user2(acces: any): Observable<any>{
    let para = JSON.stringify(acces);
    let cabezera = new HttpHeaders().set('Content-Type','application/json');
    return this.http.post('http://10.42.01:4201/setUseradmo', para, { headers: cabezera });
  }

  /* Bitacora */
  public anadirbitacora(acces: any): Observable<any>{
    let para = JSON.stringify(acces);
    let cabezera = new HttpHeaders().set('Content-Type','application/json');
    return this.http.post('http://10.42.01:4201/setBitacora', para, { headers: cabezera });
  }

  public getbitacora(): Observable<any>{
    //getBitacora
    let cabezera = new HttpHeaders().set('Content-Type','application/json');
    return this.http.post('http://10.42.01:4201/getBitacora',{ headers: cabezera });
  }

  public set_producto(acces: any): Observable<any>{
    //setProductoI
    return this.http.post('http://10.42.01:4201/setProductoI', acces);
  }

  public activateacount(acces: any): Observable<any>{
      let para = JSON.stringify(acces);
      let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
      return this.http.post('http://10.42.01:4201/validate', para, { headers: cabezera });
  }

  public get_datos(acces: any): Observable<any> {
    let para = JSON.stringify(acces);
    console.log(para);
    let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post('http://10.42.01:4201/demo', para, { headers: cabezera });
  }


  public get_pagina(acces: any): Observable<any>{
    let para = JSON.stringify(acces);
    let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post('http://10.42.01:4201/get_pagina',para,{headers: cabezera});
  }


  public get_usernames(id: any): Observable<any> {
     let para = JSON.stringify(id);
     console.log(para);
     let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post('http://10.42.01:4201/get_usuarios', para, { headers: cabezera });
  } 

  public getTable(id: any): Observable<any> {
     let para = JSON.stringify(id);
     console.log(para);
     let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post('http://10.42.01:4201/getUserTable', para, { headers: cabezera });
  }

  public update_usuarios(id: any): Observable<any>{
    let para = JSON.stringify(id);
     console.log(para);
     let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post('http://10.42.01:4201/update_user', para, { headers: cabezera });
  }

  public delete_user(id: any): Observable<any>{
      let para = JSON.stringify(id);
     console.log(para);
     let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
     return this.http.post('http://10.42.01:4201/deleteuser', para, { headers: cabezera });
  }

  public async insertar_producto2(acces: any): Promise<any> {


  }

  public insert_producto(acces: any): Observable<any>{
     let para = JSON.stringify(acces);
     console.log(para);
     let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
     return this.http.post('http://10.42.01:4201/insertar_producto', para, { headers: cabezera });
  }

  public obtener_productos(acces: any): Observable<any>{
    let para = JSON.stringify(acces);
    let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
     return this.http.post('http://10.42.01:4201/alie/getproductos', para, { headers: cabezera });
  }

  public obtener_producto(acces: any): Observable<any>{
      let para = JSON.stringify(acces);
    let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
     return this.http.post('http://10.42.01:4201/getdatosproducto', para, { headers: cabezera });
  }


  public solicitar_carrito(acces: any): Observable<any>{
      let para = JSON.stringify(acces);
      let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
     return this.http.post('http://10.42.01:4201/getcarrito1', para, { headers: cabezera });
  }

  public get_carrito(acces: any): Observable<any>{
      let para = JSON.stringify(acces);
      let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
      return this.http.post('http://10.42.01:4201/getdetallescarro', para, { headers: cabezera });
  }

  public setcarrito(acces: any): Observable<any>{
     //insertarcarrito
     let para = JSON.stringify(acces);
     let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
     return this.http.post('http://10.42.01:4201/insertarcarrito', para, { headers: cabezera });
  }

  public getcarritonombre(acces: any): Observable<any>{
    //selectnamecarrito
     let para = JSON.stringify(acces);
     let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
     return this.http.post('http://10.42.01:4201/selectnamecarrito', para, { headers: cabezera });
  }

  public detallecarrito(acces: any): Observable<any>{
    //
    let para = JSON.stringify(acces);
    let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post('http://10.42.01:4201/obtenerdetallecarrito', para, { headers: cabezera });
  }

  public eliminarcarrito(acces: any): Observable<any>{
    return null;
  }

  public getpromedio1(acces: any): Observable<any>{
     let para = JSON.stringify(acces);
     let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
     return this.http.post('http://10.42.01:4201/getpromedio', para, { headers: cabezera });
  }

  public setpuntuacion(acces: any): Observable<any>{
     //insertarpromedio
     let para = JSON.stringify(acces);
     let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
     return this.http.post('http://10.42.01:4201/insertarpromedio', para, { headers: cabezera });
  }

  public deletepcarrito(acces: any): Observable<any>{
     //deletedelcarrito
     let para = JSON.stringify(acces);
     let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
     return this.http.post('http://10.42.01:4201/deletedelcarrito', para, { headers: cabezera });
  }

  public obtenertotalcarro(acces: any): Observable<any>{
    //getvalorcarrito
    let para = JSON.stringify(acces);
     let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
     return this.http.post('http://10.42.01:4201/getvalorcarrito', para, { headers: cabezera });
  }

  //enviar archivo y clave
  public subirarchivo(acces: any): Observable<any>{
    //subirproductos
    return this.http.post('http://10.42.01:4201/subirproductos',acces);
  }

  public nuevafotoperfil(acces: any): Observable<any>{
    //updatepictureuser
    return this.http.post('http://10.42.01:4201/updatepictureuser',acces);
  }

  public getnombresproductos(acces: any): Observable<any>{
    //getmisproductos
    let para = JSON.stringify(acces);
    let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post('http://10.42.01:4201/getmisproductos', para, { headers: cabezera });
  }

  public updateimagenproducto(acces: any): Observable<any>{
    // actualizarimagenproducto
     return this.http.post('http://10.42.01:4201/actualizarimagenproducto', acces);
  }

  //Busqueda
  public ejecutar_busqueda(acces: any): Observable<any>{
    let para = JSON.stringify(acces);
    let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post('http://10.42.01:4201/buscarproducto', para, { headers: cabezera });
  }

/*------------------------------- Compra -------------------------------------------*/

  public enviarcorreo(acces: any): Observable<any>{
    let para = JSON.stringify(acces);
    let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post('http://10.42.01:4201/enviarcorreo', para, { headers: cabezera });
  }

  public abonarcredito(acces: any): Observable<any>{
    let para = JSON.stringify(acces);
    let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post('http://10.42.01:4201/updateabono', para, { headers: cabezera });
  }

  public descontarcantidadproduct(acces: any): Observable<any>{
     let para = JSON.stringify(acces);
    let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post('http://10.42.01:4201/quitarcantidadproducto', para, { headers: cabezera });
  }

  public finzalizarproceso(acces: any): Observable<any>{
      let para = JSON.stringify(acces);
    let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post('http://10.42.01:4201/finalizarprocesocompra', para, { headers: cabezera });
  }


/*--------------------------------- Factura -----------------------------------------------*/
  public obtenermisfacturas(acces: any): Observable<any>{
     let para = JSON.stringify(acces);
    let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post('http://10.42.01:4201/listafacturas', para, { headers: cabezera });
  }

  public obtenerfactura(acces: any): Observable<any>{
     let para = JSON.stringify(acces);
    let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post('http://10.42.01:4201/getfactura', para, { headers: cabezera });
  }

  public obtenerdetallefactura(acces: any): Observable<any>{
      let para = JSON.stringify(acces);
      let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
      return this.http.post('http://10.42.01:4201/detallesfactura', para, { headers: cabezera });
  }

/* -------------------------- Comentarios -----------------------------------*/
  public setcomentario(acces: any): Observable<any>{
    //setComentario
      let para = JSON.stringify(acces);
      let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
      return this.http.post('http://10.42.01:4201/setComentario', para, { headers: cabezera });
  }

  public getComentarios(acces: any): Observable<any>{
      let para = JSON.stringify(acces);
      let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
      return this.http.post('http://10.42.01:4201/getComentarios', para, { headers: cabezera });
  }

/* ------------------- Seccion de reportes ------------------------------------------------------------------------- */

  public retornarhombresayuda(acces: any): Observable<any>{
    //gethombreservicio
    let para = JSON.stringify(acces);
     let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
     return this.http.post('http://10.42.01:4201/gethombreservicio', para, { headers: cabezera });
  }

  public retornarmujeresadmoy(acces: any): Observable<any>{
    let para = JSON.stringify(acces);
     let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
     return this.http.post('http://10.42.01:4201/getmujeresadmoyano', para, { headers: cabezera });
  }

  public obtenerganaciaclientes(): Observable<any>{
    //ganaciaobtenidareporte
     let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
     return this.http.post('http://10.42.01:4201/ganaciaobtenidareporte',cabezera);
  }

  public todosproductoscategoria(): Observable<any>{
    //allproductoscategorias
    let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
     return this.http.post('http://10.42.01:4201/allproductoscategorias',cabezera);
  }

  public obteneravgproductos(): Observable<any>{
    //getpuntuaciongeneral
    let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
     return this.http.post('http://10.42.01:4201/getpuntuaciongeneral',cabezera);
  }


  public comentariosproductos(acces: any): Observable<any>{
    // numcomentariosyfecha
    let para = JSON.stringify(acces);
     let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
     return this.http.post('http://10.42.01:4201/numcomentariosyfecha', para, { headers: cabezera });
  }

  public obtenercantidadp(acces: any): Observable<any>{
     let para = JSON.stringify(acces);
     let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
     return this.http.post('http://10.42.01:4201/getcantidad1', para, { headers: cabezera });
  }


  public obtenertop3clieproduct(): Observable<any>{
    let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
     return this.http.post('http://10.42.01:4201/tpo3clienteproducto',cabezera);
  }

  public obtener3peorproducto(): Observable<any>{
    //peorproductosvotados
    let cabezera = new HttpHeaders().set('Content-Type', 'application/json');
     return this.http.post('http://10.42.01:4201/peorproductosvotados',cabezera);
  }

//----------------------------------------------------------------------------------------------------------------------

  cerrar_sesion() {
    this.router.navigate(['/inicio']);
    localStorage.removeItem('llave');
    localStorage.removeItem('idU');
    localStorage.removeItem('rol');
    localStorage.removeItem('imagenuser');
    localStorage.removeItem('idcarrito');
    localStorage.removeItem('credito');
  }

  public obtener_login(): boolean {
    return (localStorage.getItem('llave') !== null);
  }

  public obtener_id(): string{
    return localStorage.getItem('idU');
  }

  public retornarcredito(): number {
    return parseInt(localStorage.getItem('credito'));
  }

  public getcarro(): string{
    return localStorage.getItem('idcarrito');
  }

  public imprimir_rol(){
    console.log(localStorage.getItem('rol'));
  }

  public get_rol(): string{
    return localStorage.getItem('rol');
  }

  public get_imagen(): string{
    return localStorage.getItem('imagenuser');
  }

  public actualizar_imagen(imagen: any){
    localStorage.removeItem('imagenuser');
    localStorage.setItem('imagenuser', imagen);
  }

}
