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
// temp variables for api test
myEmail: string = "";
myApplications = [];
earnableBadgeIDlist : any;

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



  // ================= API Calls ==================

getAllEarnableBadges() {
  MeteorObservable.call('getEarnableBadges').subscribe((response) => {
    console.log(response);


    if (response != undefined || response != "") {
      MeteorObservable.call('getBadgesByID', response).subscribe((res) => {
        console.log(res);
      });
    }
  });

}

getMyApplication() {

  this.earnableBadgeIDlist = []
  MeteorObservable.call('getEarnableBadges').subscribe((response) => {
    // console.log(response);
    this.earnableBadgeIDlist.push(response);
    this.getmyresourceData();
  });

}



getmyresourceData() {
  this.myApplications = [];

    console.log(this.earnableBadgeIDlist);

  for (let i=0; i< this.earnableBadgeIDlist[0].length; i++) {

    MeteorObservable.call('getAllBadgeApplication', this.earnableBadgeIDlist[0][i]).subscribe((response) => {
      console.log(response);

      this.getDetails(response);

    });

  }


}

getDetails(res) {

  console.log(res.length);
  for (let key in res) {
    if (res.length >= 1){
    this.myApplications.push(res[key]);
    }
  }
}






} // end of class homePage
