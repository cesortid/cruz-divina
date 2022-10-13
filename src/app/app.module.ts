import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Anexo01Component } from './modules/dashboard/postulantes-eval/anexo01/anexo01.component';
import { SharedModule } from './modules/shared/shared.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { HttpTokenInterceptor } from './core/guards/interceptors/http.token.interceptor';
import { Funciones } from './modules/shared/funciones';
import { NgHttpLoaderModule } from 'ng-http-loader'; // <============
import { HomonimosComponent } from './modules/dashboard/postulantes-eval/modales/homonimos/homonimos.component';

@NgModule({
  declarations: [
    AppComponent,
    Anexo01Component,
    HomonimosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    PaginationModule.forRoot(),
    NgHttpLoaderModule.forRoot(), 
  ],
  providers: [{
    provide:HTTP_INTERCEPTORS,
    useClass:HttpTokenInterceptor,
    multi:true    
  },Funciones,

  ],
  bootstrap: [AppComponent],
  entryComponents:[Anexo01Component,HomonimosComponent]
})
export class AppModule { }
