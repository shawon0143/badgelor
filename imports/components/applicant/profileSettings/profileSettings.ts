import 'zone.js';
import 'reflect-metadata';

import { Component, OnInit } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { AccountService } from '/imports/service/accountService';



import template from './profileSettings.html';



@Component({
  selector: 'profile-settings',
  template
})



export class ProfileSettings implements OnInit {

  constructor( private route: ActivatedRoute,
               private router: Router,
               public accountService: AccountService) {

  }

  ngOnInit() {

  }



} // end of class ProfileSettings
