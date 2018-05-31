import { Injectable, NgZone, ApplicationRef } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { Router, ActivatedRoute, Params, NavigationEnd, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Meteor } from 'meteor/meteor';
// import { Observable } from 'rxjs/Observable';

import { AccountService } from '/imports/service/accountService';

@Injectable()
export class OnlyAuthorisedUserGuard implements CanActivate {

  constructor( private route: ActivatedRoute,
               private router: Router,
               private accountService: AccountService) {

  }


  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot) : Promise<boolean> | boolean {


                 if (this.accountService.isAuthenticated()) {
                     return true;
                   } else {
                     window.alert("You don't have permission to view this page");
                     this.router.navigate(['/']);
                     return false;
                   }


  } // END OF canActivate

} // END OF OnlyAuthorisedUsersGuard
