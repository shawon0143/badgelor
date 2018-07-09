import { Injectable, NgZone, ApplicationRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Accounts } from 'meteor/accounts-base';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from "meteor-rxjs";
import { Observable } from "rxjs";
import { ProfileDB } from "/imports/api/index";


import moment from 'moment';


@Injectable()
export class SearchUserService {

  // ===============================
  // search user related vaeriables
  // ===============================
  emailAddressToSearch: string = "";
  showUserAddEditForm: boolean = false;

  searchResultUserData = {
    firstName: "",
    lastName: "",
    occupation: "",
    campus: "",
    role: "",
    userAccountID: "",
    _id: "",
    lastLogin: ""
  };

  resetSearchResultUserData;

  badgelorMemory;

  isThisAnewUser: boolean = false;
  errorMsg: string = "";
  successMsg: string = "";

  hideAllBadgelorUserCard: boolean = false;

  constructor(public zone: NgZone, public localStorageService: LocalStorageService, public router: Router) {

    if (this.localStorageService.get('badgelorMemory')) {
      this.badgelorMemory = this.localStorageService.get('badgelorMemory');
    }

    this.resetSearchResultUserData = this.searchResultUserData;


  } //--- end of constructor ---

  getAllUserProfiles(): Observable<any[]> {

    return ProfileDB.find().map((profile) => {
      return profile;
    });

  } // END OF getAllUserProfiles --------

  viewUser(profile) {
    this.emailAddressToSearch = Meteor.users.findOne({"_id": profile.userAccountID}).emails[0].address;
    this.searchUser();
  }

  deleteUser(profile) {
    MeteorObservable.call('deleteUserByAdmin', profile).subscribe((response) => {
      if (response["code"] === 200) {
        this.resetSearchUserForm();
        this.successMsg = response["feedback"];
        setTimeout(() => {
          this.successMsg = "";
        }, 3000);
      }
    }, (err) => {
      // TODO: handle error
      console.log(err);
    });
  }

  showAllBadgelorUserCardOnUI() {
    this.hideAllBadgelorUserCard = false;
  }

  hideAllBadgelorUserCardOnUI() {
    this.hideAllBadgelorUserCard = true;
  }


  searchUser() {

    this.emailAddressToSearch = this.emailAddressToSearch.toLowerCase();
    if (this.emailAddressToSearch === '') {
      return false; // input field is empty
    }
    // Now check if the user exist in local userDB
    // if so return the user details
    MeteorObservable.call("getExistingUserData", this.emailAddressToSearch).subscribe((response) => {
      // response["code"] === 200 means user exist in local userDB
      if (response["code"] === 200) {
        // console.log(response["userData"]);
        this.showUserAddEditForm = true; // show the add-edit form
        this.isThisAnewUser = false; // this is not a new user
        this.searchResultUserData.firstName = response["userData"]["firstName"];
        this.searchResultUserData.lastName = response["userData"]["lastName"];
        this.searchResultUserData.occupation = response["userData"]["occupation"];
        this.searchResultUserData.campus = response["userData"]["campus"];
        this.searchResultUserData.role = response["userData"]["role"];
        this.searchResultUserData.userAccountID = response["userData"]["userAccountID"];
        this.searchResultUserData._id = response["userData"]["profileID"]
        // dealing with the last activity
        if (response["userData"]["lastLogin"] !== 'Never') {
          this.searchResultUserData.lastLogin = response["userData"]["lastLogin"].toJSON().substring(0,19).replace('T',' ');
        } else {
          this.searchResultUserData.lastLogin = response["userData"]["lastLogin"];
        }

      }
      // response["code"] === 999 means user doesn't exist in local userDB
      // so we search user in ldap server
      if (response["code"] === 999) {
        // getting admin details from the localstoage to perform ldap search
        if (this.localStorageService.get('badgelorMemory')) {
          this.badgelorMemory = this.localStorageService.get('badgelorMemory');
        }

        let adminEmail = Meteor.users.findOne({ "_id": Meteor.userId() }).emails[0].address;
        let adminUsername = adminEmail.substring(0, adminEmail.lastIndexOf("@"));
        let adminDomain = adminEmail.substring(adminEmail.lastIndexOf("@") + 1);


        var username = this.emailAddressToSearch.substring(0, this.emailAddressToSearch.lastIndexOf("@"));
        var domain = this.emailAddressToSearch.substring(this.emailAddressToSearch.lastIndexOf("@") + 1);


        let dataForLdapCall = {
          adminDomain: adminDomain,
          adminUsername: adminUsername,
          adminPassword: this.badgelorMemory.adminSecret,
          searchDomain: domain,
          searchUserName: username
        }

        this.searchUserInLdap(dataForLdapCall);

      }

    }, (err) => {
      // TODO: handle error
      console.log(err);
    });

  }

  resetSearchUserForm() {
    this.searchResultUserData = this.resetSearchResultUserData;
    this.showUserAddEditForm = false;
    this.isThisAnewUser = false;
    this.emailAddressToSearch = "";
  }







  searchUserInLdap(data) {


    var data1 = {
      username: data.adminUsername,
      password: data.adminPassword,
      searchUserName: data.searchUserName,
      ou1: "people",
      ou2: "koblenz",
      ou3: "people",
      ou4: "koblenz"

    }

    var data2 = {
      username: data.adminUsername,
      password: data.adminPassword,
      searchUserName: data.searchUserName,
      ou1: "people",
      ou2: "koblenz",
      ou3: "mitarbeiter",
      ou4: "landau"
    }

    var data3 = {
      username: data.adminUsername,
      password: data.adminPassword,
      searchUserName: data.searchUserName,
      ou1: "people",
      ou2: "koblenz",
      ou3: "stud",
      ou4: "landau"
    }

    var data4 = {
      username: data.adminUsername,
      password: data.adminPassword,
      searchUserName: data.searchUserName,
      ou1: "mitarbeiter",
      ou2: "landau",
      ou3: "people",
      ou4: "koblenz"
    }

    var data5 = {
      username: data.adminUsername,
      password: data.adminPassword,
      searchUserName: data.searchUserName,
      ou1: "stud",
      ou2: "landau",
      ou3: "people",
      ou4: "koblenz"
    }


    var data6 = {
      username: data.adminUsername,
      password: data.adminPassword,
      searchUserName: data.searchUserName,
      ou1: "mitarbeiter",
      ou2: "landau",
      ou3: "mitarbeiter",
      ou4: "landau"
    }

    var data7 = {
      username: data.adminUsername,
      password: data.adminPassword,
      searchUserName: data.searchUserName,
      ou1: "mitarbeiter",
      ou2: "landau",
      ou3: "stud",
      ou4: "landau"
    }

    var data8 = {
      username: data.adminUsername,
      password: data.adminPassword,
      searchUserName: data.searchUserName,
      ou1: "stud",
      ou2: "landau",
      ou3: "mitarbeiter",
      ou4: "landau"
    }

    var data9 = {
      username: data.adminUsername,
      password: data.adminPassword,
      searchUserName: data.searchUserName,
      ou1: "stud",
      ou2: "landau",
      ou3: "stud",
      ou4: "landau"
    }



    // **************************************************************************
    // ===================== START of KOBLENZ ADMIN  ============================
    // **************************************************************************
    if (data.adminDomain == 'uni-koblenz.de') {
      // ===============================================================
      // =========== START of searching a koblenz domain user ==========
      // ===============================================================
      if (data.searchDomain == 'uni-koblenz.de') {
        MeteorObservable.call('bindAndSearch', data1).subscribe((response) => {
          if (response["firstName"] !== '' && response["firstName"] !== undefined) {
            this.loadKoblenzUserData(response);
          }
          if (response["error"] !== 'no error') {
            // TODO: handle error
            // create a error message variable
            // console.log(response["error"]);
            this.errorMsg = response["error"];
            setTimeout(() => {
              this.errorMsg = "";
            }, 3000);
          }
        }, (err) => {
          // TODO: handle error
          console.log(err);
        });// Meteor.call('bindAndSearch', data1)

      }// searchDomain == uni-koblenz.de

      // ==============================================================
      // =========== START of searching a landau domain user ==========
      // ==============================================================
      else if (data.searchDomain == 'uni-landau.de') {
        MeteorObservable.call('bindAndSearch', data2).subscribe((response) => {
          if (response["firstName"] !== '' && response["firstName"] !== undefined) {
            // we get response from ldap server
            this.loadLandauUserData(response)
          }
          if (response["error"] !== 'no error') {
            // we couldn't find the user in mitarbeiter database
            // so we try to search in student database
            MeteorObservable.call('bindAndSearch', data3).subscribe((response) => {
              if (response["firstName"] !== '' && response["firstName"] !== undefined) {
                // we get response from ldap server
                this.loadLandauUserData(response)
              }
              if (response["error"] !== 'no error') {
                // TODO: handle error
                // create a error message variable
                console.log(response["error"]);
                this.errorMsg = response["error"];
                setTimeout(() => {
                  this.errorMsg = "";
                }, 3000);
              }
            }, (err) => {
              // TODO: handle error
              console.log(err);
            });
          }
        }, (err) => {
          // TODO: handle error
          console.log(err);
        });
      } // searchDomain == uni-landau.de

      // ==============================================================
      // =========== END of searching a landau domain user ============
      // ==============================================================
      else {
        console.log('Invalid email address');
        this.errorMsg = 'Invalid email address';
        setTimeout(() => {
          this.errorMsg = "";
        }, 3000);
      }
    }// adminDomain == uni-koblenz.de

    // **************************************************************************
    // ========================= END OF KOBLENZ ADMIN  ==========================
    // **************************************************************************



    // **************************************************************************
    // ===================== START of LANDAU ADMIN  ============================
    // **************************************************************************

    else if (data.adminDomain == 'uni-landau.de') {
      // ===============================================================
      // =========== START of searching a koblenz domain user ==========
      // ===============================================================
      if (data.searchDomain == 'uni-koblenz.de') {
        MeteorObservable.call('bindAndSearch', data4).subscribe((response) => {
          if (response["firstName"] !== '' && response["firstName"] !== undefined) {
            // we get response from ldap server
            this.loadKoblenzUserData(response);
          }
          if (response["error"] !== 'no error') {
            // The admin is not in mitarbeiter database
            // so use student ou value for admin
            MeteorObservable.call('bindAndSearch', data5).subscribe((response) => {
              if (response["firstName"] !== '' && response["firstName"] !== undefined) {
                // we get response from ldap server
                this.loadKoblenzUserData(response);
              }
              if (response["error"] !== 'no error') {
                // TODO: handle error
                // create a error message variable
                console.log(response["error"]);
                this.errorMsg = response["error"];
                setTimeout(() => {
                  this.errorMsg = "";
                }, 3000);
              }
            }, (err) => {
              // TODO: handle error
              console.log(err);
            });
          } // END OF if (response["error"] !== 'no error')
        }, (err) => {
          // TODO: handle error
          console.log(err);
        });
      }// searchDomain == uni-koblenz.de
      // ==============================================================
      // =========== START of searching a landau domain user ==========
      // ==============================================================
      else if (data.searchDomain == 'uni-landau.de') {
        MeteorObservable.call('bindAndSearch', data6).subscribe((response) => {
          if (response["firstName"] !== '' && response["firstName"] !== undefined) {
            // we get response from ldap server
            this.loadLandauUserData(response);
          }
          if (response["error"] !== 'no error') {
            MeteorObservable.call('bindAndSearch', data7).subscribe((response) => {
              if (response["firstName"] !== '' && response["firstName"] !== undefined) {
                // we get response from ldap server
                this.loadLandauUserData(response);
              }
              if (response["error"] !== 'no error') {
                MeteorObservable.call('bindAndSearch', data8).subscribe((response) => {
                  if (response["firstName"] !== '' && response["firstName"] !== undefined) {
                    // we get response from ldap server
                    this.loadLandauUserData(response);
                  }
                  if (response["error"] !== 'no error') {
                    MeteorObservable.call('bindAndSearch', data9).subscribe((response) => {
                      if (response["firstName"] !== '' && response["firstName"] !== undefined) {
                        // we get response from ldap server
                        this.loadLandauUserData(response);
                      }
                      if (response["error"] !== 'no error') {
                        console.log(response["error"]);
                        this.errorMsg = response["error"];
                        setTimeout(() => {
                          this.errorMsg = "";
                        }, 3000);
                      }
                    }, (err) => {
                      // TODO: handle error
                      console.log(err);
                    });
                  }
                }, (err) => {
                  // TODO: handle error
                  console.log(err);
                });
              }

            }, (err) => {
              // TODO: handle error
              console.log(err);
            });
          }
        }, (err) => {
          // TODO: handle error
          console.log(err);
        });
      }// else if (searchDomain == 'uni-landau.de')
      // ==============================================================
      // =========== END of searching a landau domain user ============
      // ==============================================================
      else {
        console.log('Invalid email address');
        this.errorMsg = 'Invalid email address';
        setTimeout(() => {
          this.errorMsg = "";
        }, 3000);
      }
    } //else if (adminDomain == 'uni-landau.de')
    // **************************************************************************
    // ===================== END of LANDAU ADMIN  ===============================
    // **************************************************************************



  }



  loadKoblenzUserData(response) {
      this.showUserAddEditForm = true; // show the add-edit form
      this.isThisAnewUser = true; // This is a new user
      this.searchResultUserData.firstName = response["firstName"];
      this.searchResultUserData.lastName = response["lastName"];
      this.searchResultUserData.occupation = response["eduPersonAffiliation"];
      this.searchResultUserData.campus = 'koblenz';
      this.searchResultUserData.role = '';
      this.searchResultUserData.lastLogin = 'Never';
    }

  loadLandauUserData(response) {
      this.showUserAddEditForm = true; // show the add-edit form
      this.isThisAnewUser = true; // This is a new user
      this.searchResultUserData.firstName = response["firstName"];
      this.searchResultUserData.lastName = response["lastName"];
      this.searchResultUserData.occupation = response["eduPersonAffiliation"];
      this.searchResultUserData.campus = 'landau';
      this.searchResultUserData.role = '';
      this.searchResultUserData.lastLogin = 'Never';
    }

    selectedRole(userRole) {
      this.searchResultUserData.role = userRole.toLowerCase();
    }

    updateUserRole() {
      MeteorObservable.call("setUserRole", this.emailAddressToSearch, this.searchResultUserData.role).subscribe((response) => {
        if (response["code"] === 200) {
          this.successMsg = response["feedback"];
          setTimeout(() => {
            this.successMsg = "";
          }, 3000);
        }
      }, (err) => {
        // TODO: handle  error
        console.log(err);
      });
    }

    addNewUser() {
      if (this.searchResultUserData.role === "") {
        this.errorMsg = "Please select a role for the user";
        setTimeout(() => {
          this.errorMsg = "";
        }, 3000);
        return false;
      }


      var registerData = {
        email: this.emailAddressToSearch,
        password: "12345",
        // this is just a fake password we need for Meteor.loginwithpassword to work.
        // our actual login works via LDAP credentials. So nothing to worry about.
        role: this.searchResultUserData.role
      }

      var profileData = {
        firstName: this.searchResultUserData.firstName,
        lastName: this.searchResultUserData.lastName,
        campus: this.searchResultUserData.campus,
        occupation: this.searchResultUserData.occupation,
        imageURL: "/images/avatar.png"
      }

      MeteorObservable.call('addNewUserByAdmin', registerData, profileData).subscribe((response) => {
        if (response["code"] === 200) {
          this.searchResultUserData = this.resetSearchResultUserData;
          this.showUserAddEditForm = false;
          this.isThisAnewUser = false;
          this.emailAddressToSearch = "";
          this.successMsg = "New user added successfully!"
          setTimeout(() => {
            this.successMsg = "";
          }, 3000);
        }
      }, (err) => {
        // TODO: handle error
        console.log(err);
      });

    }









}
