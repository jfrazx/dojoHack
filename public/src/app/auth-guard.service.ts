import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpService } from './http.service';



@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private httpService: HttpService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    console.log("AuthGuard canActivate called");
    let url: string = state.url;
    return this.checkLogin(url);
    
  }
  checkLogin(url: string): boolean {
    if(this.httpService.isLoggedIn){
      return true;
    }
    this.httpService.redirectUrl = url;
    this.router.navigate(['/register']);
    return false;
  }

}