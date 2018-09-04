import 'zone.js';
import 'reflect-metadata';

import { Component, OnInit } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { AccountService } from '/imports/service/accountService';
import { AutoLogoutService } from '/imports/service/autoLogout';
import { BadgeService } from '/imports/service/badgeService';

import { fadeInAnimation } from '/imports/service/animations';

import template from './earnableBadges.html';




@Component({
  selector: 'earnable-badges',
  template,
  animations: [ fadeInAnimation ]
})



export class EarnableBadges implements OnInit {
  allLevels;
  allCompetencies;
  constructor( private route: ActivatedRoute,
               private router: Router,
               public accountService: AccountService,
               private autoLogoutService: AutoLogoutService,
               private badgeService: BadgeService) {
                 // Load all levels via method call from server
                 MeteorObservable.call('getAllLevelName').subscribe((response) => {
                   this.allLevels = response;
                 }, (err) => {
                   // TODO: handle error
                   console.log(err);
                 });
                 // Lead all competencies via method call from server
                 MeteorObservable.call('getAllCompetencyName').subscribe((response) => {
                   this.allCompetencies = response;
                 }, (err) => {
                   // TODO: handle error
                   console.log(err);
                 });


  }


  ngOnInit() {
    localStorage.setItem('lastAction', Date.now().toString());
    // after routing from another page it remembers the previous window position
    // Code below is to solve that scrolling problem
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      } else {
        window.scrollTo(0,0);
      }
    });

  } // end of ngOnInit



} // end of class EarnableBadges
