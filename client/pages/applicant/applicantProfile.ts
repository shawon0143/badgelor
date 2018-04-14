import 'zone.js';
import 'reflect-metadata';

import { Component, OnInit } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { AccountService } from '/imports/service/accountService';
import { AutoLogoutService } from '/imports/service/autoLogout';


import template from './applicantProfile.html';



@Component({
  selector: 'applicant-profile',
  template
})



export class ApplicantProfile implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, public accountService: AccountService, private autoLogoutService: AutoLogoutService) {
    // TODO: do reactive router subscription and check user status
    // for invalid user show 404 not found view
    // this.accountService.isUserApplicant();
  }

  ngOnInit() {
    localStorage.setItem('lastAction', Date.now().toString());
  }

} // end of class applicant-profile
