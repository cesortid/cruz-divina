import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService {

  constructor(public router: Router) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (sessionStorage.getItem("Usuario") != null) {
      if (sessionStorage.getItem("Menus") != null) {
        let menus:any=[] = JSON.parse(sessionStorage.getItem("Menus")!);
        let url = menus.find((x:any) => x.Url == "/dashboard/" + route.routeConfig!.path);

        if (url == null) {
          this.router.navigate(['login']);
          return false;
        }
      }
      else {
        this.router.navigate(['login']);
        return false;
      }
    }
    else {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
