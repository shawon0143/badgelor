import 'zone.js';
import 'reflect-metadata';

import { Component, OnInit } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { AccountService } from '/imports/service/accountService';
import { AutoLogoutService } from '/imports/service/autoLogout';

import template from './userManagement.html';




@Component({
  selector: 'user-management',
  template
})



export class UserManagement implements OnInit {

  constructor( private route: ActivatedRoute,
               private router: Router,
               public accountService: AccountService,
               private autoLogoutService: AutoLogoutService) {

  }


  ngOnInit() {

    // after route it remembers the previous window position
    // Code below is to solve that scrolling problem
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      } else {
        window.scrollTo(0,0);
      }
    });

    // check user activity for autologout service
    localStorage.setItem('lastAction', Date.now().toString());

  } // end of ngOnInit



} // end of class UserManagement
