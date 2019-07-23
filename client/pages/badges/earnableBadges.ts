import 'zone.js';
import 'reflect-metadata';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MeteorObservable } from "meteor-rxjs";
import { AccountService } from '/imports/service/accountService';
import { AutoLogoutService } from '/imports/service/autoLogout';
import { BadgeService } from '/imports/service/badgeService';
import { SearchService } from '/imports/service/searchService';

import { fadeInAnimation,slideInOut } from '/imports/service/animations';

import template from './earnableBadges.html';




@Component({
  selector: 'earnable-badges',
  template,
  animations: [ fadeInAnimation, slideInOut ]
})



export class EarnableBadges implements OnInit, OnDestroy {
  private metadataSubscription: any;
  private meteorSubscriptionCourse: any;
  private meteorSubscriptionTool: any;
  private meteorSubscriptionCompetency: any;
  private meteorSubscriptionLevel: any;



  constructor( private route: ActivatedRoute,
               private router: Router,
               public accountService: AccountService,
               private autoLogoutService: AutoLogoutService,
               private badgeService: BadgeService,
               private searchService: SearchService) {


                 this.metadataSubscription = MeteorObservable.subscribe<any>("publishAllMetadata").subscribe(() => {
                   // Subscription is ready!

                 });
                 this.meteorSubscriptionCourse = MeteorObservable.subscribe<any>("publishAllCourses").subscribe(() => {
                   // Subscription is ready!

                 });

                 this.meteorSubscriptionTool = MeteorObservable.subscribe<any>("publishAllTools").subscribe(() => {

                 });

                 this.meteorSubscriptionCompetency = MeteorObservable.subscribe<any>("publishAllCompetencies").subscribe(() => {

                 });

                 this.meteorSubscriptionLevel = MeteorObservable.subscribe<any>("publishAllLevels").subscribe(() => {

                 });

  }


  ngOnInit() {
    this.searchService.getEarnableBadges();

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

  ngOnDestroy() {
    if (this.metadataSubscription) {
      this.metadataSubscription.unsubscribe();
    }

    if (this.meteorSubscriptionCourse) {
      this.meteorSubscriptionCourse.unsubscribe();
    }

    if (this.meteorSubscriptionTool) {
      this.meteorSubscriptionTool .unsubscribe();
    }

    if (this.meteorSubscriptionCompetency) {
      this.meteorSubscriptionCompetency.unsubscribe();
    }

    if (this.meteorSubscriptionLevel) {
      this.meteorSubscriptionLevel.unsubscribe();
    }

  }



} // end of class EarnableBadges
