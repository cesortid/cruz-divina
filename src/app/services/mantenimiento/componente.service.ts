import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MetodoService } from '../comunes/metodo.service';


@Injectable({
    providedIn: 'root'
})

export class MantenimientoComponenteService {

    constructor(private http: HttpClient, private apiService: MetodoService) { }

    registrarComponente(componente: any) {
        return this.apiService.POST("api/login/InsertarComponente", componente);
    }
    anularComponente(componente: any) {
        return this.apiService.POST("api/login/AnularComponente", componente);
    }

    actualizarComponente(componente: any) {
        return this.apiService.POST("api/login/ModificarComponente", componente);
    }

    listaComponentes(ipInput: any) {
        return this.apiService.GET("api/login/ListarComponente", ipInput);
    }
   
    listarMenu(ipInput: any) {
        return this.apiService.POST("api/login/ListarMenu", ipInput);
    }

}
