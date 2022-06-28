import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MetodoService } from '../comunes/metodo.service';



@Injectable({
    providedIn: 'root'
})

export class MantenimientoMenuService {

    constructor(private http: HttpClient, private apiService: MetodoService) { }

    registrarMenu(componente: any) {
        return this.apiService.POST("api/login/insertarMenu", componente);
    }

    actualizarMenu(componente: any) {
        return this.apiService.POST("api/login/ModificarMenu", componente);
    }

    listarMenu(ipInput: any) {
        return this.apiService.GET("api/login/listarMenu", ipInput);
    }
   
    listarMenuCombo() {
        return this.apiService.GET("api/login/ListarMenuCombo");
    }

    anularMenu(menu: any) {
        return this.apiService.POST("api/login/AnularMenu", menu);
    }
    
 
}