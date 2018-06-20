import { Injectable, NgZone, ApplicationRef } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { Router, ActivatedRoute, Params, NavigationEnd, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import { Observable } from 'rxjs/Observable';

import { AccountService } from '/imports/service/accountService';

@Injectable()
export class OnlyLoggedInUsersGuard implements CanActivate {

  constructor( private route: ActivatedRoute,
               private router: Router,
               private accountService: AccountService) {

  }

  // for canActivate to survive browser reload we created two functions
  // in the accountService. One will trigger normally
  // and when we refresh page the other one triggers
  // the one triggers on page reload gets slow response
  // because it gets the value from accountService.isLoggedIn() method
  // its just a workaround

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean {

               if (this.isPageRefresh()) {

                 if (route.params["id"] === this.accountService.currentUserId) {
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
                  } // END OF if (route.params["id"] === this.accountService.currentUserId)
                  else {
                    window.alert("Something went wrong!");
                    this.router.navigate(['/']);
                    return false;
                  }

               } else {
                 if (this.accountService.isLoggedIn() && route.params["id"] === this.accountService.currentUserId) {
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
}
