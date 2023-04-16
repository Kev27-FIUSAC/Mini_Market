import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { RegistroComponent } from './registro/registro.component';
import { AdmoComponent } from './admo/admo.component';
import { AdmoUserComponent } from './admo-user/admo-user.component';
import { RootUserComponent } from './root-user/root-user.component';
import { RootPerfilComponent } from './root-perfil/root-perfil.component';
import { AdmoUsersComponent } from './admo-users/admo-users.component';
import { AdmoReportesComponent } from './admo-reportes/admo-reportes.component';
import { ClienteiComponent } from './clientei/clientei.component';
import { ClientedatosComponent } from './clientedatos/clientedatos.component';
import { ClientecargaComponent } from './clientecarga/clientecarga.component';
import { ClientetiendaComponent } from './clientetienda/clientetienda.component';
import { CarritoComponent } from './carrito/carrito.component';
import { ServiciomainComponent  } from './serviciomain/serviciomain.component';
import { ServicioclienteComponent } from './serviciocliente/serviciocliente.component';
import { FacturaClienteComponent } from './factura-cliente/factura-cliente.component';
import { ValidacionComponent } from './validacion/validacion.component';
import { ClienteproductoComponent } from './clienteproducto/clienteproducto.component';
import { PaginaErrorComponent } from './pagina-error/pagina-error.component';
import { ServiciodatosComponent } from './serviciodatos/serviciodatos.component';
import { BitacoraComponent } from './bitacora/bitacora.component';

const routes: Routes = [
  {path: '', redirectTo: 'inicio', pathMatch: 'full'},
  {path: 'inicio', component: BienvenidaComponent},
  {path: 'acceder', component: LoginComponent},
  {path: 'registro', component: RegistroComponent},
  {path: 'administrador', component: AdmoComponent},
  {path: 'administrador/user', component: AdmoUserComponent},
  {path: 'administrador/users', component: AdmoUsersComponent},
  {path: 'rootUser', component: RootUserComponent},
  {path: 'rootUser/user', component: RootPerfilComponent},
  { path: 'administrador/reporte', component: AdmoReportesComponent },
  { path: 'cliente', component: ClienteiComponent },
  {path: 'cliente/datos', component: ClientedatosComponent},
  { path: 'cliente/carga', component: ClientecargaComponent },
  { path: 'cliente/tienda', component: ClientetiendaComponent},
  {path: 'cliente/carrito', component: CarritoComponent},
  { path: 'servicio/principal', component: ServiciomainComponent },
  { path: 'cliente/servicio', component: ServicioclienteComponent},
  { path: 'cliente/factura', component: FacturaClienteComponent},
  { path: 'validar/:correo', component: ValidacionComponent},
  { path: 'cliente/producto', component: ClienteproductoComponent },
  { path: 'error', component: PaginaErrorComponent },
  { path: 'servicio/datos', component: ServiciodatosComponent },
  { path: 'administrador/bitacora', component: BitacoraComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
