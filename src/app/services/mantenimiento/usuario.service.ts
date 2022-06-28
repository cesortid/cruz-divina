import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { MetodoService } from '../comunes/metodo.service';

@Injectable({
	providedIn: 'root'
})

export class UsuarioService {

	constructor(private http: HttpClient, private metodo: MetodoService) { }

	listarUsuarioAsignado(ipInput: any) {
        return this.metodo.GET("api/Login/listarUsuarioAsignado", ipInput);
	}

	validarUsuario(strUsuario: string, strContrasenia: string) {
		const href = "Login/validarUsuario";
		return this.http.get(href + "?strUsuario=" + strUsuario + "&strContrasenia=" + strContrasenia);
	}

	listarCombo(ipInput: any) {
		return this.metodo.GET("api/Login/ListarUsuarioCombo", ipInput);
	}
	listarComboPrincipal(ipInput: any) {
		return this.metodo.GET("api/Login/ListarUsuarioControl", ipInput);
	}
	listarComboProvincia(ipInput: any) {
		return this.metodo.GET("api/Ubigeo/ListarProvinciaPorDepartamento", ipInput);
	}

	insertarUsuario(usuario: any) {
		return this.metodo.POST("api/login/insertarUsuario", usuario);
	}

	actualizarContrasenia(intIdUsuario: number,strClave: string,strCambioClave:string){
		const href = environment.host + "api/Login/actualizarClaveUsuario";

		var headers_object = new HttpHeaders();
		headers_object.append('Content-Type', 'application/json');

		const httpOptions = {
			headers: headers_object,
			params: new HttpParams().set('intIdUsuario', intIdUsuario.toString())
				.append("strClave", strClave)
				.append("strCambioClave", strCambioClave)
		};

		return this.http.post(href, null, httpOptions);

	}

	modificarUsuario(usuario: any/*, file: any */) {
		return this.metodo.POST("api/login/modificarUsuario", usuario);
	}

	anularUsuario(ipInput: any) {
		const href = "api/login/anularUsuario";
		return this.metodo.POST(href, ipInput);
	}

	validarUsuarioActivo(strDni: string) {
		let strData = { dni: strDni };
		return this.metodo.POST("api/login/validarUsuarioActivo", strData);
	}

	notificarUsuario(ipInput: any) {
		const href = "Usuario/notificarUsuario";
		return this.http.get(href + "?ipInput=" + JSON.stringify(ipInput));
    }
    
    anularUsuarioSMV(ipInput: any){
		const href = "api/login/AnularUsuario";
		return this.metodo.POST(href, ipInput);
	}

}