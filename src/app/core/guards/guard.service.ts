import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardService{
  constructor(public router: Router) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if(sessionStorage.getItem("Usuario")!=null){
    }
    else{
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
