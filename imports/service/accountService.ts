import { Injectable, NgZone, ApplicationRef } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { Accounts } from 'meteor/accounts-base';
import { Tracker } from 'meteor/tracker';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { MeteorObservable } from "meteor-rxjs";


export interface UserCredentials {
  email: string;
  password: string;
  organisation?: string; // Optional as other organisation might not have that
}


@Injectable()
export class AccountService {
  autorunComputation: Tracker.Computation;
  currentUser: Meteor.User;
  currentUserId: string;
  isLoggingIn: boolean;
  isUserLoggedIn: boolean;
  credentials: UserCredentials;

  errors: Array<string>;

  showLoginAndSignupViewOnUI: boolean = false;
  showLoginViewOnUI: boolean = false;
  showSignupViewOnUI: boolean = false;

  signupData = {
    email: "",
    password: "",
    organisation: undefined
  }
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  resetSignupData;




  constructor(public zone: NgZone) {

    this.resetSignupData = JSON.stringify(this.signupData);
    this._initAutorun();

  } //--- end of constructor ---


// this function will have two use case:
// (i) set the value of isUserLoggedIn var reactively on each login/logout action by user.
// -- usually called inside autorun function to set this flag. This flag will be used in HTML view
// (2) to be used by any module controller to check login state.
// This function should Never to be used inside ngif as function in HTML view (to avoid loop)
  isLoggedIn() {
    if (Meteor.user()) {
      this.isUserLoggedIn = true; // this is to use in *ngIf
      return true; // this is to use in any other function
    }
    else {
      this.isUserLoggedIn = false;
      return false;
    }

  } // --------- end of isLoggedIn ---------

  showLoginAndSignupView() {
    this.showLoginAndSignupViewOnUI = true;

    document.body.classList.add('hideBodyScroll');
    document.body.classList.remove('showBodyScroll');

  }
  hideLoginAndSignupView() {
    this.showLoginAndSignupViewOnUI = false;
    this.signupData = JSON.parse(this.resetSignupData);
    this.emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
    document.body.classList.remove('hideBodyScoll');
    document.body.classList.add('showBodyScroll');


  }
  showLoginView() {
    this.showLoginViewOnUI = true;
    this.showSignupViewOnUI = false;
  }
  showSignupView() {
    this.showSignupViewOnUI = true;
    this.showLoginViewOnUI = false;;
  }

  signup() {
    console.log(this.signupData.email);
    console.log(this.signupData.organisation);
  }

  orgSelection(campus) {
    if (campus === undefined) {
      return;
    }
    this.signupData.organisation = campus;

    if (campus === "koblenz") {
      this.emailPattern = "^[a-z0-9._%+-]+@uni-koblenz+\.de";
    } else if (campus === "landau") {
      this.emailPattern = "^[a-z0-9._%+-]+@uni-landau+\.de";
    }
  }


  _initAutorun(): void {
    this.autorunComputation = Tracker.autorun(() => {
      this.zone.run(() => {
        this.currentUser = Meteor.user();
        this.currentUserId = Meteor.userId();
        this.isLoggingIn = Meteor.loggingIn();
        // setting the values for user-type flags during each logins
        this.isLoggedIn();
        // this.isUserAdmin();

      })
    });
  } // ------- end of _initAutorun -------------

} //end of class AccountService
