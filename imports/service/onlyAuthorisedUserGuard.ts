import { Injectable, NgZone, ApplicationRef } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { Router, ActivatedRoute, Params, NavigationEnd, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import { Observable } from 'rxjs/Observable';

import { AccountService } from '/imports/service/accountService';

@Injectable()
export class OnlyAuthorisedUserGuard implements CanActivate {

  constructor( private route: ActivatedRoute,
               private router: Router,
               private accountService: AccountService) {

  }


  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean {

               if (this.isPageRefresh()) {


                 return this.accountService.isAuthenticated()
                    .then(
                      (authenticated : boolean) => {
                        if (authenticated) {
                          return true;
                        } else {
                          window.alert("Something went wrong!");
                          this.router.navigate(['/']);
                          return false;
                        } // END OF if else authenticated
                      } // END OF (authenticated : boolean)
                    ); // END OF .then


               } else {
                 if (this.accountService.isLoggedIn()) {
                     return true;
                   } else {
                     window.alert("You don't have permission to view this page");
                     this.router.navigate(['/']);
                     return false;
                   }
               }

  } // END OF canActivate

  // I determine if the current route-request is part of a page refresh.
  isPageRefresh() : boolean {

      // If the router has yet to establish a single navigation, it means that this
      // navigation is the first attempt to reconcile the application state with the
      // URL state. Meaning, this is a page refresh.
      return( ! this.router.navigated );

  }

} // END OF OnlyAuthorisedUsersGuard
