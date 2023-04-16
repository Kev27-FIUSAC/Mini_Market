import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { RegistroComponent } from './registro/registro.component';
import { AdmoComponent } from './admo/admo.component';
import { AdmoUserComponent } from './admo-user/admo-user.component';
import { RootUserComponent } from './root-user/root-user.component';
import { RootPerfilComponent } from './root-perfil/root-perfil.component';
import { MatInputModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { ToastrModule } from 'ngx-toastr';
import { AdmoUsersComponent } from './admo-users/admo-users.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdmoReportesComponent } from './admo-reportes/admo-reportes.component';
import { MatVideoModule } from 'mat-video';
import { ClienteiComponent } from './clientei/clientei.component';
import { ClientedatosComponent } from './clientedatos/clientedatos.component';
import { ClientecargaComponent } from './clientecarga/clientecarga.component';
import { ClientetiendaComponent } from './clientetienda/clientetienda.component';
import { CarritoComponent } from './carrito/carrito.component';
import { ServiciomainComponent } from './serviciomain/serviciomain.component';
import { ServicioclienteComponent } from './serviciocliente/serviciocliente.component';
import { FacturaClienteComponent } from './factura-cliente/factura-cliente.component';
import { ValidacionComponent } from './validacion/validacion.component';
import { ClienteproductoComponent } from './clienteproducto/clienteproducto.component';
import { PaginaErrorComponent } from './pagina-error/pagina-error.component';
import { ServiciodatosComponent } from './serviciodatos/serviciodatos.component';
import { BitacoraComponent } from './bitacora/bitacora.component';

@NgModule({
  declarations: [
    AppComponent,
    BienvenidaComponent,
    LoginComponent,
    RegistroComponent,
    AdmoComponent,
    AdmoUserComponent,
    RootUserComponent,
    RootPerfilComponent,
    AdmoUsersComponent,
    AdmoReportesComponent,
    ClienteiComponent,
    ClientedatosComponent,
    ClientecargaComponent,
    ClientetiendaComponent,
    CarritoComponent,
    ServiciomainComponent,
    ServicioclienteComponent,
    FacturaClienteComponent,
    ValidacionComponent,
    ClienteproductoComponent,
    PaginaErrorComponent,
    ServiciodatosComponent,
    BitacoraComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatGridListModule,
    MatTableModule,
    MatVideoModule,
    MatCheckboxModule,
    ToastrModule.forRoot() // ToastrModule added
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
