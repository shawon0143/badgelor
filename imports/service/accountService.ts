import { Injectable, NgZone, ApplicationRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Accounts } from 'meteor/accounts-base';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Tracker } from 'meteor/tracker';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { MeteorObservable } from "meteor-rxjs";



@Injectable()
export class AccountService {
  autorunComputation: Tracker.Computation;
  currentUser: Meteor.User;
  currentUserId: string;
  isLoggingIn: boolean;
  isUserLoggedIn: boolean;
  isUserTypeAdmin: boolean = false;
  isUserTypeApplicant: boolean = false;
  isLoginFormEmpty: boolean = false;

  showLoggingInAnimation: boolean = false;
  loginData = {
    email: "",
    password: ""
  }

  resetLoginData;

  errors: Array<string>;

  showLoginAndSignupViewOnUI: boolean = false;
  showLoginViewOnUI: boolean = false;
  showSignupViewOnUI: boolean = false;

  signupData = {
    email: "",
    password: "",
    organisation: undefined
  }

  resetSignupData;

  // fakePass is required for Meteor.loginWithPassword function
  // to work. But it has nothing to do with user login.
  fakepass = "12345";

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"; // default regex pattern for email validation

  // a session array to hold rememberMe, lastLogin, if Admin (password)
  // we clear the password on
  badgelorMemory: any = {
    isTheUserAdmin: false,
    adminSecret: "",
    rememberMe: false,
    status: "offline",
    lastLogin: new Date()
  };

  resetbadgelorMemory;


  // ===============
  // error messages
  // ===============
  isUserAlreadyExist: boolean = false;
  userAlreadyExistMsg = "This email already registered in the system.";

  isUserCredentialsWrong: boolean = false;
  userCredentialWrong = "Invalid Credential, Try Again";

  // isSignupSuccessful: boolean = false;
  // userSignupSuccessful = "Signup Successful";

  isUserRegistered: boolean = true;
  userNotRegisteredMsg = "This email is not registered in this system";

  constructor(public zone: NgZone, public localStorageService: LocalStorageService, public router: Router) {

    if (this.localStorageService.get('badgelorMemory')) {
      this.badgelorMemory = this.localStorageService.get('badgelorMemory');
    }

    this.resetSignupData = JSON.stringify(this.signupData);
    this.resetLoginData = JSON.stringify(this.loginData);

    this._initAutorun();
    this.isUserAdmin();
    this.isUserApplicant();

  } //--- end of constructor ---

  // The function below is used in the onlyLoggedInUsersGuard service
  // where we need to check whether the user is logged in and
  // he has right to access the route via canActivate
  //
  isAuthenticated() {
    const promise = new Promise(
      (resolve, reject) => {
        setTimeout(() => {
          resolve(this.isLoggedIn());
        }, 1000);
      }
    );
    return promise;
  } // END OF isAuthenticated

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

  isUserAdmin() {
    MeteorObservable.call("isUserTypeAdmin").subscribe((response) => {
      if (response === 100) {
        this.isUserTypeAdmin = true;
      }
      else {
        this.isUserTypeAdmin = false;
      }
    });

  } // end isUserAdmin

  isUserApplicant() {
    MeteorObservable.call("isUserTypeApplicant").subscribe((response) => {
      if (response === 100) {
        this.isUserTypeApplicant = true;
      }
      else {
        this.isUserTypeApplicant = false;
      }
    });

  } // end isUserApplicant


  showLoginAndSignupView() {
    this.showLoginAndSignupViewOnUI = true;
    this.isUserAlreadyExist = false;
    this.isUserRegistered = true;
    document.body.classList.add('hideBodyScroll');
    document.body.classList.remove('showBodyScroll');

  }
  hideLoginAndSignupView() {
    this.showLoginAndSignupViewOnUI = false;
    this.signupData = JSON.parse(this.resetSignupData);
    this.loginData = JSON.parse(this.resetLoginData);
    this.emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
    document.body.classList.remove('hideBodyScoll');
    document.body.classList.add('showBodyScroll');
  }
  showLoginView() {
    console.log('showlogin called');
    this.showLoginViewOnUI = true;
    this.showSignupViewOnUI = false;
    this.signupData = JSON.parse(this.resetSignupData);
    this.loginData = JSON.parse(this.resetLoginData);
    this.isUserAlreadyExist = false;
    this.isUserCredentialsWrong = false;
    this.isLoginFormEmpty = false;
    this.isUserRegistered = true;
  }
  showSignupView() {
    this.showSignupViewOnUI = true;
    this.showLoginViewOnUI = false;
    this.signupData = JSON.parse(this.resetSignupData);
    this.loginData = JSON.parse(this.resetLoginData);
    this.isUserAlreadyExist = false;
    this.isUserCredentialsWrong = false;
    this.isLoginFormEmpty = false;
    this.isUserRegistered = true;
  }



  login() {

    if (this.loginData.email === "") {
      this.isLoginFormEmpty = true;
      setTimeout(() => {
        this.isLoginFormEmpty = false;
      }, 1000);
      return true;
    }
    // this.showLoggingInAnimation = true;
    MeteorObservable.call('isUserExistInDB', this.loginData.email).subscribe(response => {

      if (response["code"] === 100) {
        // user registered to badgelor proceed to login process
        this.isUserRegistered = true;
        // =========================================
        // now check login credential in LDAP server
        // =========================================
        var username = this.loginData.email.substring(0, this.loginData.email.lastIndexOf("@"));
        var domain = this.loginData.email.substring(this.loginData.email.lastIndexOf("@") + 1);

        //  ///////////////////////////////////////
        //  the domain of koblenz user
        //  ///////////////////////////////////////
        if (domain === "uni-koblenz.de") {
          this.loginToKoblenzDomain(username);
        }
        //  ///////////////////////////////////////
        //  the domain of landau user
        //  ///////////////////////////////////////
        else if (domain === "uni-landau.de") {
          this.loginToLandauDomain(username);
        }
        //  ///////////////////////////////////////
        //  other domain users
        //  ///////////////////////////////////////
        else {
          // TODO : implement login for other domain users
        }


      } else if (response["code"] === 999) {

        // ====================================================
        // user not registered to badgelor -> show warning msg
        this.isUserRegistered = false;
        // ====================================================

      }
    });

  } // END of login()


  loginToKoblenzDomain(username) {
    var dataForLdap = {
      username: username,
      password: this.loginData.password,
      searchUserName: username,
      ou1: "people",
      ou2: "koblenz",
      ou3: "people",
      ou4: "koblenz"
    };



    MeteorObservable.call("onlyLogin", dataForLdap).subscribe(response => {

      if (response["feedback"] === "Login successful") {
        this.showLoginAndSignupViewOnUI = false;

        // ldap credentials matched -> login to badgelor now
        // we used fakepass to mimic the login in meteor
        // we mainly do our authentication in LDAP server .
        Meteor.loginWithPassword(this.loginData.email, this.fakepass, (error) => {
          if (!error) {
            // user exist in badgelor
            this.setLocalStorageOnLogin();
            console.log("Login successful");
            this.updateLastLoginInDB();
            // this.showLoggingInAnimation = false;
            document.body.classList.remove('hideBodyScoll');
            document.body.classList.add('showBodyScroll');

            // admin / issuer / creator should redirect to dashboard after successful login
            this.routeUserToDashboard();
          }
          else if (error) {
            console.log(error);
          }
        }); // end of Meteor.loginWithPassword
      } // END of if (response["name"])
      if (response["feedback"] === "Invalid password") {
        // if a registered user enters wrong credentials
        this.isUserCredentialsWrong = true;
      }
    }, (err) => {
      // TODO: handle error
      console.log(err);
    }); // END of MeteorObservable.call("bindAndSearch")
  } // END of loginToKoblenzDomain(username)



  loginToLandauDomain(username) {
    var dataForLdap = {
      username: username,
      password: this.loginData.password,
      searchUserName: username,
      ou1: "mitarbeiter",
      ou2: "landau",
      ou3: "mitarbeiter",
      ou4: "landau"
    };

    MeteorObservable.call("onlyLogin", dataForLdap).subscribe(response => {

      if (response["feedback"] === "Login successful") {
        this.showLoginAndSignupViewOnUI = false;

        // ldap credentials matched -> login to badgelor now
        // we used fakepass to mimic the login in meteor
        // we mainly do our authentication in LDAP server .
        Meteor.loginWithPassword(this.loginData.email, this.fakepass, (error) => {
          if (!error) {
            // user exist in badgelor
            this.setLocalStorageOnLogin();
            console.log("Login successful");
            this.updateLastLoginInDB();
            // this.showLoggingInAnimation = false;
            document.body.classList.remove('hideBodyScoll');
            document.body.classList.add('showBodyScroll');
            // admin / issuer / creator should redirect to dashboard after successful login
            this.routeUserToDashboard();

          }
          else if (error) {
            console.log(error);
          }
        }); // end of Meteor.loginWithPassword
      } // END of if (response["name"])
      if (response["feedback"] === "Invalid password") {
        // ==========================================
        // Login not successful in the Miterbeiter DB
        // ==========================================

        var dataForLdap = {
          username: username,
          password: this.signupData.password,
          searchUserName: username,
          ou1: "stud",
          ou2: "landau",
          ou3: "stud",
          ou4: "landau"
        };

        MeteorObservable.call("onlyLogin", dataForLdap).subscribe(response => {
          if (response["feedback"] === "Login successful") {
            this.showLoginAndSignupViewOnUI = false;

            // ldap credentials matched -> login to badgelor now
            // we used fakepass to mimic the login in meteor
            // we mainly do our authentication in LDAP server .
            Meteor.loginWithPassword(this.loginData.email, this.fakepass, (error) => {
              if (!error) {
                // user exist in badgelor
                this.setLocalStorageOnLogin();
                console.log("Login successful");
                this.updateLastLoginInDB();
                // this.showLoggingInAnimation = false;
                document.body.classList.remove('hideBodyScoll');
                document.body.classList.add('showBodyScroll');
                // admin / issuer / creator should redirect to dashboard after successful login
                this.routeUserToDashboard();
              }
              else if (error) {
                console.log(error);
              }
            }); // end of Meteor.loginWithPassword
          } // END of if (response["error"] === "Login successful")
          if (response["feedback"] === "Invalid password") {
            // if a registered user enters wrong credentials
            this.isUserCredentialsWrong = true;
          }

        }); // END of MeteorObservable.call("bindAndSearch")

      }
    }); // END of MeteorObservable.call("bindAndSearch")
  } // END of loginToLandauDomain(username)


  updateLastLoginInDB() {
    MeteorObservable.call("updateLastLoginStatus").subscribe((response) => {
      console.log(response["feedback"]);
    }, (err) => {
      // TODO: handle error
      console.log(err);
    });
  }

  setLocalStorageOnLogin() {

    // *********************************************************
    // if a user close his browser tab                         *
    // without logging out from the system                     *
    // if he selected the rememberMe option                    *
    // his session will not time out                           *
    // however if he doesn't select that and                   *
    // tries to log in after 30 minutes he will                *
    // have to login to the system again                       *
    // *********************************************************
    // ==================== >>>>>>>>>>>>>

    if (this.localStorageService.get('badgelorMemory')) {
      this.badgelorMemory = this.localStorageService.get('badgelorMemory');
    }

    let adminSecret = "";

    MeteorObservable.call("isUserTypeAdmin").subscribe((response) => {
      if (response === 100) {
        this.badgelorMemory.isTheUserAdmin = true;
        this.badgelorMemory.adminSecret = this.loginData.password;
        this.badgelorMemory.status = "online";
        this.localStorageService.set('badgelorMemory', this.badgelorMemory);
      }
      if (response === 999) {
        this.badgelorMemory.isTheUserAdmin = false;
        this.badgelorMemory.adminSecret = "";
        this.badgelorMemory.status = "online";
        this.localStorageService.set('badgelorMemory', this.badgelorMemory);
      }
    });



    // ==================== >>>>>>>>>

  } // END of setLocalStorageOnLogin()




  routeUserToDashboard() {
    // if user is an applicant the route remains the same
    MeteorObservable.call("isUserTypeAdmin").subscribe((response) => {
      if (response === 100) {
        this.router.navigate(['dashboard']);
      }
    });
  }















  signup() {

    // step-1 check if user already exist in the users DB
    // step-2 account doesn't exist : check ldap credential - if user has an official account
    // get Name, Occupation
    // step-3 create new user account : call server method + set user role to Applicant


    MeteorObservable.call('isUserExistInDB', this.signupData.email).subscribe(response => {

      if (response["code"] === 100) {
        this.isUserAlreadyExist = true;
      } else if (response["code"] === 999) {

        this.isUserAlreadyExist = false;
        var username = this.signupData.email.substring(0, this.signupData.email.lastIndexOf("@"));

        // =======================
        // First Koblenz
        // =======================
        if (this.signupData.organisation === "koblenz") {
          this.addNewUserKoblenz(username);
        } // if (this.signupData.organisation === "koblenz")

        // =======================
        // Second Landau
        // =======================
        if (this.signupData.organisation === "landau") {
          this.addNewUserLandau(username);
        } // if (this.signupData.organisation === "landau")
      } // if (response["code"] === 999)
    }, (err) => {
      // TODO: handle error

    }); // MeteorObservable.call('isUserExistInDB')
  } // END of signup()


  addNewUserKoblenz(username) {

    var dataForLdap = {
      username: username,
      password: this.signupData.password,
      searchUserName: username,
      ou1: "people",
      ou2: "koblenz",
      ou3: "people",
      ou4: "koblenz"
    };

    MeteorObservable.call("bindAndSearch", dataForLdap).subscribe(response => {

      if (response["firstName"]) {
        // if not registered then create new user account.
        var registerData = {
          email: this.signupData.email,
          password: this.fakepass,
          profile: {
            lastLogin: new Date()
          },
          role: "applicant",
          obfID: ""
        }

        // user doesn't exist in db so we create a new account
        Accounts.createUser(registerData, (error) => {
          if (error) {
            // this.errors.push(error.reason || "Unknown error");
            console.log(error);
          }
          else {

            console.log("Signup Successful");
            document.body.classList.remove('hideBodyScoll');
            document.body.classList.add('showBodyScroll');
            // setting the localstorage
            this.setLocalStorageOnLogin();
            // hiding the signup UI now
            this.showLoginAndSignupViewOnUI = false;
            MeteorObservable.call("setUserRole", this.signupData.email, registerData.role).subscribe(response => {
              console.log(response["feedback"]);
            });
            // TODO: create a notification for user to show Successful signup message
            // TODO: response code change based on HTTP response code i.e 200 is OK
          }
        }); // Accounts.createUser(registerData)

        // ====================================================
        // method call to create a profileDB data
        // ====================================================
        var profileData = {
          firstName: response["firstName"],
          lastName: response["lastName"],
          campus: this.signupData.organisation,
          occupation: response["eduPersonAffiliation"],
          imageURL: "/images/avatar.png"
        }
        MeteorObservable.call("createMyProfile", profileData).subscribe((response) => {
          // console.log(response);
          console.log("new profile created")
        }, (err) => {
          // TODO: handle error
          console.log(err);
        });

      } // if (response["firstName"])

      if (response["error"] === "Invalid password") {
        this.isUserCredentialsWrong = true;
      }
    });// MeteorObservable.call("bindAndSearch")
  } // END of addNewUserKoblenz()


  addNewUserLandau(username) {
    var dataForLdap = {
      username: username,
      password: this.signupData.password,
      searchUserName: username,
      ou1: "mitarbeiter",
      ou2: "landau",
      ou3: "mitarbeiter",
      ou4: "landau"
    };

    MeteorObservable.call("bindAndSearch", dataForLdap).subscribe(response => {
      // =================================================
      // if we get response from miterbeiter database
      // the following block runs
      // =================================================
      if (response["firstName"]) {
        // if not registered then create new user account.
        var registerData = {
          email: this.signupData.email,
          password: this.fakepass,
          profile: {
            lastLogin: new Date()
          },
          role: "applicant",
          obfID: ""
        }

        // user doesn't exist in db so we create a new account
        Accounts.createUser(registerData, (error) => {
          if (error) {
            // this.errors.push(error.reason || "Unknown error");

          }
          else {

            console.log("Signup Successful");
            document.body.classList.remove('hideBodyScoll');
            document.body.classList.add('showBodyScroll');
            // setting the localstorage
            this.setLocalStorageOnLogin();
            // hiding the signup UI now
            this.showLoginAndSignupViewOnUI = false;
            MeteorObservable.call("setUserRole", this.signupData.email, registerData.role).subscribe(response => {
              console.log(response["feedback"]);
            });
            // TODO: create a notification for user to show Successful signup message
            // TODO: response code change based on HTTP response code i.e 200 is OK
          }
        }); // Accounts.createUser(registerData)

        // ====================================================
        // method call to create a profileDB data
        // ====================================================
        var profileData = {
          firstName: response["firstName"],
          lastName: response["lastName"],
          campus: this.signupData.organisation,
          occupation: response["eduPersonAffiliation"],
          imageURL: "/images/avatar.png"
        }
        MeteorObservable.call("createMyProfile", profileData).subscribe((response) => {
          // console.log(response);
          console.log("new profile created")
        }, (err) => {
          // TODO: handle error
          console.log(err);
        });
      } // if (response["name"])

      // ==============================================
      // if user is not a landau miterbeiter
      // we send request to student database
      // ==============================================
      if (response["error"] === "Invalid password") {
        var dataForLdap = {
          username: username,
          password: this.signupData.password,
          searchUserName: username,
          ou1: "stud",
          ou2: "landau",
          ou3: "stud",
          ou4: "landau"
        };
        MeteorObservable.call("bindAndSearch", dataForLdap).subscribe(response => {
          if (response["firstName"]) {
            // if not registered then create new user account.
            var registerData = {
              email: this.signupData.email,
              password: this.fakepass,
              profile: {
                lastLogin: new Date()
              },
              role: "applicant",
              obfID: ""
            }

            // user doesn't exist in db so we create a new account
            Accounts.createUser(registerData, (error) => {
              if (error) {
                // this.errors.push(error.reason || "Unknown error");

              }
              else {

                console.log("Signup Successful");
                // shoe body scroll
                document.body.classList.remove('hideBodyScoll');
                document.body.classList.add('showBodyScroll');
                // setting the localstorage
                this.setLocalStorageOnLogin();
                // hiding the signup UI now
                this.showLoginAndSignupViewOnUI = false;
                MeteorObservable.call("setUserRole", this.signupData.email, registerData.role).subscribe(response => {
                  console.log(response["feedback"]);
                });
                // TODO: create a notification for user to show Successful signup message
                // TODO: response code change based on HTTP response code i.e 200 is OK
              }
            }); // Accounts.createUser(registerData)

            // ====================================================
            // method call to create a profileDB data
            // ====================================================
            var profileData = {
              firstName: response["firstName"],
              lastName: response["lastName"],
              campus: this.signupData.organisation,
              occupation: response["eduPersonAffiliation"],
              imageURL: "/images/avatar.png"
            }
            MeteorObservable.call("createMyProfile", profileData).subscribe((response) => {
              console.log(response);
              console.log("new profile created")
            }, (err) => {
              // TODO: handle error
              console.log(err);
            });
          } // if (response["name"])
          if (response["error"] === "Invalid password") {
            this.isUserCredentialsWrong = true;
          }
        });
      }
    });// MeteorObservable.call("bindAndSearch")
  } // END of addNewUserLandau(username)



  logout(): void {
    console.log("logout successful");
    Meteor.logout();
    this.signupData = JSON.parse(this.resetSignupData);
    this.loginData = JSON.parse(this.resetLoginData);
    this.localStorageService.set('badgelorMemory', "");
    this.router.navigate(['/']);

  } // --------  end of logout ----------


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
        this.isUserApplicant();
        this.isUserAdmin();

      })
    });
  } // ------- end of _initAutorun -------------

} //end of class AccountService
