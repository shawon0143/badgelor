import { Component, OnInit, OnDestroy } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { Observable } from "rxjs";
import { MetadataDB } from "/imports/api/index";
import { AccountService } from '/imports/service/accountService';
import { BadgeService } from '/imports/service/badgeService';

import { flyFromTop, fadeInAnimation } from '/imports/service/animations';

import template from './allBadges.html';




@Component({
  selector: 'all-badges',
  template,
  animations: [ flyFromTop, fadeInAnimation ]
})


export class AllBadges implements OnInit, OnDestroy {
  private metadataSubscription: any;

  constructor( private route: ActivatedRoute,
               private router: Router,
               public accountService: AccountService,
               private badgeService: BadgeService) {



               this.metadataSubscription = MeteorObservable.subscribe<any>("publishAllMetadata").subscribe(() => {
                 // Subscription is ready!
                 MeteorObservable.autorun().subscribe(() => {
                   this.badgeService.getAllBadges();
                 });
               });




  } // END of constructor


  ngOnInit() {

  } // end of ngOnInit

  getAllBadges() {}


  ngOnDestroy() {
    if (this.metadataSubscription) {
      this.metadataSubscription.unsubscribe();
    }

    this.badgeService.showBadgeEditForm = false;

  }



} // end of class importBadge
