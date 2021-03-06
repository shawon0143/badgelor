import 'zone.js';
import 'reflect-metadata';

import { Component, OnInit } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";

import { AccountService } from '/imports/service/accountService';
import { ApplicantProfileService } from "/imports/service/applicantProfileService";



import template from './badgeApplications.html';



@Component({
  selector: 'badge-applications',
  template
})



export class BadgeApplications implements OnInit {

  constructor( private route: ActivatedRoute,
               private router: Router,
               public accountService: AccountService,
               public applicantProfile: ApplicantProfileService) {


  } // END OF constructor

  ngOnInit() {

  } // END OF ngOnInit()



} // end of class BadgeApplications
