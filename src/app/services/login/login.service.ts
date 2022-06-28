import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http:HttpClient) { }
  validarLogin(username: string,password:string) {
		let body = new HttpParams()
		.set('grant_type', 'password')
		.set('password', password)
		//.set('ipInput',JSON.stringify(prueba,this.remplazar))
		.set('username', username);
		// options.;
		// this.http.get(url, options)
		return this.http.post(environment.host+'token',
		body.toString(),
		  {
			headers: new HttpHeaders()
			  .set('Content-Type', 'application/x-www-form-urlencoded'),
		  }
		);
	  }
}
