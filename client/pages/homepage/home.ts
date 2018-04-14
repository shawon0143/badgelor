import 'zone.js';
import 'reflect-metadata';

import { Component, OnInit } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { AccountService } from '/imports/service/accountService';
import { AutoLogoutService } from '/imports/service/autoLogout';

import template from './home.html';




@Component({
  selector: 'home-page',
  template
})



export class HomePage implements OnInit {


  constructor( private route: ActivatedRoute,
               private router: Router,
               public accountService: AccountService,
               private autoLogoutService: AutoLogoutService) {

  }

  // the function below will trigger once the child infographics has a click on signup button
  showSignupView() {
    this.accountService.showLoginAndSignupView();
    this.accountService.showSignupView();
  }

  ngOnInit() {
    localStorage.setItem('lastAction', Date.now().toString());
    // after route it remembers the previous window position
    // Code below is to solve that scrolling problem
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      } else {
        window.scrollTo(0,0);
      }
    });

  } // end of ngOnInit

getAllEarnableBadges() {
  MeteorObservable.call('getEarnableBadges').subscribe((response) => {
    console.log(response);
  });

}












} // end of class homePage
