import { Component, OnInit, OnDestroy } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { AccountService } from '/imports/service/accountService';
import { BadgeService } from '/imports/service/badgeService';

import { flyFromTop, fadeInAnimation } from '/imports/service/animations';

import template from './updateMetadata.html';




@Component({
  selector: 'update-metadata',
  template,
  animations: [ flyFromTop, fadeInAnimation ]
})


export class UpdateMetadata implements OnInit, OnDestroy {
  private metadataSubscription: any;

  constructor( private route: ActivatedRoute,
               private router: Router,
               public accountService: AccountService,
               private badgeService: BadgeService) {

                 this.metadataSubscription = MeteorObservable.subscribe<any>("publishAllMetadata").subscribe(() => {
                   // Subscription is ready!
                   MeteorObservable.autorun().subscribe(() => {
                     this.badgeService.getMissingMetadataBadges();
                   });
                 });



  }


  ngOnInit() {


  } // end of ngOnInit


  ngOnDestroy() {
    this.badgeService.showBadgeEditForm = false; // we have to change the flag so that addIssuerAndCreatorEmail() works in addNewBadge.ts file.
    this.badgeService.isAnyBadgeMetaMissing = false;

    if (this.metadataSubscription) {
      this.metadataSubscription.unsubscribe();
    }
  }



} // end of class UpdateMetadata
