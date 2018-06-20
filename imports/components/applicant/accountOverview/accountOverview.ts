import 'zone.js';
import 'reflect-metadata';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { AccountService } from '/imports/service/accountService';
import { ApplicantProfileService } from "/imports/service/applicantProfileService";


import template from './accountOverview.html';



@Component({
  selector: 'account-overview',
  template
})



export class AccountOverview implements OnInit {

  // private parentRouteParamSubscription: any;
  // userID: any;
  // myProfile;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public accountService: AccountService,
    public applicantProfileService: ApplicantProfileService) {
    // this is how we access parent route params
    // this.parentRouteParamSubscription = this.route.parent.params.subscribe(params => {
    //         this.userID = params["id"];
    //         this.myProfile = this.getMyProfile();
    //     });
  }

  ngOnInit() {

  }

  // getMyProfile() {
  //   return Meteor.users.findOne({"_id": this.userID});
  // }
  ngOnDestroy() {
    // if (this.parentRouteParamSubscription) {
    //   this.parentRouteParamSubscription.unsubscribe();
    // }
  }


} // end of class AccountOverview
