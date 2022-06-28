import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetodoService {


	
  constructor(private http: HttpClient) { }
  POST(path: string, ipInput: any, contentType: string = 'application/x-www-form-urlencoded') {
		var headers_object = new HttpHeaders();
		//let accessToken = this.authService.getAccessToken();
		headers_object.append('Content-Type', contentType);
		let body: HttpParams = new HttpParams();
		body = body.append('ipInput', JSON.stringify(ipInput));
		const httpOptions = {
			headers: headers_object
		};
		return this.http.post(`${environment.host }${path}`, body, httpOptions);
	}
	// _POST(path: string, ipInput: any, contentType: string = 'application/x-www-form-urlencoded') {
	// 	var headers_object = new HttpHeaders();
	// 	//let accessToken = this.authService.getAccessToken();
	// 	headers_object.append('Content-Type', contentType);
	// 	let body: HttpParams = new HttpParams({encoder: new CustomEncoder()})
	// 	.set('ipInput', JSON.stringify(ipInput, this.replacer));
	// 	const httpOptions = {
	// 		headers: headers_object
	// 	};				
	// 	return this.http.post(`${environment.api_url}${path}`, body, httpOptions,);
	// }


	GET(path: string, ipInput: any = null) {
		if (ipInput == null) {
			return this.http.get(`${environment.host}${path}`);
		}
		else {
			return this.http.get(`${environment.host}${path}?ipInput=${JSON.stringify(ipInput)}`);
		}
	}
}
