import 'zone.js';
import 'reflect-metadata';

import { Component, OnInit } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
// all service and providers
import { AccountService } from '/imports/service/accountService';
import { AutoLogoutService } from '/imports/service/autoLogout';
import { ApplicantProfileService } from "/imports/service/applicantProfileService";


import template from './applicantProfile.html';



@Component({
  selector: 'applicant-profile',
  template
})



export class ApplicantProfile implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router,
    public accountService: AccountService,
    private autoLogoutService: AutoLogoutService,
    public applicantProfileService: ApplicantProfileService) {
    // TODO: check router for valid user

  }

  ngOnInit() {
    localStorage.setItem('lastAction', Date.now().toString());
  }



} // end of class ApplicantProfile
