import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MetodoService } from '../comunes/metodo.service';


@Injectable({
  providedIn: 'root'
})
export class MantenimientoPerfilService {
  ListarDetalleMenuCombo(idPerfil: number) {
    throw new Error("Method not implemented.");
  }

  constructor(private http: HttpClient, private apiService: MetodoService) { }

  listarPerfiles(ipInput: any) {
    const href = environment.host + "api/login/ListarPerfil";
    return this.http.get(href + "?ipInput=" + JSON.stringify(ipInput));
  }

  actualizarPerfiles(perfil: any) {
    return this.apiService.POST("api/login/ModificarPerfil", perfil);
  }
  registrarPerfiles(perfil: any) {
    return this.apiService.POST("api/login/InsertarPerfil", perfil);
  }

  listarDetallePerfilMenu(ipInput: any) {
    return this.apiService.GET("api/login/ListarDetallePerfilMenu", ipInput);
  }

  ListarComponentePendiente(ipInput: any) {
    return this.apiService.GET("api/login/ListarComponentePendiente", ipInput);
  }

  procesarDetallePerfilMenuComponente(perfil: any) {
    return this.apiService.POST("api/login/ProcesarDetallePerfilMenuComponente", perfil);
  }

  listarDetallePerfilMenuComponente(ipInput: any) {
    return this.apiService.GET("api/login/ListarDetallePerfilMenuComponente", ipInput);
  }

  anularDetallePerfilMenuComponente(componente: any) {
    return this.apiService.POST("api/login/AnularDetallePerfilMenuComponente", componente);
  }

  ModificarDetallePerfilMenuComponente(perfil: any) {
    return this.apiService.POST("api/login/ModificarDetallePerfilMenuComponente", perfil);
  }
  
  listarDetalleMenu(ipInput: any) {
    return this.apiService.GET("api/login/ListarDetalleMenu", ipInput);
  }

  insertarDetallePerfilMenu(perfil: any) {
    return this.apiService.POST("api/login/insertarDetallePerfilMenu", perfil);
  }

  anularPerfil(ipInput: any){
    return this.apiService.POST("api/login/anularPerfil", ipInput);
  }


  listarDetalleComponente(ipInput: any) {
    return this.apiService.GET("api/login/listarDetalleComponente", ipInput);
  }

  insertarDetallePerfilComponente(perfil: any) {
    return this.apiService.POST("api/login/insertarDetallePerfilComponente", perfil);
  }
}
