import 'zone.js';
import 'reflect-metadata';

import { Component, OnInit } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { AccountService } from '/imports/service/accountService';
import { AutoLogoutService } from '/imports/service/autoLogout';

import template from './dashboard-home.html';




@Component({
  selector: 'dashboard-home',
  template
})



export class DashboardHome implements OnInit {

  currentRoute;

  constructor( private route: ActivatedRoute,
               private router: Router,
               public accountService: AccountService,
               private autoLogoutService: AutoLogoutService) {

               // The two line code below sets the breadcrumb value for either page refresh
               // or getting to the dashboard for the first time ;-)
               let str = this.router.url;
               this.currentRoute = str.substring(str.lastIndexOf("/") + 1, str.length);

  }


  ngOnInit() {

    // after route it remembers the previous window position
    // Code below is to solve that scrolling problem
    this.router.events.subscribe((evt) => {
      // ======================================================================
      // The two line code reactively changes the value of
      // breadcrumb ;-)
      let str = this.router.url;
      this.currentRoute = str.substring(str.lastIndexOf("/") + 1, str.length);
      // ======================================================================

      if (!(evt instanceof NavigationEnd)) {
        return;
      } else {
        window.scrollTo(0,0);
      }
    });

    // check user activity for autologout service
    localStorage.setItem('lastAction', Date.now().toString());

  } // end of ngOnInit



} // end of class DashboardHome
