import { Component, OnInit, OnDestroy } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { Observable } from "rxjs";
import { AccountService } from '/imports/service/accountService';
import { SearchUserService } from '/imports/service/searchUserService';
import { list1, fadeInAnimation } from "/imports/service/animations";
import { ProfileDB } from "/imports/api/index";

import template from './userManagement.html';




@Component({
  selector: 'user-management',
  template,
  animations: [list1, fadeInAnimation]
})



export class UserManagement implements OnInit {
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  private meteorSubscriptionAllProfile;
  private meteorSubscriptionAllUser;
  allProfiles: Observable<any[]>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public accountService: AccountService,
              public searchUserService: SearchUserService) {

              this.meteorSubscriptionAllProfile = MeteorObservable.subscribe<any>("publishAllUserProfileForAdmin").subscribe(() => {

              });

              this.meteorSubscriptionAllUser = MeteorObservable.subscribe<any>("publishAllUserForAdmin").subscribe(() => {

              });

  }


  ngOnInit(): void {
      this.allProfiles = this.searchUserService.getAllUserProfiles();
      // everytime when the component loads we reset the search field and hide the add/edit form
      this.searchUserService.showUserAddEditForm = false;
      this.searchUserService.emailAddressToSearch = "";
  } // end of ngOnInit

  ngOnDestroy() {
    if (this.meteorSubscriptionAllProfile) {
      this.meteorSubscriptionAllProfile.unsubscribe();
    }
    if (this.meteorSubscriptionAllUser) {
      this.meteorSubscriptionAllUser.unsubscribe();
    }
  }




} // end of class UserManagement
