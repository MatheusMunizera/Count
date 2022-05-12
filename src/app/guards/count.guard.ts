import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PhotoService } from '../services/photo.service';

@Injectable({
  providedIn: 'root'
})
export class CountGuard implements CanActivate{

  constructor(private photoService: PhotoService, private router: Router) { }

  canActivate( route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree
 {
   if(!(this.photoService.photosTemp.length <= 0))
   return true
   else
   return this.router.parseUrl("/")
  }

}
